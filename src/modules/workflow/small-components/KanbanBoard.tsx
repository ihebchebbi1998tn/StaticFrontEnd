import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDroppable } from '@dnd-kit/core';
import { KanbanColumn } from "../types";

interface KanbanBoardProps {
  columns: KanbanColumn[];
  itemsByColumn: Record<string, any[]>;
  onMove: (itemId: string, fromColumn: string, toColumn: string, index?: number) => void;
  renderItem: (item: any) => ReactNode;
  className?: string;
}

function DroppableColumn({ 
  column, 
  items, 
  renderItem 
}: { 
  column: KanbanColumn; 
  items: any[]; 
  renderItem: (item: any) => ReactNode; 
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getColumnColor = (color?: string) => {
    switch (color) {
      case 'blue': return 'border-blue-200 bg-blue-50/50';
      case 'orange': return 'border-orange-200 bg-orange-50/50';
      case 'purple': return 'border-purple-200 bg-purple-50/50';
      case 'green': return 'border-green-200 bg-green-50/50';
      case 'red': return 'border-red-200 bg-red-50/50';
      default: return 'border-gray-200 bg-gray-50/50';
    }
  };

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-shrink-0 w-80">
      <Card className={`h-full ${getColumnColor(column.color)} ${isOver ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
            <Badge variant="outline" className={`text-xs ${getBadgeColor(column.color)}`}>
              {items.length}
              {column.limit && ` / ${column.limit}`}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
            {items.map((item) => renderItem(item))}
            
            {items.length === 0 && (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg">
                {/** i18n: Drag an item here */}
                {typeof window !== 'undefined' ? (window?.localStorage?.getItem('i18n') ? '' : '') : ''}
                {/* Keep simple: use translation hook where component is used; fallback to English */}
                Drag an item here
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function KanbanBoard({
  columns,
  itemsByColumn,
  onMove,
  renderItem,
  className
}: KanbanBoardProps) {
  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      <div className="flex gap-6 p-1 min-w-max">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            items={itemsByColumn[column.id] || []}
            renderItem={renderItem}
          />
        ))}
      </div>
    </div>
  );
}