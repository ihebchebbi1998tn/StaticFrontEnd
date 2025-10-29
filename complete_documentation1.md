# FlowSolution - Complete Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Architecture](#core-architecture)
5. [Module System](#module-system)
6. [Authentication & Authorization](#authentication--authorization)
7. [State Management](#state-management)
8. [Routing System](#routing-system)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Styling & Design System](#styling--design-system)
11. [Database Schema](#database-schema)
12. [API Integration](#api-integration)
13. [Component Architecture](#component-architecture)
14. [Services & Business Logic](#services--business-logic)
15. [Performance Optimization](#performance-optimization)
16. [Development Guidelines](#development-guidelines)

---

## Overview

**FlowSolution** is a comprehensive Enterprise Resource Planning (ERP) system built with React and TypeScript. It integrates CRM (Customer Relationship Management), Field Service Management, Project Management, Sales, and System Administration into a unified platform.

### Key Features
- **CRM Management**: Contact management, companies, deals, and customer relationships
- **Field Service Operations**: Service orders, installations, technician dispatch, and scheduling
- **Sales Pipeline**: Offers, quotes, sales tracking, and conversion management
- **Project Management**: Project tracking, tasks, and Kanban boards
- **Document Management**: Multi-module document handling with categorization
- **Workflow Automation**: Business process automation and workflow management
- **Calendar & Scheduling**: Event management and resource scheduling
- **Multi-language Support**: English and French with extensible i18n system
- **Role-Based Access Control**: Comprehensive user and permission management
- **Responsive Design**: Mobile-first approach with adaptive layouts

---

## Technology Stack

### Frontend Core
- **React 18.3.1**: UI library with modern hooks and concurrent features
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **React Router DOM 6.26.2**: Client-side routing
- **TanStack Query 5.87.1**: Server state management and caching

### UI Framework & Components
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Re-usable component library based on Radix UI
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Icon library
- **next-themes**: Theme management (dark/light mode)

### Forms & Validation
- **React Hook Form 7.53.0**: Performant form management
- **Zod 3.23.8**: TypeScript-first schema validation

### Data Visualization
- **Recharts 2.12.7**: Composable charting library
- **React Big Calendar 1.19.4**: Calendar component
- **React Data Grid 7.0.0**: High-performance data grids

### Maps & Location
- **Leaflet 1.9.4**: Interactive maps
- **React Leaflet 5.0.0**: React wrapper for Leaflet
- **Mapbox GL 3.14.0**: Advanced mapping features

### Additional Libraries
- **i18next 25.3.2 + react-i18next 15.6.1**: Internationalization
- **date-fns 4.1.0 + dayjs 1.11.13**: Date manipulation
- **axios 1.12.2**: HTTP client
- **@dnd-kit**: Drag and drop functionality
- **xlsx 0.18.5**: Excel file handling
- **@react-pdf/renderer 4.3.0**: PDF generation

### Authentication
- **Clerk React 5.47.0**: Authentication and user management (optional)
- **Custom Auth Service**: Mock authentication for development

---

## Project Structure

```
flowsolution/
├── src/
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles and design tokens
│   │
│   ├── components/                  # Shared UI components
│   │   ├── charts/                  # Chart components (AnalyticsChart, MiniChart, ProgressRing)
│   │   ├── navigation/              # Navigation components (TopNavigation, MobileNavigation)
│   │   ├── providers/               # React context providers
│   │   ├── search/                  # Global search functionality
│   │   ├── shared/                  # Shared utility components
│   │   └── ui/                      # shadcn/ui components
│   │
│   ├── contexts/                    # React context providers
│   │   ├── AuthContext.tsx          # Authentication state management
│   │   ├── PreferencesProvider.tsx  # User preferences management
│   │   └── LookupsContext.tsx       # Lookup data management
│   │
│   ├── modules/                     # Feature modules (see detailed breakdown)
│   │   ├── analytics/               # Analytics and reporting
│   │   ├── articles/                # Product/article inventory
│   │   ├── calendar/                # Calendar and event management
│   │   ├── contacts/                # CRM contact management
│   │   ├── dashboard/               # Main dashboard
│   │   ├── dispatcher/              # Job dispatch and technician management
│   │   ├── documents/               # Document management system
│   │   ├── field/                   # Field service management
│   │   ├── lookups/                 # Reference data management
│   │   ├── offers/                  # Sales offers and quotes
│   │   ├── onboarding/              # User onboarding flow
│   │   ├── projects/                # Project management
│   │   ├── sales/                   # Sales pipeline management
│   │   ├── scheduling/              # Resource scheduling
│   │   ├── support/                 # Customer support module
│   │   ├── system/                  # System administration
│   │   └── workflow/                # Workflow automation
│   │
│   ├── services/                    # Core services
│   │   ├── mockAuthService.ts       # Authentication service
│   │   ├── contactsApi.ts           # Contacts API client
│   │   ├── lookupsApi.ts            # Lookups API client
│   │   └── ...                      # Other API services
│   │
│   ├── shared/                      # Shared utilities across modules
│   │   ├── components/              # Reusable components
│   │   ├── contexts/                # Shared contexts
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # Shared services
│   │   ├── types/                   # Shared TypeScript types
│   │   └── utils/                   # Utility functions
│   │
│   ├── hooks/                       # Application-wide custom hooks
│   │   ├── usePreferences.ts        # User preferences hook
│   │   ├── useTheme.ts              # Theme management hook
│   │   ├── useLayoutMode.ts         # Layout mode hook
│   │   └── use-toast.ts             # Toast notifications hook
│   │
│   ├── lib/                         # Library configurations
│   │   ├── i18n.ts                  # Internationalization setup
│   │   └── utils.ts                 # Utility functions
│   │
│   ├── data/                        # Mock data for development
│   │   └── mock/                    # JSON mock data files
│   │
│   ├── assets/                      # Static assets (images, fonts)
│   │
│   └── pages/                       # Standalone pages
│       ├── MainApp.tsx              # Main application page
│       └── NotFound.tsx             # 404 error page
│
├── production/                      # Production module (separate concern)
│   ├── api/                         # Production-specific APIs
│   ├── components/                  # Production UI components
│   ├── pages/                       # Production pages
│   └── schema/                      # Database schemas
│
├── public/                          # Static public assets
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
└── package.json                     # Project dependencies
```

---

## Core Architecture

### Application Entry Point (`src/main.tsx`)

The application bootstraps with:
1. **Clerk Authentication** (optional): Conditionally wraps app if valid Clerk key exists
2. **React StrictMode**: Enables development-time checks
3. **Root Mounting**: Attaches to DOM element with id="root"

```typescript
// Conditional Clerk integration based on environment variable
const isValidClerkKey = /^pk_(test|live)_.{80,}$/.test(PUBLISHABLE_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isValidClerkKey ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
```

### Main Application Component (`src/App.tsx`)

**Provider Hierarchy (top to bottom):**

```
QueryClientProvider (TanStack Query)
  └─ AuthProvider (Authentication state)
      └─ PreferencesProvider (User preferences)
          └─ PreferencesLoader (Load preferences on mount)
          └─ LoadingProvider (Global loading states)
              └─ LookupsProvider (Reference data)
                  └─ TooltipProvider (UI tooltips)
                      └─ BrowserRouter (Routing)
                          └─ AppErrorBoundary (Error handling)
                              └─ Suspense (Code splitting)
                                  └─ Routes (Application routes)
```

**Key Features:**
- **Theme Initialization**: Loads saved theme preference on mount
- **Idle Preloading**: Preloads critical routes during browser idle time
- **Visit Logging**: Optional telemetry to ntfy.sh
- **Global Progress Bar**: TopProgressBar for navigation feedback
- **Toast Notifications**: Dual toast systems (Toaster + Sonner)
- **Scroll Management**: ScrollToTop component for route changes
- **Error Boundaries**: Graceful error handling with reload option

**Main Routes:**
- `/` → Login page
- `/login` → Login page
- `/user-login` → User-specific login
- `/sso-callback` → SSO callback handler
- `/onboarding` → User onboarding flow
- `/dashboard/*` → Main application dashboard (protected)
- `/support/*` → Customer support module
- `/offers` → Redirects to `/dashboard/offers`
- `/calendar` → Redirects to `/dashboard/calendar`
- `*` → 404 Not Found page

---

## Module System

FlowSolution uses a **modular architecture** where each business domain is encapsulated in its own module with clear boundaries.

### Module Structure Pattern

Each module follows a consistent structure:

```
module-name/
├── components/          # Module-specific UI components
├── pages/              # Module pages
├── hooks/              # Module-specific custom hooks
├── services/           # Business logic and API calls
├── types/              # TypeScript type definitions
├── locale/             # Internationalization files (en.json, fr.json)
├── migrations/         # Database migration definitions (JSON)
├── ModuleName.tsx      # Module root component with routing
└── index.ts            # Module exports
```

### Module Categories

#### 1. CRM Modules

**Contacts Module** (`src/modules/contacts/`)
- **Purpose**: Manage customer and company contacts
- **Key Features**:
  - Contact CRUD operations
  - Company relationships
  - Tags and categorization
  - Notes and history tracking
  - AI-powered column mapping for imports
  - Advanced search and filtering
- **Services**: `ContactService`, `AIColumnMapperService`
- **API Integration**: `contactsApi.ts`, `contactNotesApi.ts`, `contactTagsApi.ts`

**Sales Module** (`src/modules/sales/`)
- **Purpose**: Sales pipeline and deal management
- **Key Features**:
  - Sales stages tracking
  - Deal value and probability
  - Sales forecasting
  - PDF generation for sales documents
  - Conversion from offers
- **Services**: `SalesService`, `PdfSettingsService`

**Offers Module** (`src/modules/offers/`)
- **Purpose**: Quotations and proposals
- **Key Features**:
  - Offer creation and editing
  - Line item management (products/services)
  - Pricing calculations with taxes and discounts
  - Convert to sales or service orders
  - PDF export
  - Templates
- **Services**: `OffersService`, `PdfSettingsService`

**Projects Module** (`src/modules/projects/`)
- **Purpose**: Project and task management
- **Key Features**:
  - Project creation and tracking
  - Task management with Kanban boards
  - Milestone tracking
  - Team assignments
  - Progress monitoring

**Calendar Module** (`src/modules/calendar/`)
- **Purpose**: Event scheduling and calendar management
- **Key Features**:
  - Event creation (meetings, tasks, reminders)
  - Calendar views (month, week, day, agenda)
  - Event types and categorization
  - Recurring events
  - Integration with contacts and projects
- **Services**: `CalendarService`
- **Components**: Uses `react-big-calendar`

**Articles Module** (`src/modules/articles/`)
- **Purpose**: Product and material inventory management
- **Key Features**:
  - SKU management
  - Stock tracking
  - Pricing (cost and sell price)
  - Categories and locations
  - Transfer management
  - Low stock alerts
  - Export functionality
- **Services**: `ArticlesService`
- **Views**: List view, Grid view

**Documents Module** (`src/modules/documents/`)
- **Purpose**: Centralized document management across modules
- **Key Features**:
  - Multi-module attachment (contacts, sales, offers, projects, field)
  - File upload and storage
  - Document preview
  - Comments and sharing
  - Categories: CRM and Field
  - Access control
  - Search and filtering
- **Services**: `DocumentsService`
- **Components**: `DocumentsList`, `DocumentPreviewModal`, `DocumentUploadModal`

**Workflow Module** (`src/modules/workflow/`)
- **Purpose**: Business process automation
- **Key Features**:
  - Workflow designer
  - Trigger conditions
  - Action sequences
  - Email automation
  - Status updates
- **Uses**: `@xyflow/react` for visual workflow design

#### 2. Field Service Modules

**Field Module** (`src/modules/field/`)
- **Purpose**: Core field service management
- **Sub-modules**:
  - **Service Orders**: Work order management
  - **Installations**: Equipment and installation tracking
  - **Time & Expenses**: Time tracking and expense reporting
  - **Field Customers**: Customer management specific to field operations

**Service Orders** (`src/modules/field/service-orders/`)
- **Purpose**: Comprehensive work order lifecycle management
- **Key Features**:
  - Service order creation and tracking
  - Multi-status workflow (draft, confirmed, in progress, completed)
  - Customer and site information
  - Job associations (one service order can have multiple jobs)
  - PDF generation and customization
  - Priority management
  - SLA tracking
- **Entities** (see `entities/` folder):
  - **Technicians**: Technician profiles, skills, certifications, assignments
  - **Materials**: Material usage, requests, and inventory depletion
  - **Dispatches**: Job dispatch to technicians, routes, schedules
  - **Work Details**: Work steps, time entries, checklists, attachments
  - **Financials**: Costs, pricing, payments, invoicing
  - **Communications**: Messages, notifications, templates
  - **Audit**: Change tracking, logs, history
  - **Follow-up**: Post-completion follow-ups, feedback
  - **Jobs**: Individual work items within a service order
- **Services**: `ServiceOrdersService`, `PdfSettingsService`

**Installations** (`src/modules/field/installations/`)
- **Purpose**: Track installed equipment at customer sites
- **Key Features**:
  - Installation records (model, manufacturer, location)
  - Warranty tracking
  - Customer association
  - Related service orders
  - Installation type (internal/external)
  - Maintenance history
- **Types**: `Installation`, `InstallationFilters`, `CreateInstallationData`

**Dispatcher Module** (`src/modules/dispatcher/`)
- **Purpose**: Technician dispatch and job scheduling
- **Key Features**:
  - Unassigned job queue
  - Technician availability tracking
  - Skill-based assignment
  - Real-time location tracking (GPS)
  - Route optimization
  - Drag-and-drop job assignment
  - Calendar view for schedules
  - Workload balancing
- **Services**: `DispatcherService`
- **Types**: `Job`, `Technician`, `ServiceOrder`, `Assignment`

**Scheduling Module** (`src/modules/scheduling/`)
- **Purpose**: Resource scheduling and planning
- **Key Features**:
  - Technician schedule management
  - Job scheduling
  - Calendar integration
  - Conflict detection
  - Meta information storage (custom data per technician)
- **Services**: `SchedulingService` (delegates to `DispatcherService`)

**Time & Expenses** (`src/modules/field/time-expenses/`)
- **Purpose**: Track work time and expenses
- **Key Features**:
  - Time entry logging
  - Expense recording
  - Approval workflows
  - Billable/non-billable categorization
  - Export for invoicing

#### 3. System Modules

**Dashboard Module** (`src/modules/dashboard/`)
- **Purpose**: Main landing page and navigation hub
- **Key Features**:
  - Customizable sidebar
  - Widget-based dashboard
  - Quick stats and KPIs
  - Recent activity feed
  - Quick create actions
  - Module navigation
- **Components**: `DashboardGate` (preloading gate), customizable sidebar
- **Services**: `sidebar.service.ts` (sidebar configuration management)

**Lookups Module** (`src/modules/lookups/`)
- **Purpose**: Manage reference data and dropdown values
- **Key Features**:
  - Task statuses
  - Event types
  - Service categories
  - Currencies
  - Priorities
  - Custom lookup types
  - Color coding
  - Sort ordering
- **Services**: `LookupsService`, `mockLookupsService`
- **Context**: `LookupsContext` (global access to lookup data)

**Support Module** (`src/modules/support/`)
- **Purpose**: Customer support and ticketing system
- **Key Features**:
  - Ticket creation and management
  - FAQ management
  - Ticket replies and threading
  - Status tracking
  - Attachments
  - Ticket reopening
- **Architecture**: Uses ViewModel pattern
- **Components**: `SupportModuleRoutes`
- **Services**: `supportService`
- **ViewModel**: `useSupportViewModel`

**Onboarding Module** (`src/modules/onboarding/`)
- **Purpose**: New user onboarding flow
- **Key Features**:
  - Multi-step wizard
  - User profile setup
  - Preferences configuration
  - Welcome screens
  - Getting started guide

**Analytics Module** (`src/modules/analytics/`)
- **Purpose**: Business intelligence and reporting
- **Key Features**:
  - Event tracking
  - Session analytics
  - Custom metrics
  - Data visualization
- **Types**: `AnalyticsEvent`, `AnalyticsSession`, `AnalyticsMetric`

**Auth Module** (`src/modules/auth/`)
- **Purpose**: Authentication pages and flows
- **Pages**:
  - `Login.tsx`: Admin/owner login
  - `UserLogin.tsx`: Regular user login
- **Integration**: Works with `AuthContext` and `mockAuthService`

#### 4. Production Module

**Production Module** (`production/`)
- **Purpose**: Manufacturing and production management (separate from main app)
- **Key Features**:
  - Production orders
  - Batch management
  - Material configuration
  - Stock validation and merging
  - Size-based production
  - Production tracking
- **Components**: Located in `production/components/`
- **Pages**: Located in `production/pages/`
- **API**: Located in `production/api/`
- **Schema**: Database schemas in `production/schema/`

### Module Export Pattern

Each module exports its public API through `index.ts`:

```typescript
// Example: src/modules/documents/index.ts
export { DocumentsModule } from "./DocumentsModule";
export { DocumentsList } from "./components/DocumentsList";
export { DocumentPreviewModal } from "./components/DocumentPreviewModal";
export { DocumentUploadModal } from "./components/DocumentUploadModal";
export { DocumentFilters } from "./components/DocumentFilters";
export { useDocuments } from "./hooks/useDocuments";
export { DocumentsService } from "./services/documents.service";
export type { 
  Document, 
  DocumentFilters as DocumentFiltersType, 
  DocumentStats, 
  DocumentUploadData 
} from "./types";
```

---

## Authentication & Authorization

### Authentication System

**Core Service**: `src/services/mockAuthService.ts`

**User Data Structure**:
```typescript
interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country: string;
  industry: string;
  companyName?: string;
  companyWebsite?: string;
  preferences?: string;
  onboardingCompleted?: boolean;
  createdAt: string;
  lastLoginAt?: string;
  role?: string;
}
```

**Authentication Flow**:

1. **Login** (`authService.login()`)
   - Mock service accepts any email/password
   - Generates JWT-style tokens (mock)
   - Sets expiration (24 hours)
   - Stores tokens in localStorage
   - Returns user data

2. **Token Management**
   - Access token: 24-hour expiry
   - Refresh token: 7-day expiry
   - Auto-refresh before expiration
   - Token stored in localStorage: `auth_token`, `refresh_token`, `token_expires_at`

3. **Session Persistence**
   - User data cached in localStorage: `auth_user`
   - Automatic session restoration on page reload
   - Token validation on app initialization

4. **Logout** (`authService.logout()`)
   - Clears all auth-related localStorage items
   - Resets auth context state
   - Redirects to login page

### AuthContext (`src/contexts/AuthContext.tsx`)

**Provides**:
- `user`: Current user data or null
- `isLoading`: Authentication initialization status
- `isAuthenticated`: Boolean authentication state
- `login(email, password)`: Admin/owner login function
- `userLogin(email, password)`: Regular user login function
- `signup(email, password, userData)`: User registration
- `logout()`: Logout function
- `updateUser(userData)`: Update current user
- `refreshUser()`: Refresh user data from server

**Features**:
- Automatic token refresh (checks every minute)
- Session restoration on mount
- Token expiration handling
- Graceful error handling

### Protected Routes

**Component**: `src/components/ProtectedRoute.tsx`

```typescript
<ProtectedRoute requireOnboarding={false}>
  <DashboardComponent />
</ProtectedRoute>
```

**Logic**:
1. Check if user is authenticated
2. If not authenticated → redirect to `/login`
3. If authenticated but onboarding required and not completed → redirect to `/onboarding`
4. Otherwise → render children

### Role-Based Access Control (RBAC)

**User Roles** (extensible):
- `owner`: Full system access
- `admin`: Administrative access
- `manager`: Management-level access
- `user`: Standard user access
- `technician`: Field technician access
- `viewer`: Read-only access

**Role Storage**:
- Stored in `UserData.role`
- Can be extended with permissions array

**Usage Pattern**:
```typescript
const { user } = useAuth();
if (user?.role === 'admin' || user?.role === 'owner') {
  // Show admin features
}
```

---

## State Management

### Global State Layers

#### 1. Server State (TanStack Query)

**Configuration**: `src/App.tsx`

```typescript
const queryClient = new QueryClient();
```

**Usage Pattern**:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['contacts'],
  queryFn: () => ContactService.getContacts()
});

// Mutate data
const mutation = useMutation({
  mutationFn: (newContact) => ContactService.createContact(newContact),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['contacts'] });
  }
});
```

**Benefits**:
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

#### 2. Authentication State (Context)

**Provider**: `AuthContext` (`src/contexts/AuthContext.tsx`)

**Usage**:
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

#### 3. Preferences State (Context)

**Provider**: `PreferencesContext` (`src/contexts/PreferencesProvider.tsx`)

**Hook**: `usePreferences()` (`src/hooks/usePreferences.ts`)

**Manages**:
- User interface preferences
- Theme settings
- Language preferences
- Layout modes
- Notification preferences

**Storage**: localStorage with key `user-preferences`

#### 4. Lookups State (Context)

**Provider**: `LookupsContext` (`src/shared/contexts/LookupsContext.tsx`)

**Usage**:
```typescript
const { 
  taskStatuses, 
  eventTypes, 
  serviceCategories, 
  currencies,
  priorities,
  getTaskStatusById 
} = useLookups();
```

**Features**:
- Centralized reference data
- API-backed with localStorage fallback
- Helper functions for ID lookups
- Default value management

#### 5. Loading State (Context)

**Provider**: `LoadingContext` (`src/shared/contexts/LoadingContext.tsx`)

**Usage**:
```typescript
const { loadingState, setLoading, withLoading } = useLoading();

// Manual control
setLoading(true, 'Processing...', 0);

// Automatic wrapper
await withLoading(async () => {
  await someAsyncOperation();
}, 'Loading data...');
```

**Features**:
- Global loading indicator
- Progress tracking (0-100)
- Loading messages
- Automatic progress simulation

#### 6. Layout Mode State (Context)

**Provider**: `LayoutModeProvider` (`src/components/providers/LayoutModeProvider.tsx`)

**Hook**: `useLayoutMode()` (`src/hooks/useLayoutMode.ts`)

**Manages**:
- Desktop/mobile layout modes
- Sidebar visibility
- Responsive layout behavior

### Component-Level State

**Patterns Used**:
1. **useState**: Local component state
2. **useReducer**: Complex state logic
3. **useRef**: DOM references and mutable values
4. **Custom hooks**: Reusable stateful logic

### Data Flow Pattern

```
User Action
  ↓
Component Event Handler
  ↓
Service Function (API call)
  ↓
TanStack Query Mutation/Query
  ↓
Cache Update / Background Refetch
  ↓
Component Re-render
  ↓
UI Update
```

---

## Routing System

### Router Configuration

**Library**: React Router DOM v6.26.2

**Router Type**: BrowserRouter

**Location**: `src/App.tsx`

### Route Structure

```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/user-login" element={<UserLogin />} />
  <Route path="/sso-callback" element={<SSOCallback />} />
  <Route path="/onboarding" element={<Onboarding />} />
  
  {/* Redirects for standalone paths */}
  <Route path="/offers" element={<Navigate to="/dashboard/offers" replace />} />
  <Route path="/offers/*" element={<Navigate to="/dashboard/offers" replace />} />
  <Route path="/calendar" element={<Navigate to="/dashboard/calendar" replace />} />
  <Route path="/calendar/*" element={<Navigate to="/dashboard/calendar" replace />} />
  
  {/* Protected Routes */}
  <Route path="/dashboard/*" element={<DashboardGate />} />
  
  {/* Module Routes */}
  <Route path="/support/*" element={<SupportModuleRoutes />} />
  
  {/* 404 Catch-all */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Navigation Components

#### TopNavigation (`src/components/navigation/TopNavigation.tsx`)

**Features**:
- Company branding with logo
- Global search modal
- Quick create menu
- User profile dropdown
- Theme switcher
- Language selector
- Notification center
- Mobile hamburger menu

**Navigation Items**:
- Dynamically loaded from sidebar configuration
- Grouped by category (Workspace, CRM, Service, System)
- Icon-based navigation
- Preloading on hover (performance optimization)

#### MobileNavigation (`src/components/navigation/MobileNavigation.tsx`)

**Features**:
- Bottom navigation bar for mobile
- Quick access to main sections
- Active route highlighting
- Overflow menu for additional items

### Route Preloading

**Purpose**: Improve perceived performance by preloading routes during idle time

**Implementation**: `src/shared/prefetch.ts`

```typescript
// Preload routes during browser idle
runWhenIdle(() => {
  preloadDashboard();
  preloadOnboarding();
  preloadSupport();
  preloadLogin();
}, 800);
```

**Functions**:
- `runWhenIdle(callback, delay)`: Execute during idle time
- `preloadDashboard()`: Preload dashboard module
- `preloadSupport()`: Preload support module
- `preloadOnboarding()`: Preload onboarding module
- `preloadLogin()`: Preload login pages

### Scroll Management

**Component**: `ScrollToTop` (`src/shared/components/ScrollToTop.tsx`)

**Behavior**: Automatically scrolls to top on route change

### Lazy Loading & Code Splitting

**Pattern**: React.lazy() + Suspense

```typescript
<Suspense fallback={<AppLoader />}>
  <Routes>
    {/* Routes */}
  </Routes>
</Suspense>
```

**Lazy-loaded Modules**:
- Dashboard module
- Individual module routes
- Heavy components (maps, charts)

---

## Internationalization (i18n)

### Configuration

**Library**: i18next + react-i18next

**Setup File**: `src/lib/i18n.ts`

**Supported Languages**:
- English (en) - Default
- French (fr)

### Translation Structure

**Storage**: `localStorage` key: `language`

**Namespace Organization**:
```
translation (default)
  ├── auth (authentication strings)
  ├── footer (footer strings)
  ├── common (shared strings)
  ├── contacts.* (contacts module)
  ├── field.* (field module)
  ├── service_orders (service orders)
  ├── installations.* (installations)
  ├── offers.* (offers module)
  ├── sales.* (sales module)
  ├── documents.* (documents module)
  ├── lookups.* (lookups module)
  ├── workflow.* (workflow module)
  ├── dispatcher.* (dispatcher module)
  ├── scheduling.* (scheduling module)
  └── dashboard.* (dashboard module)

job-detail (namespace)
dispatches (namespace)
attachments (namespace)
notes (namespace)
time-booking (namespace)
technician (namespace)
expense-booking (namespace)
common (namespace)
time-expenses (namespace)
```

### Translation Files Location

**Module Pattern**:
```
src/modules/<module-name>/locale/
  ├── en.json
  └── fr.json
```

**Sub-module Pattern**:
```
src/modules/<module-name>/<sub-module>/locales/
  ├── en.json
  ├── fr.json
  └── <component-name>/
      ├── en.json
      └── fr.json
```

### Usage in Components

**Basic Usage**:
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <h1>{t('auth.welcome')}</h1>
  );
}
```

**With Namespace**:
```typescript
const { t } = useTranslation('job-detail');
return <h2>{t('title')}</h2>;
```

**With Interpolation**:
```typescript
t('greeting', { name: user.firstName }) 
// "Hello, {{name}}" → "Hello, John"
```

**Language Switching**:
```typescript
import i18n from '@/lib/i18n';

// Change language
i18n.changeLanguage('fr');

// Get current language
const currentLang = i18n.language; // 'en' or 'fr'
```

### Translation Keys Structure

**Format**: `module.section.key`

**Examples**:
- `auth.welcome` → "Welcome to FlowSolution"
- `contacts.add_contact` → "Add Contact"
- `service_orders.status.pending` → "Pending"
- `documents.upload_success` → "Document uploaded successfully"

### Fallback Strategy

1. Try requested key in current language
2. Try default namespace translation
3. Try fallback language (en)
4. Return key name if not found

---

## Styling & Design System

### Design System Architecture

**Approach**: Semantic token-based design system using CSS variables

**Configuration Files**:
- `src/index.css`: CSS variable definitions
- `tailwind.config.ts`: Tailwind CSS configuration

### Color System

**Semantic Tokens** (defined in `index.css`):

```css
:root {
  /* Base Colors */
  --background: <hsl>;
  --foreground: <hsl>;
  
  /* Brand Colors */
  --primary: <hsl>;
  --primary-foreground: <hsl>;
  --primary-hover: <hsl>;
  --primary-light: <hsl>;
  
  --secondary: <hsl>;
  --secondary-foreground: <hsl>;
  
  --accent: <hsl>;
  --accent-foreground: <hsl>;
  --accent-hover: <hsl>;
  --accent-light: <hsl>;
  
  /* UI Colors */
  --card: <hsl>;
  --card-foreground: <hsl>;
  
  --popover: <hsl>;
  --popover-foreground: <hsl>;
  
  --muted: <hsl>;
  --muted-foreground: <hsl>;
  
  /* Semantic Colors */
  --destructive: <hsl>;
  --destructive-foreground: <hsl>;
  
  --success: <hsl>;
  --success-foreground: <hsl>;
  
  --warning: <hsl>;
  --warning-foreground: <hsl>;
  
  --info: <hsl>;
  --info-foreground: <hsl>;
  
  /* Form Elements */
  --border: <hsl>;
  --input: <hsl>;
  --ring: <hsl>;
  
  /* Sidebar */
  --sidebar-background: <hsl>;
  --sidebar-foreground: <hsl>;
  --sidebar-primary: <hsl>;
  --sidebar-primary-foreground: <hsl>;
  --sidebar-accent: <hsl>;
  --sidebar-accent-foreground: <hsl>;
  --sidebar-border: <hsl>;
  --sidebar-ring: <hsl>;
}

/* Dark mode overrides */
.dark {
  --background: <hsl>;
  --foreground: <hsl>;
  /* ... other dark mode colors */
}
```

**Tailwind Usage**:
```typescript
// ❌ WRONG - Direct color usage
<div className="bg-white text-black">

// ✅ CORRECT - Semantic tokens
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-card text-card-foreground border border-border">
```

### Typography

**Font Families** (tailwind.config.ts):
```typescript
fontFamily: {
  geist: ['Geist', 'sans-serif'],
  poppins: ['Poppins', 'sans-serif'],
  sans: ['Geist', 'Poppins', 'sans-serif'],
}
```

**Usage**:
```typescript
<h1 className="font-geist text-4xl font-bold">
<p className="font-poppins text-base">
```

### Spacing & Sizing

**Tailwind Standard Scale**: Uses Tailwind's default spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, etc.)

**Container**:
```typescript
container: {
  center: true,
  padding: '2rem',
  screens: {
    '2xl': '1400px'
  }
}
```

### Border Radius

**Variables**:
```css
--radius: 0.5rem; /* 8px */
```

**Tailwind Classes**:
- `rounded-lg`: `var(--radius)`
- `rounded-md`: `calc(var(--radius) - 2px)`
- `rounded-sm`: `calc(var(--radius) - 4px)`

### Animations

**Keyframes** (tailwind.config.ts):

```typescript
keyframes: {
  'accordion-down': { /* Radix accordion animation */ },
  'accordion-up': { /* Radix accordion animation */ },
  'fade-in': { 
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  },
  'scale-in': {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' }
  },
  'slide-in-right': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' }
  }
}
```

**Animation Classes**:
- `animate-fade-in`: Fade and slide up
- `animate-scale-in`: Scale and fade in
- `animate-slide-in-right`: Slide from right
- `animate-accordion-down`: Accordion open
- `animate-accordion-up`: Accordion close

### Theme System

**Provider**: next-themes

**Themes**:
- `light`: Light mode
- `dark`: Dark mode
- `system`: Follow OS preference

**Usage**:
```typescript
import { useTheme } from '@/hooks/useTheme';

const { theme, setTheme } = useTheme();

// Set theme
setTheme('dark');
setTheme('light');
setTheme('system');
```

**Storage**: localStorage key: `flowsolution-theme`

### Component Variants

**Pattern**: class-variance-authority (cva)

**Example**: Button variants
```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "base classes here",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Responsive Design

**Breakpoints** (Tailwind defaults):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Usage**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="text-sm md:text-base lg:text-lg">
```

### shadcn/ui Components

**Location**: `src/components/ui/`

**Philosophy**: Copy-paste components, fully customizable

**Key Components**:
- Button, Badge, Card, Dialog, DropdownMenu
- Input, Label, Select, Checkbox, RadioGroup
- Sheet, Popover, Tooltip, Toast
- Table, Tabs, Accordion, Collapsible
- Avatar, Progress, Separator
- And many more...

**Customization**: Modify component files directly in `src/components/ui/`

---

## Database Schema

### Schema Convention

All database tables follow a strict naming convention:

- **`CRM.*`**: Customer Relationship Management tables
- **`FIELD.*`**: Field Service Management tables
- **`LU.*`**: Lookup/Reference tables
- **`SYS.*`**: System configuration and management tables

### Key Tables Overview

#### CRM Schema

**CRM.contacts**
- Customer and company contact information
- Tags, notes, and status tracking
- Relationships to offers, sales, projects

**CRM.offers**
- Quotations and proposals
- Line items (products/services)
- Pricing, taxes, discounts
- Conversion tracking

**CRM.sales**
- Sales deals and pipeline stages
- Value, probability, close date
- Related contacts and offers

**CRM.projects**
- Project records with timelines
- Team assignments
- Milestones and deliverables

**CRM.project_tasks**
- Individual tasks within projects
- Status, priority, assignments
- Dependencies

**CRM.calendar_events**
- Events, meetings, reminders
- Event types and participants
- Recurring event support

**CRM.documents**
- File storage metadata
- Module associations (polymorphic)
- Comments and sharing

**CRM.articles**
- Product/service catalog
- SKU, pricing, stock levels
- Categories and locations

#### FIELD Schema

**FIELD.service_orders**
- Work order master records
- Customer, site, priority
- Status workflow tracking
- Related jobs

**FIELD.jobs**
- Individual work items within service orders
- Installation associations (mandatory)
- Work type, estimated duration
- Progress tracking

**FIELD.installations**
- Equipment/installation records
- Customer sites
- Warranty information
- Maintenance history

**FIELD.technicians**
- Technician profiles
- Skills and certifications
- Current location (GPS)
- Availability

**FIELD.dispatches**
- Job assignments to technicians
- Scheduled dates/times
- Routes and travel time
- Status tracking

**FIELD.technician_assignments**
- Assignment details
- Role (primary/assistant/supervisor)
- Estimated vs actual hours

**FIELD.materials**
- Material/part inventory
- Stock levels
- Suppliers

**FIELD.material_usage**
- Material consumption per service order
- Costs and approvals

**FIELD.time_entries**
- Work time logging
- Billable/non-billable
- Approval workflow

**FIELD.work_steps**
- Step-by-step work procedures
- Completion tracking
- Photos and notes

**FIELD.checklists**
- Quality assurance checklists
- Required checks
- Completion status

#### LU Schema (Lookups)

**LU.task_statuses**
- Task status types
- Colors and ordering

**LU.event_types**
- Calendar event categories
- Colors and descriptions

**LU.service_categories**
- Service type classifications
- Colors and ordering

**LU.currencies**
- Currency codes and symbols

**LU.priorities**
- Priority levels
- Colors

#### SYS Schema (System)

**SYS.users**
- User accounts
- Authentication data
- Roles and permissions

**SYS.roles**
- Role definitions
- Permission sets

**SYS.audit_trail**
- Change tracking across all entities
- Who, what, when logging

**SYS.settings**
- System-wide configuration
- User preferences

**SYS.notifications**
- Notification queue
- Read status

### Migration Management

**Location**: `src/modules/<module>/migrations/`

**Format**: JSON schema definitions

**Example Structure**:
```json
{
  "module": "contacts",
  "version": "001",
  "description": "CRM contacts and companies tables",
  "tables": [
    {
      "name": "CRM.contacts",
      "primaryKey": "id",
      "fields": {
        "id": { "type": "string", "required": true },
        "firstName": { "type": "string", "required": true },
        "email": { "type": "string", "unique": true },
        "createdAt": { "type": "datetime", "required": true },
        "createdBy": { 
          "type": "string", 
          "foreignKey": "SYS.users.id" 
        }
      },
      "indexes": ["email", "createdAt"]
    }
  ]
}
```

**Data Types**:
- `string`: Text fields
- `integer`: Whole numbers
- `decimal`: Numeric with decimals
- `datetime`: Timestamp with timezone
- `date`: Date only
- `time`: Time only
- `boolean`: True/false
- `json`: JSON objects
- `array`: Arrays of strings or IDs

---

## API Integration

### API Client Pattern

**Structure**: Service classes encapsulate API calls

**Example**: `src/services/contactsApi.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = '/api';

export const contactsApi = {
  // GET all contacts
  getAll: async (): Promise<Contact[]> => {
    const response = await axios.get(`${API_BASE_URL}/contacts`);
    return response.data;
  },
  
  // GET single contact
  getById: async (id: string): Promise<Contact> => {
    const response = await axios.get(`${API_BASE_URL}/contacts/${id}`);
    return response.data;
  },
  
  // POST create contact
  create: async (data: CreateContactData): Promise<Contact> => {
    const response = await axios.post(`${API_BASE_URL}/contacts`, data);
    return response.data;
  },
  
  // PUT update contact
  update: async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const response = await axios.put(`${API_BASE_URL}/contacts/${id}`, data);
    return response.data;
  },
  
  // DELETE contact
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/contacts/${id}`);
  }
};
```

### Service Layer Pattern

**Purpose**: Abstract API calls and provide business logic

**Example**: `src/modules/contacts/services/contacts.service.ts`

```typescript
import { contactsApi } from '@/services/contactsApi';

export const ContactService = {
  async getContacts(filters?: ContactFilters): Promise<Contact[]> {
    const contacts = await contactsApi.getAll();
    // Apply filters, sorting, business logic
    return applyFilters(contacts, filters);
  },
  
  async createContact(data: CreateContactData): Promise<Contact> {
    // Validation, transformation
    const validated = validateContactData(data);
    return await contactsApi.create(validated);
  },
  
  // Additional business logic methods
  async archiveContact(id: string): Promise<void> {
    return await contactsApi.update(id, { archived: true });
  }
};
```

### HTTP Client Configuration

**Library**: Axios 1.12.2

**Interceptors** (can be added):
```typescript
// Request interceptor (auth tokens, etc.)
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (error handling, etc.)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

### API Integration with TanStack Query

**Pattern**: Service functions + TanStack Query hooks

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactService } from '../services/contacts.service';

export function useContacts(filters?: ContactFilters) {
  return useQuery({
    queryKey: ['contacts', filters],
    queryFn: () => ContactService.getContacts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateContactData) => ContactService.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
```

### Mock Data Strategy

**Development Mode**: Use mock JSON data

**Location**: `src/data/mock/*.json`

**Service Pattern**:
```typescript
import mockData from '@/data/mock/contacts.json';

const STORAGE_KEY = 'contacts-data';

function load(): Contact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return mockData as Contact[];
}

function save(list: Contact[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const ContactService = {
  list: () => load(),
  getById: (id: string) => load().find(c => c.id === id),
  create: (data: CreateContactData) => {
    const newContact = { ...data, id: generateId() };
    const all = [...load(), newContact];
    save(all);
    return newContact;
  },
  // ...
};
```

**Transition to Real API**:
1. Keep service interface identical
2. Replace localStorage operations with API calls
3. No component changes needed

---

## Component Architecture

### Component Organization

**Hierarchy**:
```
src/
├── components/                  # Global shared components
│   ├── ui/                      # shadcn/ui primitives
│   ├── charts/                  # Chart components
│   ├── navigation/              # Navigation components
│   ├── search/                  # Global search
│   └── shared/                  # Shared utilities
│
├── modules/<module>/
│   └── components/              # Module-specific components
│
└── shared/
    └── components/              # Shared across modules
```

### Component Types

#### 1. Presentation Components

**Purpose**: Pure UI, no business logic

**Example**: `Button`, `Card`, `Badge`

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md',
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

#### 2. Container Components

**Purpose**: Manage data and state

**Example**: Contact list container

```typescript
export function ContactsList() {
  const [filters, setFilters] = useState<ContactFilters>({});
  const { data: contacts, isLoading } = useContacts(filters);
  const deleteMutation = useDeleteContact();
  
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  
  if (isLoading) return <Loader />;
  
  return (
    <ContactsListView 
      contacts={contacts}
      onDelete={handleDelete}
      onFilter={setFilters}
    />
  );
}
```

#### 3. Layout Components

**Purpose**: Page structure and composition

**Example**: Dashboard layout

```typescript
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <TopNavigation />
        {children}
      </main>
    </div>
  );
}
```

#### 4. Form Components

**Purpose**: Form handling with validation

**Pattern**: React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm({ onSubmit }: ContactFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('firstName')} />
      {form.formState.errors.firstName && (
        <ErrorMessage>{form.formState.errors.firstName.message}</ErrorMessage>
      )}
      {/* More fields */}
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

#### 5. Modal/Dialog Components

**Pattern**: Radix Dialog + controlled state

```typescript
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{itemName}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Component Patterns

#### 1. Compound Components

**Example**: Card with sub-components

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### 2. Render Props

**Example**: Data table with custom cell renderers

```typescript
<DataTable
  data={contacts}
  columns={[
    { 
      key: 'name', 
      header: 'Name',
      render: (contact) => (
        <div className="flex items-center gap-2">
          <Avatar src={contact.avatar} />
          <span>{contact.name}</span>
        </div>
      )
    }
  ]}
/>
```

#### 3. Higher-Order Components (HOC)

**Example**: WithAuth wrapper

```typescript
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return <Loader />;
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

#### 4. Custom Hooks Pattern

**Example**: useContacts hook

```typescript
export function useContacts(filters?: ContactFilters) {
  const [search, setSearch] = useState('');
  
  const query = useQuery({
    queryKey: ['contacts', filters, search],
    queryFn: () => ContactService.getContacts({ ...filters, search }),
  });
  
  return {
    ...query,
    search,
    setSearch,
  };
}
```

### Component Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Composition Over Inheritance**: Build complex UIs from simple components
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Default Props**: Use default parameters or default values
5. **Memoization**: Use React.memo for expensive renders
6. **Ref Forwarding**: Forward refs when necessary for parent control
7. **Error Boundaries**: Wrap risky components in error boundaries
8. **Loading States**: Always handle loading and error states
9. **Accessibility**: Use semantic HTML and ARIA attributes
10. **Testability**: Write components that are easy to test

---

## Services & Business Logic

### Service Layer Architecture

**Purpose**: Encapsulate business logic and API calls

**Location**: `src/modules/<module>/services/`

**Responsibilities**:
- API communication
- Data transformation
- Business rule enforcement
- Caching strategies
- Error handling

### Service Patterns

#### 1. CRUD Service

**Pattern**: Standard create, read, update, delete operations

**Example**: Articles Service

```typescript
// src/modules/articles/services/articles.service.ts
export const ArticlesService = {
  list(): InventoryArticle[] {
    return load(); // from localStorage or API
  },
  
  getById(id: string): InventoryArticle | undefined {
    return load().find(a => String(a.id) === String(id));
  },
  
  upsert(item: InventoryArticle): void {
    const all = load();
    const idx = all.findIndex(a => String(a.id) === String(item.id));
    if (idx >= 0) all[idx] = item; 
    else all.push(item);
    save(all);
  },
  
  remove(id: string): void {
    const all = load().filter(a => String(a.id) !== String(id));
    save(all);
  }
};
```

#### 2. Stateful Service (Singleton)

**Pattern**: Class-based service with internal state

**Example**: Dispatcher Service

```typescript
// src/modules/dispatcher/services/dispatcher.service.ts
export class DispatcherService {
  private static technicianMeta: Map<string, Record<string, any>> = new Map();
  
  static getTechnicians(): Technician[] {
    return mockTechnicians;
  }
  
  static getUnassignedJobs(): Job[] {
    return mockJobs.filter(job => job.status === 'unscheduled');
  }
  
  static assignJob(
    jobId: string, 
    technicianId: string, 
    scheduledStart: Date, 
    scheduledEnd: Date
  ): void {
    const job = mockJobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'dispatched';
      job.assignedTechnicians = [technicianId];
      // Update in-memory state
    }
  }
  
  static setTechnicianMeta(technicianId: string, meta: Record<string, any>): void {
    this.technicianMeta.set(technicianId, meta);
  }
  
  static getTechnicianMeta(technicianId: string): Record<string, any> | null {
    return this.technicianMeta.get(technicianId) || null;
  }
}
```

#### 3. Async Service

**Pattern**: Promise-based operations

**Example**: Support Service

```typescript
// src/modules/support/services/supportService.ts
export const supportService = {
  async getFaqList(): Promise<FAQ[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFaqs;
  },
  
  async getTickets(): Promise<Ticket[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTickets;
  },
  
  async createTicket(data: Partial<Ticket>): Promise<Ticket> {
    const newTicket: Ticket = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      status: 'open',
    } as Ticket;
    mockTickets.push(newTicket);
    return newTicket;
  },
  
  async addReply(ticketId: string, message: Message): Promise<Message> {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.messages.push(message);
      ticket.updatedAt = new Date();
    }
    return message;
  }
};
```

#### 4. API Client Service

**Pattern**: Axios-based API wrapper

**Example**: Contacts API

```typescript
// src/services/contactsApi.ts
const API_BASE = '/api';

export const contactsApi = {
  getAll: async (): Promise<Contact[]> => {
    const response = await axios.get(`${API_BASE}/contacts`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Contact> => {
    const response = await axios.get(`${API_BASE}/contacts/${id}`);
    return response.data;
  },
  
  create: async (data: CreateContactData): Promise<Contact> => {
    const response = await axios.post(`${API_BASE}/contacts`, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const response = await axios.put(`${API_BASE}/contacts/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/contacts/${id}`);
  }
};
```

#### 5. Configuration Service

**Pattern**: Settings persistence

**Example**: PDF Settings Service

```typescript
// src/modules/field/service-orders/services/pdfSettings.service.ts
export class PdfSettingsService {
  private static readonly STORAGE_KEY = 'service-order-pdf-settings';
  
  static getSettings(): PdfSettings {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  },
  
  static saveSettings(settings: PdfSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  },
  
  static exportSettings(): void {
    const settings = this.getSettings();
    const blob = new Blob([JSON.stringify(settings, null, 2)], { 
      type: 'application/json' 
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'service-order-pdf-settings.json';
    link.click();
  },
  
  static importSettings(file: File): Promise<PdfSettings> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          this.saveSettings(settings);
          resolve(settings);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }
}
```

### ViewModel Pattern (MVVM)

**Used in**: Support module

**Purpose**: Separate presentation logic from UI

**Example**:

```typescript
// src/modules/support/viewmodel/supportViewModel.ts
export function useSupportViewModel() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
    fetchTickets();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    const data = await supportService.getFaqList();
    setFaqs(data);
    setLoading(false);
  };

  const fetchTickets = async () => {
    setLoading(true);
    const data = await supportService.getTickets();
    setTickets(data);
    setLoading(false);
  };

  const createTicket = async (ticket: Partial<Ticket>): Promise<Ticket> => {
    setLoading(true);
    const created = await supportService.createTicket(ticket);
    await fetchTickets();
    setSelectedTicket(created);
    setLoading(false);
    return created;
  };

  const addReply = async (ticketId: string, message: Partial<Message>): Promise<Message | null> => {
    setLoading(true);
    const created = await supportService.addReply(ticketId, message as Message);
    await fetchTickets();
    // Refresh selected ticket
    if (selectedTicket && selectedTicket.id === ticketId) {
      const refreshed = await supportService.getTicketById(ticketId);
      setSelectedTicket(refreshed);
    }
    setLoading(false);
    return created;
  };

  return {
    faqs,
    tickets,
    selectedTicket,
    loading,
    fetchFaqs,
    fetchTickets,
    selectTicket: async (id: string) => {
      const ticket = await supportService.getTicketById(id);
      setSelectedTicket(ticket || null);
    },
    createTicket,
    addReply,
    reopenTicket: async (id: string) => {
      await supportService.reopenTicket(id);
      await fetchTickets();
    },
    updateTicketStatus: async (id: string, status: string) => {
      await supportService.updateTicketStatus(id, status);
      await fetchTickets();
    }
  };
}
```

**Usage in Component**:
```typescript
export function SupportDashboard() {
  const vm = useSupportViewModel();
  
  return (
    <div>
      {vm.loading && <Loader />}
      <TicketsList 
        tickets={vm.tickets} 
        onSelect={vm.selectTicket}
      />
      {vm.selectedTicket && (
        <TicketDetail 
          ticket={vm.selectedTicket}
          onReply={vm.addReply}
        />
      )}
    </div>
  );
}
```

### Service Delegation Pattern

**Example**: Scheduling delegates to Dispatcher

```typescript
// src/modules/scheduling/services/scheduling.service.ts
import { DispatcherService } from '../../dispatcher/services/dispatcher.service';

export class SchedulingService {
  static getTechnicians(): Technician[] {
    return DispatcherService.getTechnicians();
  }

  static getUnassignedJobs(): Job[] {
    return DispatcherService.getUnassignedJobs();
  }

  static setTechnicianMeta(technicianId: string, meta: Record<string, any>): void {
    DispatcherService.setTechnicianMeta(technicianId, meta);
  }

  static getTechnicianMeta(technicianId: string): Record<string, any> | null {
    return DispatcherService.getTechnicianMeta(technicianId);
  }
}
```

**Benefits**:
- Single source of truth
- Avoids data duplication
- Maintains consistency across modules

---

## Performance Optimization

### Code Splitting & Lazy Loading

**Implementation**: React.lazy() + Suspense

```typescript
// Lazy load routes
const DashboardGate = lazy(() => import('./modules/dashboard/components/DashboardGate'));
const SupportModuleRoutes = lazy(() => import('./modules/support/SupportModuleRoutes'));

// Usage
<Suspense fallback={<AppLoader />}>
  <Routes>
    <Route path="/dashboard/*" element={<DashboardGate />} />
  </Routes>
</Suspense>
```

### Route Preloading

**Strategy**: Preload critical routes during idle time

**Implementation**: `src/shared/prefetch.ts`

```typescript
export function runWhenIdle(callback: () => void, delay: number = 0) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => setTimeout(callback, delay));
  } else {
    setTimeout(callback, delay);
  }
}

export function preloadDashboard() {
  import('./modules/dashboard/components/DashboardGate');
}

export function preloadSupport() {
  import('./modules/support/SupportModuleRoutes');
}
```

### Memoization

**React.memo**: Prevent unnecessary re-renders

```typescript
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

**useMemo**: Memoize computed values

```typescript
const sortedContacts = useMemo(() => {
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}, [contacts]);
```

**useCallback**: Memoize function references

```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### TanStack Query Optimizations

**Stale Time**: Reduce unnecessary refetches

```typescript
const { data } = useQuery({
  queryKey: ['contacts'],
  queryFn: fetchContacts,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

**Cache Time**: Keep data in cache

```typescript
const { data } = useQuery({
  queryKey: ['contacts'],
  queryFn: fetchContacts,
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

**Prefetching**: Preload data before needed

```typescript
const queryClient = useQueryClient();

function prefetchContact(id: string) {
  queryClient.prefetchQuery({
    queryKey: ['contact', id],
    queryFn: () => fetchContact(id),
  });
}
```

### Virtual Scrolling

**Library**: react-window

**Use Case**: Long lists (thousands of items)

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={contacts.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ContactRow contact={contacts[index]} />
    </div>
  )}
</FixedSizeList>
```

### Image Optimization

**Lazy Loading**: Native lazy loading

```typescript
<img src={url} alt={alt} loading="lazy" />
```

**Responsive Images**: Serve appropriate sizes

```typescript
<img 
  srcSet={`
    ${smallUrl} 400w,
    ${mediumUrl} 800w,
    ${largeUrl} 1200w
  `}
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  src={mediumUrl}
  alt={alt}
/>
```

### Bundle Size Optimization

**Tree Shaking**: Import only what's needed

```typescript
// ❌ Imports entire library
import _ from 'lodash';

// ✅ Imports only debounce
import debounce from 'lodash/debounce';
```

**Dynamic Imports**: Load code on demand

```typescript
const handleExport = async () => {
  const { exportToExcel } = await import('./exportUtils');
  exportToExcel(data);
};
```

### Performance Monitoring

**React DevTools Profiler**: Identify slow renders

**Network Tab**: Monitor bundle sizes and load times

**Lighthouse**: Overall performance audit

---

## Development Guidelines

### Code Style

**TypeScript**: Strict mode enabled

**Linting**: ESLint configuration

**Formatting**: Prettier (recommended)

### Naming Conventions

**Files**:
- Components: PascalCase (e.g., `ContactsList.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Services: camelCase with `.service.ts` suffix (e.g., `contacts.service.ts`)
- Types: camelCase with `.types.ts` suffix (e.g., `contact.types.ts`)

**Variables & Functions**:
- camelCase (e.g., `firstName`, `handleClick`)
- Boolean prefixes: `is`, `has`, `should` (e.g., `isLoading`, `hasPermission`)
- Event handlers: `handle` prefix (e.g., `handleSubmit`, `handleDelete`)

**Types & Interfaces**:
- PascalCase (e.g., `Contact`, `ContactFilters`)
- Interfaces don't need `I` prefix
- Props interfaces: `ComponentNameProps` (e.g., `ContactsListProps`)

**Constants**:
- UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`)

### TypeScript Best Practices

1. **Strict Type Checking**: Avoid `any`, use `unknown` if type is truly unknown
2. **Interfaces Over Types**: Use interfaces for object shapes
3. **Utility Types**: Leverage `Partial<T>`, `Pick<T>`, `Omit<T>`, `Required<T>`
4. **Generics**: Use generics for reusable components and functions
5. **Type Guards**: Create type guards for runtime type checking
6. **Enums vs Union Types**: Prefer union types over enums in most cases

### Component Guidelines

1. **Functional Components**: Use function components with hooks
2. **Props Destructuring**: Destructure props in function signature
3. **PropTypes**: Use TypeScript interfaces instead of PropTypes
4. **Default Props**: Use default parameters
5. **Refs**: Forward refs when component needs external control
6. **Error Boundaries**: Wrap risky operations
7. **Loading States**: Always handle loading, error, and empty states
8. **Accessibility**: Use semantic HTML and ARIA attributes

### Git Workflow (Recommended)

**Branch Naming**:
- `feature/feature-name`
- `bugfix/bug-description`
- `hotfix/critical-fix`
- `refactor/refactor-description`

**Commit Messages**:
- Use conventional commits format
- Examples:
  - `feat: add contact filtering`
  - `fix: resolve service order status bug`
  - `refactor: improve dispatcher service`
  - `docs: update README`
  - `style: format code with prettier`

### Testing Strategy (Recommended)

**Unit Tests**: Test individual functions and components

**Integration Tests**: Test component interactions

**E2E Tests**: Test complete user flows

**Libraries to Consider**:
- Vitest (unit/integration testing)
- React Testing Library (component testing)
- Playwright or Cypress (E2E testing)

### Security Best Practices

1. **Input Validation**: Validate all user inputs (Zod schemas)
2. **XSS Prevention**: Sanitize user-generated content
3. **CSRF Protection**: Implement CSRF tokens for state-changing operations
4. **Secure Storage**: Don't store sensitive data in localStorage
5. **HTTPS Only**: Force HTTPS in production
6. **Authentication Tokens**: Use HTTP-only cookies or secure token storage
7. **Authorization**: Implement role-based access control
8. **Audit Logging**: Log security-relevant events

### Deployment Checklist

**Pre-Deployment**:
- [ ] Run production build (`npm run build`)
- [ ] Check bundle size
- [ ] Test in production mode
- [ ] Run Lighthouse audit
- [ ] Check console for errors
- [ ] Verify environment variables
- [ ] Test authentication flows
- [ ] Verify API endpoints

**Production Environment**:
- [ ] Enable HTTPS
- [ ] Set up CDN (if applicable)
- [ ] Configure caching headers
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure analytics
- [ ] Set up backup strategy
- [ ] Document deployment process

### Documentation Standards

**Code Comments**:
- Use JSDoc for functions
- Explain "why" not "what"
- Document complex algorithms
- Add TODO comments for future improvements

**README Files**:
- Module README in each module root
- Include purpose, usage, and examples

**Type Documentation**:
- Document complex types
- Explain non-obvious field purposes

---

## Conclusion

FlowSolution is a comprehensive, modular ERP system built with modern web technologies. Its architecture emphasizes:

- **Modularity**: Clear separation of business domains
- **Type Safety**: TypeScript throughout
- **Performance**: Code splitting, lazy loading, and optimized rendering
- **Maintainability**: Consistent patterns and clear structure
- **Scalability**: Service-oriented architecture ready for growth
- **User Experience**: Responsive design, i18n, and accessibility

### Key Technologies Summary

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Routing** | React Router v6 |
| **State Management** | TanStack Query, React Context |
| **UI Framework** | Tailwind CSS, shadcn/ui, Radix UI |
| **Forms** | React Hook Form, Zod |
| **Data Visualization** | Recharts, React Big Calendar |
| **Maps** | Leaflet, Mapbox GL |
| **i18n** | i18next, react-i18next |
| **HTTP Client** | Axios |
| **Authentication** | Custom + Clerk (optional) |

### Module Breakdown

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **Contacts** | CRM contact management | CRUD, tags, notes, AI import |
| **Sales** | Sales pipeline | Stages, forecasting, PDF |
| **Offers** | Quotations | Line items, conversions |
| **Projects** | Project management | Tasks, Kanban, milestones |
| **Calendar** | Event scheduling | Views, recurring events |
| **Articles** | Inventory | SKU, stock, transfers |
| **Documents** | Document management | Multi-module, preview, sharing |
| **Service Orders** | Field work orders | Jobs, dispatch, tracking |
| **Installations** | Equipment tracking | Warranty, maintenance |
| **Dispatcher** | Job dispatch | Technician assignment, routing |
| **Scheduling** | Resource scheduling | Calendar, conflicts |
| **Dashboard** | Main hub | Widgets, navigation |
| **Lookups** | Reference data | Statuses, types, priorities |
| **Support** | Ticketing | FAQs, replies, status |

### Future Enhancement Opportunities

1. **Real-Time Features**: WebSocket integration for live updates
2. **Offline Support**: Service workers and offline-first architecture
3. **Mobile Apps**: React Native for native mobile apps
4. **Advanced Analytics**: BI dashboards and custom reports
5. **API Gateway**: Centralized API management
6. **Microservices**: Break backend into microservices
7. **GraphQL**: Alternative to REST API
8. **PWA**: Progressive Web App capabilities
9. **AI Integration**: Enhanced AI features (beyond column mapping)
10. **Multi-Tenancy**: Support for multiple organizations

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: FlowSolution Development Team