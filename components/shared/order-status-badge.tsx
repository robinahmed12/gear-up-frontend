// Color-coded badge per RentalStatus: PLACED(yellow) CONFIRMED(blue) PAID(purple) PICKED_UP(green) RETURNED(gray) CANCELLED(red)
// components/shared/order-status-badge.tsx
import type { RentalStatus } from '@/lib/types';

interface OrderStatusBadgeProps {
  status: RentalStatus;
}

// Single source of truth for status → color across the whole app —
// AdminRentalsTable, customer OrderHistoryTable, and RentalStatusChart on
// the admin overview page all reuse this same mapping.
const statusConfig: Record<RentalStatus, { label: string; className: string }> = {
  PLACED: { label: 'Placed', className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  PAID: { label: 'Paid', className: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' },
  PICKED_UP: { label: 'Picked up', className: 'bg-primary/15 text-primary' },
  RETURNED: { label: 'Returned', className: 'bg-muted text-muted-foreground' },
  CANCELLED: { label: 'Cancelled', className: 'bg-destructive/15 text-destructive' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}