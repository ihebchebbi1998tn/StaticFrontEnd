import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading, Text } from '@/shared/components/Typography';

export default function ArticlesCard({ articles = 5 }: { articles?: number }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Heading as={CardTitle as any} size="card">Articles</Heading>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-col justify-between h-full">
          <div>
            <Text as="div" variant="muted">Published</Text>
            <Text as="div" variant="metric-sm" className="mt-1">{articles}</Text>
          </div>
          <Text as="div" variant="muted-xs" className="mt-3">Top article: How to improve customer retention</Text>
        </div>
      </CardContent>
    </Card>
  );
}
