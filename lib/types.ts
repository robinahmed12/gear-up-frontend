

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

export type PaymentStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'FAILED';
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
  id: string;
  name: string;
}

export interface RentalOrder {
  id: string;
  gearId: string;
  customerId: string;
  customer?: { id: string; name: string; email: string };
  quantity: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  serviceFee: number;
  depositAmount: number;
  taxAmount: number;
  currency: string;
  totalAmount: number;
  status: RentalStatus;
  payment?: { id: string; status: PaymentStatus; method: PaymentMethod };
  lineItems?: OrderLineItem[];
  deposit?: Deposit;
  gear: Gear;
}
export type NextStatus = Extract<RentalStatus, 'CONFIRMED' | 'PICKED_UP' | 'RETURNED'>;

export interface Payment {
  id: string;
  rentalOrderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
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

export type OrderLineItemType =
  | 'RENTAL'
  | 'SERVICE_FEE'
  | 'DEPOSIT'
  | 'TAX'
  | 'DAMAGE_FEE'
  | 'LATE_FEE'
  | 'REFUND'
  | 'ADJUSTMENT';

export interface OrderLineItem {
  id: string;
  rentalOrderId: string;
  type: OrderLineItemType;
  amount: number;
  currency: string;
  description?: string | null;
  createdAt: string;
}

export type DepositStatus = 'PENDING' | 'AUTHORIZED' | 'RELEASED' | 'CAPTURED' | 'FAILED';

export interface Deposit {
  id: string;
  rentalOrderId: string;
  amount: number;
  currency: string;
  status: DepositStatus;
  stripePaymentIntentId?: string | null;
  authorizedAt?: string | null;
  releasedAt?: string | null;
  capturedAt?: string | null;
  capturedAmount?: number | null;
  createdAt: string;
  updatedAt: string;
}

export type RefundStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED';

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason?: string | null;
  status: RefundStatus;
  stripeRefundId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CancellationTier = 'FULL' | 'PARTIAL' | 'NONE';

export interface CancellationOutcome {
  tier: CancellationTier;
  refundableAmount: number;
  refundId: string | null;
  depositReleased: boolean;
}

export interface AvailabilityCheckResult {
  available: boolean;
  isAvailable: boolean;
  reason?: string;
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