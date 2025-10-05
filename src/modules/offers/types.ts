// Database Tables/Entities for Offers Module
export interface Offer {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  contactCompany?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'TND';
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'cancelled' | 'modified';
  category: 'potential' | 'big_project' | 'likely_to_close' | 'unlikely_to_close' | 'follow_up_required';
  source: 'direct_customer' | 'social_media' | 'email_marketing' | 'referral' | 'website' | 'trade_show' | 'cold_call' | 'other';
  description?: string;
  notes?: string;
  validUntil?: Date;
  items: OfferItem[];
  assignedTo?: string;
  assignedToName?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastActivity?: Date;
  // Conversion tracking
  convertedToSaleId?: string;
  convertedToServiceOrderId?: string;
  convertedAt?: Date;
  // Additional fields
  taxes?: number;
  discount?: number;
  totalAmount?: number;
}

export interface OfferItem {
  id: string;
  offerId: string;
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

export interface CreateOfferData {
  title: string;
  description: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  status: 'draft' | 'sent';
  category: 'potential' | 'big_project' | 'likely_to_close' | 'unlikely_to_close' | 'follow_up_required';
  source: 'direct_customer' | 'social_media' | 'email_marketing' | 'referral' | 'website' | 'trade_show' | 'cold_call' | 'other';
  amount: number;
  currency: string;
  validUntil: Date | undefined;
  items: OfferItem[];
  notes: string;
  taxes: number;
  discount: number;
}

export interface OfferActivity {
  id: string;
  offerId: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status_change' | 'created' | 'sent' | 'accepted' | 'declined';
  description: string;
  details?: string;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface OfferStats {
  totalOffers: number;
  activeOffers: number;
  acceptedOffers: number;
  declinedOffers: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
  monthlyGrowth: number;
}

export interface OfferFilters {
  status?: string;
  category?: string;
  source?: string;
  contactId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface ConvertOfferData {
  offerId: string;
  convertToSale: boolean;
  convertToServiceOrder: boolean;
  salesData?: any;
  serviceOrderData?: any;
}