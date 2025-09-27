import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, AlertCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  labels?: string[];
  estimatedHours?: number;
}

interface TaskCardProps {
  data: TaskData;
}

const TaskCard = memo(({ data }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="w-80">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Card className="shadow-card hover-lift transition-all duration-200 border-0 bg-card">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-2 py-1 ${getPriorityColor(data.priority)}`}>
                {data.priority}
              </Badge>
              {data.labels?.map((label, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-2 leading-tight">
              {data.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{data.dueDate}</span>
              </div>
              {data.estimatedHours && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  <span>{data.estimatedHours}h</span>
                </div>
              )}
            </div>
            
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(data.assignee)}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;