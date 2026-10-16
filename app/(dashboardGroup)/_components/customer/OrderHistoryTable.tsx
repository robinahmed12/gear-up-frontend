// Client Component — TanStack Query (hooks/use-rentals-query.ts) for live status polling,
// <OrderStatusBadge/> per row, 'Pay now' when CONFIRMED, 'Leave review' when RETURNED.
// Each row expands to show the itemized price breakdown.
"use client";

import { Fragment, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ClipboardList,
  CreditCard,
  ImageOff,
  Loader2,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRentalsQuery } from "@/lib/use-rentals-query";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import OrderStatusBadge from "./OrderStatusBadge";
import { RentalOrder } from "@/lib/types";
import { cancelRentalAction } from "@/app/(dashboardGroup)/_actions/rentalActions";

interface OrderHistoryTableProps {
  rentals: RentalOrder[];
}

type Status = RentalOrder["status"];
type Filter = "all" | "active" | "completed" | "cancelled";

const CANCELLABLE: Status[] = ["PLACED", "CONFIRMED", "PAID"];

const FILTERS: { value: Filter; label: string; match: (s: Status) => boolean }[] = [
  { value: "all", label: "All", match: () => true },
  {
    value: "active",
    label: "Active",
    match: (s) => ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"].includes(s),
  },
  { value: "completed", label: "Completed", match: (s) => s === "RETURNED" },
  { value: "cancelled", label: "Cancelled", match: (s) => s === "CANCELLED" },
];

/* ---------- helpers ---------- */

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const fmt = (d: string | Date) => dateFmt.format(new Date(d));

function rentalDays(start: string | Date, end: string | Date) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

function GearThumb({ src, alt, size }: { src?: string; alt: string; size: string }) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md border border-border bg-muted",
        size,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageOff className="h-4 w-4" aria-hidden />
        </div>
      )}
    </div>
  );
}

function PriceBreakdown({ rental }: { rental: RentalOrder }) {
  const currency = rental.currency ?? "USD";
  const rows: [string, number | undefined][] = [
    ["Subtotal", rental.subtotal],
    ["Service fee", rental.serviceFee],
    ["Tax", rental.taxAmount],
    ["Security deposit", rental.depositAmount],
  ];

  return (
    <dl className="w-full max-w-sm space-y-2 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="tabular-nums text-foreground">
            {formatMoney(value ?? 0, currency)}
          </dd>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-t border-border pt-2 font-semibold">
        <dt className="text-foreground">Total</dt>
        <dd className="tabular-nums text-foreground">
          {formatMoney(rental.totalAmount ?? 0, currency)}
        </dd>
      </div>
    </dl>
  );
}

/* ---------- main component ---------- */

