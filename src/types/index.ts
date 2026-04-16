export type UserRole = 'client' | 'transitaire' | 'admin' | 'scanner' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  companyId?: string; // For transitaires and their team
  subscription?: string; // 'starter' | 'pro' | 'enterprise'
  favorites?: string[];
  profileProgress?: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  banner?: string;
  slogan?: string;
  description: string;
  addressChina: string;
  addressAfrica: string;
  countries: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  services: Service[];
  gallery?: string[];
  totalPackages?: number;
  showTotalPackages?: boolean;
  status?: 'open' | 'closed';
  showPrice?: 'hide' | 'starting' | 'full';
  showReviews?: boolean;
  contact?: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  style?: string;
  locations?: {
    africa: boolean;
    china: boolean;
  };
}

export interface Service {
  id: string;
  type: 'maritime' | 'aérien' | 'express';
  delay: string;
  priceInfo: string;
  pricePerUnit: number;
  unit: 'kg' | 'cbm';
  active?: boolean;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientPhone2?: string;
  companyId: string;
  companyName: string;
  serviceId: string;
  serviceType: string;
  status: 'pending' | 'received' | 'loaded' | 'in_transit' | 'arrived' | 'delivered' | 'problem';
  weight?: number;
  cbm?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  price?: number;
  destination: string;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  qrCode: string;
  reviewed?: boolean;
  departureDate?: string;
  estimatedArrival?: string;
}

export interface Review {
  id: string;
  orderId: string;
  companyId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  criteria: {
    speed: number;
    communication: number;
    safety: number;
    price: number;
  };
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName?: string;
  orderId?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
}

export interface Shipment {
  id: string;
  type: 'air' | 'sea';
  reference: string;
  departureDate: string;
  route: {
    from: string;
    to: string;
  };
  capacity: {
    total: number;
    used: number;
    unit: 'kg' | 'cbm';
  };
  status: 'preparation' | 'loaded' | 'in_transit' | 'arrived' | 'completed';
  packageCount: number;
  orders: string[]; // Order IDs
}
