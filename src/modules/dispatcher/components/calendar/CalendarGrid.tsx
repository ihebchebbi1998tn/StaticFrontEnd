import { format, getHours, getMinutes, isSameDay, differenceInMinutes, startOfDay, isWeekend } from "date-fns";
import type { Technician, Job, DragData } from "../../types";
import type { ZoomDimensions } from "./types";
import { ResizableJobBlock } from "./ResizableJobBlock";

interface CalendarGridProps {
  dates: Date[];
  technicians: Technician[];
  workingHours: number[];
  assignedJobs: Record<string, Job[]>;
  dimensions: ZoomDimensions;
  dragOverSlot: { technicianId: string; date: Date; hour: number } | null;
  onDragOver: (e: React.DragEvent, technicianId: string, date: Date, hour: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, technicianId: string, date: Date, hour: number) => void;
  onJobResize: (jobId: string, newEnd: Date) => void;
  onJobClick: (job: Job) => void;
  includeWeekends: boolean;
}

export function CalendarGrid({
  dates,
  technicians,
  workingHours,
  assignedJobs,
  dimensions,
  dragOverSlot,
  onDragOver,
  onDragLeave,
  onDrop,
  onJobResize,
  onJobClick,
  onPreviewResize,
  includeWeekends
}: CalendarGridProps & { onPreviewResize?: (jobId: string, newEnd: Date) => void }) {
  const { dateWidth, hourWidth, widthMode } = dimensions;

  const getJobsForDate = (technicianId: string, date: Date) => {
    const key = `${technicianId}-${format(date, 'yyyy-MM-dd')}`;
    return assignedJobs[key] || [];
  };

  const getJobPosition = (job: Job, date: Date) => {
    if (!job.scheduledStart) return null;
    
    const dayStart = startOfDay(date);
    const minutesFromStart = differenceInMinutes(job.scheduledStart, dayStart);
    const hours = minutesFromStart / 60;
    
    // Position relative to working hours (8 AM = hour 0)
    const workingHourOffset = hours - workingHours[0];
    
    console.log('Job positioning:', {
      jobId: job.id,
      scheduledStart: job.scheduledStart,
      dayStart,
      minutesFromStart,
      hours,
      workingHourOffset,
      hourWidth: dimensions.hourWidth
    });
    
    return {
      left: `${Math.max(0, workingHourOffset) * dimensions.hourWidth}px`,
      top: '4px'
    };
  };

  const isSlotHighlighted = (technicianId: string, date: Date, hour: number) => {
    return dragOverSlot?.technicianId === technicianId && 
           isSameDay(dragOverSlot.date, date) && 
           dragOverSlot.hour === hour;
  };

  return (
  <div className="flex-1 overflow-x-hidden bg-gradient-to-br from-background to-accent/5">
      <div className={`${widthMode === 'auto' ? 'w-full' : ''}`} style={widthMode === 'scroll' ? { width: `${dates.length * dateWidth}px` } : {}}>
        {technicians.map((technician) => (
          <div key={technician.id} className="flex border-b h-20">
            {dates.map(date => {
              const dayJobs = getJobsForDate(technician.id, date);
              console.log(`Rendering jobs for ${technician.firstName} on ${format(date, 'yyyy-MM-dd')}:`, dayJobs);
              const weekend = isWeekend(date);
              const weekendDisabled = weekend && !includeWeekends;
              
              return (
                <div 
                  key={format(date, 'yyyy-MM-dd')} 
                  className={`flex border-r last:border-r-0 flex-shrink-0 relative ${widthMode === 'auto' ? 'flex-1' : ''} ${weekendDisabled ? 'bg-destructive/10 dark:bg-destructive/15' : weekend ? 'bg-muted/10' : ''} ${weekendDisabled ? 'pointer-events-none' : ''}`}
                  style={widthMode === 'scroll' ? { width: `${dateWidth}px` } : { minWidth: `${dateWidth}px` }}
                >
                  {weekendDisabled && (
                    <div className="absolute inset-0 pointer-events-none opacity-60 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,0,0,0.10)_8px,rgba(255,0,0,0.10)_16px)]" />
                  )}
                  {/* Working hour slots */}
                  {workingHours.map(hour => {
                    const isHighlighted = isSlotHighlighted(technician.id, date, hour);
                    
                    return (
                      <div
                        key={hour}
                        className={`calendar-drop-zone flex-1 border-r last:border-r-0 transition-all duration-200 cursor-pointer relative group ${
                          isHighlighted 
                            ? 'drag-over bg-gradient-to-br from-primary/20 to-primary/10 border-primary/40' 
                            : 'hover:bg-gradient-to-br hover:from-accent/20 hover:to-accent/10'
                        }`}
                        style={{ minWidth: `${dimensions.hourWidth}px` }}
                        onDragOver={(e) => !weekendDisabled && onDragOver(e, technician.id, date, hour)}
                        onDragLeave={(e) => !weekendDisabled && onDragLeave(e)}
                        onDrop={(e) => !weekendDisabled && onDrop(e, technician.id, date, hour)}
                      >
                        {/* Enhanced drop zone indicator with animation */}
                        {isHighlighted && (
                          <div className="absolute inset-0 border-2 border-dashed border-primary/60 rounded-md flex items-center justify-center z-20 animate-pulse">
                            <div className="flex items-center gap-1 text-primary/80 text-xs font-medium">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <span>Drop here</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Hover indicator */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <div className="absolute top-1 left-1 w-1 h-1 bg-accent rounded-full"></div>
                          <div className="absolute bottom-1 right-1 w-1 h-1 bg-accent rounded-full"></div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Positioned job blocks */}
                  {dayJobs.map(job => {
                    const position = getJobPosition(job, date);
                    if (!position) return null;
                    
                    return (
                      <div
                        key={job.id}
                        className="absolute"
                        style={position}
                      >
                        <ResizableJobBlock
                          job={job}
                          hourWidth={dimensions.hourWidth}
                          onResize={onJobResize}
                          onPreviewResize={onPreviewResize}
                          onClick={onJobClick}
                          isLocked={job.isLocked}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}