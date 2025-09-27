import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  MapPin, 
  User, 
  Wrench,
  GripVertical,
  ChevronDown,
  Package,
  Search
} from "lucide-react";
import type { Job, ServiceOrder } from "../types";
import { DispatcherService } from "../services/dispatcher.service";
import './dispatcher-drag.css';

interface UnassignedJobsListProps {
  jobs: Job[];
  onJobUpdate: () => void;
  onJobClick?: (job: Job) => void;
  isMobile?: boolean;
}

export function UnassignedJobsList({ jobs, onJobUpdate, onJobClick, isMobile }: UnassignedJobsListProps) {
  const { t } = useTranslation();
  const [expandedServiceOrders, setExpandedServiceOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  // Group jobs by service order and filter by search term
  const serviceOrdersWithJobs = () => {
    const serviceOrders = DispatcherService.getServiceOrders();
    return serviceOrders.map(order => ({
      ...order,
      unassignedJobs: jobs.filter(job => job.serviceOrderId === order.id)
    })).filter(order => {
      if (order.unassignedJobs.length === 0) return false;
      
      // Filter by search term (service order ID or title)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesOrderId = order.id.toLowerCase().includes(searchLower);
        const matchesOrderTitle = order.title.toLowerCase().includes(searchLower);
        const matchesJobTitle = order.unassignedJobs.some(job => 
          job.title.toLowerCase().includes(searchLower)
        );
        return matchesOrderId || matchesOrderTitle || matchesJobTitle;
      }
      
      return true;
    });
  };

  const groupedData = serviceOrdersWithJobs();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const toggleServiceOrder = (serviceOrderId: string) => {
    setExpandedServiceOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceOrderId)) {
        newSet.delete(serviceOrderId);
      } else {
        newSet.add(serviceOrderId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e: React.DragEvent, job: Job) => {
    if (isMobile) {
      e.preventDefault();
      return;
    }
    
    setIsDragging(true);
    document.body.classList.add('dragging');
    
    // Create enhanced drag data
    const dragData = {
      type: 'job',
      item: job,
      timestamp: Date.now()
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // Create custom drag ghost for better visual feedback
    const dragGhost = createDragGhost(job);
    e.dataTransfer.setDragImage(dragGhost, dragGhost.offsetWidth / 2, dragGhost.offsetHeight / 2);
    
    // Add drag styling to the element with smooth transition
    const target = e.currentTarget as HTMLElement;
    target.classList.add('dragging');
    
    // Enhanced visual feedback
    setTimeout(() => {
      target.style.opacity = '0.5';
    }, 50);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    document.body.classList.remove('dragging');
    
    // Remove drag styling with smooth transition
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('dragging');
    target.style.opacity = '';
    
    // Clean up any ghost elements
    cleanupDragGhost();
  };

  const createDragGhost = (job: Job) => {
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.innerHTML = `
      <div class="p-2 bg-card border rounded-lg shadow-lg min-w-[200px]">
        <div class="font-medium text-sm text-foreground">${job.title}</div>
        <div class="text-xs text-muted-foreground mt-1">${job.customerName}</div>
        <div class="text-xs text-muted-foreground">${Math.floor(job.estimatedDuration / 60)}h ${job.estimatedDuration % 60}m</div>
      </div>
    `;
    document.body.appendChild(ghost);
    return ghost;
  };

  const cleanupDragGhost = () => {
    const ghosts = document.querySelectorAll('.drag-ghost');
    ghosts.forEach(ghost => ghost.remove());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drag-ready');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-ready');
  };

  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader className="pb-3">
  <h3 className="text-sm font-semibold mb-2">Service orders jobs</h3>
        {/* Search Input (header title removed per UX request) */}
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-4 pt-0">
            {groupedData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchTerm ? 'No results found' : t('dispatcher.no_unassigned_jobs')}
                </p>
              </div>
            ) : (
              groupedData.map((serviceOrderData) => (
                <div key={serviceOrderData.id} className="border rounded-lg bg-card/50 overflow-hidden">
                  {/* Service Order Header */}
                  <div 
                    className="p-2.5 border-b bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => toggleServiceOrder(serviceOrderData.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Package className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate" style={{ fontSize: '0.75rem' }}>
                              #{serviceOrderData.id}
                            </span>
                          </div>
                          <div className="text-muted-foreground" style={{ fontSize: '0.65rem' }}>
                            {serviceOrderData.unassignedJobs.length} job{serviceOrderData.unassignedJobs.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={getPriorityColor(serviceOrderData.priority)} className="text-[0.6rem] px-1 py-0 h-4">
                          {t(`dispatcher.priority_${serviceOrderData.priority}`)}
                        </Badge>
                        <ChevronDown 
                          className={`h-3 w-3 transition-transform text-muted-foreground ${
                            expandedServiceOrders.has(serviceOrderData.id) ? 'rotate-180' : ''
                          }`} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Jobs List */}
                  {expandedServiceOrders.has(serviceOrderData.id) && (
                    <div className="bg-background">
                      <div className="space-y-1.5 p-2">
                        {serviceOrderData.unassignedJobs.map((job) => (
                          <div
                            key={job.id}
                            draggable={!isMobile}
                            onDragStart={(e) => handleDragStart(e, job)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => isMobile && onJobClick?.(job)}
                            className={`dispatcher-job-item p-2 border rounded bg-card transition-all ${
                              isMobile 
                                ? 'mobile cursor-pointer hover:shadow-sm' 
                                : 'hover:shadow-md'
                            } hover:border-primary/50`}
                          >
                            <div className="flex items-start gap-1.5">
                              {!isMobile && (
                                <GripVertical 
                                  className="grip-icon h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0 opacity-60" 
                                />
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-medium leading-tight" style={{ fontSize: '0.7rem' }}>
                                    {job.title}
                                  </h4>
                                  <Badge variant={getPriorityColor(job.priority)} className="text-[0.6rem] px-1 py-0 h-4">
                                    {t(`dispatcher.priority_${job.priority}`)}
                                  </Badge>
                                </div>
                                
                                {job.description && (
                                  <p className="text-muted-foreground mb-1 leading-tight" style={{ fontSize: '0.65rem' }}>
                                    {job.description}
                                  </p>
                                )}
                                
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: '0.65rem' }}>
                                    <User className="h-2 w-2 flex-shrink-0" />
                                    <span className="truncate">{job.customerName}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: '0.65rem' }}>
                                    <MapPin className="h-2 w-2 flex-shrink-0" />
                                    <span className="truncate">{job.location.address}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: '0.65rem' }}>
                                    <Clock className="h-2 w-2 flex-shrink-0" />
                                    <span>
                                      {Math.floor(job.estimatedDuration / 60)}h {job.estimatedDuration % 60}m
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-1">
                                  <div className="flex flex-wrap gap-0.5">
                                    {job.requiredSkills.slice(0, 2).map((skill) => (
                                      <Badge key={skill} variant="outline" className="text-[0.6rem] px-0.5 py-0 h-4">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {job.requiredSkills.length > 2 && (
                                      <Badge variant="outline" className="text-[0.6rem] px-0.5 py-0 h-4">
                                        +{job.requiredSkills.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}