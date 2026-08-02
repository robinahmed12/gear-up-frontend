// app/(dashboardGroup)/admin-dashboard/rentals/page.tsx
import { getAdminRentals } from '@/service/getAdminRentals';
import { AdminRentalsTable } from '../../_components/admin/AdminRentalsTable';
import { AdminRentalsFilters } from '../../_components/admin/AdminRentalsFilters';
import Link from 'next/link';

interface AdminRentalsPageProps {
  searchParams: { status?: string; page?: string };
}

export default async function AdminRentalsPage({ searchParams }: AdminRentalsPageProps) {
  // Await the promise before accessing properties
  const params = await searchParams;

  const page = params.page ? Number(params.page) : 1;

  const result = await getAdminRentals({ status: params.status, page });
  const rentals = result.success ? result.data : [];
  const meta = result.success ? result.meta : undefined;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Rental oversight</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All rental orders across every provider on the platform.
          </p>
        </div>
        <AdminRentalsFilters />
      </div>

      <AdminRentalsTable rentals={rentals} />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </span>
          <div className="flex gap-2">
            <Link
              href={`?status=${searchParams.status ?? ''}&page=${Math.max(1, page - 1)}`}
              aria-disabled={page <= 1}
              className={`rounded-md border border-border px-3 py-1.5 ${
                page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-muted'
              }`}
            >
              Previous
            </Link>
            <Link
              href={`?status=${searchParams.status ?? ''}&page=${page + 1}`}
              aria-disabled={page >= meta.totalPages}
              className={`rounded-md border border-border px-3 py-1.5 ${
                page >= meta.totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-muted'
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
