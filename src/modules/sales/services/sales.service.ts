import { Sale, CreateSaleData, SaleFilters, SaleStats } from '../types';
import salesData from '@/data/mock/sales.json';

// Mock data - will be replaced with actual API calls
let mockSales: Sale[] = [];

// Initialize with simplified mock data
const initializeMockData = () => {
  if (mockSales.length === 0) {
    mockSales = [
      {
        id: 'SALE-001',
        title: 'Office Equipment Sale',
        contactId: 'CONT-001',
        contactName: 'John Doe',
        contactCompany: 'Acme Corp',
        amount: 15000,
        currency: 'USD',
        status: 'new_offer',
        stage: 'offer',
        priority: 'medium',
        description: 'Office equipment and supplies',
        items: [],
        assignedTo: '',
        assignedToName: '',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        customerName: 'John Doe',
        customerEmail: 'john@acme.com',
        customerPhone: '+1-555-0123',
        customerAddress: '123 Business St',
        taxes: 1200,
        discount: 0,
        shippingCost: 0,
        totalAmount: 16200
      }
    ];
  }
};

export function getSales(): Sale[] {
  initializeMockData();
  return mockSales;
}

export class SalesService {
  static async getSales(filters?: SaleFilters): Promise<Sale[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredSales = [...mockSales];
    
    if (filters) {
      if (filters.status) {
        filteredSales = filteredSales.filter(sale => sale.status === filters.status);
      }
      if (filters.priority) {
        filteredSales = filteredSales.filter(sale => sale.priority === filters.priority);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredSales = filteredSales.filter(sale => 
          sale.title.toLowerCase().includes(searchLower) ||
          sale.contactName.toLowerCase().includes(searchLower) ||
          sale.description?.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return filteredSales;
  }

  static async getSaleById(id: string): Promise<Sale | null> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockSales.find(sale => sale.id === id) || null;
  }

  static async createSale(data: CreateSaleData): Promise<Sale> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newSale: Sale = {
      id: `SALE-${String(mockSales.length + 1).padStart(3, '0')}`,
      title: data.title,
      description: data.description || '',
      contactId: data.customerId,
      contactName: data.customerName,
      contactCompany: '',
      amount: data.amount,
      currency: data.currency as 'USD' | 'EUR' | 'GBP' | 'TND',
      status: data.status as 'new_offer' | 'won' | 'lost' | 'redefined' | 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled',
      stage: 'offer',
      priority: data.priority,
      notes: data.notes,
      items: data.items,
      assignedTo: '',
      assignedToName: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      deliveryDate: data.deliveryDate,
      taxes: data.taxes,
      discount: data.discount,
      shippingCost: data.shippingCost,
      totalAmount: data.amount + data.taxes + data.shippingCost - data.discount,
    };
    
    mockSales.push(newSale);
    return newSale;
  }

  static async updateSale(id: string, data: Partial<Sale>): Promise<Sale> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockSales.findIndex(sale => sale.id === id);
    if (index === -1) {
      throw new Error('Sale not found');
    }
    
    const updatedSale = {
      ...mockSales[index],
      ...data,
      updatedAt: new Date(),
    };
    
    // Recalculate total if relevant fields changed
    if (data.amount !== undefined || data.taxes !== undefined || data.discount !== undefined || data.shippingCost !== undefined) {
      updatedSale.totalAmount = (updatedSale.amount || 0) + (updatedSale.taxes || 0) + (updatedSale.shippingCost || 0) - (updatedSale.discount || 0);
    }
    
    mockSales[index] = updatedSale;
    return updatedSale;
  }

  static async deleteSale(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockSales.findIndex(sale => sale.id === id);
    if (index === -1) {
      throw new Error('Sale not found');
    }
    
    mockSales.splice(index, 1);
  }

  static async getSaleStats(): Promise<SaleStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const totalSales = mockSales.length;
    const totalValue = mockSales.reduce((sum, sale) => sum + (sale.totalAmount || sale.amount), 0);
    const averageValue = totalSales > 0 ? totalValue / totalSales : 0;
    const activeSales = mockSales.filter(sale => ['new_offer', 'draft', 'sent', 'accepted'].includes(sale.status)).length;
    const wonSales = mockSales.filter(sale => ['won', 'completed'].includes(sale.status)).length;
    const lostSales = mockSales.filter(sale => ['lost', 'cancelled'].includes(sale.status)).length;
    const conversionRate = totalSales > 0 ? (wonSales / totalSales) * 100 : 0;
    
    return {
      totalSales,
      activeSales,
      wonSales,
      lostSales,
      totalValue,
      averageValue,
      conversionRate,
      monthlyGrowth: 15.2 // Mock value
    };
  }
}