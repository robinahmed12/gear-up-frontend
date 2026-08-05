

export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  phone?: string | null;
  createdAt: string;
}

export type RentalStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PAID'
  | 'PICKED_UP'
  | 'RETURNED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'STRIPE' | 'SSLCOMMERZ';

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Gear {
  id: string;
  title: string;
  description: string;
  brand?: string | null;
  pricePerDay: number;
  stock: number;
  isAvailable: boolean;
  images: string[];
  averageRating: number;
  reviewCount: number;
  categoryId: string;
  category?: Category;
  providerId: string;
  provider: provider
}

export interface provider {
  id: number;
  name: string
}

export interface RentalOrder {
  id: string;
  gearId: string;
  customerId: string;
  quantity: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  totalAmount: number;
  status: RentalStatus;
  provider: provider
}
export type NextStatus = Extract<RentalStatus, 'CONFIRMED' | 'PICKED_UP' | 'RETURNED'>;

export interface Payment {
  id: string;
  rentalOrderId: string;
  transactionId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null;
}

export interface Review {
  id: string;
  gearId: string;
  customerId: string;
  rentalOrderId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

// Matches the backend's standard response envelope
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorDetails: unknown;
}