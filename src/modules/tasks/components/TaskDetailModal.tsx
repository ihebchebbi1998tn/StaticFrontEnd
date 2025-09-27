import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Edit, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function TaskDetailModal({ open, onOpenChange, task }: TaskDetailModalProps) {
  const { toast } = useToast();

  if (!task) return null;

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⚡';
      case 'low':
        return '📌';
      default:
        return '📝';
    }
  };

  const getStatusColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      case 'progress':
        return 'bg-primary/10 text-primary dark:bg-primary/20';
      case 'review':
        return 'bg-warning/10 text-warning dark:bg-warning/20';
      case 'done':
        return 'bg-success/10 text-success dark:bg-success/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusLabel = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'To Do';
      case 'progress':
        return 'In Progress';
      case 'review':
        return 'Review';
      case 'done':
        return 'Done';
      default:
        return columnId;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit Task",
      description: "Edit functionality coming soon!",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Delete Task",
      description: "Delete functionality coming soon!",
      variant: "destructive",
    });
  };

  const handleComment = () => {
    toast({
      title: "Add Comment",
      description: "Comment functionality coming soon!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold leading-tight text-foreground">
                {task.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className={`${getPriorityColor(task.priority)} text-xs px-3 py-1`}>
                  {getPriorityIcon(task.priority)} {task.priority.toUpperCase()}
                </Badge>
                <Badge className={`${getStatusColor(task.columnId)} text-xs px-3 py-1`}>
                  {getStatusLabel(task.columnId)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Description
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-4">
              {task.description || "No description provided"}
            </p>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignee */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignee
              </h3>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm bg-primary/10 text-primary">
                    {getInitials(task.assignee)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">
                  {task.assignee}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </h3>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {task.dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </h3>
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground">{formatDate(task.createdAt)}</span>
              </div>
              {task.lastMoved && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last moved:</span>
                  <span className="text-foreground">{formatDate(task.lastMoved)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-foreground">{getStatusLabel(task.columnId)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleComment} className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}