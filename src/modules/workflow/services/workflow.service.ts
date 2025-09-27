import { 
  WorkflowOffer, 
  WorkflowSale, 
  WorkflowServiceOrder, 
  WorkflowDispatch,
  WorkflowTechnician,
  WorkflowActivity,
  WorkflowNotification,
  QuickCreateWorkflowData 
} from '../types';

// Mock data - will be replaced with actual API calls
let mockOffers: WorkflowOffer[] = [];
let mockSales: WorkflowSale[] = [];
let mockServiceOrders: WorkflowServiceOrder[] = [];
let mockTechnicians: WorkflowTechnician[] = [];
let mockActivities: WorkflowActivity[] = [];
let mockNotifications: WorkflowNotification[] = [];

// Initialize with mock data
const initializeMockData = () => {
  if (mockTechnicians.length === 0) {
    mockTechnicians = [
      {
        id: 'tech-1',
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '+33 6 12 34 56 78',
        status: 'available',
        skills: ['plumbing', 'heating'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'tech-2', 
        name: 'Marie Martin',
        email: 'marie@example.com',
        phone: '+33 6 87 65 43 21',
        status: 'busy',
        skills: ['electrical', 'maintenance'],
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      }
    ];
  }

  if (mockOffers.length === 0) {
    mockOffers = [
      {
        id: 'WF-OFFER-001',
        title: 'Installation système chauffage',
        contactId: 'CONT-001',
        items: [
          {
            id: 'item-1',
            itemCode: 'CHF-001',
            itemName: 'Chaudière condensation',
            type: 'article',
            quantity: 1,
            unitPrice: 2500,
            totalPrice: 2500
          }
        ],
        amount: 2500,
        status: 'sent',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        shareLink: 'https://app.example.com/offers/WF-OFFER-001/public',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
};

export class WorkflowService {
  static async createWorkflow(data: QuickCreateWorkflowData): Promise<{ offerId: string; saleId?: string; serviceOrderId?: string }> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 200));

    // Create offer
    const newOffer: WorkflowOffer = {
      id: `WF-OFFER-${String(mockOffers.length + 1).padStart(3, '0')}`,
      title: `Devis pour ${data.items[0]?.itemName || 'Services'}`,
      contactId: data.contactId,
      items: data.items,
      amount: data.pricing.total,
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockOffers.push(newOffer);

    const result: { offerId: string; saleId?: string; serviceOrderId?: string } = {
      offerId: newOffer.id
    };

    // Auto-create sale if requested
    if (data.notifications.autoCreateSale) {
      const newSale: WorkflowSale = {
        id: `WF-SALE-${String(mockSales.length + 1).padStart(3, '0')}`,
        title: newOffer.title,
        contactId: data.contactId,
        offerId: newOffer.id,
        items: data.items,
        totalAmount: data.pricing.total,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockSales.push(newSale);
      result.saleId = newSale.id;

      // Create service order if services exist
      const hasServices = data.items.some(item => item.type === 'service');
      if (hasServices) {
        const newServiceOrder: WorkflowServiceOrder = {
          id: `WF-SO-${String(mockServiceOrders.length + 1).padStart(3, '0')}`,
          title: `Service pour ${newSale.title}`,
          contactId: data.contactId,
          saleId: newSale.id,
          status: 'pending',
          priority: 'medium',
          dispatches: [],
          completionPercentage: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        mockServiceOrders.push(newServiceOrder);
        result.serviceOrderId = newServiceOrder.id;
      }
    }

    return result;
  }

  static async getOffers(contactId?: string): Promise<WorkflowOffer[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filtered = [...mockOffers];
    if (contactId) {
      filtered = filtered.filter(offer => offer.contactId === contactId);
    }
    
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async getSales(contactId?: string): Promise<WorkflowSale[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filtered = [...mockSales];
    if (contactId) {
      filtered = filtered.filter(sale => sale.contactId === contactId);
    }
    
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async getServiceOrders(contactId?: string): Promise<WorkflowServiceOrder[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filtered = [...mockServiceOrders];
    if (contactId) {
      filtered = filtered.filter(so => so.contactId === contactId);
    }
    
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async getTechnicians(): Promise<WorkflowTechnician[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockTechnicians];
  }

  static async updateDispatchStatus(dispatchId: string, status: WorkflowDispatch['status'], technicianId?: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Find and update dispatch
    for (const serviceOrder of mockServiceOrders) {
      const dispatch = serviceOrder.dispatches.find(d => d.id === dispatchId);
      if (dispatch) {
        dispatch.status = status;
        dispatch.updatedAt = new Date();
        
        if (technicianId) {
          const technician = mockTechnicians.find(t => t.id === technicianId);
          if (technician) {
            dispatch.assignedTechnician = technician;
          }
        }

        // Update service order completion percentage
        const totalDispatches = serviceOrder.dispatches.length;
        const completedDispatches = serviceOrder.dispatches.filter(d => d.status === 'completed').length;
        serviceOrder.completionPercentage = totalDispatches > 0 ? (completedDispatches / totalDispatches) * 100 : 0;
        
        break;
      }
    }
  }

  static async createDispatch(serviceOrderId: string, dispatchData: Partial<WorkflowDispatch>): Promise<WorkflowDispatch> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const serviceOrder = mockServiceOrders.find(so => so.id === serviceOrderId);
    if (!serviceOrder) {
      throw new Error('Service Order not found');
    }

    const newDispatch: WorkflowDispatch = {
      id: `DISPATCH-${String(Date.now()).slice(-6)}`,
      serviceOrderId,
      title: dispatchData.title || 'Nouvelle intervention',
      description: dispatchData.description,
      status: dispatchData.status || 'scheduled',
      priority: dispatchData.priority || 'medium',
      assignedTechnician: dispatchData.assignedTechnician,
      startAt: dispatchData.startAt,
      endAt: dispatchData.endAt,
      estimatedDuration: dispatchData.estimatedDuration || 120,
      location: dispatchData.location || { address: '' },
      tags: dispatchData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    serviceOrder.dispatches.push(newDispatch);
    return newDispatch;
  }

  static async getActivities(relatedId?: string): Promise<WorkflowActivity[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filtered = [...mockActivities];
    if (relatedId) {
      filtered = filtered.filter(activity => activity.relatedId === relatedId);
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static async getNotifications(): Promise<WorkflowNotification[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
}