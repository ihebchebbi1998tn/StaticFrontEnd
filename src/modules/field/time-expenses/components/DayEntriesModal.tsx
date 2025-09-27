import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { X, Clock, DollarSign, User, FileText, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TimeExpenseEntry } from '../types';
import { cn } from '@/lib/utils';

interface DayEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  entries: TimeExpenseEntry[];
}

export function DayEntriesModal({ 
  isOpen, 
  onClose, 
  date, 
  entries 
}: DayEntriesModalProps) {
  const { t } = useTranslation();

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time':
        return <Clock className="h-4 w-4" />;
      case 'expense':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const totalTime = entries.reduce((sum, entry) => sum + entry.timeBooked, 0);
  const totalExpenses = entries.reduce((sum, entry) => sum + entry.expenses, 0);
  const totalEarnings = entries.reduce((sum, entry) => sum + (entry.timeBooked / 60) * entry.hourlyRate, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] h-auto p-0 flex flex-col">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {format(date, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center flex-1">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No entries for this date
            </h3>
            <p className="text-sm text-muted-foreground">
              There are no time or expense entries recorded for {format(date, 'MMMM d, yyyy')}.
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Summary Stats */}
            <div className="px-6 pb-4 flex-shrink-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-muted-foreground">Time</span>
                  </div>
                  <div className="font-semibold text-success">
                    {formatTime(totalTime)}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-muted-foreground">Expenses</span>
                  </div>
                  <div className="font-semibold text-warning">
                    {formatCurrency(totalExpenses)}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="flex-shrink-0" />

            {/* Entries List */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px]">
                <div className="p-6 pt-4">
                  <div className="space-y-3">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Description with Icon */}
                          <div className="flex items-start gap-2 mb-2">
                            {getTypeIcon(entry.type)}
                            <p className="font-medium text-foreground">
                              {entry.description}
                            </p>
                          </div>

                          {/* User Info */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <User className="h-3 w-3" />
                            <span>{entry.userName}</span>
                          </div>

                          {/* Service Order */}
                          {entry.serviceOrderId && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <FileText className="h-3 w-3" />
                              <span>SO: {entry.serviceOrderId}</span>
                            </div>
                          )}

                          {/* Details */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            {entry.timeBooked > 0 && (
                              <div className="flex items-center gap-1 text-success">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(entry.timeBooked)}</span>
                              </div>
                            )}
                            {entry.expenses > 0 && (
                              <div className="flex items-center gap-1 text-warning">
                                <DollarSign className="h-3 w-3" />
                                <span>{formatCurrency(entry.expenses)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}