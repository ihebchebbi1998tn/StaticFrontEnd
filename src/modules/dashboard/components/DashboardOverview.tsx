import UpcomingEventsCard from './overview/UpcomingEventsCard';
import React, { useEffect, useState } from 'react';
import KPICard from './overview/KPICard';
import { useCurrency } from '@/shared/hooks/useCurrency';
// import TasksCard from './overview/TasksCard';
// import EventsCard from './overview/EventsCard';
import SalesSummaryCard from './overview/SalesSummaryCard';
import ArticlesCard from './overview/ArticlesCard';
import TodayTodoCard from './overview/TodayTodoCard';
// import ServicesCard from './overview/ServicesCard';
import { AnalyticsChart } from '@/components/charts/AnalyticsChart';
import { MiniChart } from '@/components/charts/MiniChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heading, Text } from '@/shared/components/Typography';
import { ColorPicker } from '@/components/ui/color-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import KpiBuilderDialog, { KpiDefinition } from './kpi/KpiBuilderDialog';

// Mock data imports
import salesData from '@/data/mock/sales.json';
import articlesData from '@/data/mock/articles.json';
// import servicesData from '@/data/mock/services.json';
import calendarData from '@/data/mock/calendarData.json';
import projectTasks from '@/data/mock/projectTasks.json';
import dayjs from 'dayjs';

type ChartKey = 'articles' | 'revenue' | 'technicians';

// Chart options will be built dynamically to always put the user's custom KPI first if it exists

