// app/(dashboardGroup)/_components/provider/IncomingOrdersTable.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import { useUpdateOrderStatus } from "@/hooks/use-provider-orders-query";

import type { NextStatus, RentalOrder } from "@/lib/types";

interface IncomingOrdersTableProps {
  initialOrders: RentalOrder[];
}

const nextAction: Partial<
  Record<
    RentalOrder["status"],
    {
      label: string;
      next: NextStatus;
    }
  >
> = {
  PLACED: {
    label: "Confirm",
    next: "CONFIRMED",
  },

  PAID: {
    label: "Mark picked up",
    next: "PICKED_UP",
  },

  PICKED_UP: {
    label: "Mark returned",
    next: "RETURNED",
  },
};

export function IncomingOrdersTable({
  initialOrders,
}: IncomingOrdersTableProps) {
  /*
   * TanStack Query keeps the orders in client-side cache.
   *
   * initialOrders comes from the Server Component.
   * The mutation hook updates this cache optimistically.
   */
  const { data: orders = [] } = useQuery<RentalOrder[]>({
    queryKey: ["provider-orders"],
    queryFn: async () => initialOrders,
    initialData: initialOrders,
    staleTime: Infinity,
  });

  const updateStatus = useUpdateOrderStatus();

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
        <ClipboardList className="mb-4 h-10 w-10 text-muted-foreground" />

        <h3 className="text-base font-semibold text-foreground">
          No incoming orders
        </h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Orders for your gear will show up here when customers place rental
          requests.
        </p>
      </div>
    );
  }

  function renderAction(order: RentalOrder) {
    const action = nextAction[order.status];

    /*
     * No provider action for:
     *
     * CONFIRMED → waiting for customer payment
     * RETURNED  → rental completed
     * CANCELLED → order cancelled
     */
    if (!action) {
      if (order.status === "CONFIRMED") {
        return (
          <span className="text-xs text-muted-foreground">
            Waiting for payment
          </span>
        );
      }

      if (order.status === "RETURNED") {
        return (
          <span className="text-xs font-medium text-muted-foreground">
            Completed
          </span>
        );
      }

      if (order.status === "CANCELLED") {
        return (
          <span className="text-xs font-medium text-destructive">
            Cancelled
          </span>
        );
      }

      return <span className="text-xs text-muted-foreground">—</span>;
    }

    const isThisRowUpdating =
      updateStatus.isPending && updateStatus.variables?.orderId === order.id;

    return (
      <Button
        type="button"
        size="sm"
        disabled={updateStatus.isPending}
        onClick={() => {
          updateStatus.mutate({
            orderId: order.id,
            status: action.next,
          });
        }}
        className="min-w-[120px] bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isThisRowUpdating ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Updating...
          </>
        ) : (
          action.label
        )}
      </Button>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* =========================
          Desktop Table
      ========================== */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-5 py-4 text-left font-medium text-muted-foreground">
                Order
              </th>

              <th className="px-5 py-4 text-left font-medium text-muted-foreground">
                Dates
              </th>

              <th className="px-5 py-4 text-left font-medium text-muted-foreground">
                Amount
              </th>

              <th className="px-5 py-4 text-left font-medium text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-4 text-right font-medium text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-muted/30"
              >
                {/* Order */}
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 8)}
                  </span>
                </td>

                {/* Dates */}
                <td className="px-5 py-4">
                  <div className="text-sm text-foreground">
                    {new Date(order.startDate).toLocaleDateString()}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    to {new Date(order.endDate).toLocaleDateString()}
                  </div>
                </td>

                {/* Amount */}
                <td className="px-5 py-4">
                  <span className="font-semibold text-foreground">
                    ৳{Number(order.totalAmount).toLocaleString()}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>

                {/* Action */}
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end">{renderAction(order)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
          Mobile Cards
      ========================== */}
      <div className="divide-y divide-border sm:hidden">
        {orders.map((order) => {
          const isThisRowUpdating =
            updateStatus.isPending &&
            updateStatus.variables?.orderId === order.id;

          return (
            <div key={order.id} className="space-y-4 p-4">
              {/* Order + Status */}
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  #{order.id.slice(0, 8)}
                </span>

                <OrderStatusBadge status={order.status} />
              </div>

              {/* Dates */}
              <div>
                <p className="text-sm font-medium text-foreground">
                  Rental period
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(order.startDate).toLocaleDateString()} –{" "}
                  {new Date(order.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Amount + Action */}
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-foreground">
                  ৳{Number(order.totalAmount).toLocaleString()}
                </span>

                <div>
                  {(() => {
                    const action = nextAction[order.status];

                    if (!action) {
                      if (order.status === "CONFIRMED") {
                        return (
                          <span className="text-xs text-muted-foreground">
                            Waiting for payment
                          </span>
                        );
                      }

                      if (order.status === "RETURNED") {
                        return (
                          <span className="text-xs font-medium text-muted-foreground">
                            Completed
                          </span>
                        );
                      }

                      if (order.status === "CANCELLED") {
                        return (
                          <span className="text-xs font-medium text-destructive">
                            Cancelled
                          </span>
                        );
                      }

                      return (
                        <span className="text-xs text-muted-foreground">—</span>
                      );
                    }

                    return (
                      <Button
                        type="button"
                        size="sm"
                        disabled={updateStatus.isPending}
                        onClick={() => {
                          updateStatus.mutate({
                            orderId: order.id,
                            status: action.next,
                          });
                        }}
                        className="min-w-[120px] bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {isThisRowUpdating ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          action.label
                        )}
                      </Button>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
