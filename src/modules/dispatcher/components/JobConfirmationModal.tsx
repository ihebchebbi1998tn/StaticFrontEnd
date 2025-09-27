import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import type { Job, Technician } from "../types";

interface JobConfirmationModalProps {
  job: Job | null;
  technician: Technician | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onUnassign: () => void;
}

export function JobConfirmationModal({
  job,
  technician,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  onUnassign
}: JobConfirmationModalProps) {
  if (!job || !technician) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const duration = job.scheduledEnd && job.scheduledStart 
    ? Math.round((job.scheduledEnd.getTime() - job.scheduledStart.getTime()) / (1000 * 60 * 60 * 100)) / 10
    : Math.round(job.estimatedDuration / 60 * 10) / 10;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Confirm Job Assignment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-accent/30 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <Badge variant={getPriorityColor(job.priority)}>
                {job.priority.toUpperCase()}
              </Badge>
            </div>
            
            {job.description && (
              <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{technician.firstName} {technician.lastName}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {job.scheduledStart && format(job.scheduledStart, 'MMM dd, HH:mm')} - 
                  {job.scheduledEnd && format(job.scheduledEnd, 'HH:mm')} 
                  ({duration}h)
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{job.location.address}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Once confirmed, this job will be locked and cannot be moved accidentally. 
              You can still unassign it if needed.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onUnassign}>
            Unassign
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm & Lock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}