export default function DashboardOverview() {
  const { format } = useCurrency();
  
  // KPIs (simple derivation from mock sales)
  const totalRevenue = (salesData as any[]).reduce((sum, s) => sum + (s.amount || 0), 0);
  const openPipeline = (salesData as any[]).filter(s => s.stage !== 'closed').length;
  const dealsClosed = (salesData as any[]).filter(s => s.stage === 'closed').length;

  const kpis = [
    { title: 'MTD Revenue', value: format(Math.round(totalRevenue)), subtitle: 'vs last month' },
    { title: 'Open Pipeline', value: `${openPipeline} deals`, subtitle: 'in progress' },
    { title: 'Deals Closed (MTD)', value: `${dealsClosed}`, subtitle: 'closed deals' },
    { title: 'Overdue Tasks', value: `${(projectTasks as any[]).filter(t => t.status !== 'done').length}`, subtitle: 'pending tasks' }
  ];

  // Tasks removed

  // Events removed for now


  const [_chartIdx, setChartIdx] = useState(0); // default to first chart (custom or default)
  const [showPicker, setShowPicker] = useState(false);
  const [actualColor, setActualColor] = useState<string>('hsl(var(--chart-1))');
  const [projectedColor, setProjectedColor] = useState<string>('hsl(var(--chart-2))');
  const [showActual, setShowActual] = useState(true);
  const [showProjected, setShowProjected] = useState(true);
  const [selectedChartKey, setSelectedChartKey] = useState<string>('customKpi');
  const [kpiDialogOpen, setKpiDialogOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KpiDefinition | undefined>(undefined);
  const [customKpis, setCustomKpis] = useState<KpiDefinition[]>(() => {
    try { return JSON.parse(localStorage.getItem('customKpis') || '[]'); } catch { return []; }
  });

  const SETTINGS_STORAGE_KEY = 'dashboardChartSettings';

  // Build chart options dynamically
  const mainCustomKpi = customKpis.length > 0 ? customKpis[0] : null;
  const chartOptions = [
    ...(mainCustomKpi ? [{
      key: 'customKpi',
      label: mainCustomKpi.title,
      render: () => {
        // Build mock data based on sources for demo purposes
        const kpi = mainCustomKpi;
        const base = kpi.sampleData || (
          kpi.source === 'sales' ? (salesData as any[]).slice(0, 6).map((s, i) => ({ name: `Deal ${i+1}`, amount: s.amount || 0 })) :
          kpi.source === 'articles' ? (articlesData as any[]).slice(0, 5).map((a) => ({ name: a.name, qty: a.quantity || Math.round(Math.random()*100) })) :
          kpi.source === 'tasks' ? (projectTasks as any[]).slice(0, 5).map((t) => ({ name: t.title, effort: t.estimate || Math.round(Math.random()*8) })) :
          [{ name: 'A', value: 10 }, { name: 'B', value: 15 }]
        );
        const data = base.map((row: any) => ({
          name: row[kpi.xField] ?? row.name,
          ...Object.fromEntries(kpi.series.map(s => [s.key, row[s.key] ?? Math.max(1, Math.round((row.amount || row.qty || row.count || row.total || row.effort || Math.random()*20) * (0.5 + Math.random())))]))
        }));
        const series = kpi.series.map(s => ({ key: s.key, name: s.name, color: s.color, dashed: s.dashed, show: s.enabled }));
        return <AnalyticsChart data={data} height={240} series={series} />;
      }
    }] : []),
    {
      key: 'articles',
      label: 'Articles Sales',
      render: () => (
        <AnalyticsChart data={[
          { name: 'Article A', actual: 120, projected: 140 },
          { name: 'Article B', actual: 90, projected: 100 },
          { name: 'Article C', actual: 60, projected: 80 },
        ]} height={240} />
      )
    },
    {
      key: 'revenue',
      label: 'Revenue Trend',
      render: () => (
        <AnalyticsChart data={[
          { name: 'Week 1', actual: 8000, projected: 9000 },
          { name: 'Week 2', actual: 9200, projected: 9500 },
          { name: 'Week 3', actual: 11000, projected: 12000 },
          { name: 'Week 4', actual: 12430, projected: 13000 },
        ]} height={240} />
      )
    },
    {
      key: 'technicians',
      label: 'Technicians Performance',
      render: () => (
        <AnalyticsChart data={[
          { name: 'Tech 1', actual: 15, projected: 18 },
          { name: 'Tech 2', actual: 12, projected: 14 },
          { name: 'Tech 3', actual: 20, projected: 22 },
        ]} height={240} />
      )
    },
  ];

  // Load persisted settings, but always prefer a user-created KPI as the default when present
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;

      // If the user has a custom KPI, force it to be the selected chart on open
      if (mainCustomKpi) {
        setSelectedChartKey('customKpi');
        setChartIdx(0);
      } else if (parsed && typeof parsed === 'object') {
        if (parsed.selectedChartKey) {
          setSelectedChartKey(parsed.selectedChartKey);
          const idx = chartOptions.findIndex(c => c.key === parsed.selectedChartKey);
          if (idx >= 0) setChartIdx(idx);
        }
      }

      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.showActual === 'boolean') setShowActual(parsed.showActual);
        if (typeof parsed.showProjected === 'boolean') setShowProjected(parsed.showProjected);
        if (typeof parsed.actualColor === 'string') setActualColor(parsed.actualColor);
        if (typeof parsed.projectedColor === 'string') setProjectedColor(parsed.projectedColor);
      }
    } catch {
      // ignore JSON parse/storage errors
    }
  }, [mainCustomKpi]);

  // Persist settings on change
  useEffect(() => {
    const payload = {
      selectedChartKey,
      showActual,
      showProjected,
      actualColor,
      projectedColor,
    };
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [selectedChartKey, showActual, showProjected, actualColor, projectedColor]);

  // Persist custom KPIs
  useEffect(() => {
    try { localStorage.setItem('customKpis', JSON.stringify(customKpis)); } catch {}
  }, [customKpis]);

  const handlePrev = () => {
    setChartIdx(prev => {
      const nextIdx = (prev - 1 + chartOptions.length) % chartOptions.length;
      setSelectedChartKey(chartOptions[nextIdx].key);
      return nextIdx;
    });
  };
  const handleNext = () => {
    setChartIdx(prev => {
      const nextIdx = (prev + 1) % chartOptions.length;
      setSelectedChartKey(chartOptions[nextIdx].key);
      return nextIdx;
    });
  };

  const resolvedChartIndex = chartOptions.findIndex(c => c.key === selectedChartKey);
  const CurrentChart = chartOptions[resolvedChartIndex]?.render;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((k, i) => (
          <KPICard key={i} title={k.title} value={k.value} subtitle={k.subtitle} />
        ))}
      </div>

      {/* Main content: analytics + tasks + side widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 relative">
              {/* Mobile settings icon - positioned at top right */}
              <div className="absolute top-4 right-4 sm:hidden">
                <Dialog open={showPicker} onOpenChange={setShowPicker}>
                  <DialogTrigger asChild>
                    <button className="p-1 rounded hover:bg-muted" title="Choose chart">
                      {/* Settings gear icon */}
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .66.42 1.25 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.66 0 1.25.42 1.51 1H21a2 2 0 0 1 0 4h-.09c-.66 0-1.25.42-1.51 1z" />
                      </svg>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Chart Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <Text as="p" variant="muted">
                        Configure the chart dataset, series visibility, and colors.
                      </Text>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Heading as="div" size="label" className="text-muted-foreground uppercase tracking-wide">Dataset (default)</Heading>
                          <Select
                            value={selectedChartKey}
                            onValueChange={(v: ChartKey) => {
                              setSelectedChartKey(v);
                              setChartIdx(chartOptions.findIndex(c => c.key === v));
                            }}
                          >
                            <SelectTrigger aria-label="Choose chart dataset">
                              <SelectValue placeholder="Dataset (default)" />
                            </SelectTrigger>
                            <SelectContent>
                              {chartOptions.map((opt) => (
                                <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <Button variant="secondary" onClick={() => { setShowPicker(false); setEditingKpi(undefined); setKpiDialogOpen(true); }}>Create KPI</Button>
                        <Button variant="ghost" onClick={() => {
                          setSelectedChartKey('articles');
                          setChartIdx(0);
                          setShowActual(true);
                          setShowProjected(true);
                          setActualColor('hsl(var(--chart-1))');
                          setProjectedColor('hsl(var(--chart-2))');
                        }}>
                          Reset to defaults
                        </Button>
                        <Button onClick={() => setShowPicker(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto pr-12 sm:pr-0">
                <button onClick={handlePrev} className="p-1 rounded hover:bg-muted" title="Previous chart">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <Heading as={CardTitle as any} size="section" className="truncate">{chartOptions[resolvedChartIndex]?.label}</Heading>
                <button onClick={handleNext} className="p-1 rounded hover:bg-muted" title="Next chart">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
                </button>
              </div>
              
              {/* Desktop settings icon */}
              <div className="hidden sm:block">
                <Dialog open={showPicker} onOpenChange={setShowPicker}>
                  <DialogTrigger asChild>
                    <button className="p-1 rounded hover:bg-muted" title="Choose chart">
                      {/* Settings gear icon */}
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .66.42 1.25 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.66 0 1.25.42 1.51 1H21a2 2 0 0 1 0 4h-.09c-.66 0-1.25.42-1.51 1z" />
                      </svg>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Chart Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <Text as="p" variant="muted">
                        Configure the chart dataset, series visibility, and colors.
                      </Text>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Heading as="div" size="label" className="text-muted-foreground uppercase tracking-wide">Dataset (default)</Heading>
                          <Select
                            value={selectedChartKey}
                            onValueChange={(v: ChartKey) => {
                              setSelectedChartKey(v);
                              setChartIdx(chartOptions.findIndex(c => c.key === v));
                            }}
                          >
                            <SelectTrigger aria-label="Choose chart dataset">
                              <SelectValue placeholder="Dataset (default)" />
                            </SelectTrigger>
                            <SelectContent>
                              {chartOptions.map((opt) => (
                                <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <Button variant="secondary" onClick={() => { setShowPicker(false); setEditingKpi(undefined); setKpiDialogOpen(true); }}>Create KPI</Button>
                        <Button variant="ghost" onClick={() => {
                          setSelectedChartKey('articles');
                          setChartIdx(0);
                          setShowActual(true);
                          setShowProjected(true);
                          setActualColor('hsl(var(--chart-1))');
                          setProjectedColor('hsl(var(--chart-2))');
                        }}>
                          Reset to defaults
                        </Button>
                        <Button onClick={() => setShowPicker(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {((selectedChartKey === 'customKpi') && customKpis.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-[240px] text-center space-y-4">
                  <div className="rounded-full bg-muted p-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.08" />
                      <polyline points="5,16 9,11 13,13 17,8 21,10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9" cy="11" r="0.9" fill="currentColor" />
                      <circle cx="13" cy="13" r="0.9" fill="currentColor" />
                      <circle cx="17" cy="8" r="0.9" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <Heading as="h3" size="card" className="font-semibold">No Custom KPI Created</Heading>
                    <Text variant="muted" className="max-w-sm">Create your own custom KPI to track what matters most to your business</Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => setShowPicker(true)}>
                      Browse charts
                    </Button>
                    <Button variant="outline" onClick={() => { setEditingKpi(undefined); setKpiDialogOpen(true); }}>
                      Create KPI
                    </Button>
                  </div>
                </div>
              ) : (
                CurrentChart && <CurrentChart />
              )}
            </CardContent>
          </Card>
          {/* Upcoming Events Card */}
          <div className="w-full mt-2">
            <UpcomingEventsCard
              events={Array.isArray(calendarData)
                ? calendarData.filter(ev => {
                    const start = dayjs(ev.start);
                    const now = dayjs();
                    return start.isAfter(now) && start.isBefore(now.add(2, 'day'));
                  })
                : []}
              allEvents={Array.isArray(calendarData) ? calendarData : []}
            />
          </div>

        </div>

        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6 h-full min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
            <SalesSummaryCard won={(salesData as any[]).filter(s => s.status === 'won').length} lost={(salesData as any[]).filter(s => s.status === 'lost').length} />
            <ArticlesCard articles={(articlesData as any[]).length} />
          </div>
          <div className="flex-1 min-h-0 flex flex-col mb-4" >
            <TodayTodoCard 
              task={null} // TODO: Replace with today's task if exists
            />
          </div>
        </div>
      </div>
  {/* Builder Dialog, launched from settings gear's Create KPI */}
      <KpiBuilderDialog 
        open={kpiDialogOpen} 
        onOpenChange={(v) => { setKpiDialogOpen(v); if (!v) setEditingKpi(undefined); }}
        initial={editingKpi}
        onSave={(def) => {
          setCustomKpis(prev => {
            const exists = prev.find(x => x.id === def.id);
            const next = exists ? prev.map(x => x.id === def.id ? def : x) : [...prev, def];
            return next;
          });
          setKpiDialogOpen(false);
          setEditingKpi(undefined);
        }}
      />
    </div>
  );
}
