// Client Component — TanStack Query (hooks/use-rentals-query.ts) for live status polling, <OrderStatusBadge/> per row, 'Pay Now' button when CONFIRMED, 'Leave Review' when RETURNED. Each row expands to show the itemized price breakdown.
"use client";

import { Fragment, useState } from "react";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useRentalsQuery } from "@/lib/use-rentals-query";
import { formatMoney } from "@/lib/format";
import OrderStatusBadge from "./OrderStatusBadge";
import { RentalOrder } from "@/lib/types";
import { cancelRentalAction } from "@/app/(dashboardGroup)/_actions/rentalActions";
import { toast } from "sonner";

interface OrderHistoryTableProps {
  rentals: RentalOrder[];
}

export default function OrderHistoryTable({
  rentals: initialRentals,
}: OrderHistoryTableProps) {
  const { data, isLoading } = useRentalsQuery();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rentals = data?.data ?? initialRentals;

  if (isLoading) {
    return (
      <div className="rounded-lg border p-6 text-center">
        Loading rentals...
      </div>
    );
  }

  if (!rentals.length) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No rental orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted">
          <tr>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Gear </th>

            <th className="p-4 text-left">Customer Id</th>

            <th className="p-4 text-left">Dates</th>

            <th className="p-4 text-left">Status</th>

            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {rentals.map((rental: RentalOrder) => {
            const isExpanded = expandedId === rental.id;
            const currency = rental.currency ?? "USD";

            return (
              <Fragment key={rental.id}>
                <tr className="border-b">
                  <td>
                    {rental.gear?.images?.[0] && (
                      <Image
                        src={rental.gear.images[0]}
                        alt="Gear image"
                        width={200}
                        height={150}
                      />
                    )}
                  </td>

                  <td className="p-4">
                    <div>
                      <p className="font-medium">
                        {rental.gear?.title ?? "Gear Item"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Qty: {rental.quantity ?? 1}
                      </p>
                    </div>
                  </td>
                  <td>{rental.customerId}</td>

                  <td className="p-4">
                    <p>{new Date(rental.startDate).toLocaleDateString()}</p>

                    <p>- {new Date(rental.endDate).toLocaleDateString()}</p>
                  </td>

                  <td className="p-4">
                    <OrderStatusBadge status={rental.status} />
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : rental.id)
                        }
                        aria-label="Toggle price breakdown"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>

                      {rental.status === "CONFIRMED" && (
                        <Button asChild>
                          <Link href={`/dashboard/orders/${rental.id}/pay`}>
                            Pay Now
                          </Link>
                        </Button>
                      )}

                      {['PLACED', 'CONFIRMED', 'PAID'].includes(rental.status) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (!confirm('Cancel this rental?')) return;
                            const res = await cancelRentalAction(rental.id);
                            if (res.success) {
                              const c = (res as any).data?.cancellation;
                              toast.success(
                                `Cancelled (${c?.tier ?? '...'})${c?.refundableAmount ? `, refund ${c.refundableAmount}` : ''}${
                                  c?.depositReleased ? ', deposit released' : ''
                                }`,
                              );
                            } else {
                              toast.error(res.message);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      )}

                      {rental.status === "RETURNED" && (
                        <Button asChild variant="outline">
                          <Link
                            href={`/gear/${rental.gear.id}/review?rental=${rental.id}`}
                          >
                            Leave Review
                          </Link>
                        </Button>
                      )}

                      {rental.status !== "CONFIRMED" &&
                        rental.status !== "RETURNED" && (
                          <span className="text-sm text-muted-foreground">
                            No action
                          </span>
                        )}
                    </div>
                  </td>
                </tr>

                {isExpanded && (
                  <tr className="border-b bg-muted/30">
                    <td colSpan={6} className="p-4">
                      <div className="max-w-md space-y-1 text-sm">
                        <p className="font-medium text-foreground">
                          Price breakdown
                        </p>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatMoney(rental.subtotal ?? 0, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Service fee
                          </span>
                          <span>
                            {formatMoney(rental.serviceFee ?? 0, currency)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span>{formatMoney(rental.taxAmount ?? 0, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Security deposit
                          </span>
                          <span>
                            {formatMoney(rental.depositAmount ?? 0, currency)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-1 font-medium text-foreground">
                          <span>Total</span>
                          <span>
                            {formatMoney(rental.totalAmount ?? 0, currency)}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
