// app/(dashboardGroup)/_components/provider/IncomingOrdersTable.tsx
"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CircleCheck, ClipboardList, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import { useUpdateOrderStatus } from "@/hooks/use-provider-orders-query";
import { cancelProviderOrderAction } from "@/app/(dashboardGroup)/_actions/providerOrderActions";
import { cn } from "@/lib/utils";

import type { NextStatus, RentalOrder } from "@/lib/types";

interface IncomingOrdersTableProps {
  initialOrders: RentalOrder[];
}

type Status = RentalOrder["status"];

const nextAction: Partial<Record<Status, { label: string; next: NextStatus }>> = {
  PLACED: { label: "Confirm order", next: "CONFIRMED" },
  PAID: { label: "Mark picked up", next: "PICKED_UP" },
  PICKED_UP: { label: "Mark returned", next: "RETURNED" },
};

const CANCELLABLE: Status[] = ["PLACED", "CONFIRMED", "PAID"];

type Filter = "all" | "action" | "payment" | "closed";

const FILTERS: { value: Filter; label: string; match: (s: Status) => boolean }[] = [
  { value: "all", label: "All", match: () => true },
  { value: "action", label: "Needs action", match: (s) => s in nextAction },
  { value: "payment", label: "Awaiting payment", match: (s) => s === "CONFIRMED" },
  {
    value: "closed",
    label: "Closed",
    match: (s) => s === "RETURNED" || s === "CANCELLED",
  },
];

/* ---------- helpers ---------- */

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function fmt(date: string | Date) {
  return dateFmt.format(new Date(date));
}

function rentalDays(start: string | Date, end: string | Date) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

function money(value: number | string) {
  return `৳${Number(value).toLocaleString("en-US")}`;
}

/* ---------- component ---------- */

export function IncomingOrdersTable({ initialOrders }: IncomingOrdersTableProps) {
  // initialOrders comes from the Server Component; the mutation hook
  // updates this cache optimistically. No automatic refetching.
  const { data: orders = initialOrders } = useQuery<RentalOrder[]>({
    queryKey: ["provider-orders"],
    queryFn: async () => initialOrders,
    initialData: initialOrders,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  const updateStatus = useUpdateOrderStatus();

  const [filter, setFilter] = useState<Filter>("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const result = {} as Record<Filter, number>;
    for (const f of FILTERS) {
      result[f.value] = orders.filter((o) => f.match(o.status)).length;
    }
    return result;
  }, [orders]);

  const visible = useMemo(() => {
    const active = FILTERS.find((f) => f.value === filter)!;
    return orders.filter((o) => active.match(o.status));
  }, [orders, filter]);

  function handleCancel(order: RentalOrder) {
    const ref = order.id.slice(0, 8);
    toast.warning(`Cancel order #${ref}?`, {
      description: "The customer will be notified. This can't be undone.",
      action: {
        label: "Cancel order",
        onClick: async () => {
          setCancellingId(order.id);
          try {
            const result = await cancelProviderOrderAction(order.id);
            if (result.success) toast.success(result.message);
            else toast.error(result.message);
          } finally {
            setCancellingId(null);
          }
        },
      },
      cancel: { label: "Keep order", onClick: () => {} },
    });
  }

  /* Shared by desktop table and mobile cards */
  function renderActions(order: RentalOrder, fullWidth = false) {
    const action = nextAction[order.status];
    const isUpdating =
      updateStatus.isPending && updateStatus.variables?.orderId === order.id;
    const isCancelling = cancellingId === order.id;
    const busy = updateStatus.isPending || isCancelling;

    let primary: React.ReactNode;

    if (action) {
      primary = (
        <Button
          type="button"
          size="sm"
          disabled={busy}
          onClick={() =>
            updateStatus.mutate({ orderId: order.id, status: action.next })
          }
          className={cn(
            "bg-accent text-accent-foreground hover:bg-accent/90",
            fullWidth ? "flex-1" : "min-w-[130px]",
          )}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating…
            </>
          ) : (
            action.label
          )}
        </Button>
      );
    } else if (order.status === "CONFIRMED") {
      primary = (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          Waiting for payment
        </span>
      );
    } else if (order.status === "RETURNED") {
      primary = (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <CircleCheck className="h-3.5 w-3.5" aria-hidden />
          Completed
        </span>
      );
    } else if (order.status === "CANCELLED") {
      primary = (
        <span className="text-xs font-medium text-destructive">Cancelled</span>
      );
    } else {
      primary = <span className="text-xs text-muted-foreground">—</span>;
    }

    const canCancel = CANCELLABLE.includes(order.status);

    return (
      <div
        className={cn(
          "flex items-center gap-2",
          fullWidth ? "w-full" : "justify-end",
        )}
      >
        {primary}
        {canCancel && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => handleCancel(order)}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {isCancelling ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Cancel"
            )}
          </Button>
        )}
      </div>
    );
  }

  /* ----- empty state ----- */
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <ClipboardList className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No incoming orders
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          When a customer requests one of your items, the order will appear here
          for you to confirm.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Filters */}
      <div
        role="tablist"
        aria-label="Filter orders"
        className="flex gap-1 overflow-x-auto rounded-lg bg-secondary p-0.5 sm:inline-flex"
      >
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.value)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "ml-1.5 tabular-nums",
                  f.value === "action" && counts.action > 0 && !active
                    ? "font-semibold text-accent"
                    : "text-muted-foreground",
                )}
              >
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {visible.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              No orders in this view
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setFilter("all")}
            >
              Show all orders
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Order</th>
                    <th scope="col" className="px-5 py-3 font-medium">Rental period</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Amount</th>
                    <th scope="col" className="px-5 py-3 font-medium">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((order) => {
                    const days = rentalDays(order.startDate, order.endDate);
                    return (
                      <tr
                        key={order.id}
                        className={cn(
                          "transition-colors hover:bg-muted/30",
                          order.status === "CANCELLED" && "opacity-70",
                        )}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-medium text-foreground">
                            #{order.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-foreground">
                            {fmt(order.startDate)} – {fmt(order.endDate)}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {days} {days === 1 ? "day" : "days"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right font-semibold tabular-nums text-foreground">
                          {money(order.totalAmount)}
                        </td>
                        <td className="px-5 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-4">{renderActions(order)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-border md:hidden">
              {visible.map((order) => {
                const days = rentalDays(order.startDate, order.endDate);
                return (
                  <li key={order.id} className="space-y-4 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-medium text-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-sm text-foreground">
                          <CalendarDays
                            className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                            aria-hidden
                          />
                          {fmt(order.startDate)} – {fmt(order.endDate)}
                        </p>
                        <p className="mt-0.5 pl-5 text-xs text-muted-foreground">
                          {days} {days === 1 ? "day" : "days"}
                        </p>
                      </div>
                      <p className="text-lg font-semibold tabular-nums text-foreground">
                        {money(order.totalAmount)}
                      </p>
                    </div>

                    <div className="border-t border-border pt-3">
                      {renderActions(order, true)}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
              Showing {visible.length} of {orders.length}{" "}
              {orders.length === 1 ? "order" : "orders"}
            </div>
          </>
        )}
      </div>
    </section>
  );
}