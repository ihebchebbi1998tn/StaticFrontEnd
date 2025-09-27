import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ContactProjectColumn, ContactTask } from "../types";
import { ContactDraggableTaskCard } from "./ContactDraggableTaskCard";

interface ContactDroppableColumnProps {
  column: ContactProjectColumn;
  tasks: ContactTask[];
  onQuickAdd: () => void;
}

export function ContactDroppableColumn({
  column,
  tasks,
  onQuickAdd
}: ContactDroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
  });

  const getColumnColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-slate-500': 'bg-slate-100 border-slate-200',
      'bg-primary': 'bg-primary/10 border-primary/20',
      'bg-warning': 'bg-warning/10 border-warning/20',
      'bg-success': 'bg-success/10 border-success/20',
      'bg-destructive': 'bg-destructive/10 border-destructive/20',
    };
    return colorMap[color] || 'bg-gray-100 border-gray-200';
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${column.color}`} />
            {column.title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-3 pt-0">
        <div
          ref={setNodeRef}
          className={`
            flex-1 rounded-lg border-2 border-dashed p-2 space-y-3 min-h-[200px]
            ${getColumnColorClasses(column.color)}
            transition-colors
          `}
        >
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <div key={task.id} className="group">
                <ContactDraggableTaskCard
                  task={task}
                  technicians={[]} // We'll need to pass this from parent
                />
              </div>
            ))}
          </SortableContext>
          
          {/* Quick Add Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground border-2 border-dashed border-muted hover:border-muted-foreground/50 mt-2"
            onClick={onQuickAdd}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}