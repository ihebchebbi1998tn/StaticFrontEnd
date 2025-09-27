
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  RefreshCcw,
  Monitor,
  Menu,
  Users,
  Briefcase
} from "lucide-react";

import { CustomCalendar } from "./CustomCalendar";
import { UnassignedJobsList } from "./UnassignedJobsList";
import { useSidebar } from "@/components/ui/sidebar";
import type { Job, Technician, CalendarViewType } from "../types";
import { DispatcherService } from "../services/dispatcher.service";
import { format, addDays, subDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";

export function DispatchingInterface() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Safely access sidebar controls - may not be available in all contexts
  let setOpen: ((open: boolean) => void) | null = null;
  try {
    const sidebar = useSidebar();
    setOpen = sidebar.setOpen;
  } catch (e) {
    // useSidebar not available in this context, ignore
    console.log('Sidebar context not available');
  }
  const [jobs, setJobs] = useState<Job[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<CalendarViewType>({
    type: 'week',
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date())
  });

  // Mobile detection and UI state
  const [isMobile, setIsMobile] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobsSheetOpen, setIsJobsSheetOpen] = useState(false);
  const [isTechniciansSheetOpen, setIsTechniciansSheetOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setJobs(DispatcherService.getUnassignedJobs());
    setTechnicians(DispatcherService.getTechnicians());
  }, []);

  // Refresh handler to reload jobs & technicians
  const handleRefresh = () => {
    setJobs(DispatcherService.getUnassignedJobs());
    setTechnicians(DispatcherService.getTechnicians());
  };

  const handleJobAssignment = async (jobId: string, technicianId: string, scheduledStart: Date, scheduledEnd: Date) => {
    try {
      await DispatcherService.assignJob(jobId, technicianId, scheduledStart, scheduledEnd);
      setJobs(DispatcherService.getUnassignedJobs());
      // Close mobile sheets after assignment
      if (isMobile) {
        setIsJobsSheetOpen(false);
        setSelectedJob(null);
      }
    } catch (error) {
      console.error('Failed to assign job:', error);
    }
  };

  const handleJobClick = (job: Job) => {
    if (isMobile) {
      setSelectedJob(job);
      setIsJobsSheetOpen(false);
      setIsTechniciansSheetOpen(true);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      
      {/* Header - match Service Orders style */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          {/* Back to list moved to far left */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              try { 
                if (setOpen) setOpen(true); 
              } catch (e) { 
                /* ignore if provider not present */ 
              }
              navigate('/dashboard/field/dispatcher');
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('dispatcher.back_to_list')}
          </Button>
          <div className="p-2 rounded-lg bg-primary/10">
            <CalendarIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t('dispatcher.title')}</h1>
            <p className="text-[11px] text-muted-foreground">{t('dispatcher.description')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            {t('common.update', { defaultValue: 'Update' })}
          </Button>
        </div>
      </header>


      {/* Desktop Layout */}
      {!isMobile && (
        <div className="flex-1 flex w-full overflow-hidden min-h-0">
          {/* Center - Calendar with horizontal scroll container */}
          <div className="flex-1 min-w-0 max-w-[calc(100vw-288px)]">
            <CustomCalendar
              view={calendarView}
              technicians={technicians}
              selectedTechnician={selectedTechnician}
              onJobAssignment={handleJobAssignment}
            />
          </div>

          {/* Right Sidebar - Always visible, fixed width */}
          <div className="w-72 max-w-72 border-l bg-card flex-shrink-0 overflow-hidden">
            <UnassignedJobsList
              jobs={jobs}
              onJobUpdate={() => setJobs(DispatcherService.getUnassignedJobs())}
            />
          </div>
        </div>
      )}

      {/* Mobile Calendar View */}
      {isMobile && (
        <div className="flex-1 w-full overflow-hidden">
          <CustomCalendar
            view={calendarView}
            technicians={technicians}
            selectedTechnician={selectedTechnician}
            onJobAssignment={handleJobAssignment}
            isMobile={true}
          />
        </div>
      )}
    </div>
  );
}
