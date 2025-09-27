import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { 
  Users, 
  Calendar, 
  Clock, 
  Eye,
  Edit,
  MapPin,
  CheckCircle,
  AlertCircle,
  Wrench,
  Map,
  Download
} from "lucide-react";
import { mockDispatches } from "../data";
import type { DispatchJob } from "../types";
import { MapOverlay } from "@/components/shared/MapOverlay";
import { mapDispatchesToMapItems } from "@/components/shared/mappers";
import { ExportModal, ExportConfig } from "@/components/shared/ExportModal";

export default function DispatchesList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dispatches] = useState<DispatchJob[]>(mockDispatches);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showMap, setShowMap] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const getStatusColor = (status: DispatchJob["status"]) => {
    const colors = {
      pending: "bg-gray-100 text-gray-800",
      assigned: "bg-blue-100 text-blue-800",
      acknowledged: "bg-purple-100 text-purple-800",
      en_route: "bg-orange-100 text-orange-800",
      on_site: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-indigo-100 text-indigo-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: DispatchJob["priority"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-600",
      medium: "bg-yellow-100 text-yellow-600", 
      high: "bg-orange-100 text-orange-600",
      urgent: "bg-red-100 text-red-600"
    };
    return colors[priority] || "bg-gray-100 text-gray-600";
  };

  const getStatusIcon = (status: DispatchJob["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-indigo-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleDispatchClick = (dispatch: DispatchJob) => {
    navigate(`/dashboard/field/dispatches/${dispatch.id}`);
  };

  const handleEditDispatch = (dispatch: DispatchJob) => {
    navigate(`/dashboard/field/dispatches/edit/${dispatch.id}`);
  };

  const exportConfig: ExportConfig = {
    filename: 'dispatches-export',
    allDataTransform: (dispatch: any) => ({
      'Job Number': dispatch.jobNumber,
      'Service Order ID': dispatch.serviceOrderId,
      'Service Order Number': dispatch.serviceOrderNumber,
      'Title': dispatch.title,
      'Description': dispatch.description,
      'Status': dispatch.status,
      'Priority': dispatch.priority,
      'Customer Company': dispatch.customer.company,
      'Customer Contact': dispatch.customer.contactPerson,
      'Customer Phone': dispatch.customer.phone,
      'Customer Email': dispatch.customer.email,
      'Scheduled Start': dispatch.scheduledStartTime,
      'Scheduled End': dispatch.scheduledEndTime,
      'Estimated Duration': dispatch.estimatedDuration,
      'Assigned Technicians': dispatch.assignedTechnicians.map((t: any) => t.name).join(', '),
      'Created At': new Date(dispatch.createdAt).toLocaleDateString(),
      'Updated At': dispatch.updatedAt ? new Date(dispatch.updatedAt).toLocaleDateString() : 'N/A',
    }),
    availableColumns: [
      { key: 'jobNumber', label: 'Job Number', category: 'Basic' },
      { key: 'serviceOrderId', label: 'Service Order ID', category: 'Basic' },
      { key: 'serviceOrderNumber', label: 'Service Order Number', category: 'Basic' },
      { key: 'title', label: 'Title', category: 'Basic' },
      { key: 'description', label: 'Description', category: 'Basic' },
      { key: 'status', label: 'Status', category: 'Basic' },
      { key: 'priority', label: 'Priority', category: 'Basic' },
      { key: 'customer.company', label: 'Customer Company', category: 'Customer' },
      { key: 'customer.contactPerson', label: 'Customer Contact', category: 'Customer' },
      { key: 'customer.phone', label: 'Customer Phone', category: 'Customer' },
      { key: 'customer.email', label: 'Customer Email', category: 'Customer' },
      { key: 'scheduledStartTime', label: 'Scheduled Start', category: 'Schedule' },
      { key: 'scheduledEndTime', label: 'Scheduled End', category: 'Schedule' },
      { key: 'estimatedDuration', label: 'Estimated Duration', category: 'Schedule' },
      { key: 'assignedTechnicians', label: 'Assigned Technicians', category: 'Assignment', transform: (techs: any[]) => Array.isArray(techs) ? techs.map(t => t.name).join(', ') : '' },
      { key: 'createdAt', label: 'Created Date', category: 'Timeline', transform: (date: string) => new Date(date).toLocaleDateString() },
      { key: 'updatedAt', label: 'Updated Date', category: 'Timeline', transform: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A' },
    ]
  };

  const filteredDispatches = dispatches.filter(dispatch => {
    const matchesSearch = searchTerm === "" || 
      dispatch.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dispatch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-subtle backdrop-blur-sm sticky top-0 z-20 shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t("dispatches.title")}</h1>
                <p className="text-muted-foreground">{t("dispatches.subtitle")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-stretch sm:items-center">
          <div className="flex-1">
            <CollapsibleSearch 
              placeholder={t("dispatches.search_placeholder")}
              value={searchTerm}
              onChange={setSearchTerm}
              className="w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">{t("dispatches.all_statuses")}</option>
            <option value="pending">{t("dispatches.statuses.pending")}</option>
            <option value="assigned">{t("dispatches.statuses.assigned")}</option>
            <option value="in_progress">{t("dispatches.statuses.in_progress")}</option>
            <option value="completed">{t("dispatches.statuses.completed")}</option>
          </select>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={showMap ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setShowMap(!showMap)} 
              className={`flex-1 sm:flex-none ${showMap ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
            >
              <Map className={`h-4 w-4 ${showMap ? 'text-white' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowExportModal(true)}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <Card className="shadow-card border-0 bg-card">
          {/* Map Section */}
          {showMap && (
            <MapOverlay
              items={mapDispatchesToMapItems(filteredDispatches)}
              onViewItem={(item) => handleDispatchClick(filteredDispatches.find(d => d.id === item.id)!)}
              onEditItem={(item) => handleEditDispatch(filteredDispatches.find(d => d.id === item.id)!)}
              onClose={() => setShowMap(false)}
              isVisible={showMap}
            />
          )}
          
          <CardContent className={showMap ? "pt-4 p-0" : "p-0"}>
            {/* Dispatches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredDispatches.map((dispatch) => (
                <Card key={dispatch.id} className="shadow-card hover-lift transition-all hover:shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {dispatch.jobNumber}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {dispatch.title}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={`${getStatusColor(dispatch.status)} text-xs font-medium`}>
                          {getStatusIcon(dispatch.status)}
                          <span className="ml-1">{t(`dispatches.statuses.${dispatch.status}`)}</span>
                        </Badge>
                        <Badge className={`${getPriorityColor(dispatch.priority)} text-xs font-medium`}>
                          {t(`dispatches.priorities.${dispatch.priority}`)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dispatch.customer.company}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {dispatch.customer.address.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {dispatch.scheduledDate?.toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {dispatch.scheduledStartTime} - {dispatch.scheduledEndTime}
                        </span>
                      </div>

                      {dispatch.assignedTechnicians.length > 0 && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Assigned to:</p>
                          <div className="flex flex-wrap gap-1">
                            {dispatch.assignedTechnicians.map((tech) => (
                              <Badge key={tech.id} variant="secondary" className="text-xs">
                                {tech.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDispatchClick(dispatch)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("common.view")}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditDispatch(dispatch)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t("common.edit")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Export Modal */}
      <ExportModal 
        open={showExportModal}
        onOpenChange={setShowExportModal}
        data={filteredDispatches}
        moduleName="Dispatches"
        exportConfig={exportConfig}
      />
    </div>
  );
}