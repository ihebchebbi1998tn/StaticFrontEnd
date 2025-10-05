import { Offer, CreateOfferData, OfferFilters, OfferStats, ConvertOfferData } from '../types';

// Mock data - will be replaced with actual API calls
let mockOffers: Offer[] = [];

// Initialize with mock data
const initializeMockData = () => {
  if (mockOffers.length === 0) {
    mockOffers = [
      {
        id: 'OFFER-001',
        title: 'Enterprise Software Package',
        contactId: 'CONT-001',
        contactName: 'John Doe',
        contactCompany: 'Acme Corp',
        contactEmail: 'john@acme.com',
        contactPhone: '+1-555-0123',
        contactAddress: '123 Business St',
        amount: 25000,
        currency: 'USD',
        status: 'sent',
        category: 'big_project',
        source: 'direct_customer',
        description: 'Complete enterprise software solution with support',
        items: [
          {
            id: 'item-1',
            offerId: 'OFFER-001',
            itemId: 'SW-001',
            itemCode: 'SW-001',
            itemName: 'Enterprise Software License',
            type: 'article',
            quantity: 10,
            unitPrice: 2000,
            totalPrice: 20000
          },
          {
            id: 'item-2',
            offerId: 'OFFER-001',
            itemId: 'SRV-001',
            itemCode: 'SRV-001',
            itemName: 'Implementation & Training',
            type: 'service',
            quantity: 40,
            unitPrice: 150,
            totalPrice: 6000
          }
        ],
        assignedTo: 'user-1',
        assignedToName: 'Sales Rep',
        tags: ['enterprise', 'software'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
        createdBy: 'user-1',
        validUntil: new Date('2024-02-10'),
        taxes: 2000,
        discount: 1000,
        totalAmount: 26000
      },
      {
        id: 'OFFER-002',
        title: 'Monthly Consulting Services',
        contactId: 'CONT-002',
        contactName: 'Jane Smith',
        contactCompany: 'Tech Startup',
        contactEmail: 'jane@techstartup.com',
        contactPhone: '+1-555-0124',
        contactAddress: '456 Innovation Ave',
        amount: 5000,
        currency: 'USD',
        status: 'accepted',
        category: 'likely_to_close',
        source: 'referral',
        description: 'Monthly consulting and support services',
        items: [
          {
            id: 'item-3',
            offerId: 'OFFER-002',
            itemId: 'SRV-002',
            itemCode: 'SRV-002',
            itemName: 'Monthly Consulting Hours',
            type: 'service',
            quantity: 40,
            unitPrice: 120,
            totalPrice: 4800
          },
          {
            id: 'item-4',
            offerId: 'OFFER-002',
            itemId: 'SRV-003',
            itemCode: 'SRV-003',
            itemName: 'Technical Support',
            type: 'service',
            quantity: 1,
            unitPrice: 600,
            totalPrice: 600
          }
        ],
        assignedTo: 'user-2',
        assignedToName: 'Consultant',
        tags: ['consulting', 'recurring'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-20'),
        createdBy: 'user-2',
        validUntil: new Date('2024-02-05'),
        taxes: 400,
        discount: 0,
        totalAmount: 5400,
        convertedToSaleId: 'SALE-001',
        convertedAt: new Date('2024-01-20')
      },
      {
        id: 'OFFER-003',
        title: 'Custom Integration Project',
        contactId: 'CONT-003',
        contactName: 'Mike Johnson',
        contactCompany: 'Consulting LLC',
        contactEmail: 'mike@consulting.com',
        contactPhone: '+1-555-0125',
        contactAddress: '789 Professional Blvd',
        amount: 15000,
        currency: 'USD',
        status: 'draft',
        category: 'potential',
        source: 'email_marketing',
        description: 'Custom API integration and data migration',
        items: [
          {
            id: 'item-5',
            offerId: 'OFFER-003',
            itemId: 'SRV-004',
            itemCode: 'SRV-004',
            itemName: 'API Integration Development',
            type: 'service',
            quantity: 80,
            unitPrice: 150,
            totalPrice: 12000
          },
          {
            id: 'item-6',
            offerId: 'OFFER-003',
            itemId: 'SRV-005',
            itemCode: 'SRV-005',
            itemName: 'Data Migration Service',
            type: 'service',
            quantity: 20,
            unitPrice: 200,
            totalPrice: 4000
          }
        ],
        assignedTo: 'user-1',
        assignedToName: 'Technical Lead',
        tags: ['integration', 'custom'],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        createdBy: 'user-1',
        validUntil: new Date('2024-03-20'),
        taxes: 1200,
        discount: 500,
        totalAmount: 15700
      }
    ];
  }
};

export class OffersService {
  static async getOffers(filters?: OfferFilters): Promise<Offer[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredOffers = [...mockOffers];
    
    if (filters) {
      if (filters.status) {
        filteredOffers = filteredOffers.filter(offer => offer.status === filters.status);
      }
      if (filters.category) {
        filteredOffers = filteredOffers.filter(offer => offer.category === filters.category);
      }
      if (filters.source) {
        filteredOffers = filteredOffers.filter(offer => offer.source === filters.source);
      }
      if (filters.contactId) {
        filteredOffers = filteredOffers.filter(offer => offer.contactId === filters.contactId);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOffers = filteredOffers.filter(offer => 
          offer.title.toLowerCase().includes(searchLower) ||
          offer.contactName.toLowerCase().includes(searchLower) ||
          offer.description?.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return filteredOffers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async getOfferById(id: string): Promise<Offer | null> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockOffers.find(offer => offer.id === id) || null;
  }

  static async createOffer(data: CreateOfferData): Promise<Offer> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newOffer: Offer = {
      id: `OFFER-${String(mockOffers.length + 1).padStart(3, '0')}`,
      title: data.title,
      description: data.description || '',
      contactId: data.contactId,
      contactName: data.contactName,
      contactCompany: '',
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      contactAddress: data.contactAddress,
      amount: data.amount,
      currency: data.currency as 'USD' | 'EUR' | 'GBP' | 'TND',
      status: data.status as 'draft' | 'sent',
      category: data.category,
      source: data.source,
      notes: data.notes,
      items: data.items,
      assignedTo: 'current-user',
      assignedToName: 'Current User',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      validUntil: data.validUntil,
      taxes: data.taxes,
      discount: data.discount,
      totalAmount: data.amount + data.taxes - data.discount
    };
    
    mockOffers.push(newOffer);
    return newOffer;
  }

  static async updateOffer(id: string, data: Partial<Offer>): Promise<Offer> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockOffers.findIndex(offer => offer.id === id);
    if (index === -1) {
      throw new Error('Offer not found');
    }
    
    const updatedOffer = {
      ...mockOffers[index],
      ...data,
      updatedAt: new Date(),
    };
    
    // Recalculate total if relevant fields changed
    if (data.amount !== undefined || data.taxes !== undefined || data.discount !== undefined) {
      updatedOffer.totalAmount = (updatedOffer.amount || 0) + (updatedOffer.taxes || 0) - (updatedOffer.discount || 0);
    }
    
    mockOffers[index] = updatedOffer;
    return updatedOffer;
  }

  static async deleteOffer(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockOffers.findIndex(offer => offer.id === id);
    if (index === -1) {
      throw new Error('Offer not found');
    }
    
    mockOffers.splice(index, 1);
  }

  static async convertOffer(data: ConvertOfferData): Promise<{ saleId?: string; serviceOrderId?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const offer = await this.getOfferById(data.offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    // Update offer status to accepted
    await this.updateOffer(data.offerId, { 
      status: 'accepted',
      convertedAt: new Date()
    });

    const result: { saleId?: string; serviceOrderId?: string } = {};

    if (data.convertToSale) {
      // Mock sale creation
      const saleId = `SALE-${String(Date.now()).slice(-6)}`;
      result.saleId = saleId;
      
      // Update offer with conversion info
      await this.updateOffer(data.offerId, { convertedToSaleId: saleId });
    }

    if (data.convertToServiceOrder) {
      // Mock service order creation
      const serviceOrderId = `SO-${String(Date.now()).slice(-6)}`;
      result.serviceOrderId = serviceOrderId;
      
      // Update offer with conversion info
      await this.updateOffer(data.offerId, { convertedToServiceOrderId: serviceOrderId });
    }

    return result;
  }

  static async getOfferStats(): Promise<OfferStats> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const totalOffers = mockOffers.length;
    const totalValue = mockOffers.reduce((sum, offer) => sum + (offer.totalAmount || offer.amount), 0);
    const averageValue = totalOffers > 0 ? totalValue / totalOffers : 0;
    const activeOffers = mockOffers.filter(offer => ['draft', 'sent'].includes(offer.status)).length;
    const acceptedOffers = mockOffers.filter(offer => offer.status === 'accepted').length;
    const declinedOffers = mockOffers.filter(offer => ['declined', 'cancelled'].includes(offer.status)).length;
    const conversionRate = totalOffers > 0 ? (acceptedOffers / totalOffers) * 100 : 0;
    
    return {
      totalOffers,
      activeOffers,
      acceptedOffers,
      declinedOffers,
      totalValue,
      averageValue,
      conversionRate,
      monthlyGrowth: 12.8 // Mock value
    };
  }

  static async renewOffer(id: string): Promise<Offer> {
    const originalOffer = await this.getOfferById(id);
    if (!originalOffer) {
      throw new Error('Offer not found');
    }

    const renewedOffer: Offer = {
      ...originalOffer,
      id: `OFFER-${String(mockOffers.length + 1).padStart(3, '0')}`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      validUntil: undefined,
      convertedToSaleId: undefined,
      convertedToServiceOrderId: undefined,
      convertedAt: undefined
    };

    mockOffers.push(renewedOffer);
    return renewedOffer;
  }
}

export function getOffers(): Offer[] {
  initializeMockData();
  return mockOffers;
}