export interface PdfSettings {
  // Typography
  fontFamily: string;
  fontSize: {
    header: number;
    title: number;
    body: number;
    small: number;
  };
  
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    border: string;
    gradient?: string;
  };
  
  // Layout
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  
  // Company Info
  company: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
  };
  
  // Data Display
  showElements: {
    customerInfo: boolean;
    quoteInfo: boolean;
    itemsTable: boolean;
    summary: boolean;
    footer: boolean;
    logo: boolean;
    quoteDetails: boolean;
    watermark: boolean;
    pageNumbers: boolean;
  };
  
  // Table Settings
  table: {
    showPositions: boolean;
    showArticleCodes: boolean;
    showQuantity: boolean;
    showUnitPrice: boolean;
    alternateRowColors: boolean;
    borderStyle: string;
    headerStyle: string;
  };
  
  // Advanced Settings
  advanced: {
    compression: number;
    quality: string;
    watermarkText: string;
    watermarkOpacity: number;
    headerHeight: number;
    footerHeight: number;
    lineHeight: number;
  };
  
  // Formatting
  dateFormat: string;
  currencySymbol: string;
  taxRate: number;
  paperSize: string;
  orientation: string;
  
  // Mobile Optimizations
  mobileOptimized: boolean;
  templateStyle: string;
}

export const defaultSettings: PdfSettings = {
  fontFamily: 'Helvetica',
  fontSize: {
    header: 20,
    title: 11,
    body: 10,
    small: 9,
  },
  colors: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    text: '#1F2937',
    background: '#FFFFFF',
    border: '#E5E7EB',
    gradient: 'linear-gradient(135deg, #3B82F6, #1E40AF)',
  },
  margins: {
    top: 24,
    bottom: 24,
    left: 24,
    right: 24,
  },
  company: {
    name: 'YOUR COMPANY',
    tagline: 'Professional Business Solutions',
    address: '1234 Business Street, City, State 12345',
    phone: '(555) 123-4567',
    email: 'quotes@yourcompany.com',
    website: 'www.yourcompany.com',
  },
  showElements: {
    customerInfo: true,
    quoteInfo: true,
    itemsTable: true,
    summary: true,
    footer: true,
    logo: false,
    quoteDetails: true,
    watermark: false,
    pageNumbers: true,
  },
  table: {
    showPositions: true,
    showArticleCodes: true,
    showQuantity: true,
    showUnitPrice: true,
    alternateRowColors: true,
    borderStyle: 'solid',
    headerStyle: 'filled',
  },
  advanced: {
    compression: 80,
    quality: 'high',
    watermarkText: 'QUOTE',
    watermarkOpacity: 10,
    headerHeight: 80,
    footerHeight: 60,
    lineHeight: 1.4,
  },
  dateFormat: 'en-US',
  currencySymbol: '$',
  taxRate: 0,
  paperSize: 'A4',
  orientation: 'portrait',
  mobileOptimized: true,
  templateStyle: 'professional',
};

// Predefined color themes
export const colorThemes = [
  { name: 'Professional Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
  { name: 'Business Green', primary: '#10B981', secondary: '#047857', accent: '#34D399' },
  { name: 'Corporate Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
  { name: 'Modern Gray', primary: '#6B7280', secondary: '#4B5563', accent: '#9CA3AF' },
  { name: 'Professional Orange', primary: '#F59E0B', secondary: '#D97706', accent: '#FCD34D' },
];

export const paperSizes = [
  { value: 'A4', label: 'A4 (210 × 297 mm)' },
  { value: 'LETTER', label: 'Letter (8.5 × 11 in)' },
  { value: 'LEGAL', label: 'Legal (8.5 × 14 in)' },
];

export const templateStyles = [
  { value: 'professional', label: 'Professional' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'classic', label: 'Classic' },
];

export const formatDisplayName = (key: string): string => {
  return key.replace(/([A-Z])/g, ' $1').trim();
};

export const updateNestedObject = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const updated = { ...obj };
  let current: any = updated;
  
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  return updated;
};