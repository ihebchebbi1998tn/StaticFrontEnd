import type { Job, Technician, ServiceOrder } from '../types';

// Mock data for development
const mockJobs: Job[] = [
  {
    id: 'job-1',
    serviceOrderId: 'so-1',
    title: 'Engine Repair',
    description: 'Replace faulty engine components',
    status: 'unassigned',
    priority: 'high',
    estimatedDuration: 180, // 3 hours
    requiredSkills: ['engine_repair', 'diagnostics'],
    location: {
      address: '123 Main St, City Center',
      lat: 40.7128,
      lng: -74.0060
    },
    customerName: 'John Smith',
    customerPhone: '+1-555-123-4567',
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00')
  },
  {
    id: 'job-2',
    serviceOrderId: 'so-1',
    title: 'Body Paint Touch-up',
    description: 'Minor scratches and paint restoration',
    status: 'unassigned',
    priority: 'medium',
    estimatedDuration: 120, // 2 hours
    requiredSkills: ['painting', 'body_work'],
    location: {
      address: '123 Main St, City Center',
      lat: 40.7128,
      lng: -74.0060
    },
    customerName: 'John Smith',
    customerPhone: '+1-555-123-4567',
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00')
  },
  {
    id: 'job-3',
    serviceOrderId: 'so-2',
    title: 'Air Conditioning Service',
    description: 'AC system inspection and repair',
    status: 'unassigned',
    priority: 'urgent',
    estimatedDuration: 90, // 1.5 hours
    requiredSkills: ['hvac', 'electrical'],
    location: {
      address: '456 Oak Avenue, Downtown',
      lat: 40.7589,
      lng: -73.9851
    },
    customerName: 'Sarah Johnson',
    customerPhone: '+1-555-987-6543',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00')
  }
];

const mockTechnicians: Technician[] = [
  {
    id: 'tech-1',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    email: 'mike.rodriguez@company.com',
    phone: '+1-555-111-2222',
    skills: ['engine_repair', 'diagnostics', 'electrical'],
    status: 'available',
    workingHours: { start: '08:00', end: '17:00' },
    avatar: '/placeholder.svg'
  },
  {
    id: 'tech-2',
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.chen@company.com',
    phone: '+1-555-333-4444',
    skills: ['painting', 'body_work', 'detailing'],
    status: 'available',
    workingHours: { start: '09:00', end: '18:00' },
    avatar: '/placeholder.svg'
  },
  {
    id: 'tech-3',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@company.com',
    phone: '+1-555-555-6666',
    skills: ['hvac', 'electrical', 'diagnostics'],
    status: 'busy',
    workingHours: { start: '07:00', end: '16:00' },
    avatar: '/placeholder.svg'
  },
  {
    id: 'tech-4',
    firstName: 'Sarah',
    lastName: 'Thompson',
    email: 'sarah.thompson@company.com',
    phone: '+1-555-777-8888',
    skills: ['painting', 'body_work', 'inspection'],
    status: 'not_working',
    workingHours: { start: '08:00', end: '17:00' },
    avatar: '/placeholder.svg'
  },
  {
    id: 'tech-5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    phone: '+1-555-999-0000',
    skills: ['engine_repair', 'transmission', 'diagnostics'],
    status: 'over_capacity',
    workingHours: { start: '06:00', end: '15:00' },
    avatar: '/placeholder.svg'
  },
  {
    id: 'tech-6',
    firstName: 'Emily',
    lastName: 'Garcia',
    email: 'emily.garcia@company.com',
    phone: '+1-555-222-3333',
    skills: ['electrical', 'air_conditioning', 'diagnostics'],
    status: 'on_leave',
    workingHours: { start: '09:00', end: '18:00' },
    avatar: '/placeholder.svg'
  },
  {
    id: 'tech-7',
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'robert.martinez@company.com',
    phone: '+1-555-444-5555',
    skills: ['brakes', 'suspension', 'alignment'],
    status: 'available',
    workingHours: { start: '08:00', end: '17:00' },
    avatar: '/placeholder.svg'
  }
];

