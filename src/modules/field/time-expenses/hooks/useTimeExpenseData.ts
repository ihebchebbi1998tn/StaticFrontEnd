import { useState, useEffect, useMemo, useCallback } from 'react';
import { TimeExpenseEntry, User, TimeExpenseFilters, TimeExpenseSummary } from '../types';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@company.com',
    role: 'Senior Technician',
    hourlyRate: 45,
    avatar: undefined
  },
  {
    id: '2', 
    name: 'Marie Tremblay',
    email: 'marie.tremblay@company.com',
    role: 'Lead Technician',
    hourlyRate: 50,
    avatar: undefined
  },
  {
    id: '3',
    name: 'Pierre Leblanc', 
    email: 'pierre.leblanc@company.com',
    role: 'Technician',
    hourlyRate: 35,
    avatar: undefined
  },
  {
    id: '4',
    name: 'Sophie Martin',
    email: 'sophie.martin@company.com', 
    role: 'Junior Technician',
    hourlyRate: 30,
    avatar: undefined
  }
];

const generateMockEntries = (): TimeExpenseEntry[] => {
  const entries: TimeExpenseEntry[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate 1-3 entries per day randomly
    const entriesPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < entriesPerDay; j++) {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const types: ('time' | 'expense' | 'both')[] = ['time', 'expense', 'both'];
      const type = types[Math.floor(Math.random() * types.length)];
      const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const timeBooked = type === 'expense' ? 0 : Math.floor(Math.random() * 480) + 60; // 1-8 hours
      const expenses = type === 'time' ? 0 : Math.floor(Math.random() * 500) + 50; // $50-550
      
      entries.push({
        id: `entry-${i}-${j}`,
        userId: user.id,
        userName: user.name,
        serviceOrderId: Math.random() > 0.5 ? `SO-${Math.floor(Math.random() * 1000)}` : undefined,
        dispatchId: Math.random() > 0.7 ? `DISP-${Math.floor(Math.random() * 1000)}` : undefined,
        date,
        timeBooked,
        expenses,
        hourlyRate: user.hourlyRate,
        description: `Work description for ${type} entry on ${date.toDateString()}`,
        type,
        status,
        createdAt: new Date(date.getTime() - Math.random() * 86400000), // Random time before date
        updatedAt: date
      });
    }
  }
  
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export function useTimeExpenseData() {
  const [allEntries] = useState<TimeExpenseEntry[]>(() => generateMockEntries());
  const [users] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterEntries = (entries: TimeExpenseEntry[], filters: TimeExpenseFilters): TimeExpenseEntry[] => {
    return entries.filter(entry => {
      // Date range filter
      const entryDate = new Date(entry.date);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      
      if (entryDate < fromDate || entryDate > toDate) {
        return false;
      }

      // User filter
      if (filters.users.length > 0 && !filters.users.includes(entry.userId)) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(entry.type)) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(entry.status)) {
        return false;
      }

      return true;
    });
  };

  const getFilteredEntries = useCallback((filters: TimeExpenseFilters): TimeExpenseEntry[] => {
    console.log('getFilteredEntries called with filters:', filters);
    try {
      setLoading(true);
      const filtered = filterEntries(allEntries, filters);
      setError(null);
      console.log('Filtered entries count:', filtered.length);
      return filtered;
    } catch (err) {
      console.error('Error in getFilteredEntries:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, [allEntries]);

  const getSummaryByUser = useCallback((entries: TimeExpenseEntry[]): TimeExpenseSummary[] => {
    console.log('getSummaryByUser called with entries count:', entries.length);
    const summaryMap = new Map<string, TimeExpenseSummary>();

    entries.forEach(entry => {
      const existing = summaryMap.get(entry.userId);
      const earnings = (entry.timeBooked / 60) * entry.hourlyRate;

      if (existing) {
        existing.totalTimeBooked += entry.timeBooked;
        existing.totalExpenses += entry.expenses;
        existing.totalEarnings += earnings;
        existing.entriesCount += 1;
      } else {
        summaryMap.set(entry.userId, {
          userId: entry.userId,
          userName: entry.userName,
          totalTimeBooked: entry.timeBooked,
          totalExpenses: entry.expenses,
          totalEarnings: earnings,
          entriesCount: 1
        });
      }
    });

    const result = Array.from(summaryMap.values()).sort((a, b) => 
      b.totalEarnings - a.totalEarnings
    );
    console.log('Summary by user result:', result);
    return result;
  }, []);

  return {
    users,
    allEntries,
    getFilteredEntries,
    getSummaryByUser,
    loading,
    error
  };
}