// Sales module types for CRM
export interface Sale {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  contactCompany?: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'TND';
  status: 'new_offer' | 'won' | 'lost' | 'redefined' | 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled';
  stage: 'offer' | 'negotiation' | 'closed' | 'converted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  notes?: string;
  validUntil?: Date;
  estimatedCloseDate?: Date;
  actualCloseDate?: Date;
  lostReason?: string;
  items: SaleItem[];
  assignedTo?: string;
  assignedToName?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastActivity?: Date;
  // Additional fields for comprehensive sale management
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  deliveryDate?: Date;
  taxes?: number;
  discount?: number;
  shippingCost?: number;
  totalAmount?: number;
}

export interface SaleItem {
  id: string;
  saleId: string;
  type: 'article' | 'service';
  itemId: string;
  itemName: string;
  itemCode?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  installationId?: string;
  installationName?: string;
}

export interface CreateSaleData {
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  status: 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled' | 'new_offer' | 'won' | 'lost' | 'redefined';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  amount: number;
  currency: string;
  deliveryDate: Date | undefined;
  items: SaleItem[];
  notes: string;
  taxes: number;
  discount: number;
  shippingCost: number;
  isRecurring: boolean;
  recurringInterval: string;
}

export interface SaleActivity {
  id: string;
  saleId: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status_change' | 'created';
  description: string;
  details?: string;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface SaleStats {
  totalSales: number;
  activeSales: number;
  wonSales: number;
  lostSales: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
  monthlyGrowth: number;
}

export interface SaleFilters {
  status?: string;
  priority?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}