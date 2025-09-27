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
import { ArrowLeft, Clock, DollarSign, Users, MapPin, Calendar, CheckCircle, AlertCircle, User, Phone, Mail, Settings, MoreVertical, Edit, Trash2, Wrench, FileText, Camera, Upload, Plus, Building, ExternalLink, Play, Pause, Square, ChevronDown, ChevronRight, ClipboardList, Share2 } from "lucide-react";
import { TimeExpensesTab } from "../../service-orders/components/TimeExpensesTab";
import { cn } from "@/lib/utils";
import { ProfessionalShareModal } from "@/components/shared/ProfessionalShareModal";
import { DispatchPDFPreviewModal } from "../components/DispatchPDFPreviewModal";
import type { ServiceOrderDispatch } from "../../service-orders/entities/dispatches/types";
import { DispatchStatusFlow, type DispatchStatus } from "../components/DispatchStatusFlow";
import { AddMaterialModal } from "../../components/AddMaterialModal";
import type { Article } from "@/modules/inventory-services/types";

// Mock dispatch data
const mockDispatch: ServiceOrderDispatch = {
  id: "disp-001",
  serviceOrderId: "so-001",
  jobId: "job-001", // Added required jobId
  dispatchNumber: "DISP-2024-001",
  assignedTechnicians: ["John Smith", "Mike Johnson"],
  requiredSkills: ["electrical", "automotive"],
  scheduledDate: new Date(),
  scheduledStartTime: "09:00",
  scheduledEndTime: "12:00",
  estimatedDuration: 180,
  status: "in_progress",
  priority: "high",
  workloadHours: 3,
  dispatchedBy: "dispatcher-001",
  dispatchedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock related data
const mockContact = {
  id: "contact-001",
  company: "Acme Corporation",
  contactPerson: "John Doe",
  phone: "+216 72 285 123",
  email: "john.doe@acme.com",
  address: {
    street: "Avenue Habib Bourguiba",
    city: "Nabeul",
    state: "Nabeul",
    zipCode: "8000",
    country: "Tunisia",
    longitude: 10.737222,
    latitude: 36.456389,
    hasLocation: 1
  }
};

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

export default function DispatchJobDetail() {
  const { t } = useTranslation('job-detail');
  const { id } = useParams();
  const navigate = useNavigate();
  const [dispatch, setDispatch] = useState<ServiceOrderDispatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleMaterialAdd = (materialData: any) => {
    console.log('Adding material to dispatch:', materialData);
    // Here you would make an API call to add the material to the dispatch
  };

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

  useEffect(() => {
    if (id) {
      // In real app, fetch dispatch data from API
      setDispatch(mockDispatch);
      document.title = `Dispatch - ${mockDispatch.dispatchNumber}`;
      setLoading(false);
    } else {
      navigate("/dashboard/field/dispatcher");
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">{t('dispatch_detail.loading')}</p>
        </div>
      </div>
    );
  }

  if (!dispatch) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('dispatch_detail.not_found')}</h3>
          <p className="text-muted-foreground mb-4">{t('dispatch_detail.not_found_message')}</p>
          <Button onClick={() => navigate("/dashboard/field/dispatcher")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('dispatch_detail.back_to_dispatcher')}
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: ServiceOrderDispatch["status"]) => {
    const colors = {
      pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15 transition-colors",
      assigned: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15 transition-colors",
      acknowledged: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/15 transition-colors",
      en_route: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/15 transition-colors",
      on_site: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/15 transition-colors",
      in_progress: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/15 transition-colors",
      completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/15 transition-colors",
      cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/15 transition-colors"
    };
    return colors[status] || "bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70 transition-colors";
  };

  const getPriorityColor = (priority: ServiceOrderDispatch["priority"]) => {
    const colors = {
      low: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/15 transition-colors",
      medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15 transition-colors",
      high: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/15 transition-colors",
      urgent: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/15 transition-colors"
    };
    return colors[priority] || "bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70 transition-colors";
  };

  const getStatusIcon = (status: ServiceOrderDispatch["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in_progress":
      case "on_site":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (newStatus: DispatchStatus) => {
    if (dispatch) {
      setDispatch({ ...dispatch, status: newStatus as ServiceOrderDispatch["status"] });
      // In real app, this would make an API call
    }
  };

  const statusFlowOptions = [
    { value: "pending", label: "Pending", icon: Clock },
    { value: "assigned", label: "Assigned", icon: User },
    { value: "acknowledged", label: "Acknowledged", icon: CheckCircle },
    { value: "en_route", label: "En Route", icon: MapPin },
    { value: "on_site", label: "On Site", icon: Building },
    { value: "in_progress", label: "In Progress", icon: Play },
    { value: "completed", label: "Completed", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: AlertCircle }
  ];

  // Generate dispatch-specific time tracking data
  const getDispatchTimeData = (dispatchId: string) => {
    const timeData = {
      "disp-001": [
        {
          id: "time-001",
          serviceOrderId: dispatch.serviceOrderId,
          technicianId: "tech-001",
          workType: "travel" as const,
          startTime: new Date("2024-01-15T08:00:00"),
          endTime: new Date("2024-01-15T08:45:00"),
          duration: 45,
          description: "Travel to client site",
          billable: true,
          status: "submitted" as const,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15")
        },
        {
          id: "time-002", 
          serviceOrderId: dispatch.serviceOrderId,
          technicianId: "tech-001",
          workType: "work" as const,
          startTime: new Date("2024-01-15T09:00:00"),
          endTime: new Date("2024-01-15T12:30:00"),
          duration: 210,
          description: "Network equipment installation and configuration",
          billable: true,
          status: "approved" as const,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15")
        }
      ],
      "disp-002": [
        {
          id: "time-003",
          serviceOrderId: dispatch.serviceOrderId,
          technicianId: "tech-001",
          workType: "work" as const,
          startTime: new Date("2024-01-16T10:00:00"),
          endTime: new Date("2024-01-16T11:30:00"),
          duration: 90,
          description: "System diagnostics and troubleshooting",
          billable: true,
          status: "draft" as const,
          createdAt: new Date("2024-01-16"),
          updatedAt: new Date("2024-01-16")
        }
      ],
      "disp-003": [
        {
          id: "time-004",
          serviceOrderId: dispatch.serviceOrderId,
          technicianId: "tech-001",
          workType: "setup" as const,
          startTime: new Date("2024-01-17T09:15:00"),
          endTime: new Date("2024-01-17T10:00:00"),
          duration: 45,
          description: "Equipment setup and preparation",
          billable: true,
          status: "submitted" as const,
          createdAt: new Date("2024-01-17"),
          updatedAt: new Date("2024-01-17")
        },
        {
          id: "time-005",
          serviceOrderId: dispatch.serviceOrderId,
          technicianId: "tech-001",
          workType: "work" as const, 
          startTime: new Date("2024-01-17T10:00:00"),
          endTime: new Date("2024-01-17T14:00:00"),
          duration: 240,
          description: "Main repair work - server maintenance",
          billable: true,
          status: "approved" as const,
          createdAt: new Date("2024-01-17"),
          updatedAt: new Date("2024-01-17")
        },
        {
          id: "time-006",
          serviceOrderId: dispatch.serviceOrderId,
          technicianId: "tech-001",
          workType: "documentation" as const,
          startTime: new Date("2024-01-17T14:00:00"),
          endTime: new Date("2024-01-17T14:30:00"),
          duration: 30,
          description: "Completion documentation and handover",
          billable: true,
          status: "draft" as const,
          createdAt: new Date("2024-01-17"),
          updatedAt: new Date("2024-01-17")
        }
      ]
    };
    return timeData[dispatchId as keyof typeof timeData] || [];
  };

  // Create a mock service order for the TimeExpensesTab component with all required fields
  const mockServiceOrderForTab = {
    id: dispatch.serviceOrderId,
    orderNumber: dispatch.serviceOrderId,
    customer: mockContact,
    status: "in_progress" as const,
    priority: dispatch.priority,
    repair: {
      description: "Dispatch work",
      location: mockInstallation.location,
      urgencyLevel: dispatch.priority,
      promisedRepairDate: dispatch.scheduledDate
    },
    createdAt: dispatch.createdAt,
    updatedAt: dispatch.updatedAt,
    assignedTechnicians: dispatch.assignedTechnicians,
    jobs: [],
    dispatches: [dispatch],
    workDetails: {
      stepsPerformed: [],
      timeTracking: getDispatchTimeData(dispatch.id),
      photos: [],
      checklists: []
    },
    materials: [],
    financials: {
      id: "fin-001",
      serviceOrderId: dispatch.serviceOrderId,
      currency: "TND",
      estimatedCost: 1000,
      actualCost: 0,
      laborCost: 0,
      materialCost: 0,
      travelCost: 0,
      equipmentCost: 0,
      overheadCost: 0,
      basePrice: 1000,
      discounts: [],
      taxes: [],
      totalAmount: 1000,
      paymentTerms: "Net 30",
      paymentStatus: "pending" as const,
      paidAmount: 0,
      remainingAmount: 1000,
      invoiceStatus: "draft" as const,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    followUp: {
      reminders: [],
      maintenanceNotes: ""
    },
    changeLog: [],
    communications: []
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/field/dispatcher")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('dispatch_detail.back_to_dispatcher')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background z-50 border border-border/50">
                <DropdownMenuItem className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Mark Complete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Cancel Dispatch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-4">
            <h1 className="text-xl font-bold text-foreground">
              {dispatch.dispatchNumber}
            </h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between p-6 lg:p-8">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/field/dispatcher")} className="gap-2 hover:bg-background/80">
                <ArrowLeft className="h-4 w-4" />
                {t('dispatch_detail.back_to_dispatcher')}
              </Button>
              <div className="h-8 w-px bg-border/50" />
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                {dispatch.dispatchNumber}
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
              <DispatchStatusFlow
                currentStatus={dispatch.status as DispatchStatus}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Enhanced tabs with icons */}
          <div className="w-full mb-6">
            <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-lg lg:grid lg:grid-cols-5 lg:gap-0">
              <div className="flex lg:contents overflow-x-auto mask-fade-right gap-1 lg:gap-0 pb-1 lg:pb-0">
                <TabsTrigger 
                  value="overview" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[100px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                 >
                  {t('dispatch_detail.overview')}
                 </TabsTrigger>
                <TabsTrigger 
                  value="time_expenses" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[120px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                 >
                  {t('tabs.time_expenses')}
                 </TabsTrigger>
                <TabsTrigger 
                  value="materials" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[90px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                 >
                  {t('dispatch_detail.materials')}
                 </TabsTrigger>
                <TabsTrigger 
                  value="photos" 
                  className="whitespace-nowrap px-4 py-2.5 min-w-[100px] flex-shrink-0 lg:flex-1 lg:min-w-0 text-sm font-medium"
                 >
                  {t('tabs.attachments')}
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
            {/* Dispatch Details */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Related Service Order</label>
                      <div className="mt-1">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-left font-semibold text-primary hover:underline inline-flex items-center"
                          onClick={() => navigate(`/dashboard/field/service-orders/${dispatch.serviceOrderId}`)}
                        >
                          <span>#{dispatch.serviceOrderId}</span>
                          <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Required Skills</label>
                      <div className="mt-1">
                        {dispatch.requiredSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {dispatch.requiredSkills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15 transition-colors">
                                {skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground font-medium">None specified</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Installation</label>
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
                      <label className="text-sm font-medium text-muted-foreground">Contact</label>
                      <div className="mt-1">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-left font-semibold text-primary hover:underline inline-flex items-center md:max-w-none max-w-[200px] truncate"
                          onClick={() => navigate(`/dashboard/contacts/${mockContact.id}`)}
                        >
                          <span className="truncate">{mockContact.company}</span>
                          <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact Number</label>
                      <p className="text-foreground font-medium mt-1">
                        {mockContact.phone || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Assigned Technicians</label>
                      <div className="mt-1">
                        {dispatch.assignedTechnicians.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {dispatch.assignedTechnicians.map((tech, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/15 transition-colors">
                                <User className="h-3 w-3 mr-1" />
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground font-medium">None assigned</p>
                        )}
                      </div>
                    </div>

                    {dispatch.scheduledDate && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                        <p className="text-foreground font-medium mt-1">
                          {format(dispatch.scheduledDate, 'MMMM d, yyyy')}
                        </p>
                      </div>
                    )}

                    {dispatch.scheduledStartTime && dispatch.scheduledEndTime && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Scheduled Time</label>
                        <p className="text-foreground font-medium mt-1">
                          {dispatch.scheduledStartTime} - {dispatch.scheduledEndTime}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Priority Level</label>
                      <div className="mt-1">
                        <Badge variant="secondary" className={`${getPriorityColor(dispatch.priority)} font-medium`}>
                          {dispatch.priority.charAt(0).toUpperCase() + dispatch.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Dispatch Status</label>
                      <div className="mt-1">
                        <Badge variant="secondary" className={`${getStatusColor(dispatch.status)} font-medium`}>
                          {getStatusIcon(dispatch.status)}
                          <span className="ml-1 capitalize">{dispatch.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estimated Duration</label>
                      <p className="text-foreground font-medium mt-1">
                        {Math.floor(dispatch.estimatedDuration / 60)}h {dispatch.estimatedDuration % 60}m
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time & Expenses Tab */}
          <TabsContent value="time_expenses" className="mt-0">
            <div className="bg-muted/30 p-6 rounded-lg">
              <TimeExpensesTab serviceOrder={mockServiceOrderForTab} />
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Materials Used
                  </CardTitle>
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
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Materials tracking will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Activity log will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Photo gallery will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <ProfessionalShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          data={{
            title: dispatch.dispatchNumber,
            orderNumber: dispatch.dispatchNumber,
            customerName: mockContact.contactPerson,
            customerCompany: mockContact.company,
            amount: dispatch.actualDuration ? `${(dispatch.actualDuration * 75).toFixed(2)} USD` : undefined,
            type: 'dispatch',
            currentUrl: window.location.href
          }}      
          pdfFileName={`dispatch-report-${dispatch.dispatchNumber}.pdf`}
        />

        <DispatchPDFPreviewModal
          isOpen={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          dispatch={dispatch}
          customer={mockContact}
          installation={mockInstallation}
          timeData={[]}
          formatCurrency={formatCurrency}
        />

        <AddMaterialModal
          isOpen={isMaterialModalOpen}
          onClose={() => setIsMaterialModalOpen(false)}
          onSubmit={handleMaterialAdd}
          availableMaterials={mockAvailableMaterials}
          context="dispatch"
        />
      </div>
    </div>
  );
}