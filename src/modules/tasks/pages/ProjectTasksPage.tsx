import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { KanbanBoard } from "../components/KanbanBoard";
import TaskListView from "../components/TaskListView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  PlusCircle, 
  Settings, 
  Users,
  Calendar,
  FolderOpen,
  Clock,
  CheckCircle,
  Target,
  TrendingUp,
  ChevronDown,
  Search,
  Filter
} from "lucide-react";
import { Task, Project } from '../types';
import projectsData from "@/data/mock/projects.json";
import projectTasksData from "@/data/mock/projectTasks.json";
import technicianData from "@/data/mock/technicians.json";
import contactsData from "@/data/mock/contacts.json";
import { useLookups } from '@/shared/contexts/LookupsContext';

interface _ProjectTask extends Omit<Task, 'dueDate' | 'createdAt' | 'updatedAt' | 'completedAt'> {
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  contactId: string;
}

export default function ProjectTasksPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [taskViewMode, setTaskViewMode] = useState<'board' | 'list'>('board');
  const [isColumnEditorOpen, setIsColumnEditorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'done'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState<'all' | string>('all');

  // Get project data
  const projectData = projectsData.find(p => p.id === projectId);
  
  const project: Project | null = projectData ? {
    ...projectData,
    startDate: projectData.startDate ? new Date(projectData.startDate) : undefined,
    endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
    createdAt: new Date(projectData.createdAt),
    updatedAt: new Date(projectData.updatedAt),
    columns: projectData.columns.map(col => ({
      ...col,
      createdAt: new Date(col.createdAt)
    }))
  } as Project : null;

  const { priorities: lookupPriorities } = useLookups();

  // Get tasks for this project
  const projectTasks = (projectTasksData as any[])
    .filter((task: any) => task.projectId === projectId)
    .map((task: any) => ({
      ...task,
      priority: task.priority as 'high' | 'medium' | 'low' | 'urgent',
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined
    })) as Task[];

  // Map projectTasks to Kanban local task shape and keep live state so UI updates when tasks change
  const mapToLocal = (pts: Task[]) => pts.map(pt => ({
    id: pt.id,
    title: pt.title,
    description: pt.description || '',
    priority: (pt.priority as 'high' | 'medium' | 'low') || 'medium',
    assignee: (pt.assignee as string) || '',
    dueDate: (pt.dueDate instanceof Date) ? pt.dueDate.toString() : String(pt.dueDate || ''),
    columnId: (pt.status as string) || 'todo',
    createdAt: pt.createdAt || new Date(),
    projectId: pt.projectId || projectId,
  }));

  const [tasksState, setTasksState] = useState<any[]>(() => mapToLocal(projectTasks));

  // Get contact information
  const contact = contactsData.find(c => c.id.toString() === project?.contactId);

  // Calculate project statistics from live tasksState
  const projectStats = {
    totalTasks: tasksState.length,
    completedTasks: tasksState.filter((task: any) => (task.columnId === 'done') || task.completedAt).length,
    inProgressTasks: tasksState.filter((task: any) => task.columnId === 'in-progress').length,
    overdueTasks: tasksState.filter((task: any) => {
      try {
        const d = new Date(task.dueDate);
        return d < new Date() && !task.completedAt;
      } catch {
        return false;
      }
    }).length,
    totalEstimatedHours: tasksState.reduce((sum: number, task: any) => sum + (task.estimatedHours || 0), 0),
    totalActualHours: tasksState.reduce((sum: number, task: any) => sum + (task.actualHours || 0), 0),
    completionPercentage: tasksState.length > 0
      ? Math.round((tasksState.filter((task: any) => (task.columnId === 'done') || task.completedAt).length / tasksState.length) * 100)
      : 0
  };

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  const handleAddTask = () => {
    console.log('Add project task');
  };

  const handleTaskComplete = (taskId: string) => {
    console.log('Complete task:', taskId);
  };

  const handleBackToProjects = () => {
    navigate("/dashboard/tasks/projects");
  };

  if (!project) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={handleBackToProjects} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      case 'on-hold': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'sales': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'internal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'custom': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const Header = () => (
    <div className="border-b border-border bg-gradient-subtle backdrop-blur-sm sticky top-0 z-20 shadow-soft">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <Button variant="ghost" size="sm" onClick={handleBackToProjects} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddTask} size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsColumnEditorOpen(true)} className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-primary shadow-medium border-2 border-background">
              <FolderOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2 mb-1">
                {project.name}
              </h1>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                <Badge className={getTypeColor(project.type)} variant="outline">{project.type}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between p-6 lg:p-8">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={handleBackToProjects} className="gap-2 hover:bg-background/80">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <div className="h-8 w-px bg-border/50" />
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-xl bg-gradient-primary shadow-strong border-4 border-background">
                <FolderOpen className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
                  {project.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-3">
                  {project.description}
                </p>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(project.status)} px-3 py-1`}>{project.status}</Badge>
                  <Badge className={`${getTypeColor(project.type)} px-3 py-1`} variant="outline">{project.type}</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleAddTask} className="gap-2 hover:bg-primary/90">
              <PlusCircle className="h-4 w-4" />
              Add Task
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsColumnEditorOpen(true)} className="gap-2 hover:bg-background/80 border-border/50">
              <Settings className="h-4 w-4" />
              Manage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-background">
      <Header />

      {/* Project Stats Bar */}
      <div className="border-t border-border bg-muted/20 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">{projectStats.completedTasks}/{projectStats.totalTasks} Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{projectStats.totalActualHours || 0}h / {projectStats.totalEstimatedHours}h</span>
              </div>
              {projectStats.overdueTasks > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">{projectStats.overdueTasks} overdue</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${projectStats.completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium">{projectStats.completionPercentage}%</span>
            </div>
          </div>
        </div>

      {/* Search and Controls */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2 sm:gap-3 flex-1 w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={"Search project tasks"} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 h-9 sm:h-10 border-border bg-background text-sm" 
              />
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowFilterBar(s => !s)}>
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {((filterStatus !== 'all') || (filterPriority !== 'all') || (filterAssignee !== 'all')) && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {[(filterStatus !== 'all' ? 1 : 0), (filterPriority !== 'all' ? 1 : 0), (filterAssignee !== 'all' ? 1 : 0)].reduce((a,b)=>a+b,0)}
                  </Badge>
                )}
              </Button>
            </div>
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

        {showFilterBar && (
          <div className="p-3 sm:p-4 border-b border-border bg-background/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="relative">
                  <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
                    <option value="all">All</option>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterPriority} onChange={e => setFilterPriority(e.target.value as any)}>
                    <option value="all">All</option>
                    {lookupPriorities.map((p:any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}>
                    <option value="all">All Assignees</option>
                    {technicianData.map((t:any)=> <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full">
                    <option value="any">Any time</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="365">Last year</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-full border border-border text-sm" onClick={() => { setFilterStatus('all'); setFilterPriority('all'); setFilterAssignee('all'); setShowFilterBar(false); }}>{'Clear'}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Content */}
      <div className="p-4 sm:p-6">
        {taskViewMode === 'list' ? (
          <TaskListView
            tasks={projectTasks
              .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.description||'').toLowerCase().includes(searchTerm.toLowerCase()))
              .filter(t => filterStatus === 'all' ? true : (t.status === filterStatus))
              .filter(t => filterPriority === 'all' ? true : t.priority === filterPriority)
            }
            onTaskClick={handleTaskClick}
            onAddTask={() => handleAddTask()}
            onTaskComplete={(id) => handleTaskComplete(id)}
          />
        ) : (
          <KanbanBoard 
            onSwitchToProjects={handleBackToProjects}
            isDailyTasks={false}
            hideHeader={true}
            project={project}
            columnEditorOpen={isColumnEditorOpen}
            onColumnEditorOpenChange={(open) => setIsColumnEditorOpen(open)}
            initialTasks={tasksState}
            onTasksChange={(next) => setTasksState(next)}
          />
        )}
      </div>
    </div>
  );
}