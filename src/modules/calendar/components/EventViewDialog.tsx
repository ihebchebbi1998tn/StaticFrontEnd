import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarEvent } from "../types";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Edit, 
  Trash2,
  User,
  Target,
  Briefcase,
} from "lucide-react";
import dayjs from "dayjs";

interface EventViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  onEdit: () => void;
  onDelete: (eventId: string) => void;
}

export function EventViewDialog({ 
  open, 
  onOpenChange, 
  event, 
  onEdit, 
  onDelete 
}: EventViewDialogProps) {
  if (!event) return null;

  const getEventTypeIcon = (type: string) => {
    // Keep existing logic but handle string types
    if (type.includes('meeting')) return Users;
    if (type.includes('appointment')) return Clock;
    if (type.includes('project_due')) return Target;
    if (type.includes('project_milestone')) return Briefcase;
    if (type.includes('event')) return Calendar;
    return User; // default
  };

  const getEventTypeColor = (type: string) => {
    // Keep existing logic but handle string types  
    if (type.includes('meeting')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (type.includes('appointment')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (type.includes('project_due')) return 'bg-red-100 text-red-800 border-red-200';
    if (type.includes('project_milestone')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    if (type.includes('event')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200'; // default
  };

  const formatEventType = (type: string) => {
    // Convert type ID back to readable format
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const IconComponent = getEventTypeIcon(event.type);
  const duration = dayjs(event.end).diff(dayjs(event.start), 'minute');
  const isAllDay = dayjs(event.end).diff(dayjs(event.start), 'day') >= 1 && 
                   dayjs(event.start).hour() === 0 && dayjs(event.end).hour() === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-left">
                {event.title}
              </DialogTitle>
              <Badge className={`mt-1 ${getEventTypeColor(event.type)}`}>
                {formatEventType(event.type)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm text-muted-foreground">Date & Time</p>
              <div className="mt-1">
                <p className="font-semibold">
                  {dayjs(event.start).format("dddd, MMMM D, YYYY")}
                </p>
                {isAllDay ? (
                  <p className="text-sm text-muted-foreground">All day</p>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{dayjs(event.start).format("h:mm A")}</span>
                    <span>—</span>
                    <span>{dayjs(event.end).format("h:mm A")}</span>
                    <span className="text-xs">({duration} min)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-muted-foreground">Location</p>
                <p className="mt-1">{event.location}</p>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.trim().length > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-muted-foreground">Attendees</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {event.attendees ? event.attendees.split(',').map((attendee, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {attendee.trim()}
                  </Badge>
                )) : (
                  <p className="text-sm text-muted-foreground">No attendees</p>
                )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-muted-foreground">Description</p>
                <p className="mt-1 text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Event Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Created by {event.createdBy}</span>
            <span>Last updated {dayjs(event.updatedAt).format("MMM D, YYYY")}</span>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onDelete(event.id)}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={onEdit} className="bg-primary text-white hover:bg-primary/90">
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}