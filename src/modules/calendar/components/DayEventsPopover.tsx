import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent } from "../types";
import { 
  Clock, 
  MapPin, 
  Users, 
  User,
  Target,
  Briefcase,
  Calendar,
  ChevronRight,
  CalendarDays
} from "lucide-react";
import dayjs from "dayjs";

interface DayEventsPopoverProps {
  events: CalendarEvent[];
  date: Date;
  onEventClick: (event: CalendarEvent) => void;
  children: React.ReactNode;
}

export function DayEventsPopover({ 
  events, 
  date, 
  onEventClick, 
  children 
}: DayEventsPopoverProps) {
  if (events.length === 0) return <>{children}</>;

  const getEventTypeIcon = (type: string) => {
    // Handle dynamic string types
    if (type.includes('meeting')) return Users;
    if (type.includes('appointment')) return Clock;
    if (type.includes('project_due')) return Target;
    if (type.includes('project_milestone')) return Briefcase;
    if (type.includes('event')) return Calendar;
    return User; // default
  };

  const getEventTypeColor = (type: string) => {
    // Handle dynamic string types
    if (type.includes('meeting')) return 'bg-blue-500/10 text-blue-700 border-blue-200';
    if (type.includes('appointment')) return 'bg-amber-500/10 text-amber-700 border-amber-200';
    if (type.includes('project_due')) return 'bg-red-500/10 text-red-700 border-red-200';
    if (type.includes('project_milestone')) return 'bg-cyan-500/10 text-cyan-700 border-cyan-200';
    if (type.includes('event')) return 'bg-purple-500/10 text-purple-700 border-purple-200';
    return 'bg-gray-500/10 text-gray-700 border-gray-200'; // default
  };

  const getEventTypeBg = (type: string) => {
    // Handle dynamic string types
    if (type.includes('meeting')) return 'bg-blue-500';
    if (type.includes('appointment')) return 'bg-amber-500';
    if (type.includes('project_due')) return 'bg-red-500';
    if (type.includes('project_milestone')) return 'bg-cyan-500';
    if (type.includes('event')) return 'bg-purple-500';
    return 'bg-gray-500'; // default
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 border-0 shadow-strong z-50" align="start">
        <Card className="border-0 shadow-medium">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {dayjs(date).format("dddd, MMMM D")}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {events.length} event{events.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>
              <Badge variant="secondary" className="font-semibold">
                {events.length}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {events
                .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
                .map((event, index) => {
                const IconComponent = getEventTypeIcon(event.type);
                const isAllDay = dayjs(event.end).diff(dayjs(event.start), 'day') >= 1;
                
                return (
                  <div key={event.id}>
                    <button
                      onClick={() => onEventClick(event)}
                      className="w-full p-4 text-left hover:bg-muted/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getEventTypeBg(event.type)} text-white flex-shrink-0 group-hover:scale-105 transition-transform`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                              {event.title}
                            </h5>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {isAllDay ? (
                              <span className="text-xs text-muted-foreground font-medium">All day</span>
                            ) : (
                              <span className="text-xs text-muted-foreground font-medium">
                                {dayjs(event.start).format("h:mm A")} - {dayjs(event.end).format("h:mm A")}
                              </span>
                            )}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground truncate">{event.location}</span>
                            </div>
                          )}
                          
                          <div className="mt-2">
                            <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                              {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </button>
                    {index < events.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          </CardContent>
          
          <div className="p-3 border-t bg-muted/20">
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
              <Calendar className="h-3 w-3" />
              Click any event to view full details
            </p>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}