import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heading, Text } from '@/shared/components/Typography';

type Task = { id: string; title: string; due?: string; assignee?: string };

export default function TasksCard({ tasks = [] }: { tasks?: Task[] }) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
      <Heading as="div" size="card">Tasks Due</Heading>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <ul className="mt-3 space-y-2">
      {tasks.length === 0 && <li><Text variant="muted">No tasks for today</Text></li>}
          {tasks.map(t => (
            <li key={t.id} className="flex items-start justify-between">
              <div className="min-w-0">
        <Text as="div" className="font-medium truncate">{t.title}</Text>
        {t.due && <Text as="div" variant="muted-xs">Due: {t.due}</Text>}
              </div>
              <div>
                <Button variant="ghost" size="icon" className="h-8 w-8">Done</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
