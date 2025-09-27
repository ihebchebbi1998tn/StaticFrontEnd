import { useState } from "react";
import { usePaginatedData } from "@/shared/hooks/usePagination";
import { useNavigate } from "react-router-dom";
// import { useProjectsData } from "../hooks/useProjectsData";
// import { SearchAndFilterBar, FilterGroup } from "@/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter,
  Grid,
  List,
  CheckSquare,
  Briefcase,
  ChevronDown
} from "lucide-react";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Project, ProjectStats, Task } from "../types";
// import { ProjectCard } from "./ProjectCard";
import { ProjectsList } from "./ProjectsList";
import { ProjectsTable } from "./ProjectsTable";
import { EditProjectModal } from "./EditProjectModal";

import { CreateProjectModal } from "./CreateProjectModal";
import { QuickTaskModal } from "./QuickTaskModal";
import { KanbanBoard } from "./KanbanBoard";

// Import mock data from JSON files
import mockTechniciansData from "@/data/mock/technicians.json";
import mockProjectsData from "@/data/mock/projects.json";
import mockProjectStatsData from "@/data/mock/projectStats.json";
import defaultColumnsData from "@/data/mock/defaultColumns.json";

// Convert JSON data to proper types
const mockTechnicians = mockTechniciansData.map(tech => ({
  ...tech,
  role: tech.position,
  isActive: tech.status === 'Active'
}));

const mockProjects: Project[] = mockProjectsData.map(project => ({
  ...project,
  status: project.status as Project['status'],
  type: project.type as Project['type'],
  priority: project.priority as Project['priority'],
  startDate: project.startDate ? new Date(project.startDate) : undefined,
  endDate: project.endDate ? new Date(project.endDate) : undefined,
  createdAt: new Date(project.createdAt),
  updatedAt: new Date(project.updatedAt),
  columns: project.columns.map(col => ({
    ...col,
    createdAt: new Date(col.createdAt)
  }))
}));

const mockProjectStats: Record<string, ProjectStats> = mockProjectStatsData;

const defaultColumns = defaultColumnsData.map(col => ({
  ...col,
  createdAt: new Date(col.createdAt)
}));

interface ProjectManagerProps {
  onSwitchToTasks: () => void;
}

