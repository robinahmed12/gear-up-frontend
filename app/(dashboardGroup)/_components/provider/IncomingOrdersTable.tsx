// Client Component — TanStack Query (hooks/use-provider-orders-query.ts) with optimistic updates on status change so Confirm/Mark Picked Up/Mark Returned reflect instantly without a full refetch
// app/(dashboardGroup)/_components/provider/IncomingOrdersTable.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Loader2 } from 'lucide-react';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { Button } from '@/components/ui/button';
import { useUpdateOrderStatus } from '@/hooks/use-provider-orders-query';
import type { NextStatus, RentalOrder } from '@/lib/types';

interface IncomingOrdersTableProps {
  initialOrders: RentalOrder[];
}


// IncomingOrdersTable.tsx
const nextAction: Partial<
  Record<RentalOrder['status'], { label: string; next: NextStatus }>
> = {
  PLACED: { label: 'Confirm', next: 'CONFIRMED' },
  PAID: { label: 'Mark picked up', next: 'PICKED_UP' },
  PICKED_UP: { label: 'Mark returned', next: 'RETURNED' },
};


export function IncomingOrdersTable({ initialOrders }: IncomingOrdersTableProps) {
  const { data: orders = initialOrders } = useQuery({
    queryKey: ['provider-orders'],
    queryFn: async () => initialOrders,
    initialData: initialOrders,
    staleTime: 30 * 1000,
  });
console.log("o", orders)
  const updateStatus = useUpdateOrderStatus();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No incoming orders</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Orders for your gear will show up here.
        </p>
      </div>
    );
  }

  function renderAction(order: RentalOrder) {
    const action = nextAction[order.status];
    if (!action) return <span className="text-xs text-muted-foreground">—</span>;

    const isThisRowUpdating =
      updateStatus.isPending && updateStatus.variables?.orderId === order.id;

    return (
      <Button
        size="sm"
        disabled={updateStatus.isPending}
        onClick={() => updateStatus.mutate({ orderId: order.id, status: action.next })}
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isThisRowUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : action.label}
      </Button>
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
            <th className="px-4 py-3 font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 font-medium text-muted-foreground text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {order.id.slice(0, 8)}...
              </td>
              <td className="px-4 py-3 text-foreground">
                {new Date(order.startDate).toLocaleDateString()} –{' '}
                {new Date(order.endDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium text-foreground">
                ৳{order.totalAmount.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-right">{renderAction(order)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-border sm:hidden">
        {orders.map((order) => (
          <div key={order.id} className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {order.id.slice(0, 8)}...
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-foreground">
              {new Date(order.startDate).toLocaleDateString()} –{' '}
              {new Date(order.endDate).toLocaleDateString()}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">
                ৳{order.totalAmount.toLocaleString()}
              </span>
              {renderAction(order)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}