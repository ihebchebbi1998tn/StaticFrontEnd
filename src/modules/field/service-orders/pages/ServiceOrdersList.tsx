import { useEffect, useMemo, useState } from "react";
import { usePaginatedData } from "@/shared/hooks/usePagination";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { 
  ClipboardList, Filter, Calendar, User, Building, 
  Edit, Trash2, Eye, MoreVertical, Plus, MapPin, List, Table as TableIcon,
  ChevronDown, Map, Download,
  DollarSign, Target, CheckCircle, Clock, AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLookups } from '@/shared/contexts/LookupsContext';
import serviceOrderStatuses from '@/data/mock/service-order-statuses.json';
import timeframes from '@/data/mock/timeframes.json';
import { ServiceOrder, ServiceOrderFilters } from "../types";
import { MapOverlay } from "@/components/shared/MapOverlay";
import { mapServiceOrdersToMapItems } from "@/components/shared/mappers";
import { ExportModal } from "../components/ExportModal";

// Mock data for demonstration
const mockServiceOrders: ServiceOrder[] = [
  {
    id: "so-001",
    orderNumber: "SO-2024-001",
    offerId: "offer-123",
    customer: {
      id: "cust-001",
      company: "TechCorp Industries",
      contactPerson: "John Smith",
      phone: "+1-555-0123",
      email: "john.smith@techcorp.com",
      address: {
        street: "123 Business Ave",
        city: "Nabeul",
        state: "Nabeul",
        zipCode: "8000",
        country: "Tunisia",
        longitude: 10.737222,
        latitude: 36.456389,
        hasLocation: 1
      }
    },
    status: "scheduled",
    repair: {
      description: "Server maintenance and diagnostics",
      location: "Server Room A",
      urgencyLevel: "medium",
      promisedRepairDate: new Date("2024-01-20")
    },
    priority: "medium",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
    assignedTechnicians: ["tech-001", "tech-002"],
    jobs: [],
    dispatches: [],
    workDetails: {
      stepsPerformed: [],
      timeTracking: [],
      photos: [],
      checklists: []
    },
    materials: [],
    financials: {
      id: "fin-001",
      serviceOrderId: "SO-2024-001",
      currency: "TND",
      estimatedCost: 2500,
      actualCost: 0,
      laborCost: 800,
      materialCost: 0,
      travelCost: 0,
      equipmentCost: 0,
      overheadCost: 0,
      basePrice: 2500,
      discounts: [],
      taxes: [],
      totalAmount: 2500,
      paymentTerms: "Net 30",
      paymentStatus: "pending",
      paidAmount: 0,
      remainingAmount: 2500,
      invoiceStatus: "draft",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16")
    },
    followUp: {
      reminders: [],
      maintenanceNotes: ""
    },
    changeLog: [],
    communications: []
  },
  {
    id: "so-002",
    orderNumber: "SO-2024-002",
    customer: {
      id: "cust-002",
      company: "Manufacturing Plus",
      contactPerson: "Sarah Johnson",
      phone: "+1-555-0456",
      email: "sarah.j@manufplus.com",
      address: {
        street: "456 Industrial Blvd",
        city: "Nabeul",
        state: "Nabeul",
        zipCode: "8002",
        country: "Tunisia",
        longitude: 10.752314,
        latitude: 36.449876,
        hasLocation: 1
      }
    },
    status: "in_progress",
    repair: {
      description: "Equipment calibration and repair",
      location: "Production Line 2",
      urgencyLevel: "high",
      promisedRepairDate: new Date("2024-01-18")
    },
    priority: "high",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-17"),
    assignedTechnicians: ["tech-003"],
    jobs: [],
    dispatches: [],
    workDetails: {
      stepsPerformed: [],
      timeTracking: [],
      photos: [],
      checklists: []
    },
    materials: [],
    financials: {
      id: "fin-002",
      serviceOrderId: "SO-2024-002",
      currency: "TND",
      estimatedCost: 4200,
      actualCost: 3800,
      laborCost: 1200,
      materialCost: 600,
      travelCost: 0,
      equipmentCost: 0,
      overheadCost: 0,
      basePrice: 4000,
      discounts: [],
      taxes: [],
      totalAmount: 4000,
      paymentTerms: "Net 30",
      paymentStatus: "partial",
      paidAmount: 2000,
      remainingAmount: 2000,
      invoiceStatus: "sent",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-15")
    },
    followUp: {
      reminders: [],
      maintenanceNotes: ""
    },
    changeLog: [],
    communications: []
  }
];

