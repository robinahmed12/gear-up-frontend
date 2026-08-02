// Read-only moderation table — all rental orders platform-wide, filterable by status
// app/(dashboardGroup)/_components/admin/AdminRentalsTable.tsx
import { PackageSearch } from 'lucide-react';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import type { RentalOrder } from '@/lib/types';

interface AdminRentalsTableProps {
  rentals: RentalOrder[];
}

export function AdminRentalsTable({ rentals }: AdminRentalsTableProps) {
  if (rentals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <PackageSearch className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No rentals match this filter</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm sm:table">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-4 py-3 font-medium text-muted-foreground">Order</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Dates</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Qty</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rentals.map((rental) => (
            <tr key={rental.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {rental.id.slice(0, 8)}...
              </td>
              <td className="px-4 py-3 text-foreground">
                {new Date(rental.startDate).toLocaleDateString()} –{' '}
                {new Date(rental.endDate).toLocaleDateString()}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({rental.totalDays} day{rental.totalDays === 1 ? '' : 's'})
                </span>
              </td>
              <td className="px-4 py-3 text-foreground">{rental.quantity}</td>
              <td className="px-4 py-3 font-medium text-foreground">
                ৳{rental.totalAmount.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={rental.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-border sm:hidden">
        {rentals.map((rental) => (
          <div key={rental.id} className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {rental.id.slice(0, 8)}...
              </span>
              <OrderStatusBadge status={rental.status} />
            </div>
            <p className="text-sm text-foreground">
              {new Date(rental.startDate).toLocaleDateString()} –{' '}
              {new Date(rental.endDate).toLocaleDateString()}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Qty {rental.quantity} · {rental.totalDays} day{rental.totalDays === 1 ? '' : 's'}
              </span>
              <span className="font-medium text-foreground">
                ৳{rental.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}