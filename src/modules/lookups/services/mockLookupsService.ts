// Mock service replacing API calls with local data
import { 
  LookupItem,
  Currency,
  CreateLookupRequest,
  UpdateLookupRequest,
  CreateCurrencyRequest,
  UpdateCurrencyRequest,
  LookupListResponse,
  CurrencyListResponse
} from '@/services/mockLookupsApi';

// Import mock data
import defaultTaskStatusesData from '@/data/mock/taskStatuses.json';
import defaultEventTypesData from '@/data/mock/eventTypes.json';
import defaultServiceCategoriesData from '@/data/mock/serviceCategories.json';
import defaultCurrenciesData from '@/data/mock/currencies.json';
import defaultTechnicianStatusesData from '@/data/mock/technicianStatuses.json';
import defaultLeaveTypesData from '@/data/mock/leaveTypes.json';
import defaultPrioritiesData from '@/data/mock/priorities.json';

// Re-export types
export type { LookupItem, Currency } from '@/services/mockLookupsApi';

const KEYS = {
  task: 'app-task-statuses',
  event: 'app-event-types',
  service: 'app-service-categories',
  technician: 'app-technician-statuses',
  leave: 'app-leave-types',
  priorities: 'app-priorities',
  currency: 'app-currencies',
} as const;

function mapDefaults<T extends { id: string; name: string; color?: string; description?: string; isDefault?: boolean; position?: number; createdAt?: string; updatedAt?: string; code?: string }>(arr: T[]): LookupItem[] {
  return arr.map(item => ({
    id: item.id,
    name: item.name,
    color: item.color,
    description: item.description ?? item.code,
    isDefault: item.isDefault,
    sortOrder: item.position,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isActive: true, // Default to active for mock data
  }));
}

const defaults = {
  task: mapDefaults(defaultTaskStatusesData as any[]),
  event: mapDefaults(defaultEventTypesData as any[]),
  service: mapDefaults(defaultServiceCategoriesData as any[]),
  technicianStatuses: mapDefaults(defaultTechnicianStatusesData as any[]),
  leaveTypes: mapDefaults(defaultLeaveTypesData as any[]),
  priorities: mapDefaults(defaultPrioritiesData as any[]),
  currency: mapDefaults(defaultCurrenciesData as any[]),
};

function load(key: string, fallback: LookupItem[]): LookupItem[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as LookupItem[];
  } catch {}
  return fallback;
}

function save(key: string, list: LookupItem[]) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch {}
}

export const LookupsService = {
  // Task Statuses - using mock data only
  async getTaskStatusesAsync(): Promise<LookupItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return load(KEYS.task, defaults.task);
  },
  getTaskStatuses(): LookupItem[] { return load(KEYS.task, defaults.task); },
  setTaskStatuses(list: LookupItem[]) { save(KEYS.task, list); },

  // Event Types - using mock data only
  async getEventTypesAsync(): Promise<LookupItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return load(KEYS.event, defaults.event);
  },
  getEventTypes(): LookupItem[] { return load(KEYS.event, defaults.event); },
  setEventTypes(list: LookupItem[]) { save(KEYS.event, list); },

  // Service Categories - using mock data only
  async getServiceCategoriesAsync(): Promise<LookupItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return load(KEYS.service, defaults.service);
  },
  getServiceCategories(): LookupItem[] { return load(KEYS.service, defaults.service); },
  setServiceCategories(list: LookupItem[]) { save(KEYS.service, list); },

  // Technician Statuses - using mock data only
  async getTechnicianStatusesAsync(): Promise<LookupItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return load(KEYS.technician, defaults.technicianStatuses);
  },
  getTechnicianStatuses(): LookupItem[] { return load(KEYS.technician, defaults.technicianStatuses); },
  setTechnicianStatuses(list: LookupItem[]) { save(KEYS.technician, list); },

  // Leave Types - using mock data only
  async getLeaveTypesAsync(): Promise<LookupItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return load(KEYS.leave, defaults.leaveTypes);
  },
  getLeaveTypes(): LookupItem[] { return load(KEYS.leave, defaults.leaveTypes); },
  setLeaveTypes(list: LookupItem[]) { save(KEYS.leave, list); },

  // Priorities - using mock data only
  async getPrioritiesAsync(): Promise<LookupItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return load(KEYS.priorities, defaults.priorities);
  },
  getPriorities(): LookupItem[] { return load(KEYS.priorities, defaults.priorities); },
  setPriorities(list: LookupItem[]) { save(KEYS.priorities, list); },

  // Currencies - using mock data only
  async getCurrenciesAsync(): Promise<LookupItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return load(KEYS.currency, defaults.currency);
  },
  getCurrencies(): LookupItem[] { return load(KEYS.currency, defaults.currency); },
  setCurrencies(list: LookupItem[]) { save(KEYS.currency, list); },
  async setDefaultCurrencyAsync(id: string): Promise<LookupItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.setDefaultCurrency(id);
  },
  setDefaultCurrency(id: string) {
    const list = load(KEYS.currency, defaults.currency).map(c => ({ ...c, isDefault: c.id === id }));
    save(KEYS.currency, list);
    return list;
  },
};