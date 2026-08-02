// app/(dashboardGroup)/_components/admin/AdminRentalsFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { RentalStatus } from '@/lib/types';

const statusOptions: { value: RentalStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'PLACED', label: 'Placed' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PICKED_UP', label: 'Picked up' },
  { value: 'RETURNED', label: 'Returned' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function AdminRentalsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateStatus(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    router.push(`/admin-dashboard/rentals?${params.toString()}`);
  }

  return (
    <select
      className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      value={searchParams.get('status') ?? ''}
      onChange={(e) => updateStatus(e.target.value)}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}