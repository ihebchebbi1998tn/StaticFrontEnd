import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomCalendar } from '../components/CustomCalendar';
import { UserFilter } from '../components/UserFilter';
import { useTimeExpenseData } from '../hooks/useTimeExpenseData';
import { TimeExpenseFilters } from '../types';

export default function TimeExpensesPage() {
  console.log('TimeExpensesPage rendering');
  const { t } = useTranslation();
  const { users, getFilteredEntries, loading, error } = useTimeExpenseData();

  // State management - Always call hooks in the same order
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Initialize filters with current month
  const [filters, setFilters] = useState<TimeExpenseFilters>({
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date()
    },
    users: [],
    types: [],
    status: []
  });

  // Get filtered data - Always call useMemo in the same order
  const filteredEntries = useMemo(() => {
    console.log('useMemo filteredEntries recalculating');
    return getFilteredEntries(filters);
  }, [filters, getFilteredEntries]);

  // Conditional rendering without early returns to maintain hook order
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common:loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive font-medium mb-2">{t('common:error')}</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('time-expenses:title')}
          </h1>
          <p className="text-muted-foreground">
            {t('time-expenses:subtitle')}
          </p>
        </div>

        {/* Technician Filter */}
        <div className="w-full sm:w-80">
          <UserFilter
            users={users}
            selectedUsers={filters.users}
            onUsersChange={(userIds) => 
              setFilters(prev => ({ ...prev, users: userIds }))
            }
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-6xl mx-auto">
        <CustomCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          entries={filteredEntries}
          className="w-full"
        />
      </div>
    </div>
  );
}