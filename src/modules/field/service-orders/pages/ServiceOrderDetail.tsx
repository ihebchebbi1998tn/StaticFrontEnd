import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Clock, Users, Package, Calendar, CheckCircle, AlertCircle, User, MapPin, Phone, Mail, Settings, MoreVertical, Edit, Trash2, ClipboardList, Building, Wrench, ExternalLink, Filter, ChevronDown, MessageSquare, History, Check, Share2, Plus } from "lucide-react";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import type { ServiceOrder, Job } from "../types";
import { JobsTable } from "../components/JobsTable";
import { DispatchesTable } from "../components/DispatchesTable";
import { ServiceOrderStatusFlow, type ServiceOrderStatus } from "../components/ServiceOrderStatusFlow";
import { TimeExpensesTab } from "../components/TimeExpensesTab";
import { cn } from "@/lib/utils";
import { ProfessionalShareModal } from "@/components/shared/ProfessionalShareModal";
import { ServiceOrderPDFPreviewModal } from "../components/ServiceOrderPDFPreviewModal";
import { ServiceOrderPDFDocument } from "../components/ServiceOrderPDFDocument";
import { defaultSettings } from "../utils/pdfSettings.utils";
import { AddMaterialModal } from "../../components/AddMaterialModal";
import type { Article } from "@/modules/inventory-services/types";

// Mock installation data
const mockInstallation = {
  id: "inst-001",
  name: "Primary Server Infrastructure",
  model: "Dell PowerEdge R750",
  manufacturer: "Dell Technologies",
  serialNumber: "SN7894561230",
  location: "Server Room A - Rack 3",
  type: "server" as const,
  status: "operational" as const,
  installationDate: new Date("2023-06-15"),
  warrantyExpiration: new Date("2026-06-15")
};

