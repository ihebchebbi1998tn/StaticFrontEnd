import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { 
  Plus, Edit, Trash2, Eye, MoreVertical, Clock, 
  Truck, AlertTriangle, CheckCircle, Calendar,
  User, MapPin, Route, Filter, ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ServiceOrderDispatch } from "../entities/dispatches/types";

interface DispatchesTableProps {
  dispatches: ServiceOrderDispatch[];
  onDispatchUpdate?: () => void;
}

export function DispatchesTable({ dispatches, onDispatchUpdate }: DispatchesTableProps) {
  const { t } = useTranslation();
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTechnician, setFilterTechnician] = useState('all');

  // Filter the dispatches based on current filters and search term
  const filteredDispatches = dispatches.filter(dispatch => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const techNames = getTechnicianNames(dispatch.assignedTechnicians).toLowerCase();
      const matchesSearch = 
        dispatch.dispatchNumber.toLowerCase().includes(searchLower) ||
        dispatch.id.toLowerCase().includes(searchLower) ||
        techNames.includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && dispatch.status !== filterStatus) return false;
    if (filterPriority !== 'all' && dispatch.priority !== filterPriority) return false;
    if (filterTechnician !== 'all' && !dispatch.assignedTechnicians.includes(filterTechnician)) return false;
    return true;
  });

  // Count active filters
  const activeFiltersCount = [
    filterStatus !== 'all' ? 1 : 0,
    filterPriority !== 'all' ? 1 : 0,
    filterTechnician !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const getStatusColor = (status: ServiceOrderDispatch['status']) => {
    switch (status) {
      case 'completed':
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/15 transition-colors";
      case 'in_progress':
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15 transition-colors";
      case 'on_site':
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/15 transition-colors";
      case 'en_route':
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15 transition-colors";
      case 'assigned':
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/15 transition-colors";
      case 'cancelled':
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/15 transition-colors";
      default:
        return "bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70 transition-colors";
    }
  };

  const getPriorityColor = (priority: ServiceOrderDispatch['priority']) => {
    switch (priority) {
      case 'urgent':
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/15 transition-colors";
      case 'high':
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/15 transition-colors";
      case 'medium':
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15 transition-colors";
      case 'low':
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/15 transition-colors";
      default:
        return "bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70 transition-colors";
    }
  };

  const getStatusIcon = (status: ServiceOrderDispatch['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'in_progress':
        return <Clock className="h-3 w-3" />;
      case 'on_site':
        return <MapPin className="h-3 w-3" />;
      case 'en_route':
        return <Truck className="h-3 w-3" />;
      case 'assigned':
        return <User className="h-3 w-3" />;
      case 'cancelled':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Route className="h-3 w-3" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const getTechnicianNames = (technicianIds: string[]) => {
    // Mock technician names mapping
    const techNames: { [key: string]: string } = {
      'tech-001': 'Alex Johnson',
      'tech-002': 'Sarah Wilson',
      'tech-003': 'Mike Chen',
      'tech-004': 'Emma Davis'
    };
    
    return technicianIds.map(id => techNames[id] || id).join(', ');
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between mb-4 mt-6">
        <div className="flex-1">
          <CollapsibleSearch 
            placeholder="Search dispatches..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 px-3 z-20" 
            onClick={() => setShowFilterBar(s => !s)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <Button 
            size="sm"
            variant="outline"
            className="border-border bg-background hover:bg-muted"
            onClick={() => window.location.href = '/dashboard/dispatcher/manage-scheduler'}
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Schedules
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilterBar && (
        <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
          <div className="flex flex-col gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="relative">
                <select 
                  className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm z-10" 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="en_route">En Route</option>
                  <option value="on_site">On Site</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-20" />
              </div>
              <div className="relative">
                <select 
                  className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm z-10" 
                  value={filterPriority} 
                  onChange={e => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-20" />
              </div>
              <div className="relative">
                <select 
                  className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm z-10" 
                  value={filterTechnician} 
                  onChange={e => setFilterTechnician(e.target.value)}
                >
                  <option value="all">All Technicians</option>
                  <option value="tech-001">Alex Johnson</option>
                  <option value="tech-002">Sarah Wilson</option>
                  <option value="tech-003">Mike Chen</option>
                  <option value="tech-004">Emma Davis</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-20" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-1 rounded-full border border-border text-sm hover:bg-muted transition-colors" 
                onClick={() => { 
                  setSearchTerm('');
                  setFilterStatus('all'); 
                  setFilterPriority('all'); 
                  setFilterTechnician('all'); 
                  setShowFilterBar(false); 
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {filteredDispatches.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {dispatches.length === 0 ? "No dispatches scheduled yet" : "No dispatches match the current filters"}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Dispatch</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Technician</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Schedule</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Workload</th>
                <th className="w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDispatches.map((dispatch) => (
                <tr key={dispatch.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{dispatch.dispatchNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        Dispatch #{dispatch.id.slice(-4)}
                      </div>
                    </div>
                  </td>
                   <td className="px-4 py-3">
                     <Badge variant="secondary" className={getStatusColor(dispatch.status)}>
                       <div className="flex items-center gap-1.5">
                         {getStatusIcon(dispatch.status)}
                         <span className="capitalize font-medium">{dispatch.status.replace('_', ' ')}</span>
                       </div>
                     </Badge>
                   </td>
                   <td className="px-4 py-3">
                     <Badge variant="secondary" className={getPriorityColor(dispatch.priority)}>
                       <span className="capitalize font-medium">{dispatch.priority}</span>
                     </Badge>
                   </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium">{getTechnicianNames(dispatch.assignedTechnicians)}</div>
                      {dispatch.requiredSkills.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Skills: {dispatch.requiredSkills.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div>Est: {formatDuration(dispatch.estimatedDuration)}</div>
                      {dispatch.actualDuration && (
                        <div className="text-xs text-muted-foreground">
                          Actual: {formatDuration(dispatch.actualDuration)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {dispatch.scheduledDate ? (
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(dispatch.scheduledDate, 'MMM dd')}
                        </div>
                        {dispatch.scheduledStartTime && (
                          <div className="text-xs text-muted-foreground">
                            {dispatch.scheduledStartTime} - {dispatch.scheduledEndTime}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div>{dispatch.workloadHours}h</div>
                      {dispatch.travelTime && (
                        <div className="text-xs text-muted-foreground">
                          +{dispatch.travelTime}min travel
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border border-border">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Dispatch
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Route className="h-4 w-4" />
                          View Route
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Clock className="h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Cancel Dispatch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}