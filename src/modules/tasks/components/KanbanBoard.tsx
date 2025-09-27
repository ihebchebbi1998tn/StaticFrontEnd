import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Plus, Users, ArrowLeft, Settings, LayoutGrid, List } from "lucide-react";
import { DroppableColumn } from './DroppableColumn';
import { DraggableTaskCard } from './DraggableTaskCard';
import { TaskDetailModal } from './TaskDetailModal';
import { QuickTaskModal } from './QuickTaskModal';
// import { InfoTip } from "@/shared/components";
import { ColumnManager } from './ColumnManager';
import { TeamManagementModal } from './TeamManagementModal';
// import TaskListView from './TaskListView';
import TaskListViewGrouped from './TaskListViewGrouped';
import { Column, Task as TaskType } from '../types';
import { buildStatusColumns, defaultTechnicianColumns } from "../utils/columns";
import { useLookups } from "@/shared/contexts/LookupsContext";

interface LocalTask {
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


// Default/status columns helpers are extracted to utils

const defaultInitialTasks: LocalTask[] = [
  {
    id: 'task-1',
    title: 'Design new dashboard',
    description: 'Create wireframes and mockups',
    priority: 'high',
    assignee: 'Sarah Wilson',
    dueDate: 'Today',
    columnId: 'todo',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastMoved: new Date(Date.now() - 2 * 60 * 60 * 1000),
    projectName: 'Kitchen Renovation Service',
    projectId: 'proj-1',
  },
  {
    id: 'task-2',
    title: 'API integration',
    description: 'Test endpoints',
    priority: 'medium',
    assignee: 'Mike Chen',
    dueDate: 'Tomorrow',
    columnId: 'progress',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    lastMoved: new Date(Date.now() - 1 * 60 * 60 * 1000), // moved 1 hour ago
    projectName: 'Sales Pipeline Q1',
    projectId: 'proj-2',
  },
  {
    id: 'task-3',
    title: 'Database optimization',
    description: 'Improve query performance',
    priority: 'high',
    assignee: 'Lisa Johnson',
    dueDate: 'This week',
    columnId: 'review',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    lastMoved: new Date(Date.now() - 30 * 60 * 1000), // moved 30 min ago
    projectName: 'Kitchen Renovation Service',
    projectId: 'proj-1',
  },
  {
    id: 'task-4',
    title: 'User testing',
    description: 'Conduct usability tests',
    priority: 'medium',
    assignee: 'David Park',
    dueDate: 'Next week',
    columnId: 'done',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    lastMoved: new Date(Date.now() - 15 * 60 * 1000), // moved 15 min ago
    projectName: 'Sales Pipeline Q1',
    projectId: 'proj-2',
  },
  {
    id: 'task-5',
    title: 'Security audit',
    description: 'Review security measures',
    priority: 'high',
    assignee: 'Sarah Wilson',
    dueDate: 'Today',
    columnId: 'todo',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    lastMoved: new Date(Date.now() - 10 * 60 * 60 * 1000),
    projectName: 'Kitchen Renovation Service',
    projectId: 'proj-1',
  },
];

export function KanbanBoard({ project, onBackToProjects, onSwitchToProjects, technicians = [], isDailyTasks = false, hideHeader = false, columnEditorOpen, onColumnEditorOpenChange, initialTasks, onTasksChange }: { project?: any; onBackToProjects?: () => void; onSwitchToProjects?: () => void; technicians?: any[]; isDailyTasks?: boolean; hideHeader?: boolean; columnEditorOpen?: boolean; onColumnEditorOpenChange?: (open: boolean) => void; initialTasks?: LocalTask[]; onTasksChange?: (tasks: LocalTask[]) => void }) {
  const { t: _t } = useTranslation();
  const { taskStatuses } = useLookups();
  const [tasks, setTasks] = useState<LocalTask[]>(initialTasks ?? defaultInitialTasks);
  const [activeTab, setActiveTab] = useState('status');
  const [activeTask, setActiveTask] = useState<LocalTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<LocalTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);
  const [isColumnEditorOpen, setIsColumnEditorOpen] = useState(!!columnEditorOpen);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [_editingColumn, _setEditingColumn] = useState<any>(null);
  const [_newColumnName, _setNewColumnName] = useState('');
  const [projectTeamColumns, setProjectTeamColumns] = useState<Column[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Generate status columns from lookups
  const statusColumns = buildStatusColumns(taskStatuses);
  const [customColumns, setCustomColumns] = useState(statusColumns);

  // Update columns when lookups change
  useEffect(() => {
  const newStatusColumns = buildStatusColumns(taskStatuses);
    setCustomColumns(newStatusColumns);
  }, [taskStatuses]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced distance for easier activation
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;

    // Determine the target column id even when hovering over a task
    const resolveColumnId = (id: string) => {
  const allColumnIds = [...statusColumns, ...defaultTechnicianColumns].map(c => c.id);
      if (allColumnIds.includes(id)) return id;
      const overTask = tasks.find(t => t.id === id);
      return overTask?.columnId;
    };

    const newColumnId = resolveColumnId(String(over.id));

    if (!newColumnId) {
      setActiveTask(null);
      return;
    }

    // Only update if the column actually changed
    const currentTask = tasks.find(t => t.id === taskId);
    if (currentTask && currentTask.columnId !== newColumnId) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                columnId: newColumnId,
                lastMoved: new Date(),
                // Update assignee when moving to technician columns
                assignee: newColumnId === 'sarah' ? 'Sarah Wilson' :
                         newColumnId === 'mike' ? 'Mike Chen' :
                         newColumnId === 'lisa' ? 'Lisa Johnson' :
                         newColumnId === 'david' ? 'David Park' :
                         task.assignee
              }
            : task
        )
      );
    }
    
    setActiveTask(null);
  };

  const getTasksForColumn = (columnId: string) => {
    return tasks.filter(task => task.columnId === columnId);
  };

  const getColumns = () => {
  return activeTab === 'status' ? customColumns : (project ? projectTeamColumns : defaultTechnicianColumns);
  };

  // Layout: limit columns per row to avoid long single-row horizontal overflow.
  // This makes the board render at most `columnsPerRow` columns per row, then wrap to the next row.
  const columnsPerRow = 4;

  // Update team columns when project team changes
  const updateTeamColumns = useCallback(() => {
    if (project && project.teamMembers.length > 0) {
      const teamColumns: Column[] = project.teamMembers.map((memberId, index) => {
        const member = technicians.find(t => t.id === memberId);
        if (!member) return null;
        
        const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-chart-1', 'bg-chart-2'];
        return {
          id: member.id,
          title: member.name,
          color: colors[index % colors.length],
          position: index,
          isDefault: false,
          createdAt: new Date(),
        };
      }).filter(Boolean) as Column[];
      
      setProjectTeamColumns(teamColumns);
    } else {
      // Use default technician columns when no project team is set
  setProjectTeamColumns(defaultTechnicianColumns);
    }
  }, [project, technicians]);

  // Update team columns when project changes
  useEffect(() => {
    updateTeamColumns();
  }, [updateTeamColumns]);

  const handleUpdateTeam = (projectId: string, teamMembers: string[]) => {
    // Update the project team members and refresh columns
    if (project) {
      project.teamMembers = teamMembers;
      updateTeamColumns();
      
      // Also update tasks that were assigned to removed team members
      setTasks(prevTasks => 
        prevTasks.map(task => {
          // Check if the current task's assignee is no longer in the team
          const currentAssignee = technicians.find(t => t.name === task.assignee);
          if (currentAssignee && !teamMembers.includes(currentAssignee.id)) {
            return { ...task, assignee: 'Unassigned' };
          }
          return task;
        })
      );
    }
  };

  const handleUpdateColumns = (newColumns: Column[]) => {
    setCustomColumns(newColumns);
  };

  const handleCreateTask = (taskData: any) => {
    const newTask: LocalTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      lastMoved: new Date(),
      projectName: project?.name,
      projectId: project?.id,
    };
    
    setTasks(prev => {
      const next = [...prev, newTask];
      return next;
    });
  };

  const handleTaskClick = (task: LocalTask) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleEditColumn = (columnId: string, newTitle?: string) => {
    if (newTitle) {
      // Update column title in the customColumns state
      setCustomColumns(prev => 
        prev.map(col => 
          col.id === columnId 
            ? { ...col, title: newTitle }
            : col
        )
      );
    }
  };

  // Sync external control (parent) for opening/closing the column editor
  useEffect(() => {
    if (typeof columnEditorOpen !== 'undefined') {
      setIsColumnEditorOpen(!!columnEditorOpen);
    }
  }, [columnEditorOpen]);

  const handleAddTask = (_columnId: string) => {
    // Open quick task modal with the specific column pre-selected
    setIsQuickTaskModalOpen(true);
  };

  const handleChangeTheme = (columnId: string, colorClass?: string) => {
    if (colorClass) {
      // Update column color in the customColumns state
      setCustomColumns(prev => 
        prev.map(col => 
          col.id === columnId 
            ? { ...col, color: colorClass }
            : col
        )
      );
    }
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    const firstStatus = statusColumns[0]?.id || 'todo';
    const doneStatus = statusColumns.find(s => s.title.toLowerCase().includes('done') || s.title.toLowerCase().includes('complete'))?.id || 'done';
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            columnId: completed ? doneStatus : firstStatus
          }
        : task
    ));
  };

  const handleTaskMove = (taskId: string, newColumnId: string) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            columnId: newColumnId,
            lastMoved: new Date(),
            // Update assignee when moving to technician columns
            assignee: newColumnId === 'sarah' ? 'Sarah Wilson' :
                     newColumnId === 'mike' ? 'Mike Chen' :
                     newColumnId === 'lisa' ? 'Lisa Johnson' :
                     newColumnId === 'david' ? 'David Park' :
                     task.assignee
          }
        : task
    ));
  };

  // Notify parent when tasks change
  useEffect(() => {
    onTasksChange?.(tasks);
  }, [tasks, onTasksChange]);

  return (
    <div className="h-screen flex flex-col">
      {/* Enhanced Project Header - only show if hideHeader is false */}
      {!hideHeader && (
        <div className="flex flex-col gap-4 p-4 sm:p-6 border-b border-border bg-background/95">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {(onBackToProjects || onSwitchToProjects) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBackToProjects || onSwitchToProjects}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Projects</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="p-2 rounded-xl bg-primary/10 shadow-soft flex-shrink-0">
                    <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight truncate">
                      {isDailyTasks ? 'Daily Tasks' : (project ? project.name : 'Task Management')}
                    </h1>
                    {(project || isDailyTasks) && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {isDailyTasks ? 'Personal Tasks' : 'Project Tasks'}
                        </Badge>
                        {project && (
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {project.status}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm truncate">
                  {isDailyTasks 
                    ? 'Manage your personal daily tasks and to-dos' 
                    : (project ? project.description || 'Manage your project tasks with custom workflows' : 'Simply drag and drop tasks between columns')
                  }
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsQuickTaskModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
              {activeTab === 'status' && !isDailyTasks && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsColumnEditorOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Manage Columns</span>
                  <span className="sm:hidden">Columns</span>
                </Button>
              )}
              {project && !isDailyTasks && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsTeamModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Team ({project.teamMembers.length})</span>
                  <span className="sm:hidden">Team</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* View Mode Switcher */}
          <div className="flex justify-end">
            <div className="flex items-center border border-border rounded-lg p-1 bg-background">
              <Button
                variant={viewMode === 'board' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('board')}
                className="gap-2 h-8"
              >
                <LayoutGrid className="h-4 w-4" />
                Board
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2 h-8"
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {!isDailyTasks && (
          <div className="border-b border-border px-4 sm:px-6">
            <TabsList className="grid w-full sm:w-fit grid-cols-2 h-auto">
              <TabsTrigger value="status" className="gap-2 text-xs sm:text-sm py-2 sm:py-3">
                <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">By Status</span>
                <span className="sm:hidden">Status</span>
              </TabsTrigger>
              <TabsTrigger value="technician" className="gap-2 text-xs sm:text-sm py-2 sm:py-3">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">By Technician</span>
                <span className="sm:hidden">People</span>
              </TabsTrigger>
            </TabsList>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {viewMode === 'list' ? (
            <TaskListViewGrouped
              tasks={tasks.map(task => ({
                ...task,
                status: task.columnId,
                tags: [],
                updatedAt: new Date(),
                position: 0,
                priority: task.priority as 'low' | 'medium' | 'high' | 'urgent',
                dueDate: new Date(),
                assigneeName: task.assignee
              } as TaskType))}
              columns={getColumns()}
              onTaskClick={(task: TaskType) => {
                const localTask = tasks.find(t => t.id === task.id);
                if (localTask) handleTaskClick(localTask);
              }}
              onAddTask={handleAddTask}
              onTaskComplete={handleTaskComplete}
              onTaskMove={handleTaskMove}
            />
          ) : (
            <>
              {!isDailyTasks && (
                <TabsContent value="status" className="flex-1 m-0 p-3 sm:p-6">
        <div className="grid gap-3 sm:gap-4 lg:gap-6 h-full overflow-auto"
          style={{ gridTemplateColumns: `repeat(${Math.min(columnsPerRow, Math.max(1, customColumns.length))}, minmax(250px, 1fr))`, gridAutoRows: 'minmax(250px, 1fr)' }}>
                    {customColumns.map((column, index) => (
                      <DroppableColumn
                        key={column.id}
                        column={column}
                        tasks={getTasksForColumn(column.id)}
                        showSeparator
                        isFirst={index === 0}
                        onTaskClick={handleTaskClick}
                        onEditColumn={handleEditColumn}
                        onAddTask={handleAddTask}
                        onChangeTheme={handleChangeTheme}
                        allowEditing={true}
                      />
                    ))}
                  </div>
                </TabsContent>
              )}

              {!isDailyTasks && (
                <TabsContent value="technician" className="flex-1 m-0 p-3 sm:p-6">
         <div className="grid gap-3 sm:gap-4 lg:gap-6 h-full overflow-auto"
           style={{ gridTemplateColumns: `repeat(${Math.min(columnsPerRow, Math.max(1, getColumns().length))}, minmax(250px, 1fr))`, gridAutoRows: 'minmax(250px, 1fr)' }}>
                    {getColumns().map((column) => (
                      <DroppableColumn
                        key={column.id}
                        column={column}
                        tasks={getTasksForColumn(column.id)}
                        onTaskClick={handleTaskClick}
                        onEditColumn={handleEditColumn}
                        onAddTask={handleAddTask}
                        onChangeTheme={handleChangeTheme}
                        allowEditing={false}
                      />
                    ))}
                  </div>
                </TabsContent>
              )}

              {isDailyTasks && (
                <div className="flex-1 p-3 sm:p-6">
         <div className="grid gap-3 sm:gap-4 lg:gap-6 h-full overflow-auto"
           style={{ gridTemplateColumns: `repeat(${Math.min(columnsPerRow, Math.max(1, customColumns.length))}, minmax(250px, 1fr))`, gridAutoRows: 'minmax(250px, 1fr)' }}>
                    {customColumns.map((column, index) => (
                      <DroppableColumn
                        key={column.id}
                        column={column}
                        tasks={getTasksForColumn(column.id).filter(task => !task.projectId)}
                        showSeparator
                        isFirst={index === 0}
                        onTaskClick={handleTaskClick}
                        onEditColumn={handleEditColumn}
                        onAddTask={handleAddTask}
                        onChangeTheme={handleChangeTheme}
                        allowEditing={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <DragOverlay>
            {activeTask ? (
              <DraggableTaskCard task={activeTask} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>

        <TaskDetailModal 
          open={isTaskModalOpen} 
          onOpenChange={setIsTaskModalOpen} 
          task={selectedTask} 
        />

        <QuickTaskModal
          isOpen={isQuickTaskModalOpen}
          onClose={() => setIsQuickTaskModalOpen(false)}
          onCreateTask={handleCreateTask}
          technicians={technicians}
          columns={getColumns()}
          projects={project ? [project] : []}
          projectId={project?.id}
        />

        <ColumnManager
          isOpen={isColumnEditorOpen}
          onClose={() => {
            setIsColumnEditorOpen(false);
            onColumnEditorOpenChange?.(false);
          }}
          columns={customColumns}
          onUpdateColumns={handleUpdateColumns}
        />

        <TeamManagementModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          project={project}
          allTechnicians={technicians}
          onUpdateTeam={handleUpdateTeam}
        />
      </Tabs>
    </div>
  );
}