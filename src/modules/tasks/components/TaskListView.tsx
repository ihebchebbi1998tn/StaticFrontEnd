import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Calendar, 
  User, 
  Flag,
  Search
} from "lucide-react";
import { Task } from "../types";

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  onTaskComplete: (taskId: string, completed: boolean) => void;
}

export default function TaskListView({ 
  tasks, 
  onTaskClick, 
  onAddTask, 
  onTaskComplete 
}: TaskListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isCompleted = !!task.completedAt;
    const matchesFilter = filter === "all" || 
                         (filter === "completed" && isCompleted) ||
                         (filter === "pending" && !isCompleted);
    
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    onTaskComplete(taskId, completed);
  };

  return (
    <div className="flex-1 p-3 sm:p-6 space-y-4">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({tasks.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending ({tasks.filter(t => !t.completedAt).length})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed ({tasks.filter(t => !!t.completedAt).length})
          </Button>
        </div>
        
        <Button onClick={() => onAddTask("todo")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Tasks ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery || filter !== "all" ? "No tasks match your filters" : "No tasks yet"}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div 
                  key={task.id}
                  className="p-4 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={!!task.completedAt}
                      onCheckedChange={(checked) => 
                        handleTaskComplete(task.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onTaskClick(task)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium text-sm truncate ${
                          task.completedAt ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.priority && (
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className={`text-xs mb-2 ${
                          task.completedAt ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                        }`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{task.assignee}</span>
                          </div>
                        )}
                        
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex gap-1">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}