const mockServiceOrders: ServiceOrder[] = [
  {
    id: 'so-1',
    title: 'Complete Vehicle Service - John Smith',
    customerName: 'John Smith',
    status: 'pending',
    priority: 'high',
    jobs: mockJobs.filter(job => job.serviceOrderId === 'so-1'),
    totalEstimatedDuration: 300, // 5 hours total
    location: {
      address: '123 Main St, City Center',
      lat: 40.7128,
      lng: -74.0060
    },
    createdAt: new Date('2024-01-15T09:00:00')
  },
  {
    id: 'so-2',
    title: 'AC Repair Service - Sarah Johnson',
    customerName: 'Sarah Johnson',
    status: 'pending',
    priority: 'urgent',
    jobs: mockJobs.filter(job => job.serviceOrderId === 'so-2'),
    totalEstimatedDuration: 90,
    location: {
      address: '456 Oak Avenue, Downtown',
      lat: 40.7589,
      lng: -73.9851
    },
    createdAt: new Date('2024-01-15T10:30:00')
  }
];

export class DispatcherService {
  static getUnassignedJobs(): Job[] {
    return mockJobs.filter(job => job.status === 'unassigned');
  }

  static getServiceOrders(): ServiceOrder[] {
    return mockServiceOrders;
  }

  static getTechnicians(): Technician[] {
    return mockTechnicians;
  }

  static assignJob(jobId: string, technicianId: string, scheduledStart: Date, scheduledEnd: Date): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = mockJobs.find(j => j.id === jobId);
        console.log('Assigning job in service:', { jobId, technicianId, scheduledStart, scheduledEnd });
        console.log('Found job:', job);
        
        if (job) {
          job.assignedTechnicianId = technicianId;
          job.scheduledStart = scheduledStart;
          job.scheduledEnd = scheduledEnd;
          job.status = 'assigned';
          job.isLocked = false;
          job.updatedAt = new Date();
          
          console.log('Job after assignment:', job);
        }
        resolve();
      }, 100);
    });
  }

  static lockJob(jobId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = mockJobs.find(j => j.id === jobId);
        if (job) {
          job.isLocked = true;
          job.updatedAt = new Date();
        }
        resolve();
      }, 100);
    });
  }

  static resizeJob(jobId: string, newEnd: Date): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = mockJobs.find(j => j.id === jobId);
        if (job && !job.isLocked) {
          job.scheduledEnd = newEnd;
          job.updatedAt = new Date();
        }
        resolve();
      }, 100);
    });
  }

  static unassignJob(jobId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = mockJobs.find(j => j.id === jobId);
        if (job) {
          job.assignedTechnicianId = undefined;
          job.scheduledStart = undefined;
          job.scheduledEnd = undefined;
          job.status = 'unassigned';
          job.isLocked = false;
          job.updatedAt = new Date();
        }
        resolve();
      }, 100);
    });
  }

  static getAssignedJobs(technicianId: string, date: Date): Job[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const assignedJobs = mockJobs.filter(job => 
      job.assignedTechnicianId === technicianId &&
      job.scheduledStart &&
      job.scheduledStart >= startOfDay &&
      job.scheduledStart <= endOfDay
    );
    
    console.log(`Getting assigned jobs for technician ${technicianId} on ${date.toISOString()}:`, assignedJobs);
    return assignedJobs;
  }

  // Lightweight mock metadata storage for technicians (schedule notes, overrides)
  static setTechnicianMeta(technicianId: string, meta: Record<string, any>): void {
    const tech = mockTechnicians.find(t => t.id === technicianId) as any;
    if (!tech) return;
    tech._meta = { ...(tech._meta || {}), ...meta };
  }

  static getTechnicianMeta(technicianId: string): Record<string, any> | null {
    const tech = mockTechnicians.find(t => t.id === technicianId) as any;
    return tech ? (tech._meta || null) : null;
  }
}