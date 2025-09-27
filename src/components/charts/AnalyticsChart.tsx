import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useId } from 'react';

type GenericPoint = { name: string; [key: string]: any };

interface SeriesConfig {
  key: string;            // data key in each data point
  name?: string;          // legend label
  color?: string;         // stroke/fill base color
  dashed?: boolean;       // render dashed line
  show?: boolean;         // allow toggling visibility
}

interface AnalyticsChartProps {
  data: Array<GenericPoint>;
  height?: number;
  // Legacy two-series props (kept for backward compatibility)
  actualColor?: string;
  projectedColor?: string;
  showActual?: boolean;
  showProjected?: boolean;
  // New: dynamic series mode. When provided, overrides legacy props.
  series?: SeriesConfig[];
}

export function AnalyticsChart({ 
  data, 
  height = 300, 
  actualColor = 'hsl(var(--chart-1))', 
  projectedColor = 'hsl(var(--chart-2))',
  showActual = true,
  showProjected = true,
  series,
}: AnalyticsChartProps) {
  const uid = useId();
  const actualGradId = `actualGradient-${uid}`;
  const projectedGradId = `projectedGradient-${uid}`;
  const palette = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {/* Legacy gradients */}
            <linearGradient id={actualGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={actualColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={actualColor} stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id={projectedGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={projectedColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={projectedColor} stopOpacity={0.05}/>
            </linearGradient>
            {/* Dynamic gradients */}
            {series?.map((s, i) => (
              <linearGradient key={s.key} id={`grad-${s.key}-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color || palette[i % palette.length]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={s.color || palette[i % palette.length]} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-medium)'
            }}
          />
          <Legend />
          {series && series.length > 0 ? (
            series.filter(s => s.show !== false).map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color || palette[i % palette.length]}
                fillOpacity={1}
                fill={`url(#grad-${s.key}-${uid})`}
                strokeWidth={2}
                strokeDasharray={s.dashed ? '5 5' : undefined}
                name={s.name || s.key}
              />
            ))
          ) : (
            <>
              {showActual && (
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke={actualColor}
                  fillOpacity={1}
                  fill={`url(#${actualGradId})`}
                  strokeWidth={2}
                  name="Actual"
                />
              )}
              {showProjected && (
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke={projectedColor}
                  fillOpacity={1}
                  fill={`url(#${projectedGradId})`}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Projected"
                />
              )}
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}