export interface Job {
  id: string;
  serviceOrderId: string;
  title: string;
  description?: string;
  status: 'unassigned' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number; // minutes
  requiredSkills: string[];
  assignedTechnicianId?: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  isLocked?: boolean;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  customerName: string;
  customerPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  status: 'available' | 'busy' | 'offline' | 'on_leave' | 'not_working' | 'over_capacity';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  avatar?: string;
  workingHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
  };
}

export interface ServiceOrder {
  id: string;
  title: string;
  customerName: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  jobs: Job[];
  totalEstimatedDuration: number;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  createdAt: Date;
}

export interface CalendarTimeSlot {
  hour: number;
  minute: number;
  date: Date;
}

export interface DragData {
  type: 'job' | 'serviceOrder';
  item: Job | ServiceOrder;
  sourceTechnicianId?: string;
}

export interface CalendarViewType {
  type: 'day' | 'week';
  startDate: Date;
  endDate: Date;
}