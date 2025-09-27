import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Palette, Check, X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { DraggableTaskCard } from './DraggableTaskCard';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string;
  columnId: string;
  createdAt: Date;
  lastMoved?: Date;
}

interface Column {
  id: string;
  title: string;
  color: string;
}

interface DroppableColumnProps {
  column: Column;
  tasks: Task[];
  showSeparator?: boolean;
  isFirst?: boolean;
  onTaskClick?: (task: Task) => void;
  onEditColumn?: (columnId: string, newTitle?: string) => void;
  onAddTask?: (columnId: string) => void;
  onChangeTheme?: (columnId: string, colorClass?: string) => void;
  allowEditing?: boolean;
}

export function DroppableColumn({ 
  column, 
  tasks, 
  showSeparator = false, 
  isFirst = false, 
  onTaskClick, 
  onEditColumn, 
  onAddTask, 
  onChangeTheme, 
  allowEditing = true 
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const colorOptions = [
    { name: 'Slate', class: 'bg-slate-500' },
    { name: 'Primary', class: 'bg-primary' },
    { name: 'Success', class: 'bg-success' },
    { name: 'Warning', class: 'bg-warning' },
    { name: 'Destructive', class: 'bg-destructive' },
    { name: 'Accent', class: 'bg-accent' },
    { name: 'Chart 1', class: 'bg-chart-1' },
    { name: 'Chart 2', class: 'bg-chart-2' },
    { name: 'Chart 3', class: 'bg-chart-3' },
    { name: 'Chart 4', class: 'bg-chart-4' },
  ];

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== column.title) {
      onEditColumn?.(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleColorChange = (colorClass: string) => {
    onChangeTheme?.(column.id, colorClass);
  };

  return (
    <Card 
      ref={setNodeRef}
      className={`h-full flex flex-col transition-all duration-200 bg-muted/20 border border-border/30 shadow-soft rounded-lg ${
        isOver ? 'bg-primary/10 ring-2 ring-primary/40 border-primary/30' : ''
      } ${showSeparator && !isFirst ? 'border-l-2 border-l-border/60' : ''}`}
    >
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${column.color} flex-shrink-0`}></div>
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="h-6 text-xs sm:text-sm font-semibold bg-background/80 border-primary/50"
                  autoFocus
                  onBlur={handleSaveTitle}
                />
              ) : (
                <span className="truncate">{column.title}</span>
              )}
              <Badge variant="secondary" className="text-xs h-4 sm:h-5 px-1 sm:px-2 flex-shrink-0">
                {tasks.length}
              </Badge>
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {allowEditing && isEditing && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-success hover:bg-success/10"
                  onClick={handleSaveTitle}
                  title="Save changes"
                >
                  <Check className="h-2 w-2 sm:h-3 sm:w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-destructive hover:bg-destructive/10"
                  onClick={handleCancelEdit}
                  title="Cancel editing"
                >
                  <X className="h-2 w-2 sm:h-3 sm:w-3" />
                </Button>
              </>
            )}
            {allowEditing && !isEditing && onEditColumn && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 opacity-60 hover:opacity-100"
                onClick={() => setIsEditing(true)}
                title="Edit column title"
              >
                <Edit2 className="h-2 w-2 sm:h-3 sm:w-3" />
              </Button>
            )}
            {allowEditing && !isEditing && onChangeTheme && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 opacity-60 hover:opacity-100"
                    title="Change column color"
                  >
                    <Palette className="h-2 w-2 sm:h-3 sm:w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {colorOptions.map((color) => (
                    <DropdownMenuItem 
                      key={color.class}
                      onClick={() => handleColorChange(color.class)}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                      <span>{color.name}</span>
                      {column.color === color.class && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 opacity-60 hover:opacity-100"
              onClick={() => onAddTask?.(column.id)}
              title="Add task"
            >
              <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 px-3 sm:px-6 pb-3 sm:pb-6 overflow-hidden">
        <div
          className={`flex flex-col gap-4 sm:gap-5 min-h-0 flex-1 rounded-lg transition-all duration-300 p-3 sm:p-4 bg-background/50 border border-border/20 ${
            isOver ? 'bg-primary/5 border-primary/20' : ''
          }`}
        >
          {isOver && tasks.length === 0 && (
            <div className="text-center text-primary font-medium py-6 sm:py-8 text-sm sm:text-base animate-pulse">
              <div className="text-2xl mb-2">📋</div>
              Drop task here
            </div>
          )}
          <div className="flex-1 overflow-y-auto pr-1">
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <DraggableTaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
              ))}
            </SortableContext>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}