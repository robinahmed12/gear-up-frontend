// Read-only moderation table — all rental orders platform-wide, filterable by status
// app/(dashboardGroup)/_components/admin/AdminRentalsTable.tsx
// Server-compatible (no hooks): works in a Server or Client tree.
import Image from 'next/image';
import { CalendarDays, ImageOff, PackageSearch } from 'lucide-react';

import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { cn } from '@/lib/utils';
import type { RentalOrder } from '@/lib/types';

interface AdminRentalsTableProps {
  rentals: RentalOrder[];
}

/* ---------- helpers ---------- */

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const fmt = (d: string | Date) => dateFmt.format(new Date(d));

const money = (value: number | string) => `৳${Number(value).toLocaleString('en-US')}`;

function days(rental: RentalOrder) {
  const n = rental.totalDays ?? 1;
  return `${n} ${n === 1 ? 'day' : 'days'}`;
}

function Thumb({ src, alt, size }: { src?: string; alt: string; size: string }) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-md border border-border bg-muted',
        size,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes="64px" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageOff className="h-4 w-4" aria-hidden />
        </div>
      )}
    </div>
  );
}

/* ---------- component ---------- */

export function AdminRentalsTable({ rentals }: AdminRentalsTableProps) {
  if (rentals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <PackageSearch className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No rentals match this filter
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try a different status to see more orders.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Order</th>
              <th scope="col" className="px-5 py-3 font-medium">Rental period</th>
              <th scope="col" className="px-5 py-3 text-right font-medium">Qty</th>
              <th scope="col" className="px-5 py-3 text-right font-medium">Amount</th>
              <th scope="col" className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rentals.map((rental) => (
              <tr
                key={rental.id}
                className={cn(
                  'transition-colors hover:bg-muted/30',
                  rental.status === 'CANCELLED' && 'opacity-70',
                )}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Thumb
                      src={rental.gear?.images?.[0]}
                      alt={rental.gear?.title ?? 'Gear'}
                      size="h-11 w-11"
                    />
                    <div className="min-w-0">
                      <p className="max-w-[240px] truncate font-medium text-foreground">
                        {rental.gear?.title ?? 'Gear item'}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        #{rental.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-foreground">
                    {fmt(rental.startDate)} – {fmt(rental.endDate)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{days(rental)}</p>
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-foreground">
                  {rental.quantity}
                </td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                  {money(rental.totalAmount)}
                </td>
                <td className="px-5 py-3.5">
                  <OrderStatusBadge status={rental.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-border md:hidden">
        {rentals.map((rental) => (
          <li key={rental.id} className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Thumb
                src={rental.gear?.images?.[0]}
                alt={rental.gear?.title ?? 'Gear'}
                size="h-14 w-14"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-medium text-foreground">
                    {rental.gear?.title ?? 'Gear item'}
                  </p>
                  <OrderStatusBadge status={rental.status} />
                </div>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  #{rental.id.slice(0, 8)}
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 space-y-0.5">
                <p className="flex items-center gap-1.5 text-sm text-foreground">
                  <CalendarDays
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  {fmt(rental.startDate)} – {fmt(rental.endDate)}
                </p>
                <p className="pl-5 text-xs text-muted-foreground">
                  {days(rental)} · Qty {rental.quantity}
                </p>
              </div>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {money(rental.totalAmount)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-border bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
        {rentals.length} {rentals.length === 1 ? 'rental' : 'rentals'}
      </div>
    </div>
  );
}