export function ProjectManager({ onSwitchToTasks: _onSwitchToTasks }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Project['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Project['type']>('all');
  const [filterOwner, setFilterOwner] = useState<'all' | string>('all');
  const [filterTimeframe, setFilterTimeframe] = useState<'all' | '7' | '30' | '365'>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'projects' | 'project-detail' | 'daily-tasks'>('projects');
  const [selectedStat, setSelectedStat] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    // Handle special "late" filter
    const isLateProject = project.endDate && project.endDate < new Date() && project.status === 'active';
    const matchesStatus = filterStatus === 'all' || 
                         project.status === filterStatus || 
                         (selectedStat === 'late' && isLateProject);

    const matchesType = filterType === 'all' || project.type === filterType;

    const matchesOwner = filterOwner === 'all' || project.ownerId === filterOwner || project.ownerName === filterOwner;

    let matchesTimeframe = true;
    if (filterTimeframe !== 'all') {
      const days = Number(filterTimeframe);
      const refDate = project.startDate || project.createdAt || new Date();
      const msPerDay = 1000 * 60 * 60 * 24;
      const diffDays = (Date.now() - refDate.getTime()) / msPerDay;
      matchesTimeframe = diffDays <= days;
    }

    return matchesSearch && matchesStatus && matchesType && matchesOwner && matchesTimeframe;
  });

  const pagination = usePaginatedData(filteredProjects, 5);

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setProjects([newProject, ...projects]);
  };

  const navigate = useNavigate();

  const handleOpenProject = (project: Project) => {
    // Navigate to the new project detail route
    navigate(`/dashboard/tasks/projects/${project.id}`);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, ...updates }
        : p
    ));
    setIsEditModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleToggleStatus = (projectId: string, status: Project['status']) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, status, updatedAt: new Date(), completedAt: status === 'completed' ? new Date() : undefined }
        : p
    ));
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Add task to the selected project or global tasks
    console.log('Create task:', taskData);
  };

  const backToProjects = () => {
    setSelectedProject(null);
    setActiveView('projects');
  };

  if (activeView === 'project-detail' && selectedProject) {
    return (
      <KanbanBoard 
        project={selectedProject}
        onBackToProjects={backToProjects}
        technicians={mockTechnicians}
      />
    );
  }

  if (activeView === 'daily-tasks') {
    return (
      <KanbanBoard 
        onBackToProjects={() => setActiveView('projects')}
        technicians={mockTechnicians}
        isDailyTasks={true}
      />
    );
  }

  const Header = () => (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Project & Tasks</h1>
          <p className="text-[11px] text-muted-foreground">Organize tasks into projects with custom workflows</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setIsQuickTaskModalOpen(true)} className="w-full sm:w-auto">
          <CheckSquare className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Quick Task</span>
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/tasks/daily')} className="w-full sm:w-auto">
          <FolderOpen className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Daily Tasks</span>
        </Button>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gradient-primary text-white shadow-medium hover-lift w-full sm:w-auto bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4 text-white" />
          <span className="hidden sm:inline text-white">New Project</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <Header />

      {/* Project Status Cards */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: "Total",
              value: projects.length,
              icon: FolderOpen,
              color: "chart-1",
              filter: 'all'
            },
            {
              label: "Active",
              value: projects.filter(p => p.status === 'active').length,
              icon: CheckSquare,
              color: "chart-2",
              filter: 'active'
            },
            {
              label: "Completed", 
              value: projects.filter(p => p.status === 'completed').length,
              icon: CheckSquare,
              color: "chart-3", 
              filter: 'completed'
            },
            {
              label: "Late",
              value: projects.filter(p => p.endDate && p.endDate < new Date() && p.status === 'active').length,
              icon: Filter,
              color: "chart-4",
              filter: 'late'
            }
          ].map((stat, index) => {
            const isSelected = (stat.filter === 'late' && filterStatus === 'active' && selectedStat === 'late') || 
                             (stat.filter !== 'late' && filterStatus === stat.filter);
            return (
              <Card 
                key={index} 
                className={`shadow-card hover-lift gradient-card group cursor-pointer transition-all hover:shadow-lg ${
                  isSelected 
                    ? 'border-2 border-primary bg-primary/5' 
                    : 'border-0'
                }`}
                onClick={() => {
                  if (stat.filter === 'late') {
                    setFilterStatus('active');
                    setSelectedStat('late');
                  } else if (stat.filter === 'all') {
                    setFilterStatus('all');
                    setFilterType('all');
                    setSelectedStat('all');
                  } else {
                    setFilterStatus(stat.filter as Project['status']);
                    setSelectedStat(stat.filter);
                  }
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                        isSelected 
                          ? 'bg-primary/20' 
                          : `bg-${stat.color}/10 group-hover:bg-${stat.color}/20`
                      }`}>
                        <stat.icon className={`h-4 w-4 transition-all ${
                          isSelected 
                            ? 'text-primary' 
                            : `text-${stat.color}`
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-medium truncate">{stat.label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2 sm:gap-3 flex-1 w-full items-center">
            <div className="flex-1">
              <CollapsibleSearch 
                placeholder="Search projects..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 px-2 sm:px-3"
                onClick={() => setShowFilterBar(s => !s)}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {(filterStatus !== 'all' || filterType !== 'all' || filterOwner !== 'all' || filterTimeframe !== 'all') && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {[filterStatus !== 'all' ? 1 : 0, filterType !== 'all' ? 1 : 0, filterOwner !== 'all' ? 1 : 0, filterTimeframe !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none ${viewMode === 'list' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
            >
              <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-white' : ''}`} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-none ${viewMode === 'grid' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
            >
              <Grid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-white' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Slide-down Filter Bar (matches Contacts/Offers) */}
      {showFilterBar && (
        <div className="p-3 sm:p-4 border-b border-border bg-background/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterType} onChange={e => setFilterType(e.target.value as any)}>
                  <option value="all">All Types</option>
                  <option value="service">Service</option>
                  <option value="sales">Sales</option>
                  <option value="internal">Internal</option>
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterOwner} onChange={e => setFilterOwner(e.target.value)}>
                  <option value="all">All Owners</option>
                  {mockTechnicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterTimeframe} onChange={e => setFilterTimeframe(e.target.value as any)}>
                  <option value="all">Any time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="365">Last 12 months</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-full border border-border text-sm" onClick={() => { setFilterStatus('all'); setFilterType('all'); setFilterOwner('all'); setFilterTimeframe('all'); setShowFilterBar(false); }}>Clear</button>
            </div>
          </div>
        </div>
      )}

  {/* Projects Grid/List */}
  <div className="p-3 sm:p-4 lg:p-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first project"}
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2 text-white" />
              Create Project
            </Button>
          </div>
        ) : (
          <div>
            {viewMode === 'list' ? (
              <Card className="shadow-card border-0 bg-card">
                
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    <ProjectsList
                      projects={filteredProjects}
                      projectStats={mockProjectStats}
                      technicians={mockTechnicians}
                      onOpenProject={handleOpenProject}
                      onEditProject={handleEditProject}
                      onDeleteProject={handleDeleteProject}
                      onToggleStatus={handleToggleStatus}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card border-0 bg-card">
                
                <CardContent className="p-0">
                  <ProjectsTable
                    projects={pagination.data}
                    projectStats={mockProjectStats}
                    technicians={mockTechnicians}
                    onOpenProject={handleOpenProject}
                    onEditProject={handleEditProject}
                    onDeleteProject={handleDeleteProject}
                    onToggleStatus={handleToggleStatus}
                    enablePagination={true}
                    itemsPerPage={5}
                    currentPage={pagination.state.currentPage}
                    onPageChange={pagination.actions.goToPage}
                    totalItems={filteredProjects.length}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
        technicians={mockTechnicians}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProject(null);
        }}
        onUpdateProject={handleUpdateProject}
        project={editingProject}
        technicians={mockTechnicians}
      />

      <QuickTaskModal
        isOpen={isQuickTaskModalOpen}
        onClose={() => setIsQuickTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
        technicians={mockTechnicians}
        columns={defaultColumns}
        projects={projects}
      />
    </div>
  );
}