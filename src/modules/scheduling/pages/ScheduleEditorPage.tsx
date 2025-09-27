import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInCalendarDays } from 'date-fns';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { SchedulingService } from '../services/scheduling.service';
import { LookupsService } from '@/modules/lookups/services/lookups.service';
import type { Technician } from '../../dispatcher/types';
import { lookupHexColorForStatus } from '../utils';

export default function ScheduleEditorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { technicianId } = useParams<{ technicianId: string }>();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Technician['status']>('available');
  // per-day schedule: Mon..Sun
  const defaultDay = { enabled: true, start: '08:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00', fullDayOff: false };
  const [days, setDays] = useState<Record<string, any>>({ Mon: { ...defaultDay }, Tue: { ...defaultDay }, Wed: { ...defaultDay }, Thu: { ...defaultDay }, Fri: { ...defaultDay }, Sat: { ...defaultDay, enabled: false }, Sun: { ...defaultDay, enabled: false } });
  const [leaves, setLeaves] = useState<{start:string;end:string;reason?:string;type?:string}[]>([]);
  const [leaveRange, setLeaveRange] = useState<DateRange | undefined>(undefined);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveType, setLeaveType] = useState('vacation');
  const [leaveError, setLeaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!technicianId) return;
    const tech = SchedulingService.getTechnicians().find(t => t.id === technicianId) || null;
    setTechnician(tech);
    if (tech) {
      const meta = SchedulingService.getTechnicianMeta(tech.id) || {};
      setNote(meta.scheduleNote || '');
      setStatus((meta.status as any) || tech.status);
      // hydrate per-day schedule from meta if present
      if (meta.days) {
        setDays(meta.days);
      } else if (meta.workingHours) {
        // fallback to uniform working hours
        const uniform = { ...days };
        Object.keys(uniform).forEach(k => { uniform[k] = { ...uniform[k], start: meta.workingHours.start || uniform[k].start, end: meta.workingHours.end || uniform[k].end }; });
        setDays(uniform);
      }
      setLeaves(meta.leaves || []);
    }
  }, [technicianId]);

  const addLeave = () => {
    setLeaveError(null);
    if (!leaveRange || !leaveRange.from || !leaveRange.to) {
      setLeaveError(t('scheduling.leave_error_missing', 'Please select a start and end date'));
      return;
    }
    if (leaveRange.to < leaveRange.from) {
      setLeaveError(t('scheduling.leave_error_invalid', 'End date must be after start date'));
      return;
    }
    const startIso = leaveRange.from.toISOString().slice(0,10);
    const endIso = leaveRange.to.toISOString().slice(0,10);
    setLeaves(prev => [...prev, { start: startIso, end: endIso, reason: leaveReason || undefined, type: leaveType || 'vacation' }]);
    setLeaveRange(undefined);
    setLeaveReason('');
    setLeaveType('vacation');
    try {
      const from = format(new Date(startIso), 'MMM d, yyyy');
      const to = format(new Date(endIso), 'MMM d, yyyy');
      const days = differenceInCalendarDays(new Date(endIso), new Date(startIso)) + 1;
      toast({
        title: t('scheduling.leave_added', { defaultValue: 'Leave added' }),
        description: `${from} → ${to} (${days} ${t('scheduling.days', { defaultValue: 'days' })})`,
      });
    } catch (e) {
      // swallow formatting errors
    }
  };

  const save = () => {
    if (!technician) return;
    SchedulingService.setTechnicianMeta(technician.id, {
      scheduleNote: note,
      status,
      days,
      leaves
    });
    navigate(-1);
  };

  if (!technician) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6">{t('scheduling.technician_not_found', 'Technician not found')}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">{t('scheduling.edit_schedule_for', { name: `${technician.firstName} ${technician.lastName}`, defaultValue: `Edit schedule for ${technician.firstName} ${technician.lastName}` })}</h1>
          <p className="text-sm text-muted-foreground">{t('scheduling.edit_schedule_description', { defaultValue: 'Edit technician working hours, leaves and status' })}</p>
        </div>
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>{t('common.back','Back')}</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('scheduling.working_time','Working time')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const).map(d => (
              <div key={d} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={days[d].enabled && !days[d].fullDayOff} onChange={(e) => setDays(prev => ({ ...prev, [d]: { ...prev[d], enabled: e.target.checked, fullDayOff: !e.target.checked ? prev[d].fullDayOff : false } }))} />
                    <div className="font-medium">{t(`scheduling.day_${d.toLowerCase()}` as any, d)}</div>
                  </div>
                  <div>
                    <label className="text-xs mr-2">{t('scheduling.full_day_off','Full day off')}</label>
                    <input type="checkbox" checked={!!days[d].fullDayOff} onChange={(e) => setDays(prev => ({ ...prev, [d]: { ...prev[d], fullDayOff: e.target.checked, enabled: !e.target.checked ? false : prev[d].enabled } }))} />
                  </div>
                </div>

                {!days[d].fullDayOff && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                    <div>
                      <Label className="text-xs">{t('scheduling.working_hours_start','Start')}</Label>
                      <Input type="time" value={days[d].start} onChange={(e) => setDays(prev => ({ ...prev, [d]: { ...prev[d], start: e.target.value } }))} />
                    </div>
                    <div>
                      <Label className="text-xs">{t('scheduling.working_hours_end','End')}</Label>
                      <Input type="time" value={days[d].end} onChange={(e) => setDays(prev => ({ ...prev, [d]: { ...prev[d], end: e.target.value } }))} />
                    </div>
                    <div>
                      <Label className="text-xs">{t('scheduling.lunch_break','Lunch break')}</Label>
                      <div className="flex gap-2">
                        <Input type="time" value={days[d].lunchStart} onChange={(e) => setDays(prev => ({ ...prev, [d]: { ...prev[d], lunchStart: e.target.value } }))} />
                        <Input type="time" value={days[d].lunchEnd} onChange={(e) => setDays(prev => ({ ...prev, [d]: { ...prev[d], lunchEnd: e.target.value } }))} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="h-3" />

      <Card>
        <CardHeader>
          <CardTitle>{t('scheduling.leaves','Leaves')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-xs">{t('scheduling.leave_select_range','Select date range')}</Label>
              <div className="mt-1 flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9">
                      {leaveRange && leaveRange.from
                        ? `${format(leaveRange.from, 'MMM d, yyyy')}${leaveRange.to ? ` → ${format(leaveRange.to, 'MMM d, yyyy')}` : ''}`
                        : t('scheduling.select_dates', { defaultValue: 'Select dates' })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="!w-[360px] p-2">
                    <Calendar
                      mode="range"
                      selected={leaveRange}
                      onSelect={(r) => setLeaveRange(r as DateRange | undefined)}
                    />
                  </PopoverContent>
                </Popover>
                <div className="text-xs text-muted-foreground">
                  {leaveRange && leaveRange.from && leaveRange.to
                    ? `${format(leaveRange.from, 'MMM d')} — ${format(leaveRange.to, 'MMM d')} (${differenceInCalendarDays(leaveRange.to, leaveRange.from) + 1} ${t('scheduling.days', { defaultValue: 'days' })})`
                    : t('scheduling.pick_date_summary', { defaultValue: 'Click to pick a date range' })}
                </div>
              </div>
              {leaveError && <div className="text-xs text-destructive mt-1">{leaveError}</div>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <Label className="text-xs">{t('scheduling.leave_type','Type')}</Label>
                <Select value={leaveType} onValueChange={(v) => setLeaveType(v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LookupsService.getLeaveTypes().map((lt) => (
                      <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/lookups')}
                    className="text-primary underline"
                  >
                    {t('scheduling.configure_types','Configure types')}
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-xs">{t('scheduling.leave_reason','Reason')}</Label>
                <Input value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button size="sm" onClick={addLeave}>{t('scheduling.add','Add')}</Button>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {leaves.map((l, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded p-2 gap-2">
                <div className="text-sm">
                  <div className="font-medium">{t(`scheduling.leave_type_${l.type}` as any, l.type)}</div>
                  <div className="text-xs">{new Date(l.start).toLocaleDateString()} → {new Date(l.end).toLocaleDateString()}</div>
                  {l.reason && <div className="text-xs text-muted-foreground">{l.reason}</div>}
                </div>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => setLeaves(prev => prev.filter((_, i) => i !== idx))}>{t('common.delete','Delete')}</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="h-3" />

      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={() => navigate(-1)}>{t('common.cancel','Cancel')}</Button>
        <Button onClick={save}>{t('common.save','Save')}</Button>
      </div>
    </div>
  );
}
