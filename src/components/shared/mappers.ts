import { MapItem } from "./MapView";

// Service Orders
export interface ServiceOrder {
  id: string;
  orderNumber: string;
  customer: {
    company: string;
    contactPerson: string;
    address: {
      street: string;
      city: string;
      latitude: number;
      longitude: number;
      hasLocation: number;
    };
  };
  repair: {
    description: string;
  };
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function mapServiceOrdersToMapItems(orders: ServiceOrder[]): MapItem[] {
  return orders.map(order => ({
    id: order.id,
    title: order.orderNumber,
    subtitle: order.repair.description,
    priority: order.priority,
    status: order.status,
    location: {
      latitude: order.customer.address.latitude,
      longitude: order.customer.address.longitude,
      hasLocation: order.customer.address.hasLocation,
      address: order.customer.address.street,
      city: order.customer.address.city
    }
  }));
}

// Dispatches
export interface DispatchJob {
  id: string;
  jobNumber: string;
  title: string;
  description: string;
  customer: {
    address: {
      street: string;
      city: string;
      latitude: number;
      longitude: number;
      hasLocation: number;
    };
  };
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function mapDispatchesToMapItems(dispatches: DispatchJob[]): MapItem[] {
  return dispatches.map(dispatch => ({
    id: dispatch.id,
    title: dispatch.jobNumber,
    subtitle: dispatch.description,
    priority: dispatch.priority,
    status: dispatch.status,
    location: {
      latitude: dispatch.customer.address.latitude,
      longitude: dispatch.customer.address.longitude,
      hasLocation: dispatch.customer.address.hasLocation,
      address: dispatch.customer.address.street,
      city: dispatch.customer.address.city
    }
  }));
}

// Sales
export interface Sale {
  id: string;
  title: string;
  contactName: string;
  contactCompany: string;
  contactLocation?: {
    street: string;
    city: string;
    latitude: number;
    longitude: number;
    hasLocation: number;
  };
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  amount: number;
  currency: string;
}

export function mapSalesToMapItems(sales: Sale[]): MapItem[] {
  return sales
    .filter(sale => sale.contactLocation?.hasLocation === 1)
    .map(sale => ({
      id: sale.id,
      title: sale.title,
      subtitle: `${sale.contactCompany} - ${sale.amount} ${sale.currency}`,
      priority: sale.priority,
      status: sale.status,
      location: {
        latitude: sale.contactLocation!.latitude,
        longitude: sale.contactLocation!.longitude,
        hasLocation: sale.contactLocation!.hasLocation,
        address: sale.contactLocation!.street,
        city: sale.contactLocation!.city
      }
    }));
}

// Offers
export interface Offer {
  id: string;
  title: string;
  contactName: string;
  contactCompany?: string;
  contactLocation?: {
    street: string;
    city: string;
    latitude: number;
    longitude: number;
    hasLocation: number;
  };
  status: string;
  amount: number;
  currency: string;
}

export function mapOffersToMapItems(offers: Offer[]): MapItem[] {
  return offers
    .filter(offer => offer.contactLocation?.hasLocation === 1)
    .map(offer => ({
      id: offer.id,
      title: offer.title,
      subtitle: `${offer.contactCompany || 'Unknown Company'} - ${offer.amount} ${offer.currency}`,
      priority: 'medium' as const,
      status: offer.status,
      location: {
        latitude: offer.contactLocation!.latitude,
        longitude: offer.contactLocation!.longitude,
        hasLocation: offer.contactLocation!.hasLocation,
        address: offer.contactLocation!.street,
        city: offer.contactLocation!.city
      }
    }));
}