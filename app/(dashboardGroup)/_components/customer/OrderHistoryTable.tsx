// Client Component — TanStack Query (hooks/use-rentals-query.ts) for live status polling, <OrderStatusBadge/> per row, 'Pay Now' button when CONFIRMED, 'Leave Review' when RETURNED
"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useRentalsQuery } from "@/lib/use-rentals-query";
import OrderStatusBadge from "./OrderStatusBadge";
import { RentalOrder } from "@/lib/types";
import Image from "next/image";

interface OrderHistoryTableProps {
  rentals: RentalOrder[];
}

export default function OrderHistoryTable({
  rentals: initialRentals,
}: OrderHistoryTableProps) {
  const { data, isLoading } = useRentalsQuery();

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
          {rentals.map((rental: any) => (
            <tr key={rental.id} className="border-b">
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
                {rental.status === "CONFIRMED" && (
                  <Button asChild>
                    <Link href={`/dashboard/orders/${rental.id}/pay`}>
                      Pay Now
                    </Link>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