// Mock service order data with proper type structure
const mockServiceOrder: ServiceOrder = {
  id: "so-001",
  orderNumber: "SO 2025 001",
  offerId: "offer-001",
  customer: {
    id: "customer-001",
    company: "Acme Corporation",
    contactPerson: "John Doe",
    phone: "+1 555-0123",
    email: "john.doe@acme.com",
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
  status: "in_progress",
  repair: {
    description: "Server maintenance and performance optimization required",
    location: "Server Room A",
    urgencyLevel: "medium",
    promisedRepairDate: new Date("2024-01-20")
  },
  priority: "medium",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-16"),
  assignedTechnicians: ["tech-001", "tech-002"],
  jobs: [{
    id: "job-001",
    serviceOrderId: "so-001", 
    jobNumber: "JOB-2024-001",
    title: "Server Diagnostics & Performance Optimization",
    description: "Perform comprehensive server diagnostics and implement performance optimization measures",
    status: "ready",
    priority: "medium",
    requiredSkills: ["server-maintenance", "diagnostics", "performance-tuning"],
    estimatedDuration: 240,
    estimatedCost: 800,
    installationId: "inst-001", // Added mandatory installationId
    workType: "maintenance",
    workLocation: "Server Room A",
    completionPercentage: 25,
    notes: "Customer requires minimal downtime during business hours",
    issues: [],
    createdAt: new Date("2024-01-19T14:00:00"),
    updatedAt: new Date("2024-01-19T14:00:00"),
    createdBy: "supervisor-001",
    modifiedBy: "supervisor-001"
  }, {
    id: "job-002", 
    serviceOrderId: "so-001",
    jobNumber: "JOB-2024-002",
    title: "Memory Module Replacement",
    description: "Replace faulty memory modules identified during diagnostics",
    status: "unscheduled",
    priority: "high",
    requiredSkills: ["hardware-repair", "server-maintenance"],
    estimatedDuration: 120,
    estimatedCost: 450,
    installationId: "inst-001", // Added mandatory installationId
    workType: "repair",
    workLocation: "Server Room A", 
    completionPercentage: 0,
    notes: "Requires server downtime - coordinate with customer",
    issues: [],
    createdAt: new Date("2024-01-19T14:30:00"),
    updatedAt: new Date("2024-01-19T14:30:00"),
    createdBy: "supervisor-001",
    modifiedBy: "supervisor-001"
  }],
  dispatches: [{
    id: "dispatch-001",
    serviceOrderId: "so-001",
    jobId: "job-001", // Added required jobId
    dispatchNumber: "DISP-2024-001",
    assignedTechnicians: ["tech-001"], // Added required assignedTechnicians
    requiredSkills: ["server-maintenance", "diagnostics"],
    scheduledDate: new Date("2024-01-20T09:00:00"),
    scheduledStartTime: "09:00",
    scheduledEndTime: "13:00",
    estimatedDuration: 240,
    actualStartTime: new Date("2024-01-20T09:15:00"),
    actualDuration: 250,
    status: "completed",
    priority: "medium",
    workloadHours: 4,
    travelTime: 30,
    travelDistance: 15,
    notes: "Server diagnostics completed successfully. Minor delay due to unexpected memory issue.",
    dispatchedBy: "supervisor-001",
    dispatchedAt: new Date("2024-01-19T16:00:00"),
    createdAt: new Date("2024-01-19T16:00:00"),
    updatedAt: new Date("2024-01-20T13:30:00")
  }, {
    id: "dispatch-002", 
    serviceOrderId: "so-001",
    jobId: "job-002", // Added required jobId
    dispatchNumber: "DISP-2024-002",
    assignedTechnicians: ["tech-002"],
    requiredSkills: ["hardware-repair", "server-maintenance"],
    scheduledDate: new Date("2024-01-22T14:00:00"),
    scheduledStartTime: "14:00",
    scheduledEndTime: "16:00",
    estimatedDuration: 120,
    status: "assigned",
    priority: "high",
    workloadHours: 2,
    travelTime: 20,
    travelDistance: 12,
    notes: "Memory module replacement - requires server downtime coordination",
    dispatchedBy: "supervisor-001",
    dispatchedAt: new Date("2024-01-20T15:00:00"),
    createdAt: new Date("2024-01-20T15:00:00"),
    updatedAt: new Date("2024-01-20T15:00:00")
  }],
  workDetails: {
    stepsPerformed: [{
      id: "step-001",
      serviceOrderId: "so-001",
      stepNumber: 1,
      title: "Initial system diagnostics",
      description: "Initial system diagnostics completed",
      estimatedDuration: 90,
      actualDuration: 120,
      status: "completed",
      completedBy: "tech-001",
      completedAt: new Date("2024-01-17T10:30:00"),
      notes: "All systems operational, identified minor performance issues",
      createdAt: new Date("2024-01-17T09:00:00"),
      updatedAt: new Date("2024-01-17T10:30:00")
    }],
    timeTracking: [{
      id: "time-001",
      serviceOrderId: "so-001",
      technicianId: "tech-001",
      workType: "work",
      startTime: new Date("2024-01-17T09:00:00"),
      endTime: new Date("2024-01-17T11:30:00"),
      duration: 150,
      description: "Initial diagnostics and assessment",
      billable: true,
      hourlyRate: 85,
      totalCost: 212.50,
      status: "approved",
      createdAt: new Date("2024-01-17T09:00:00"),
      updatedAt: new Date("2024-01-17T11:30:00")
    }],
    photos: [],
    checklists: []
  },
  materials: [{
    id: "mat-001",
    serviceOrderId: "so-001",
    materialId: "inv-001",
    material: {
      id: "inv-001",
      name: "Server Memory Module 32GB",
      sku: "SMM-32GB",
      category: "memory",
      unit: "piece",
      standardCost: 150,
      currentStock: 10,
      minStock: 2,
      status: "active",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    quantityUsed: 2,
    unitCost: 150,
    totalCost: 300,
    requestedBy: "tech-001",
    usedAt: new Date("2024-01-17T10:00:00"),
    status: "used"
  }],
  financials: {
    id: "fin-001",
    serviceOrderId: "so-001",
    currency: "TND",
    estimatedCost: 2500,
    actualCost: 2300,
    laborCost: 800,
    materialCost: 300,
    travelCost: 0,
    equipmentCost: 0,
    overheadCost: 0,
    basePrice: 2300,
    discounts: [],
    taxes: [],
    totalAmount: 2300,
    paymentTerms: "Net 30",
    paymentStatus: "pending",
    paidAmount: 0,
    remainingAmount: 2300,
    invoiceStatus: "draft",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-17")
  },
  followUp: {
    reminders: [{
      id: "reminder-001",
      serviceOrderId: "so-001",
      type: "maintenance",
      title: "Quarterly maintenance check",
      description: "Quarterly maintenance check",
      dueDate: new Date("2024-04-20"),
      priority: "medium",
      status: "pending",
      assignedBy: "supervisor-001",
      assignedAt: new Date("2024-01-17"),
      recurring: true,
      notificationSettings: {
        enabled: true,
        methods: ["email", "in_app"],
        reminderTimes: [7, 1],
        escalationEnabled: false
      },
      createdAt: new Date("2024-01-17"),
      updatedAt: new Date("2024-01-17")
    }],
    maintenanceNotes: "System requires quarterly monitoring for optimal performance"
  },
  changeLog: [{
    id: "log-001",
    serviceOrderId: "so-001",
    timestamp: new Date("2024-01-17T10:30:00"),
    userId: "tech-001",
    userName: "John Smith",
    action: "Status Update",
    details: "Changed status from 'won' to 'in_progress'",
    oldValue: "won",
    newValue: "in_progress",
    category: "status",
    severity: "info"
  }],
  communications: [{
    id: "comm-001",
    serviceOrderId: "so-001",
    type: "email",
    direction: "outbound",
    fromName: "John Smith",
    fromUserId: "tech-001",
    toName: "John Doe",
    subject: "Service Order Confirmation",
    content: "Service order has been scheduled for January 20th at 9:00 AM",
    timestamp: new Date("2024-01-16T14:00:00"),
    priority: "medium",
    status: "sent",
    createdBy: "tech-001",
    createdAt: new Date("2024-01-16T14:00:00"),
    updatedAt: new Date("2024-01-16T14:00:00")
  }]
};
export default function ServiceOrderDetail() {
  const { t } = useTranslation('service_orders');
  const {
    id: _id
  } = useParams();
  const navigate = useNavigate();
  const [serviceOrder] = useState<ServiceOrder>(mockServiceOrder);
  const [activeTab, setActiveTab] = useState("overview");
  const [activityFilter, setActivityFilter] = useState<'all' | 'history' | 'communications'>('all');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  // Materials search and filter states
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');
  const [showMaterialFilterBar, setShowMaterialFilterBar] = useState(false);

  // Status flow management
  const [currentStatusFlow, setCurrentStatusFlow] = useState<ServiceOrderStatus>(() => {
    // Map existing ServiceOrder status to new status flow
    const statusMapping: Record<ServiceOrder['status'], ServiceOrderStatus> = {
      'draft': 'open',
      'offer': 'open', 
      'won': 'ready_for_planning',
      'scheduled': 'planned',
      'in_progress': 'planned',
      'completed': 'technically_completed',
      'cancelled': 'closed',
      'follow_up_pending': 'invoiced'
    };
    return statusMapping[serviceOrder.status] || 'open';
  });

  const handleStatusChange = (newStatus: ServiceOrderStatus) => {
    setCurrentStatusFlow(newStatus);
    // Here you could also update the actual service order status
    // and make API calls to persist the change
    console.log('Status changed to:', newStatus);
  };

  const handleMaterialAdd = (materialData: any) => {
    console.log('Adding material:', materialData);
    // Here you would make an API call to add the material
    // For now, just log the data
  };

  // Filter materials based on search term
  const filteredMaterials = serviceOrder.materials.filter(material => {
    if (materialSearchTerm) {
      const searchLower = materialSearchTerm.toLowerCase();
      const matchesSearch = 
        material.material.name.toLowerCase().includes(searchLower) ||
        material.requestedBy.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    return true;
  });

  // Mock available materials - in real app, this would come from your inventory API
  const mockAvailableMaterials: Article[] = [
    {
      id: "art-001",
      name: "Server Memory Module 32GB DDR4",
      sku: "SMM-32GB-DDR4",
      type: "material",
      category: "memory",
      status: "available",
      costPrice: 120,
      sellPrice: 150,
      stock: 25,
      minStock: 5,
      tags: ["memory", "server", "ddr4"],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "system",
      modifiedBy: "system"
    },
    {
      id: "art-002", 
      name: "Network Cable CAT6 - 5m",
      sku: "NC-CAT6-5M",
      type: "material",
      category: "networking",
      status: "available",
      costPrice: 8,
      sellPrice: 12,
      stock: 50,
      minStock: 10,
      tags: ["networking", "cable", "cat6"],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "system",
      modifiedBy: "system"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  useEffect(() => {
    document.title = `${t('service_order_details')} - ${serviceOrder.orderNumber}`;
  }, [t, serviceOrder.orderNumber]);
  const getStatusColor = (status: ServiceOrder['status']) => {
    return "bg-muted text-muted-foreground";
  };
  const getPriorityColor = (priority: ServiceOrder['priority']) => {
    return "bg-muted text-muted-foreground";
  };
  const getStatusIcon = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <div className="border-b border-border bg-gradient-subtle backdrop-blur-sm sticky top-0 z-20 shadow-soft">
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/field/service-orders")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('detail.back')}
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsPdfPreviewOpen(true)}>
              <ClipboardList className="h-4 w-4" />
              {t('detail.download_report')}
            </Button>
          </div>
          <div className="p-4">
            <div className="flex flex-col space-y-3">
              <h1 className="text-xl font-bold text-foreground">
                {serviceOrder.orderNumber}
              </h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-2 gap-1 self-start">
                    <Badge 
                      variant="secondary" 
                      className={`${
                        currentStatusFlow === 'closed' || currentStatusFlow === 'technically_completed' || currentStatusFlow === 'invoiced'
                          ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                          : currentStatusFlow === 'planned'
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                      } font-medium`}
                    >
                      {(currentStatusFlow === 'closed' || currentStatusFlow === 'technically_completed' || currentStatusFlow === 'invoiced') && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      <span className="capitalize">
                        {currentStatusFlow === 'ready_for_planning' ? 'Ready for Planning' : 
                         currentStatusFlow === 'technically_completed' ? 'Technically Completed' :
                         currentStatusFlow === 'planned' ? 'Planned' :
                         currentStatusFlow.replace('_', ' ')}
                      </span>
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-sm border border-border/50">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    Change Status
                  </div>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className={`gap-2 ${currentStatusFlow === 'open' ? 'bg-muted' : ''}`}
                    onClick={() => handleStatusChange('open')}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentStatusFlow === 'open' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      Open
                    </div>
                    {currentStatusFlow === 'open' && <CheckCircle className="h-4 w-4 ml-auto text-green-600" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className={`gap-2 ${currentStatusFlow === 'ready_for_planning' ? 'bg-muted' : ''}`}
                    onClick={() => handleStatusChange('ready_for_planning')}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentStatusFlow === 'ready_for_planning' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      Ready for Planning
                    </div>
                    {currentStatusFlow === 'ready_for_planning' && <CheckCircle className="h-4 w-4 ml-auto text-green-600" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className={`gap-2 ${currentStatusFlow === 'planned' ? 'bg-muted' : ''}`}
                    onClick={() => handleStatusChange('planned')}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentStatusFlow === 'planned' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      Planned
                    </div>
                    {currentStatusFlow === 'planned' && <CheckCircle className="h-4 w-4 ml-auto text-green-600" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className={`gap-2 ${currentStatusFlow === 'technically_completed' ? 'bg-muted' : ''}`}
                    onClick={() => handleStatusChange('technically_completed')}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentStatusFlow === 'technically_completed' ? 'bg-green-600' : 'bg-muted-foreground/30'}`} />
                      Technically Completed
                    </div>
                    {currentStatusFlow === 'technically_completed' && <CheckCircle className="h-4 w-4 ml-auto text-green-600" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className={`gap-2 ${currentStatusFlow === 'invoiced' ? 'bg-muted' : ''}`}
                    onClick={() => handleStatusChange('invoiced')}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentStatusFlow === 'invoiced' ? 'bg-green-600' : 'bg-muted-foreground/30'}`} />
                      Invoiced
                    </div>
                    {currentStatusFlow === 'invoiced' && <CheckCircle className="h-4 w-4 ml-auto text-green-600" />}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className={`gap-2 ${currentStatusFlow === 'closed' ? 'bg-muted' : ''}`}
                    onClick={() => handleStatusChange('closed')}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentStatusFlow === 'closed' ? 'bg-green-600' : 'bg-muted-foreground/30'}`} />
                      Closed
                    </div>
                    {currentStatusFlow === 'closed' && <CheckCircle className="h-4 w-4 ml-auto text-green-600" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between p-6 lg:p-8">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/field/service-orders")} className="gap-2 hover:bg-background/80">
                <ArrowLeft className="h-4 w-4" />
                {t('common:back')}
              </Button>
              <div className="h-8 w-px bg-border/50" />
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                {serviceOrder.orderNumber}
              </h1>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsPdfPreviewOpen(true)}>
                  <ClipboardList className="h-4 w-4" />
                  {t('detail.download_report')}
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsShareModalOpen(true)}>
                  <Share2 className="h-4 w-4" />
                  {t('detail.share')}
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  {t('detail.edit')}
                </Button>
              </div>
              <ServiceOrderStatusFlow
                currentStatus={currentStatusFlow}
                onStatusChange={handleStatusChange}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Mobile-friendly scrollable tabs */}
          <div className="w-full mb-6">
            <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-lg lg:grid lg:grid-cols-7 lg:gap-0">
              {/* Mobile: horizontal scroll container */}
              <div className="flex lg:contents overflow-x-auto mask-fade-right gap-1 lg:gap-0 pb-1 lg:pb-0">
                <TabsTrigger 
                  value="overview" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[100px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                >
                  {t('tabs.overview')}
                </TabsTrigger>
                <TabsTrigger 
                  value="jobs" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[80px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                >
                  {t('tabs.jobs')}
                </TabsTrigger>
                <TabsTrigger 
                  value="dispatches" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[100px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                >
                  Dispatches
                </TabsTrigger>
                <TabsTrigger 
                  value="time_expenses" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[120px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                >
                  Time & Expenses
                </TabsTrigger>
                <TabsTrigger 
                  value="materials" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[90px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                >
                  {t('tabs.materials')}
                </TabsTrigger>
                <TabsTrigger 
                  value="attachments" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[100px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                >
                  Attachments
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[80px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                >
                  Activity
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
            {/* Service Details - Consolidated */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <CardTitle>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Service Description</label>
                      <p className="text-foreground font-medium mt-1">{serviceOrder.repair.description}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Skills</label>
                      <div className="mt-1">
                        {(() => {
                          const allSkills = serviceOrder.jobs.flatMap(job => job.requiredSkills || []);
                          const uniqueSkills = [...new Set(allSkills)];
                          return uniqueSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {uniqueSkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground font-medium">Unspecified</p>
                          );
                        })()}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Affected Installation</label>
                      <div className="mt-1">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-left font-semibold text-primary hover:underline inline-flex items-center md:max-w-none max-w-[200px] truncate"
                          onClick={() => navigate(`/dashboard/field/installations/${mockInstallation.id}`)}
                        >
                          <span className="truncate">{mockInstallation.name} - {mockInstallation.model}</span>
                          <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Affected Company</label>
                      <div className="mt-1">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-left font-semibold text-primary hover:underline inline-flex items-center md:max-w-none max-w-[200px] truncate"
                          onClick={() => navigate(`/dashboard/contacts/${serviceOrder.customer.id}`)}
                        >
                          <span className="truncate">{serviceOrder.customer.company}</span>
                          <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact Number</label>
                      <p className="text-foreground font-medium mt-1">
                        {serviceOrder.customer.phone || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Service Location</label>
                        <p className="text-foreground font-medium mt-1">{serviceOrder.repair.location}</p>
                      </div>

                    {serviceOrder.repair.promisedRepairDate && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Promised Date</label>
                        <p className="text-foreground font-medium mt-1">{format(serviceOrder.repair.promisedRepairDate, 'MMMM d, yyyy')}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Priority Level</label>
                      <div className="mt-1">
                        <Badge className={`${getPriorityColor(serviceOrder.priority)} font-medium`}>
                          {t(`service_orders.priorities.${serviceOrder.priority}`)}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                      <div className="mt-1">
                        <Badge className={`${getStatusColor(serviceOrder.status)} font-medium`}>
                          {getStatusIcon(serviceOrder.status)}
                          <span className="ml-1">{t(`service_orders.statuses.${serviceOrder.status}`)}</span>
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created User</label>
                      <p className="text-foreground font-medium mt-1">
                        {serviceOrder.changeLog?.[0]?.userName || 'John Smith'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="border-t pt-6">
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground">Financial Overview</label>
                  </div>

                  {/* Sale Order & Sales Offer */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Sale Order</label>
                        <div className="mt-1">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-left font-semibold text-primary hover:underline inline-flex items-center md:max-w-none max-w-[200px] truncate"
                            onClick={() => navigate(`/dashboard/sales/orders/${serviceOrder.orderNumber}`)}
                          >
                            <span className="truncate">{serviceOrder.orderNumber}</span>
                            <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Sales Offer</label>
                        <div className="mt-1">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-left font-semibold text-primary hover:underline inline-flex items-center md:max-w-none max-w-[200px] truncate"
                            onClick={() => navigate(`/dashboard/offers/${serviceOrder.offerId}`)}
                          >
                            <span className="truncate">OFF-001 - Solar Panel Installation Package</span>
                            <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sale Order Card */}
                    <Card className="shadow-card">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground">Sale Order</h4>
                          <Badge variant="outline" className="text-muted-foreground">PENDING</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Contract Amount:</span>
                            <span className="font-medium">15,500 TND</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payment Terms:</span>
                            <span className="font-medium">{serviceOrder.financials.paymentTerms}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Outstanding:</span>
                            <span className="font-medium">11,700 TND</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Service Costs Card */}
                    <Card className="shadow-card">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground">Service Costs</h4>
                          <span className="text-xs text-muted-foreground">Actual vs Contract</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Service Cost:</span>
                            <span className="font-medium">{serviceOrder.financials.actualCost.toFixed(2)} TND</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Profit Margin:</span>
                            <span className="font-medium">13,200 TND</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Margin %:</span>
                            <span className="font-medium">85.2%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
               </CardContent>
             </Card>
           </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardContent>
                <JobsTable 
                  jobs={serviceOrder.jobs} 
                  onJobUpdate={() => {
                    // Refresh service order data
                    console.log('Job updated');
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dispatches Tab */}
          <TabsContent value="dispatches">
            <Card>
              <CardContent>
                <DispatchesTable 
                  dispatches={serviceOrder.dispatches} 
                  onDispatchUpdate={() => {
                    // Refresh service order data
                    console.log('Dispatch updated');
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time & Expenses Tab */}
          <TabsContent value="time_expenses">
            <Card>
              <CardContent className="pt-6">
                <TimeExpensesTab 
                  serviceOrder={serviceOrder} 
                  onUpdate={() => {
                    // Refresh service order data
                    console.log('Time/Expense updated');
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardContent className="pt-6">
                {/* Search and Filter Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between mb-4">
                  <div className="flex-1">
                    <CollapsibleSearch 
                      placeholder="Search materials..."
                      value={materialSearchTerm}
                      onChange={setMaterialSearchTerm}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 px-3 z-20" 
                      onClick={() => setShowMaterialFilterBar(s => !s)}
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 border-border bg-background hover:bg-muted" 
                      onClick={() => setIsMaterialModalOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Materials
                    </Button>
                  </div>
                </div>

                {/* Filter Bar */}
                {showMaterialFilterBar && (
                  <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
                    <div className="flex flex-col gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="relative">
                          <select 
                            className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm z-10"
                          >
                            <option value="all">All Materials</option>
                            <option value="recent">Recently Added</option>
                            <option value="high-cost">High Cost</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-20" />
                        </div>
                        <div className="relative">
                          <select 
                            className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm z-10"
                          >
                            <option value="all">All Technicians</option>
                            <option value="current">Current User</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Materials Table */}
                {filteredMaterials.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {materialSearchTerm ? 'No materials found matching your search' : 'No materials used'}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Material Name</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t('quantity')}</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t('unit_cost')}</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t('total_cost')}</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Added By</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Added At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMaterials.map(material => (
                          <tr key={material.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium">{material.material.name}</td>
                            <td className="px-4 py-3 text-sm">{material.quantityUsed}</td>
                            <td className="px-4 py-3 text-sm">{material.unitCost.toFixed(2)} TND</td>
                            <td className="px-4 py-3 text-sm font-medium">{material.totalCost.toFixed(2)} TND</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{material.requestedBy}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{format(material.usedAt, 'dd/MM/yyyy HH:mm')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <div className="h-12 w-12 mx-auto mb-4 opacity-50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
                    </svg>
                  </div>
                  <p>Document attachments will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab - Combined History and Communications */}
          <TabsContent value="activity">
            <Card>
              <CardContent>
                <div className="flex items-center justify-end gap-2 mb-4 mt-6">
                  <div className="relative">
                    <select 
                      className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground text-sm z-10" 
                      value={activityFilter} 
                      onChange={e => setActivityFilter(e.target.value as 'all' | 'history' | 'communications')}
                    >
                      <option value="all">All Activity</option>
                      <option value="history">History Only</option>
                      <option value="communications">Communications Only</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-20" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Combined History and Communications */}
                  {[
                    // Add history items with type identifier
                    ...serviceOrder.changeLog.map(entry => ({
                      ...entry,
                      type: 'history' as const,
                      timestamp: entry.timestamp,
                      title: entry.action,
                      content: entry.details,
                      author: entry.userName
                    })),
                    // Add communication items with type identifier
                    ...serviceOrder.communications.map(comm => ({
                      ...comm,
                      type: 'communication' as const,
                      timestamp: comm.timestamp,
                      title: comm.subject,
                      content: comm.content,
                      author: `${comm.fromName} → ${comm.toName}`
                    }))
                  ]
                    // Filter based on selected filter
                    .filter(item => activityFilter === 'all' || item.type === activityFilter)
                    // Sort by timestamp (newest first)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map(item => (
                      <div key={`${item.type}-${item.id}`} className={`border-l-4 ${item.type === 'history' ? 'border-blue-200' : 'border-green-200'} pl-3 py-2 rounded-r-lg bg-card/50`}>
                        <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {item.type === 'history' ? (
                             <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10">
                               <History className="h-3.5 w-3.5 text-primary" />
                             </div>
                          ) : (
                             <div className="p-1.5 rounded-lg bg-green-500/5 border border-green-500/10">
                               <MessageSquare className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                             </div>
                          )}
                          <span className="font-medium text-foreground">{item.title}</span>
                        </div>
                          <div className="flex items-center gap-2">
                            {item.type === 'history' ? (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors">
                                <History className="h-3 w-3 mr-1" />
                                System Log
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/15 transition-colors">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {item.type === 'communication' && 'type' in item 
                                  ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
                                  : 'Message'
                                }
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">{format(item.timestamp, 'dd/MM/yyyy HH:mm')}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{item.content}</p>
                        <span className="text-xs text-muted-foreground">
                          {item.type === 'history' ? `by ${item.author}` : item.author}
                        </span>
                      </div>
                    ))
                  }
                  
                  {/* Empty state */}
                  {[...serviceOrder.changeLog, ...serviceOrder.communications]
                    .filter(item => {
                      if (activityFilter === 'all') return true;
                      if (activityFilter === 'history') return 'action' in item;
                      if (activityFilter === 'communications') return 'subject' in item;
                      return false;
                    }).length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">
                        {activityFilter === 'all' && 'No activity recorded yet'}
                        {activityFilter === 'history' && 'No history entries found'}
                        {activityFilter === 'communications' && 'No communications found'}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <ProfessionalShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          data={{
            title: serviceOrder.orderNumber,
            orderNumber: serviceOrder.orderNumber,
            customerName: serviceOrder.customer.contactPerson,
            customerCompany: serviceOrder.customer.company,
            amount: serviceOrder.financials ? `${serviceOrder.financials.totalAmount.toFixed(2)} TND` : undefined,
            type: 'service_order',
            currentUrl: window.location.href
          }}
          pdfComponent={<ServiceOrderPDFDocument serviceOrder={serviceOrder} formatCurrency={formatCurrency} settings={defaultSettings} />}
          pdfFileName={`service-report-${serviceOrder.orderNumber}.pdf`}
        />

        <ServiceOrderPDFPreviewModal
          isOpen={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          serviceOrder={serviceOrder}
          formatCurrency={formatCurrency}
        />
        
        <AddMaterialModal
          isOpen={isMaterialModalOpen}
          onClose={() => setIsMaterialModalOpen(false)}
          onSubmit={handleMaterialAdd}
          availableMaterials={mockAvailableMaterials}
          availableJobs={serviceOrder.jobs}
          context="service_order"
        />
      </div>
    </div>;
}