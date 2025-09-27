import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KanbanBoard } from "../components/KanbanBoard";
import TaskListView from "../components/TaskListView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LayoutGrid, List, PlusCircle, CheckSquare, Search, Filter } from "lucide-react";
import { Task } from '../types';
import { TasksService, BackendDailyTaskResponse } from '../services/tasks.service';

export default function DailyTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<BackendDailyTaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskViewMode, setTaskViewMode] = useState<'board' | 'list'>('board');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>("all");
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>("all");

  // Load daily tasks on component mount
  useEffect(() => {
    loadDailyTasks();
  }, []);

  const loadDailyTasks = async () => {
    try {
      setLoading(true);
      // For now, using userId 1 - in a real app, get from auth context
      const dailyTasks = await TasksService.getUserDailyTasks(1);
      setTasks(dailyTasks);
    } catch (error) {
      console.error('Failed to load daily tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: BackendDailyTaskResponse) => {
    console.log('Task clicked:', task);
  };

  const handleAddTask = async () => {
    try {
      const createDto = {
        userId: 1,
        userName: "Daily Tasks User", 
        title: 'New Daily Task',
        description: 'New task description',
        status: 'todo' as const,
        priority: 'medium' as const,
        tags: ['daily'],
        dueDate: new Date().toISOString()
      };
      
      await TasksService.createDailyTask(createDto);
      await loadDailyTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleTaskComplete = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      await TasksService.updateDailyTask(taskId, { status: newStatus });
      await loadDailyTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleSwitchToProjects = () => {
    navigate("/dashboard/tasks/projects");
  };

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
          <div className="flex items-start sm:items-center gap-4 w-full">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSwitchToProjects}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3 sm:gap-4">
                <span className="p-2 sm:p-3 rounded-xl bg-primary/10 shadow-soft">
                  <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
                </span>
                Daily Tasks
              </h1>
              <p className="text-muted-foreground mt-2 sm:mt-3 text-base sm:text-lg lg:text-xl">
                Manage your personal daily tasks and to-dos
              </p>
            </div>
          </div>
          <Button 
            onClick={handleAddTask}
            className="gap-2 w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4 text-white" />
            <span className="hidden sm:inline text-white">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2 sm:gap-3 flex-1 w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 h-9 sm:h-10 border-border bg-background text-sm" 
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {((filterStatus !== 'all') || (filterPriority !== 'all')) && (
                    <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                      {[(filterStatus !== 'all' ? 1 : 0), (filterPriority !== 'all' ? 1 : 0)].reduce((a,b)=>a+b,0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>All {filterStatus==='all' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('todo')}>Todo {filterStatus==='todo' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('in-progress')}>In progress {filterStatus==='in-progress' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('done')}>Done {filterStatus==='done' && '✓'}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilterPriority('all')}>All {filterPriority==='all' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('urgent')}>Urgent {filterPriority==='urgent' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('high')}>High {filterPriority==='high' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('medium')}>Medium {filterPriority==='medium' && '✓'}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('low')}>Low {filterPriority==='low' && '✓'}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant={taskViewMode === 'board' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTaskViewMode('board')} 
              className={`flex-1 sm:flex-none ${taskViewMode === 'board' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
            >
              <LayoutGrid className={`h-4 w-4 ${taskViewMode === 'board' ? 'text-white' : ''}`} />
            </Button>
            <Button 
              variant={taskViewMode === 'list' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTaskViewMode('list')} 
              className={`flex-1 sm:flex-none ${taskViewMode === 'list' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
            >
              <List className={`h-4 w-4 ${taskViewMode === 'list' ? 'text-white' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Task Content */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading daily tasks...</p>
          </div>
        ) : taskViewMode === 'list' ? (
          <div className="space-y-4">
            {tasks
              .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.description||'').toLowerCase().includes(searchTerm.toLowerCase()))
              .filter(t => filterStatus === 'all' ? true : (filterStatus === 'in-progress' ? t.status === 'in-progress' : t.status === filterStatus))
              .filter(t => filterPriority === 'all' ? true : t.priority === filterPriority)
              .map(task => (
                <div key={task.id} className="p-4 border border-border rounded-lg bg-background shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground">{task.title}</h3>
                    <Badge className={task.status === 'done' ? 'status-success' : 'status-warning'}>
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.priority}</Badge>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleTaskComplete(task.id)}
                    >
                      {task.status === 'done' ? 'Mark Todo' : 'Mark Done'}
                    </Button>
                  </div>
                </div>
              ))
            }
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No daily tasks yet.</p>
                <Button onClick={handleAddTask} className="mt-4">Add your first task</Button>
              </div>
            )}
          </div>
        ) : (
          <KanbanBoard 
            onSwitchToProjects={handleSwitchToProjects}
            isDailyTasks={true}
            hideHeader={true}
          />
        )}
      </div>
    </div>
  );
}