export default function OrderHistoryTable({
  rentals: initialRentals,
}: OrderHistoryTableProps) {
  const { data, isLoading, refetch } = useRentalsQuery();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const rentals: RentalOrder[] = data?.data ?? initialRentals;

  const counts = useMemo(() => {
    const result = {} as Record<Filter, number>;
    for (const f of FILTERS) {
      result[f.value] = rentals.filter((r) => f.match(r.status)).length;
    }
    return result;
  }, [rentals]);

  const visible = useMemo(() => {
    const active = FILTERS.find((f) => f.value === filter)!;
    return rentals.filter((r) => active.match(r.status));
  }, [rentals, filter]);

  function handleCancel(rental: RentalOrder) {
    toast.warning("Cancel this rental?", {
      description: "Refund rules depend on how close the start date is.",
      action: {
        label: "Cancel rental",
        onClick: async () => {
          setCancellingId(rental.id);
          try {
            const res = await cancelRentalAction(rental.id);
            if (res.success) {
              const c = (res).data?.cancellation;
              toast.success(
                `Cancelled (${c?.tier ?? "..."})${
                  c?.refundableAmount ? `, refund ${c.refundableAmount}` : ""
                }${c?.depositReleased ? ", deposit released" : ""}`,
              );
              refetch();
            } else {
              toast.error(res.message);
            }
          } finally {
            setCancellingId(null);
          }
        },
      },
      cancel: { label: "Keep rental", onClick: () => {} },
    });
  }

  function renderActions(rental: RentalOrder, fullWidth = false) {
    const isCancelling = cancellingId === rental.id;
    const buttonCls = fullWidth ? "flex-1" : "";
    const buttons: React.ReactNode[] = [];

    if (rental.status === "CONFIRMED") {
      buttons.push(
        <Button
          key="pay"
          asChild
          size="sm"
          className={cn("bg-accent text-accent-foreground hover:bg-accent/90", buttonCls)}
        >
          <Link href={`/dashboard/orders/${rental.id}/pay`}>
            <CreditCard className="h-3.5 w-3.5" />
            Pay now
          </Link>
        </Button>,
      );
    }

    if (rental.status === "RETURNED" && rental.gear?.id) {
      buttons.push(
        <Button key="review" asChild size="sm" variant="outline" className={buttonCls}>
          <Link href={`/gear/${rental.gear.id}/review?rental=${rental.id}`}>
            <Star className="h-3.5 w-3.5" />
            Leave review
          </Link>
        </Button>,
      );
    }

    if (CANCELLABLE.includes(rental.status)) {
      buttons.push(
        <Button
          key="cancel"
          size="sm"
          variant="outline"
          disabled={isCancelling}
          onClick={() => handleCancel(rental)}
          className={cn(
            "border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive",
            buttonCls,
          )}
        >
          {isCancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Cancel"}
        </Button>,
      );
    }

    if (buttons.length === 0) {
      return <span className="text-xs text-muted-foreground">No actions</span>;
    }

    return (
      <div className={cn("flex items-center gap-2", fullWidth ? "w-full" : "justify-end")}>
        {buttons}
      </div>
    );
  }

  function ExpandButton({ rental, label }: { rental: RentalOrder; label?: string }) {
    const isExpanded = expandedId === rental.id;
    return (
      <Button
        type="button"
        variant="ghost"
        size={label ? "sm" : "icon"}
        aria-expanded={isExpanded}
        aria-controls={`breakdown-${rental.id}`}
        aria-label={label ? undefined : "Toggle price breakdown"}
        onClick={() => setExpandedId(isExpanded ? null : rental.id)}
        className="text-muted-foreground"
      >
        {label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
        />
      </Button>
    );
  }

  /* ----- loading ----- */
  if (isLoading) {
    return (
      <div
        className="space-y-px overflow-hidden rounded-xl border border-border bg-card"
        aria-busy="true"
        aria-label="Loading rentals"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-14 w-14 animate-pulse rounded-md bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  /* ----- empty ----- */
  if (!rentals.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <ClipboardList className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">No rentals yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Rentals you book will appear here so you can pay, track and review them.
        </p>
        <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/gear">Browse gear</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Filters */}
      <div
        role="tablist"
        aria-label="Filter rentals"
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
              <span className="ml-1.5 tabular-nums text-muted-foreground">
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {visible.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-foreground">No rentals in this view</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setFilter("all")}>
              Show all rentals
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Gear</th>
                    <th scope="col" className="px-5 py-3 font-medium">Rental period</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Total</th>
                    <th scope="col" className="px-5 py-3 font-medium">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((rental) => {
                    const isExpanded = expandedId === rental.id;
                    const days = rentalDays(rental.startDate, rental.endDate);
                    return (
                      <Fragment key={rental.id}>
                        <tr
                          className={cn(
                            "border-b border-border transition-colors hover:bg-muted/30",
                            isExpanded && "bg-muted/30",
                            rental.status === "CANCELLED" && "opacity-70",
                          )}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <GearThumb
                                src={rental.gear?.images?.[0]}
                                alt={rental.gear?.title ?? "Gear"}
                                size="h-14 w-14"
                              />
                              <div className="min-w-0">
                                <p className="max-w-[240px] truncate font-medium text-foreground">
                                  {rental.gear?.title ?? "Gear item"}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  Qty {rental.quantity ?? 1}
                                  <span className="mx-1.5" aria-hidden>·</span>
                                  <span className="font-mono">#{rental.id.slice(0, 8)}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-foreground">
                              {fmt(rental.startDate)} – {fmt(rental.endDate)}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {days} {days === 1 ? "day" : "days"}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-right font-semibold tabular-nums text-foreground">
                            {formatMoney(rental.totalAmount ?? 0, rental.currency ?? "USD")}
                          </td>
                          <td className="px-5 py-4">
                            <OrderStatusBadge status={rental.status} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {renderActions(rental)}
                              <ExpandButton rental={rental} />
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr id={`breakdown-${rental.id}`} className="border-b border-border bg-muted/20">
                            <td colSpan={5} className="px-5 py-5">
                              <p className="mb-3 text-sm font-semibold text-foreground">
                                Price breakdown
                              </p>
                              <PriceBreakdown rental={rental} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-border md:hidden">
              {visible.map((rental) => {
                const isExpanded = expandedId === rental.id;
                const days = rentalDays(rental.startDate, rental.endDate);
                return (
                  <li key={rental.id} className="space-y-4 p-4">
                    <div className="flex items-start gap-3">
                      <GearThumb
                        src={rental.gear?.images?.[0]}
                        alt={rental.gear?.title ?? "Gear"}
                        size="h-16 w-16"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-medium text-foreground">
                            {rental.gear?.title ?? "Gear item"}
                          </p>
                          <OrderStatusBadge status={rental.status} />
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Qty {rental.quantity ?? 1}
                          <span className="mx-1.5" aria-hidden>·</span>
                          <span className="font-mono">#{rental.id.slice(0, 8)}</span>
                        </p>
                        <p className="mt-1.5 text-sm text-foreground">
                          {fmt(rental.startDate)} – {fmt(rental.endDate)}
                          <span className="text-muted-foreground">
                            {" "}({days} {days === 1 ? "day" : "days"})
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold tabular-nums text-foreground">
                        {formatMoney(rental.totalAmount ?? 0, rental.currency ?? "USD")}
                      </p>
                      <ExpandButton rental={rental} label={isExpanded ? "Hide details" : "Details"} />
                    </div>

                    {isExpanded && (
                      <div
                        id={`breakdown-${rental.id}`}
                        className="rounded-lg bg-muted/40 p-4"
                      >
                        <p className="mb-3 text-sm font-semibold text-foreground">
                          Price breakdown
                        </p>
                        <PriceBreakdown rental={rental} />
                      </div>
                    )}

                    <div className="border-t border-border pt-3">
                      {renderActions(rental, true)}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
              Showing {visible.length} of {rentals.length}{" "}
              {rentals.length === 1 ? "rental" : "rentals"}
            </div>
          </>
        )}
      </div>
    </section>
  );
}