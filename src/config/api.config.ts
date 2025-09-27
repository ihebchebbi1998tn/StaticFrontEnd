// API Configuration - Static only
export const API_CONFIG = {
  // Static configuration - no environment variables
  baseURL: 'https://static-mock-api.com/api',  // Mock URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  
  // Contacts
  CONTACTS: '/contacts',
  CONTACT_BY_ID: (id: string) => `/contacts/${id}`,
  CONTACT_TAGS: '/contacttags', 
  CONTACT_NOTES: '/contactnotes',
  
  // Tasks
  TASKS: '/tasks',
  TASK_BY_ID: (id: string) => `/tasks/${id}`,
  
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id: string) => `/projects/${id}`,
  
  // Calendar
  CALENDAR_EVENTS: '/calendar/events',
  CALENDAR_EVENT_BY_ID: (id: string) => `/calendar/events/${id}`,
  CALENDAR_EVENT_TYPES: '/Calendar/event-types',
  CALENDAR_EVENT_ATTENDEES: '/Calendar/events/attendees',
  CALENDAR_EVENT_REMINDERS: '/Calendar/events/reminders',
  
  // Lookups
  LOOKUPS: '/lookups',
  ARTICLE_CATEGORIES: '/lookups/article-categories',
  TASK_STATUSES: '/lookups/task-statuses',
  EVENT_TYPES: '/lookups/event-types',
  SERVICE_CATEGORIES: '/lookups/service-categories',
  PRIORITIES: '/lookups/priorities',
  TECHNICIAN_STATUSES: '/lookups/technician-statuses',
  LEAVE_TYPES: '/lookups/leave-types',
  PROJECT_STATUSES: '/lookups/project-statuses',
  PROJECT_TYPES: '/lookups/project-types', 
  OFFER_STATUSES: '/lookups/offer-statuses',
  SKILLS: '/lookups/skills',
  COUNTRIES: '/lookups/countries',
  CURRENCIES: '/lookups/currencies',
  
  // Articles
  ARTICLES: '/articles'
};