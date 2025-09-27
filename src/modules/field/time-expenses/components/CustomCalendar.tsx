import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimeExpenseEntry, DayViewData } from '../types';
import { DayEntriesModal } from './DayEntriesModal';

interface CustomCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  entries: TimeExpenseEntry[];
  className?: string;
}

export function CustomCalendar({ 
  selectedDate, 
  onDateSelect, 
  entries, 
  className 
}: CustomCalendarProps) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayEntries = (date: Date): TimeExpenseEntry[] => {
    return entries.filter(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  const getDayStats = (date: Date): { totalTime: number; totalExpenses: number; count: number } => {
    const dayEntries = getDayEntries(date);
    return {
      totalTime: dayEntries.reduce((sum, entry) => sum + entry.timeBooked, 0),
      totalExpenses: dayEntries.reduce((sum, entry) => sum + entry.expenses, 0),
      count: dayEntries.length
    };
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}${t('time-expenses:time_format.minute_short')}`;
    if (mins === 0) return `${hours}${t('time-expenses:time_format.hour_short')}`;
    return `${hours}${t('time-expenses:time_format.hour_short')} ${mins}${t('time-expenses:time_format.minute_short')}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(amount);
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    setSelectedModalDate(date);
    setShowDayModal(true);
  };

  const handleModalClose = () => {
    setShowDayModal(false);
    setSelectedModalDate(null);
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card className={cn("p-6 shadow-card", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="text-sm"
          >
            {t('time-expenses:calendar.today')}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t('time-expenses:calendar.previous')}</span>
          </Button>
          <Button
            variant="outline"
            size="sm" 
            onClick={nextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t('time-expenses:calendar.next')}</span>
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week Day Headers */}
        {weekDays.map(day => (
          <div 
            key={day}
            className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {dateRange.map(date => {
          const dayStats = getDayStats(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const hasEntries = dayStats.count > 0;

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={cn(
                "h-14 p-2 text-left transition-all rounded-lg border",
                "hover:border-primary hover:shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                {
                  "bg-muted/30 text-muted-foreground": !isCurrentMonth,
                  "bg-primary text-primary-foreground border-primary": isSelected,
                  "border-primary": isTodayDate && !isSelected,
                  "border-border bg-background": !isSelected && !isTodayDate && isCurrentMonth,
                }
              )}
            >
              {/* Date Number and Entry Count */}
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  {
                    "text-primary font-semibold": isTodayDate && !isSelected,
                  }
                )}>
                  {format(date, 'd')}
                </span>
                {hasEntries && (
                  <div className="flex items-center gap-1">
                    {dayStats.totalTime > 0 && (
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                    )}
                    {dayStats.totalExpenses > 0 && (
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                    )}
                    <Badge 
                      variant="secondary" 
                      className="h-4 text-xs px-1.5 bg-accent text-accent-foreground min-w-[16px] flex items-center justify-center"
                    >
                      {dayStats.count}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Compact Stats for Current Month */}
              {hasEntries && isCurrentMonth && (
                <div className="flex items-center justify-between text-xs">
                  {dayStats.totalTime > 0 && (
                    <div className={cn(
                      "flex items-center gap-0.5",
                      isSelected ? "text-primary-foreground/80" : "text-success"
                    )}>
                      <Clock className="h-2.5 w-2.5" />
                      <span className="font-medium">{Math.floor(dayStats.totalTime / 60)}h</span>
                    </div>
                  )}
                  {dayStats.totalExpenses > 0 && (
                    <div className={cn(
                      "flex items-center gap-0.5",
                      isSelected ? "text-primary-foreground/80" : "text-warning"
                    )}>
                      <DollarSign className="h-2.5 w-2.5" />
                      <span className="font-medium">{Math.round(dayStats.totalExpenses)}</span>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded bg-success"></div>
          <span>Time entries</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded bg-warning"></div>
          <span>Expenses</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-6 h-4 rounded border border-primary bg-primary/10"></div>
          <span>{t('time-expenses:calendar.today')}</span>
        </div>
      </div>

      {/* Day Entries Modal */}
      {selectedModalDate && (
        <DayEntriesModal
          isOpen={showDayModal}
          onClose={handleModalClose}
          date={selectedModalDate}
          entries={getDayEntries(selectedModalDate)}
        />
      )}
    </Card>
  );
}