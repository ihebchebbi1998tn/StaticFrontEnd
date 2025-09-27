export interface Installation {
  id: string;
  name: string;
  model: string;
  description: string;
  location: string;
  manufacturer: string;
  hasWarranty: boolean;
  warrantyFrom?: Date;
  warrantyTo?: Date;
  type: 'internal' | 'external';
  
  // Customer Information
  customer: {
    id: string;
    company: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  
  // Service Orders relationship
  relatedServiceOrders: string[];
  
  // Timestamps and user tracking
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface InstallationFilters {
  type?: Installation['type'][];
  manufacturer?: string[];
  hasWarranty?: boolean;
  customer?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

export interface CreateInstallationData {
  name: string;
  model: string;
  description: string;
  location: string;
  manufacturer: string;
  hasWarranty: boolean;
  warrantyFrom?: Date;
  warrantyTo?: Date;
  type: Installation['type'];
  customer: Installation['customer'];
}