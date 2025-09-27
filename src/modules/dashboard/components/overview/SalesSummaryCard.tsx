import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MiniChart } from '@/components/charts/MiniChart';
import { Heading, Text } from '@/shared/components/Typography';

export default function SalesSummaryCard({ won = 12, lost = 4 }: { won?: number; lost?: number }) {
  const total = won + lost;
  const winRate = total === 0 ? 0 : Math.round((won / total) * 100);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Heading as={CardTitle as any} size="card">Sales Summary</Heading>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <Text as="div" variant="muted">Won / Lost</Text>
              <Text as="div" variant="metric-sm" className="mt-1">{won} / {lost}</Text>
            </div>
            <div className="w-20">
              <MiniChart data={[{ value: 2 }, { value: 4 }, { value: 6 }, { value: 8 }, { value: 12 }]} type="line" color="#10b981" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Text as="div" variant="muted-xs">Win rate</Text>
            <Text as="div" variant="body" className="font-medium">{winRate}%</Text>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