export default function ServiceOrdersList() {
  console.log("ServiceOrdersList rendering");
  const { t } = useTranslation('service_orders');
  const navigate = useNavigate();
  const [serviceOrders] = useState<ServiceOrder[]>(mockServiceOrders);
  const [filters, setFilters] = useState<ServiceOrderFilters>({});
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  const [showMap, setShowMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | string>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | string>('all');
  const { priorities: lookupPriorities } = useLookups();
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [filterAssigned, setFilterAssigned] = useState<'all' | string>('all');
  const [filterDateRange, setFilterDateRange] = useState<'any' | '7' | '30' | '365'>('any');
  const [showExportModal, setShowExportModal] = useState(false);
  

  useEffect(() => {
    document.title = "Service Orders — List";
  }, []);

  const handleServiceOrderClick = (order: ServiceOrder) => {
    navigate(`/dashboard/field/service-orders/${order.id}`);
  };

  const handleEditServiceOrder = (order: ServiceOrder) => {
    navigate(`/dashboard/field/service-orders/edit/${order.id}`);
  };

  const getStatusColor = (status: ServiceOrder['status']) => {
    const colors = {
      draft: "status-info",
      offer: "status-info", 
      won: "status-success",
      scheduled: "status-warning",
      in_progress: "status-warning",
      completed: "status-success",
      cancelled: "status-destructive",
      follow_up_pending: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    };
    return colors[status];
  };

  const getPriorityColor = (priority: ServiceOrder['priority']) => {
    const colors = {
      low: "status-info",
      medium: "status-info", 
      high: "status-warning",
      urgent: "status-destructive"
    };
    return colors[priority];
  };

  const _getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const filteredServiceOrders = useMemo(() => {
    return serviceOrders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.repair.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
      const matchesAssigned = filterAssigned === 'all' || (order.assignedTechnicians || []).some(a => a === filterAssigned);
      const matchesDate = (() => {
        if (filterDateRange === 'any') return true;
        const days = Number(filterDateRange);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return order.createdAt >= cutoff;
      })();
      
      // Handle stat filters
      if (selectedStat === 'active') return matchesSearch && ['scheduled', 'in_progress'].includes(order.status);
      if (selectedStat === 'completed') return matchesSearch && order.status === 'completed';
      if (selectedStat === 'urgent') return matchesSearch && order.priority === 'urgent';
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssigned && matchesDate;
    });
  }, [serviceOrders, searchTerm, filterStatus, filterPriority, selectedStat, filterAssigned, filterDateRange]);

  const pagination = usePaginatedData(filteredServiceOrders, 5);

  const assignedOptions = useMemo(() => {
    return Array.from(new Set(serviceOrders.flatMap(o => o.assignedTechnicians || [])));
  }, [serviceOrders]);

  const totalValue = useMemo(() => serviceOrders.reduce((sum, order) => sum + order.financials.estimatedCost, 0), [serviceOrders]);

  const statsData = [
    {
      label: t('list.total_orders'),
      value: serviceOrders.length,
      icon: ClipboardList,
      color: "chart-1",
      filter: 'all'
    },
    {
      label: t('list.active_orders'),
      value: serviceOrders.filter(o => ['scheduled', 'in_progress'].includes(o.status)).length,
      icon: Target,
      color: "chart-2", 
      filter: 'active'
    },
    {
      label: t('list.completed'),
      value: serviceOrders.filter(o => o.status === 'completed').length,
      icon: CheckCircle,
      color: "chart-3",
      filter: 'completed'
    },
    {
      label: t('list.total_value'),
      value: `${totalValue.toLocaleString()} TND`,
      icon: DollarSign,
      color: "chart-4",
      filter: 'value'
    }
  ];

  const handleStatClick = (stat: any) => {
    setSelectedStat(stat.filter);
    if (stat.filter === 'all') {
      setFilterStatus('all');
      setFilterPriority('all');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header - Hidden on mobile */}
        <header className="hidden md:flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{t('list.title')}</h1>
              <p className="text-[11px] text-muted-foreground">{t('list.subtitle')}</p>
            </div>
          </div>
          <div>
            <Button className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift w-full sm:w-auto" onClick={() => navigate('/dashboard/field/service-orders/create')}>
              <Plus className="mr-2 h-4 w-4 text-white" />
              {t('list.create_service_order')}
            </Button>
          </div>
  </header>

      {/* Mobile Action Bar */}
      <div className="md:hidden flex items-center justify-end p-4 border-b border-border bg-card/50 backdrop-blur">
        <Button size="sm" className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift" onClick={() => navigate('/dashboard/field/service-orders/create')}>
          <Plus className="mr-2 h-4 w-4 text-white" />
          {t('list.create_service_order')}
        </Button>
      </div>

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
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowFilterBar(s => !s)}>
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t('list.filters')}</span>
                {(filterStatus !== 'all' || filterPriority !== 'all' || filterAssigned !== 'all') && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {[
                      filterStatus !== 'all' ? 1 : 0,
                      filterPriority !== 'all' ? 1 : 0,
                      filterAssigned !== 'all' ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t('list.export')}</span>
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
            <Button 
              variant={showMap ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setShowMap(!showMap)} 
              className={`flex-1 sm:flex-none ${showMap ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
            >
              <Map className={`h-4 w-4 ${showMap ? 'text-white' : ''}`} />
            </Button>
          </div>
        </div>
      </section>

      {showFilterBar && (
        <div className="p-3 sm:p-4 border-b border-border bg-background/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">{t('list.all_statuses')}</option>
                  {serviceOrderStatuses.map((s:any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                  <option value="all">All Priorities</option>
                  {lookupPriorities.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterAssigned} onChange={e => setFilterAssigned(e.target.value)}>
                  <option value="all">All Technicians</option>
                  {assignedOptions.map((a, i) => <option key={i} value={a}>{a}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterDateRange} onChange={e => setFilterDateRange(e.target.value as any)}>
                  {timeframes.map((tf:any) => (
                    <option key={tf.id} value={tf.id}>{tf.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-full border border-border text-sm" onClick={() => { setFilterStatus('all'); setFilterPriority('all'); setFilterAssigned('all'); setFilterDateRange('any'); setShowFilterBar(false); }}>{t('clear')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Content Views */}
      {viewMode === 'list' ? (
        <section className="p-3 sm:p-4 lg:p-6">
          <Card className="shadow-card border-0 bg-card">
            {/* Map Section */}
            {showMap && (
              <MapOverlay
                items={mapServiceOrdersToMapItems(filteredServiceOrders)}
                onViewItem={(item) => handleServiceOrderClick(filteredServiceOrders.find(o => o.id === item.id)!)}
                onEditItem={(item) => handleEditServiceOrder(filteredServiceOrders.find(o => o.id === item.id)!)}
                onClose={() => setShowMap(false)}
                isVisible={showMap}
              />
            )}
            
            <CardContent className={showMap ? "pt-4 p-0" : "p-0"}>
              {filteredServiceOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {t('no_service_orders')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t('no_service_orders_description')}
                  </p>
                  <Link to="/dashboard/field/service-orders/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('create_service_order')}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {pagination.data.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-3 sm:p-4 lg:p-6 hover:bg-muted/50 transition-colors group cursor-pointer"
                      onClick={() => handleServiceOrderClick(order)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                            <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                              <ClipboardList className="h-4 w-4 sm:h-6 sm:w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                                  {order.orderNumber}
                                </h3>
                              </div>
                              <div className="flex gap-1">
                                <Badge className={`${getStatusColor(order.status)} text-xs`}>
                                  {t(`statuses.${order.status}`)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{order.customer.company}</span>
                              </div>
                              <span className="truncate">{order.customer.contactPerson}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{order.repair.location}</span>
                              </div>
                              <div className="hidden sm:flex items-center gap-1">
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span>{order.assignedTechnicians.length} technicians</span>
                              </div>
                              <div className="hidden sm:flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{order.createdAt.toLocaleDateString()}</span>
                              </div>
                              <div className="text-sm font-medium text-foreground">
                                {order.financials.estimatedCost.toLocaleString()} TND
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleServiceOrderClick(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditServiceOrder(order)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit order
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filteredServiceOrders.length > 5 && (
                <div className="border-t border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        Showing {pagination.info.startIndex + 1} to {pagination.info.endIndex} of {filteredServiceOrders.length} results
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={pagination.actions.previousPage}
                        disabled={!pagination.info.hasPreviousPage}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm">
                        {pagination.state.currentPage} of {pagination.info.totalPages}
                      </span>
                      <button
                        onClick={pagination.actions.nextPage}
                        disabled={!pagination.info.hasNextPage}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      ) : viewMode === 'table' ? (
        <section className="p-3 sm:p-4 lg:p-6">
          <Card className="shadow-card border-0 bg-card">
            {/* Map Section */}
            {showMap && (
              <MapOverlay
                items={mapServiceOrdersToMapItems(filteredServiceOrders)}
                onViewItem={(item) => handleServiceOrderClick(filteredServiceOrders.find(o => o.id === item.id)!)}
                onEditItem={(item) => handleEditServiceOrder(filteredServiceOrders.find(o => o.id === item.id)!)}
                onClose={() => setShowMap(false)}
                isVisible={showMap}
              />
            )}
            
            <CardContent className={showMap ? "pt-4 p-0" : "p-0"}>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                   style={{ WebkitOverflowScrolling: 'touch' }}>
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-[150px] font-semibold text-foreground">Order</TableHead>
                      <TableHead className="font-semibold text-foreground">Customer</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground">Cost</TableHead>
                      <TableHead className="font-semibold text-foreground">Technicians</TableHead>
                      <TableHead className="font-semibold text-foreground">Created</TableHead>
                      <TableHead className="w-[50px] font-semibold text-foreground"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.data.map((order) => (
                      <TableRow 
                        key={order.id} 
                        className="border-border hover:bg-muted/50 cursor-pointer group"
                        onClick={() => handleServiceOrderClick(order)}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                <ClipboardList className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">#{order.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <p className="font-medium text-foreground">{order.customer.company}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.contactPerson}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`${getStatusColor(order.status)} text-xs`}>
                            {t(`statuses.${order.status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium">{order.financials.estimatedCost.toLocaleString()} TND</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span>{order.assignedTechnicians.length}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{order.createdAt.toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleServiceOrderClick(order);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleEditServiceOrder(order);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit order
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredServiceOrders.length > 5 && (
                  <div className="border-t border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          Showing {pagination.info.startIndex + 1} to {pagination.info.endIndex} of {filteredServiceOrders.length} results
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={pagination.actions.previousPage}
                          disabled={!pagination.info.hasPreviousPage}
                          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm">
                          {pagination.state.currentPage} of {pagination.info.totalPages}
                        </span>
                        <button
                          onClick={pagination.actions.nextPage}
                          disabled={!pagination.info.hasNextPage}
                          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      ) : (
        <section className="p-3 sm:p-4 lg:p-6">
          <Card className="shadow-card border-0 bg-card">
            {/* Map Section */}
            {showMap && (
              <MapOverlay
                items={mapServiceOrdersToMapItems(filteredServiceOrders)}
                onViewItem={(item) => handleServiceOrderClick(filteredServiceOrders.find(o => o.id === item.id)!)}
                onEditItem={(item) => handleEditServiceOrder(filteredServiceOrders.find(o => o.id === item.id)!)}
                onClose={() => setShowMap(false)}
                isVisible={showMap}
              />
            )}
            
            <CardContent className={showMap ? "pt-4 p-0" : "p-0"}>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                   style={{ WebkitOverflowScrolling: 'touch' }}>
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-[150px] font-semibold text-foreground">Order</TableHead>
                      <TableHead className="font-semibold text-foreground">Customer</TableHead>
                      <TableHead className="font-semibold text-foreground">Location</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground">Priority</TableHead>
                      <TableHead className="font-semibold text-foreground">Cost</TableHead>
                      <TableHead className="font-semibold text-foreground">Technicians</TableHead>
                      <TableHead className="font-semibold text-foreground">Created</TableHead>
                      <TableHead className="w-[50px] font-semibold text-foreground"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.data.map((order) => (
                      <TableRow 
                        key={order.id} 
                        className="border-border hover:bg-muted/50 cursor-pointer group"
                        onClick={() => handleServiceOrderClick(order)}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                <ClipboardList className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">#{order.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <p className="font-medium text-foreground">{order.customer.company}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.contactPerson}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{order.repair.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`${getStatusColor(order.status)} text-xs`}>
                            {t(`statuses.${order.status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`${getPriorityColor(order.priority)} text-xs`}>
                            {t(`priorities.${order.priority}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium">{order.financials.estimatedCost.toLocaleString()} TND</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span>{order.assignedTechnicians.length}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{order.createdAt.toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleServiceOrderClick(order);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleEditServiceOrder(order);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
                
              {filteredServiceOrders.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {pagination.info.startIndex + 1} to {pagination.info.endIndex} of {filteredServiceOrders.length} results
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={pagination.actions.previousPage}
                      disabled={!pagination.info.hasPreviousPage}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      {pagination.state.currentPage} of {pagination.info.totalPages}
                    </span>
                    <button
                      onClick={pagination.actions.nextPage}
                      disabled={!pagination.info.hasNextPage}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Export Modal */}
      <ExportModal 
        open={showExportModal}
        onOpenChange={setShowExportModal}
        data={filteredServiceOrders}
      />
    </div>
  );
}