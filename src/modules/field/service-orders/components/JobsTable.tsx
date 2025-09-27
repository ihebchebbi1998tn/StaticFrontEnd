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
  Wrench, AlertTriangle, CheckCircle, Calendar,
  User, MapPin, Filter, ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Job } from "../entities/jobs/types";

interface JobsTableProps {
  jobs: Job[];
  onJobUpdate?: () => void;
}

export function JobsTable({ jobs, onJobUpdate }: JobsTableProps) {
  const { t } = useTranslation();
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');

  // Filter the jobs based on current filters and search term
  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        job.title.toLowerCase().includes(searchLower) ||
        job.jobNumber.toLowerCase().includes(searchLower) ||
        job.workType.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && job.status !== filterStatus) return false;
    if (filterPriority !== 'all' && job.priority !== filterPriority) return false;
    if (filterWorkType !== 'all' && job.workType !== filterWorkType) return false;
    return true;
  });

  // Count active filters
  const activeFiltersCount = [
    filterStatus !== 'all' ? 1 : 0,
    filterPriority !== 'all' ? 1 : 0,
    filterWorkType !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'dispatched':
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/15 transition-colors";
      case 'ready':
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15 transition-colors";
      case 'cancelled':
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/15 transition-colors";
      case 'unscheduled':
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15 transition-colors";
      default:
        return "bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70 transition-colors";
    }
  };

  const getPriorityColor = (priority: Job['priority']) => {
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

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'dispatched':
        return <CheckCircle className="h-3 w-3" />;
      case 'ready':
        return <Clock className="h-3 w-3" />;
      case 'cancelled':
        return <AlertTriangle className="h-3 w-3" />;
      case 'unscheduled':
        return <Wrench className="h-3 w-3" />;
      default:
        return <Wrench className="h-3 w-3" />;
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

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between mb-4 mt-6">
        <div className="flex-1">
          <CollapsibleSearch 
            placeholder="Search jobs..."
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
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Job
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
                  <option value="unscheduled">Unscheduled</option>
                  <option value="ready">Ready</option>
                  <option value="dispatched">Dispatched</option>
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
                  value={filterWorkType} 
                  onChange={e => setFilterWorkType(e.target.value)}
                >
                  <option value="all">All Work Types</option>
                  <option value="installation">Installation</option>
                  <option value="repair">Repair</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inspection">Inspection</option>
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
                  setFilterWorkType('all'); 
                  setShowFilterBar(false); 
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {filteredJobs.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {jobs.length === 0 ? "No jobs created yet" : "No jobs match the current filters"}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Job</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Work Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Assigned</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Schedule</th>
                <th className="w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{job.title}</div>
                      <div className="text-sm text-muted-foreground">
                        <span>{job.jobNumber}</span>
                      </div>
                    </div>
                  </td>
                   <td className="px-4 py-3">
                     <Badge variant="secondary" className={getStatusColor(job.status)}>
                       <div className="flex items-center gap-1.5">
                         {getStatusIcon(job.status)}
                         <span className="capitalize font-medium">{job.status.replace('_', ' ')}</span>
                       </div>
                     </Badge>
                   </td>
                   <td className="px-4 py-3">
                     <Badge variant="secondary" className={getPriorityColor(job.priority)}>
                       <span className="capitalize font-medium">{job.priority}</span>
                     </Badge>
                   </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-sm">{job.workType.replace('_', ' ')}</span>
                  </td>
                    <td className="px-4 py-3">
                      {job.status === 'dispatched' ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/15 transition-colors">
                          <span className="font-medium">Dispatched</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70 transition-colors">
                          <span className="font-medium">Pending</span>
                        </Badge>
                      )}
                    </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div>{formatDuration(job.estimatedDuration)}</div>
                      {job.actualDuration && (
                        <div className="text-xs text-muted-foreground">
                          Actual: {formatDuration(job.actualDuration)}
                        </div>
                      )}
                    </div>
                  </td>
                   <td className="px-4 py-3">
                     <span className="text-muted-foreground text-sm">Not scheduled</span>
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
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <User className="h-4 w-4" />
                          Assign Technicians
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedule Job
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete Job
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