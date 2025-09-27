import { useState, useEffect } from "react";
import { addHours, addDays, format, isSameDay } from "date-fns";
import type { CalendarViewType, Technician, Job, DragData } from "../../types";
import { DispatcherService } from "../../services/dispatcher.service";
import { CalendarControls } from "./CalendarControls";
import { CalendarSettingsPanel } from "./CalendarSettings";
import { CalendarHeader } from "./CalendarHeader";
import { TechnicianList } from "./TechnicianList";
import { CalendarGrid } from "./CalendarGrid";
import { JobConfirmationModal } from "../JobConfirmationModal";
import type { ZoomLevel, CalendarSettings, ZoomDimensions } from "./types";
import { toast } from "sonner";

interface CustomCalendarProps {
  view: CalendarViewType;
  technicians: Technician[];
  selectedTechnician: string | null;
  onJobAssignment: (jobId: string, technicianId: string, scheduledStart: Date, scheduledEnd: Date) => void;
  isMobile?: boolean;
}

export function CustomCalendar({ view, technicians, selectedTechnician, onJobAssignment, isMobile }: CustomCalendarProps) {
  const [assignedJobs, setAssignedJobs] = useState<Record<string, Job[]>>({});
  // transient previews for fast UI feedback during drag/resize
  const [previewJobs, setPreviewJobs] = useState<Record<string, Job[]>>({});
  const [dragOverSlot, setDragOverSlot] = useState<{ technicianId: string; date: Date; hour: number } | null>(null);
  // Locked to week view per requirements (remove other view options)
  const viewType = 'week';
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('md');
  // Force fixed 3-day window view every time (dayCount locked at 3)
  const [settings, setSettings] = useState<CalendarSettings>({ includeWeekends: false, dayCount: 3 });
  const [showSettings, setShowSettings] = useState(false);
  const [dateOffset, setDateOffset] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const workingHours = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM
  const displayedTechnicians = selectedTechnician 
    ? technicians.filter(t => t.id === selectedTechnician)
    : technicians;

  // Generate fixed 3-day window
  const generateDateRange = () => {
    const today = new Date();
    const startDate = addDays(today, dateOffset);
    // Always exactly 3 consecutive days
    const dates: Date[] = Array.from({ length: 3 }, (_, i) => addDays(startDate, i));
    return dates;
  };

  const dates = generateDateRange();

  // Get zoom-based dimensions that ONLY affect calendar grid
  const getZoomDimensions = (): ZoomDimensions => {
    const availableWidth = dates.length <= 7 ? 'auto' : 'scroll';
    
    switch (zoomLevel) {
      case 'xs': return { dateWidth: 180, hourWidth: 18, widthMode: availableWidth, showHourLabels: true, hourTextSize: '10px' };
      case 'sm': return { dateWidth: 220, hourWidth: 22, widthMode: availableWidth, showHourLabels: true, hourTextSize: '11px' };
      case 'md': return { dateWidth: 280, hourWidth: 28, widthMode: availableWidth, showHourLabels: true, hourTextSize: '12px' };
      case 'lg': return { dateWidth: 340, hourWidth: 34, widthMode: availableWidth, showHourLabels: true, hourTextSize: '13px' };
      case 'xl': return { dateWidth: 400, hourWidth: 40, widthMode: 'scroll', showHourLabels: true, hourTextSize: '14px' };
      case 'xxl': return { dateWidth: 500, hourWidth: 50, widthMode: 'scroll', showHourLabels: true, hourTextSize: '15px' };
    }
  };

  const dimensions = getZoomDimensions();

  useEffect(() => {
    loadAssignedJobs();
  }, [technicians, dates.length, settings.includeWeekends, dateOffset]);

  const handleDragOver = (e: React.DragEvent, technicianId: string, date: Date, hour: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    // Enhanced drag over feedback with debouncing
    const newSlot = { technicianId, date, hour };
    if (!dragOverSlot || 
        dragOverSlot.technicianId !== newSlot.technicianId ||
        !isSameDay(dragOverSlot.date, newSlot.date) ||
        dragOverSlot.hour !== newSlot.hour) {
      setDragOverSlot(newSlot);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear drag over if we're actually leaving the calendar area
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest('.calendar-drop-zone')) {
      setDragOverSlot(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, technicianId: string, date: Date, hour: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot(null);
    
    // Add loading state for better UX
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.classList.add('processing-drop');
    
    try {
      const dataText = e.dataTransfer.getData('application/json');
      if (!dataText) {
        throw new Error('No drag data found');
      }
      
      const data: DragData & { timestamp?: number } = JSON.parse(dataText);
      
      // Validate drag data
      if (!data.type || data.type !== 'job' || !data.item) {
        throw new Error('Invalid drag data format');
      }
      
      // Check for stale drag data (older than 30 seconds)
      if (data.timestamp && Date.now() - data.timestamp > 30000) {
        throw new Error('Drag operation timed out');
      }
      
      const job = data.item as Job;
      const scheduledStart = new Date(date);
      scheduledStart.setHours(hour, 0, 0, 0);
      
      // Set default duration to 3 hours when job is dropped
      const scheduledEnd = addHours(scheduledStart, 3);
      
      console.log('Assigning job:', {
        jobId: job.id,
        technicianId,
        scheduledStart,
        scheduledEnd
      });
      
      // Visual feedback during assignment
      toast.loading("Assigning job...", { id: `assign-${job.id}` });
      
      await DispatcherService.assignJob(job.id, technicianId, scheduledStart, scheduledEnd);
      onJobAssignment(job.id, technicianId, scheduledStart, scheduledEnd);
      
      // Reload assigned jobs to show the new assignment
      loadAssignedJobs();
      
      toast.success("Job assigned successfully!", { id: `assign-${job.id}` });
      
      // Add success animation
      dropZone.classList.add('drop-success');
      setTimeout(() => dropZone.classList.remove('drop-success'), 500);
      
    } catch (error) {
      console.error('Failed to assign job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign job';
      toast.error(errorMessage, { id: `assign-error-${Date.now()}` });
      
      // Add error animation
      dropZone.classList.add('drop-error');
      setTimeout(() => dropZone.classList.remove('drop-error'), 500);
    } finally {
      dropZone.classList.remove('processing-drop');
    }
  };

  const handleJobResize = async (jobId: string, newEnd: Date) => {
    try {
      await DispatcherService.resizeJob(jobId, newEnd);
      loadAssignedJobs();
      toast.success("Job duration updated!");
    } catch (error) {
      console.error('Failed to resize job:', error);
      toast.error("Failed to update job duration");
    }
  };

  const handleJobClick = (job: Job) => {
    if (job.isLocked) {
      toast.info("This job is locked and cannot be modified");
      return;
    }
    setSelectedJob(job);
    setShowConfirmModal(true);
  };

  const handleConfirmJob = async () => {
    if (!selectedJob) return;
    
    try {
      await DispatcherService.lockJob(selectedJob.id);
      loadAssignedJobs();
      setShowConfirmModal(false);
      setSelectedJob(null);
      toast.success("Job confirmed and locked!");
    } catch (error) {
      console.error('Failed to lock job:', error);
      toast.error("Failed to confirm job");
    }
  };

  const handleUnassignJob = async () => {
    if (!selectedJob) return;
    
    try {
      await DispatcherService.unassignJob(selectedJob.id);
      loadAssignedJobs();
      setShowConfirmModal(false);
      setSelectedJob(null);
      toast.success("Job unassigned successfully!");
    } catch (error) {
      console.error('Failed to unassign job:', error);
      toast.error("Failed to unassign job");
    }
  };

  const loadAssignedJobs = () => {
    console.log('Loading assigned jobs...');
    const jobs: Record<string, Job[]> = {};
    technicians.forEach(technician => {
      dates.forEach(date => {
        const techJobs = DispatcherService.getAssignedJobs(technician.id, date);
        const key = `${technician.id}-${format(date, 'yyyy-MM-dd')}`;
        jobs[key] = techJobs;
        
        if (techJobs.length > 0) {
          console.log(`Jobs for ${technician.firstName} on ${format(date, 'yyyy-MM-dd')}:`, techJobs);
        }
      });
    });
    console.log('All assigned jobs:', jobs);
    setAssignedJobs(jobs);
  };

  // preview handler updates previewJobs map without persisting to service
  const handlePreviewResize = (jobId: string, newEnd: Date) => {
    setPreviewJobs(prev => {
      // find job location in current assignedJobs
      const updated = { ...prev };
      for (const key of Object.keys(assignedJobs)) {
        const idx = assignedJobs[key].findIndex(j => j.id === jobId);
        if (idx >= 0) {
          const cloned = assignedJobs[key].map(j => ({ ...j }));
          cloned[idx].scheduledEnd = newEnd;
          updated[key] = cloned;
          return updated;
        }
      }
      return prev;
    });
  };

  const navigateDays = (direction: 'prev' | 'next') => {
    const step = 3; // fixed navigation step
    setDateOffset(prev => prev + (direction === 'next' ? step : -step));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      <CalendarControls
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        dateOffset={dateOffset}
        setDateOffset={setDateOffset}
        settings={settings}
        datesLength={dates.length}
        onNavigateDays={navigateDays}
      />

      {showSettings && (
        <CalendarSettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
        />
      )}

      <CalendarHeader
        dates={dates}
        workingHours={workingHours}
        dimensions={dimensions}
        includeWeekends={settings.includeWeekends}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-full">
          <TechnicianList technicians={displayedTechnicians} />
          
          <CalendarGrid
            dates={dates}
            technicians={displayedTechnicians}
            workingHours={workingHours}
            // merged assigned jobs with preview overlay (previewJobs wins)
            assignedJobs={{ ...assignedJobs, ...previewJobs }}
            dimensions={dimensions}
            dragOverSlot={dragOverSlot}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onJobResize={handleJobResize}
            onJobClick={handleJobClick}
            onPreviewResize={handlePreviewResize}
            includeWeekends={settings.includeWeekends}
          />
          
          <JobConfirmationModal
            job={selectedJob}
            technician={selectedJob ? displayedTechnicians.find(t => t.id === selectedJob.assignedTechnicianId) || null : null}
            open={showConfirmModal}
            onOpenChange={setShowConfirmModal}
            onConfirm={handleConfirmJob}
            onCancel={() => {
              setShowConfirmModal(false);
              setSelectedJob(null);
            }}
            onUnassign={handleUnassignJob}
          />
        </div>
      </div>
    </div>
  );
}