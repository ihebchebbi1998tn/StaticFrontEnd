import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import i18n from '@/lib/i18n';
import schedulingEnDefault from '../locales/en';
import { en as schedulingEnNested } from '../locales/en/index';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchedulingService } from "../services/scheduling.service";
import type { Technician } from "../../dispatcher/types";
import { ScheduleEditor } from "../components/ScheduleEditor";
import { initialsFor, avatarBgFor, dotColorFor, lookupHexColorForStatus } from "../utils";

export function SchedulerManager() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const openSidebarRequested = (location.state && (location.state as any).openSidebar) || false;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setOpen } = useSidebar();
  const [technicians] = useState<Technician[]>(SchedulingService.getTechnicians());
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Technician | null>(null);

  useEffect(() => {
    if (openSidebarRequested) {
      try { setOpen(true); } catch (e) { /* ignore if provider missing */ }
    }
  }, [openSidebarRequested]);

  // Ensure scheduling translations are available at runtime (useful during HMR/dev)
  useEffect(() => {
    try {
      // flat object export
      if (schedulingEnDefault && typeof schedulingEnDefault === 'object') {
        Object.keys(schedulingEnDefault).forEach((k) => {
          const key = `scheduling.${k}`;
          if (!i18n.exists(key)) i18n.addResource('en', 'translation', key, (schedulingEnDefault as any)[k]);
        });
      }
      // nested export
      if (schedulingEnNested && (schedulingEnNested as any).scheduling) {
        Object.keys((schedulingEnNested as any).scheduling).forEach((k) => {
          const key = `scheduling.${k}`;
          if (!i18n.exists(key)) i18n.addResource('en', 'translation', key, (schedulingEnNested as any).scheduling[k]);
        });
      }
    } catch (e) {
      // noop
    }
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">{t('scheduling.manage_scheduler', 'Manage scheduler')}</h1>
          <p className="text-sm text-muted-foreground">{t('scheduling.manage_scheduler_description', 'Manage technician schedules, leaves and capacity')}</p>
        </div>
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>{t('common.back', 'Back')}</Button>
        </div>
      </div>

      <Card>
          <CardHeader>
          <CardTitle>{t('scheduling.technicians_list', 'Technicians')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <Input placeholder={t('scheduling.search_placeholder', 'Search technicians...')} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-2 p-2">
                {technicians.filter((tech) => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  const fullName = `${tech.firstName} ${tech.lastName}`.toLowerCase();
                  const skills = (tech.skills || []).join(' ').toLowerCase();
                  const email = (tech.email || '').toLowerCase();
                  const phone = (tech.phone || '').toLowerCase();
                  return fullName.includes(q) || skills.includes(q) || email.includes(q) || phone.includes(q);
                }).map(tech => {
                  const meta = SchedulingService.getTechnicianMeta(tech.id) || {};
                  const status = (meta.status || tech.status) as string;
                  const avatarBg = avatarBgFor(status as any);
                  const dotColor = dotColorFor(status as any);
                  const lookupHex = lookupHexColorForStatus(status as any);
                  const initials = initialsFor(tech);

                  return (
                    <div key={tech.id} className="p-3 border rounded-lg flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`relative h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-md ${avatarBg}`}>
                          {initials}
                        </div>
                        <div className={`w-3 h-3 rounded-full border-2 border-background ${dotColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold truncate">{tech.firstName} {tech.lastName}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">{tech.skills.join(', ')}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t('scheduling.working_hours', 'Working hours')}: {meta.workingHours?.start || tech.workingHours.start} - {meta.workingHours?.end || tech.workingHours.end}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className={`w-2 h-2 rounded-full ${dotColor}`}
                            style={lookupHex ? { backgroundColor: lookupHex } : undefined}
                          />
                            <div className="text-xs text-muted-foreground">{t(`scheduling.status_${status}`,
                            status === 'available' ? 'Available' :
                            status === 'busy' ? 'Busy' :
                            status === 'offline' ? 'Offline' :
                            status === 'on_leave' ? 'On Leave' :
                            status === 'not_working' ? 'Not Working' :
                            status === 'over_capacity' ? 'Over Capacity' : status
                          )}</div>
                        </div>
                        {meta.scheduleNote && <div className="text-xs text-muted-foreground mt-1">{meta.scheduleNote}</div>}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => navigate(`/dashboard/field/dispatcher/manage-scheduler/edit/${tech.id}`)}>{t('dispatcher.edit_schedule', 'Edit')}</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {selected && (
        <ScheduleEditor
          technician={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
