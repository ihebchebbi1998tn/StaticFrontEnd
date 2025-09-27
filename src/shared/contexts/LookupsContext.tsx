import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Import default data from JSON files
import defaultTaskStatusesData from '@/data/mock/taskStatuses.json';
import defaultEventTypesData from '@/data/mock/eventTypes.json';
import defaultServiceCategoriesData from '@/data/mock/serviceCategories.json';
import defaultCurrenciesData from '@/data/mock/currencies.json';
import defaultPrioritiesData from '@/data/mock/priorities.json';

// Use types from API
import type { LookupItem } from '@/services/lookupsApi';
export type { LookupItem } from '@/services/lookupsApi';

interface LookupsContextType {
  taskStatuses: LookupItem[];
  eventTypes: LookupItem[];
  serviceCategories: LookupItem[];
  currencies: LookupItem[];
  priorities: LookupItem[];
  setDefaultCurrency: (id: string) => void;
  updateTaskStatuses: (statuses: LookupItem[]) => void;
  updateEventTypes: (types: LookupItem[]) => void;
  updateServiceCategories: (categories: LookupItem[]) => void;
  updatePriorities: (list: LookupItem[]) => void;
  getPriorityById: (id: string) => LookupItem | undefined;
  getTaskStatusById: (id: string) => LookupItem | undefined;
  getEventTypeById: (id: string) => LookupItem | undefined;
  getServiceCategoryById: (id: string) => LookupItem | undefined;
}

// Convert JSON data to LookupItem format
const defaultTaskStatuses: LookupItem[] = defaultTaskStatusesData.map(item => ({
  id: item.id,
  name: item.name,
  color: item.color,
  description: item.description,
  sortOrder: item.position,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  isActive: true, // Default to active
}));

const defaultEventTypes: LookupItem[] = defaultEventTypesData.map(item => ({
  id: item.id,
  name: item.name,
  color: item.color,
  description: item.description,
  sortOrder: item.position,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  isActive: true, // Default to active
}));

const defaultServiceCategories: LookupItem[] = defaultServiceCategoriesData.map(item => ({
  id: item.id,
  name: item.name,
  color: item.color,
  description: item.description,
  sortOrder: item.position,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  isActive: true, // Default to active
}));

const defaultCurrencies: LookupItem[] = defaultCurrenciesData.map(item => ({
  id: item.id,
  name: item.name,
  description: item.symbol,
  isActive: true, // Default to active
}));

const defaultPriorities: LookupItem[] = defaultPrioritiesData.map(item => ({
  id: item.id,
  name: item.name,
  color: item.color,
  isActive: true, // Default to active
}));

import { LookupsService } from '@/modules/lookups/services/mockLookupsService';

// Update the LookupsContext to use API service instead of localStorage
const LookupsContext = createContext<LookupsContextType | undefined>(undefined);

export function LookupsProvider({ children }: { children: ReactNode }) {
  // Use API-backed service for all data
  const [taskStatuses, setTaskStatuses] = useState<LookupItem[]>([]);
  const [eventTypes, setEventTypes] = useState<LookupItem[]>([]);
  const [serviceCategories, setServiceCategories] = useState<LookupItem[]>([]);
  const [currencies, setCurrencies] = useState<LookupItem[]>([]);
  const [priorities, setPriorities] = useState<LookupItem[]>([]);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasks, events, services, currenciesData, prioritiesData] = await Promise.all([
          LookupsService.getTaskStatusesAsync(),
          LookupsService.getEventTypesAsync(),
          LookupsService.getServiceCategoriesAsync(),
          LookupsService.getCurrenciesAsync(),
          LookupsService.getPrioritiesAsync(),
        ]);
        
        setTaskStatuses(tasks);
        setEventTypes(events);
        setServiceCategories(services);
        setCurrencies(currenciesData);
        setPriorities(prioritiesData);
      } catch (error) {
        console.error('Failed to load lookup data from API:', error);
        // Fallback to localStorage if API fails
        setTaskStatuses(LookupsService.getTaskStatuses());
        setEventTypes(LookupsService.getEventTypes());
        setServiceCategories(LookupsService.getServiceCategories());
        setCurrencies(LookupsService.getCurrencies());
        setPriorities(LookupsService.getPriorities());
      }
    };
    
    loadData();
  }, []);

  const updateTaskStatuses = (statuses: LookupItem[]) => {
    setTaskStatuses(statuses);
  };

  const updateEventTypes = (types: LookupItem[]) => {
    setEventTypes(types);
  };


  const updatePriorities = (list: LookupItem[]) => setPriorities(list);

  const updateServiceCategories = (categories: LookupItem[]) => {
    setServiceCategories(categories);
  };

  const setDefaultCurrency = (id: string) => {
    const updated = currencies.map(c => ({ ...c, isDefault: c.id === id }));
    setCurrencies(updated);
  };

  // (updatePriorities already defined earlier)

  const getTaskStatusById = (id: string) => {
    return taskStatuses.find(status => status.id === id);
  };

  const getEventTypeById = (id: string) => {
    return eventTypes.find(type => type.id === id);
  };

  const getServiceCategoryById = (id: string) => {
    return serviceCategories.find(category => category.id === id);
  };

  const getPriorityById = (id: string) => priorities.find(p => p.id === id);

  const value = {
    taskStatuses,
    eventTypes,
    serviceCategories,
    currencies,
  priorities,
    setDefaultCurrency,
    updateTaskStatuses,
    updateEventTypes,
    updateServiceCategories,
  updatePriorities,
  getPriorityById,
    getTaskStatusById,
    getEventTypeById,
    getServiceCategoryById
  };


  return (
    <LookupsContext.Provider value={value}>
      {children}
    </LookupsContext.Provider>
  );
}

export function useLookups() {
  const context = useContext(LookupsContext);
  if (context === undefined) {
    throw new Error('useLookups must be used within a LookupsProvider');
  }
  return context;
}