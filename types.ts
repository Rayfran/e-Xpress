
export enum AppView {
  DASHBOARD = 'dashboard',
  MARKETPLACE = 'marketplace',
  SERVICES = 'services',
  LOGISTICS = 'logistics',
  PROFILE = 'profile',
  AUTH = 'auth'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'provider';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  sellerId: string;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  providerName: string;
  providerId: string;
  hourlyRate: number;
  specialty: string;
  rating: number;
  availableHours: string[];
}

export interface Delivery {
  id: string;
  status: 'pending' | 'in_transit' | 'delivered';
  origin: string;
  destination: string;
  trackingCode: string;
  requesterId: string;
  createdAt: string;
}
