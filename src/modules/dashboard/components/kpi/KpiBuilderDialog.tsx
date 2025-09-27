import React, { useMemo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Static JSON imports for field introspection
import salesSample from '@/data/mock/sales.json';
import articlesSample from '@/data/mock/articles.json';
import servicesSample from '@/data/mock/services.json';
import eventsSample from '@/data/mock/calendarData.json';
import tasksSample from '@/data/mock/projectTasks.json';

export type KpiSeries = {
  key: string;      // field key
  name: string;     // label
  color?: string;
  dashed?: boolean;
  enabled: boolean;
};

export type KpiDefinition = {
  id: string;
  title: string;
  source: 'sales' | 'articles' | 'services' | 'events' | 'tasks' | 'custom-json';
  xField: string;           // the name field (x-axis)
  series: KpiSeries[];      // y-series definitions
  sampleData?: any[];       // optional sample for preview
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: KpiDefinition;
  onSave: (def: KpiDefinition) => void;
}

// Lightweight introspection of mock data
function useSourceSample(source: KpiDefinition['source']) {
  const sample = useMemo(() => {
    switch (source) {
      case 'sales':
        return (salesSample as any[]).slice(0, 10);
      case 'articles':
        return (articlesSample as any[]).slice(0, 10);
      case 'services':
        return (servicesSample as any[]).slice(0, 10);
      case 'events':
        return (eventsSample as any[]).slice(0, 10);
      case 'tasks':
        return (tasksSample as any[]).slice(0, 10);
      default:
        return [];
    }
  }, [source]);

  const allKeys = useMemo(() => {
    const set = new Set<string>();
    for (const row of sample) {
      Object.keys(row || {}).forEach(k => set.add(k));
    }
    return Array.from(set);
  }, [sample]);

  const numericKeys = useMemo(() => {
    const candidates = new Set<string>();
    for (const row of sample) {
      for (const [k, v] of Object.entries(row || {})) {
        if (typeof v === 'number') candidates.add(k);
      }
    }
    return Array.from(candidates);
  }, [sample]);

  const stringKeys = useMemo(() => {
    const candidates = new Set<string>();
    for (const row of sample) {
      for (const [k, v] of Object.entries(row || {})) {
        if (typeof v === 'string') candidates.add(k);
      }
    }
    // Prefer common label fields first
    const arr = Array.from(candidates);
    const preferred = ['name', 'title', 'label', 'id'];
    return arr.sort((a, b) => preferred.indexOf(a) - preferred.indexOf(b));
  }, [sample]);

  return { sample, allKeys, numericKeys, stringKeys };
}

export function KpiBuilderForm({ initial, onSave, onCancel }: { initial?: KpiDefinition; onSave: (def: KpiDefinition) => void; onCancel?: () => void }) {
  const [title, setTitle] = useState(initial?.title || 'My KPI');
  const [source, setSource] = useState<KpiDefinition['source']>(initial?.source || 'sales');
  const { sample, numericKeys, stringKeys } = useSourceSample(source);
  const [xField, setXField] = useState(initial?.xField || (stringKeys[0] || 'name'));
  const [series, setSeries] = useState<KpiSeries[]>(initial?.series || []);

  useEffect(() => {
    // If no series defined, seed with up to two numeric fields
    if (series.length === 0 && numericKeys.length > 0) {
      const seeded: KpiSeries[] = numericKeys.slice(0, 2).map((k, i) => ({ key: k, name: k, color: undefined, dashed: i === 1, enabled: true }));
      setSeries(seeded);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericKeys.join('|')]);

  useEffect(() => {
    // Ensure xField remains valid when source changes
    if (!stringKeys.includes(xField)) {
      setXField(stringKeys[0] || 'name');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringKeys.join('|')]);

  const addSeries = () => setSeries(s => [...s, { key: numericKeys[0] || `metric${s.length+1}`, name: `Metric ${s.length+1}`, enabled: true }]);
  const updateSeries = (idx: number, patch: Partial<KpiSeries>) => setSeries(s => s.map((it, i) => i === idx ? { ...it, ...patch } : it));
  const removeSeries = (idx: number) => setSeries(s => s.filter((_, i) => i !== idx));

  const canSave = title.trim().length > 1 && xField.trim().length > 0 && series.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Technicians Performance" />
        </div>
        <div className="space-y-2">
          <Label>Data source</Label>
          <Select value={source} onValueChange={(v: any) => setSource(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="articles">Articles</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="tasks">Tasks</SelectItem>
              <SelectItem value="custom-json">Custom JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>X field (label)</Label>
          {stringKeys.length > 0 ? (
            <Select value={xField} onValueChange={(v: any) => setXField(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select label field" />
              </SelectTrigger>
              <SelectContent>
                {stringKeys.map(k => (<SelectItem key={k} value={k}>{k}</SelectItem>))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={xField} onChange={(e) => setXField(e.target.value)} placeholder="e.g., name" />
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Series</Label>
        <div className="space-y-3">
          {series.map((s, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
              {numericKeys.length > 0 ? (
                <Select value={s.key} onValueChange={(v: any) => updateSeries(i, { key: v, name: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Metric key" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericKeys.map(k => (<SelectItem key={k} value={k}>{k}</SelectItem>))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={s.key} onChange={(e) => updateSeries(i, { key: e.target.value })} placeholder="metric key" />
              )}
              <Input value={s.name} onChange={(e) => updateSeries(i, { name: e.target.value })} placeholder="label" />
              <ColorPicker value={s.color || ''} onChange={(v: string) => updateSeries(i, { color: v })} onReset={() => updateSeries(i, { color: undefined })} />
              <div className="flex items-center gap-2">
                <Switch checked={!!s.dashed} onCheckedChange={(v) => updateSeries(i, { dashed: v })} />
                <Label>Dashed</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={s.enabled} onCheckedChange={(v) => updateSeries(i, { enabled: v })} />
                <Label>Enabled</Label>
              </div>
              <div className="md:col-span-6 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => removeSeries(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={addSeries}>Add series</Button>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button disabled={!canSave} onClick={() => onSave({
          id: initial?.id || crypto.randomUUID(),
          title,
          source,
          xField,
          series,
          sampleData: sample,
        })}>Save KPI</Button>
      </div>
    </div>
  );
}

export default function KpiBuilderDialog({ open, onOpenChange, initial, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create KPI</DialogTitle>
        </DialogHeader>
        <KpiBuilderForm
          initial={initial}
          onSave={(def) => onSave(def)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
