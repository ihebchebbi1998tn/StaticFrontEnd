import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarRange, 
  Clock, 
  MapPin, 
  User,
  UserMinus,
  AlertTriangle,
  CheckCircle,
  Circle,
  DollarSign,
  Users,
  List,
  Table as TableIcon,
  Phone,
  Building2,
  Filter,
  ChevronDown
} from "lucide-react";
import { TableLayout } from "@/components/shared/TableLayout";
import { DispatcherHeader } from "../components/DispatcherHeader";
import { DispatcherSearchControls, type DispatcherFilters } from "../components/DispatcherSearchControls";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import type { ServiceOrderDispatch } from "../../field/service-orders/entities/dispatches/types";

export function DispatcherPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dispatches, setDispatches] = useState<ServiceOrderDispatch[]>([]);
  const [activeTab, setActiveTab] = useState("dispatches");
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  const [filters, setFilters] = useState<DispatcherFilters>({
    searchTerm: '',
    status: 'all',
    priority: 'all'
  });
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);

  useEffect(() => {
    // Mock dispatches data - in real app this would come from API
    const mockDispatches: ServiceOrderDispatch[] = [
      {
        id: "disp-001",
        serviceOrderId: "so-001",
        jobId: "job-001", // Added required jobId
        dispatchNumber: "DISP-2024-001",
        assignedTechnicians: ["John Smith"],
        requiredSkills: ["electrical", "automotive"],
        scheduledDate: new Date(),
        scheduledStartTime: "09:00",
        scheduledEndTime: "12:00",
        estimatedDuration: 180,
        status: "assigned",
        priority: "high",
        workloadHours: 3,
        dispatchedBy: "dispatcher-001",
        dispatchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "disp-002",
        serviceOrderId: "so-002",
        jobId: "job-002", // Added required jobId
        dispatchNumber: "DISP-2024-002",
        assignedTechnicians: ["Mike Johnson"],
        requiredSkills: ["plumbing"],
        scheduledDate: new Date(),
        scheduledStartTime: "14:00",
        scheduledEndTime: "16:00",
        estimatedDuration: 120,
        status: "in_progress",
        priority: "urgent",
        workloadHours: 2,
        dispatchedBy: "dispatcher-001",
        dispatchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "disp-003",
        serviceOrderId: "so-003",
        jobId: "job-003", // Added required jobId
        dispatchNumber: "DISP-2024-003",
        assignedTechnicians: ["Sarah Wilson"],
        requiredSkills: ["hvac", "electrical"],
        estimatedDuration: 240,
        status: "pending",
        priority: "medium",
        workloadHours: 4,
        dispatchedBy: "dispatcher-001",
        dispatchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    setDispatches(mockDispatches);
  }, []);

  const filteredDispatches = useMemo(() => {
    return dispatches.filter(dispatch => {
      const matchesSearch = dispatch.dispatchNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        dispatch.serviceOrderId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        dispatch.assignedTechnicians.some(tech => tech.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      const matchesStatus = filters.status === 'all' || dispatch.status === filters.status;
      const matchesPriority = filters.priority === 'all' || dispatch.priority === filters.priority;
      
      // Handle stat filters
      if (selectedStat === 'all') return matchesSearch && matchesStatus && matchesPriority;
      if (selectedStat === 'urgent') return matchesSearch && dispatch.priority === 'urgent';
      if (selectedStat === 'in_progress') return matchesSearch && dispatch.status === 'in_progress';
      if (selectedStat === 'pending') return matchesSearch && dispatch.status === 'pending';
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [dispatches, filters, selectedStat]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const handleDispatchJobs = () => {
    navigate('/dashboard/field/dispatcher/interface');
  };

  const handleDispatchClick = (dispatchId: string) => {
    console.log("Clicking dispatch with ID:", dispatchId);
    navigate(`/dashboard/field/dispatcher/job/${dispatchId}`);
  };

  const handleServiceOrderClick = (serviceOrderId: string) => {
    navigate(`/dashboard/field/service-orders/${serviceOrderId}`);
  };

  const handleStatClick = (stat: any) => {
    setSelectedStat(stat.filter);
    if (stat.filter === 'all') {
      setFilters(prev => ({ ...prev, status: 'all', priority: 'all' }));
    }
  };

  // Stats calculation for dispatches
  const statsData = [
    {
      label: "Total",
      value: dispatches.length,
      icon: Circle,
      color: "chart-1",
      filter: 'all'
    },
    {
      label: "Urgent",
      value: dispatches.filter(d => d.priority === 'urgent').length,
      icon: AlertTriangle,
      color: "chart-2", 
      filter: 'urgent'
    },
    {
      label: "In Progress",
      value: dispatches.filter(d => d.status === 'in_progress').length,
      icon: Clock,
      color: "chart-3",
      filter: 'in_progress'
    },
    {
      label: "Pending",
      value: dispatches.filter(d => d.status === 'pending').length,
      icon: UserMinus,
      color: "chart-4",
      filter: 'pending'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <UserMinus className="h-4 w-4" />;
      case 'assigned': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertTriangle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const dispatchColumns = [
    {
      key: 'status',
      title: t('dispatcher.status'),
      width: 'w-32',
      render: (dispatch: ServiceOrderDispatch) => (
        <Badge variant="outline" className="capitalize">
          {t(`dispatcher.status_${dispatch.status}`)}
        </Badge>
      )
    },
    {
      key: 'dispatchNumber',
      title: 'Dispatch',
      render: (dispatch: ServiceOrderDispatch) => (
        <div 
          className="cursor-pointer hover:text-primary"
          onClick={() => handleDispatchClick(dispatch.id)}
        >
          <div className="font-medium">{dispatch.dispatchNumber}</div>
          <div className="text-sm text-muted-foreground">
            {dispatch.assignedTechnicians.join(', ')}
          </div>
        </div>
      )
    },
    {
      key: 'serviceOrder',
      title: t('dispatcher.service_order'),
      render: (dispatch: ServiceOrderDispatch) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <button 
            onClick={() => handleServiceOrderClick(dispatch.serviceOrderId)}
            className="text-primary hover:underline"
          >
            #{dispatch.serviceOrderId}
          </button>
        </div>
      )
    },
    {
      key: 'priority',
      title: t('dispatcher.priority'),
      render: (dispatch: ServiceOrderDispatch) => (
        <Badge variant={getPriorityColor(dispatch.priority)}>
          {t(`dispatcher.priority_${dispatch.priority}`)}
        </Badge>
      )
    },
    {
      key: 'schedule',
      title: 'Schedule',
      render: (dispatch: ServiceOrderDispatch) => (
        <div className="text-sm">
          {dispatch.scheduledDate && (
            <>
              <div>{dispatch.scheduledDate.toLocaleDateString()}</div>
              <div className="text-muted-foreground">
                {dispatch.scheduledStartTime} - {dispatch.scheduledEndTime}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      key: 'skills',
      title: t('dispatcher.required_skills'),
      render: (dispatch: ServiceOrderDispatch) => (
        <div className="flex flex-wrap gap-1">
          {dispatch.requiredSkills.slice(0, 2).map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {dispatch.requiredSkills.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{dispatch.requiredSkills.length - 2}
            </Badge>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Header - match Service Orders style */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="w-full">
          <DispatcherHeader onDispatchJobs={handleDispatchJobs} />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsData.map((stat, index) => {
            const isSelected = selectedStat === stat.filter;
            return (
              <Card 
                key={index} 
                className={`shadow-card hover-lift gradient-card group cursor-pointer transition-all hover:shadow-lg ${
                  isSelected 
                    ? 'border-2 border-primary bg-primary/5' 
                    : 'border-0'
                }`}
                onClick={() => handleStatClick(stat)}
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
      <section className="p-3 sm:p-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2 sm:gap-3 flex-1 w-full items-center">
            <div className="flex-1">
              <CollapsibleSearch 
                placeholder={t("dispatcher.search_placeholder")}
                value={filters.searchTerm}
                onChange={(value) => setFilters(prev => ({...prev, searchTerm: value}))}
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
                <span className="hidden sm:inline">{t('dispatcher.filters')}</span>
                {(filters.status !== 'all' || filters.priority !== 'all') && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {[
                      filters.status !== 'all' ? 1 : 0,
                      filters.priority !== 'all' ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
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
              variant={viewMode === 'table' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('table')} 
              className={`flex-1 sm:flex-none ${viewMode === 'table' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
            >
              <TableIcon className={`h-4 w-4 ${viewMode === 'table' ? 'text-white' : ''}`} />
            </Button>
          </div>
        </div>
      </section>

      {showFilterBar && (
        <div className="p-3 sm:p-4 border-b border-border bg-background/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <select 
                  className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" 
                  value={filters.status} 
                  onChange={e => setFilters(prev => ({...prev, status: e.target.value}))}
                >
                  <option value="all">{t('dispatcher.all_statuses')}</option>
                  <option value="pending">{t('dispatcher.status_pending')}</option>
                  <option value="assigned">{t('dispatcher.status_assigned')}</option>
                  <option value="in_progress">{t('dispatcher.status_in_progress')}</option>
                  <option value="completed">{t('dispatcher.status_completed')}</option>
                  <option value="cancelled">{t('dispatcher.status_cancelled')}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select 
                  className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" 
                  value={filters.priority} 
                  onChange={e => setFilters(prev => ({...prev, priority: e.target.value}))}
                >
                  <option value="all">{t('dispatcher.all_priorities')}</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-3 sm:p-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="dispatches">
                {viewMode === 'table' ? (
                  <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                       style={{ WebkitOverflowScrolling: 'touch' }}>
                    <TableLayout
                      items={filteredDispatches}
                      columns={dispatchColumns}
                      rowKey={(d: any) => d.id}
                      tableClassName="min-w-full"
                      onRowClick={(dispatch: ServiceOrderDispatch) => handleDispatchClick(dispatch.id)}
                      emptyState={
                        <div className="text-center py-12 text-muted-foreground">
                          <CalendarRange className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <h3 className="font-medium mb-2">No dispatches found</h3>
                          <p>Create new dispatches from the planner interface</p>
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <div className="p-3 sm:p-4">
                    {filteredDispatches.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <CalendarRange className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium mb-2">No dispatches found</h3>
                        <p>Create new dispatches from the planner interface</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {filteredDispatches.map((dispatch) => (
                          <div 
                            key={dispatch.id} 
                            className="p-4 hover:bg-muted/50 transition-colors group cursor-pointer"
                            onClick={() => handleDispatchClick(dispatch.id)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                <div className="flex items-center gap-2">{getStatusIcon(dispatch.status)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                    <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{dispatch.dispatchNumber}</h3>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={getPriorityColor(dispatch.priority)}>
                                        {t(`dispatcher.priority_${dispatch.priority}`)}
                                      </Badge>
                                      <Badge 
                                        variant="outline" 
                                        className="text-xs cursor-pointer hover:bg-primary hover:text-white"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleServiceOrderClick(dispatch.serviceOrderId);
                                        }}
                                      >
                                        SO: {dispatch.serviceOrderId}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    Technicians: {dispatch.assignedTechnicians.join(', ')}
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {dispatch.scheduledDate?.toLocaleDateString()} 
                                        {dispatch.scheduledStartTime && ` ${dispatch.scheduledStartTime}-${dispatch.scheduledEndTime}`}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{dispatch.estimatedDuration} min</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}