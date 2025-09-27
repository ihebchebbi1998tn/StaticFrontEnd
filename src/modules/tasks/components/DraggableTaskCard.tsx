import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, GripVertical } from 'lucide-react';

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
  projectName?: string;
  projectId?: string;
}

interface DraggableTaskCardProps {
  task: Task;
  isDragging?: boolean;
  onTaskClick?: (task: Task) => void;
}

export function DraggableTaskCard({ task, isDragging = false, onTaskClick }: DraggableTaskCardProps) {
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'transform',
    transformOrigin: 'center top',
    marginTop: isSortableDragging ? 6 : 0,
    marginBottom: isSortableDragging ? 6 : 0,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityBarColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-success';
      default:
        return 'bg-border';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click when dragging or if click is on drag handle
    if (isSortableDragging || isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    onTaskClick?.(task);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group relative overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 touch-manipulation select-none shadow-card border-0 bg-white dark:bg-card hover-lift ${
        (isSortableDragging || isDragging) ? 'opacity-70 rotate-1 shadow-xl scale-105 z-50' : ''
      } active:scale-105 mb-4 sm:mb-5 last:mb-0`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityBarColor(task.priority)}`} />
      <CardHeader className="pb-2 px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xs font-medium leading-tight flex-1 min-w-0 pointer-events-none">
            <span className="line-clamp-1">{task.title}</span>
          </CardTitle>
          <div className="opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0 pointer-events-none">
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1 pointer-events-none">
            {task.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-2 px-4 pb-3 pointer-events-none">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)} px-2 py-1`}>
            {task.priority.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{task.dueDate}</span>
          </div>
        </div>

        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-5 w-5 flex-shrink-0">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(task.assignee)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {task.assignee}
            </span>
          </div>
        </div>

        {task.projectName && (
          <div className="flex items-center gap-1 text-xs">
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {task.projectName}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}