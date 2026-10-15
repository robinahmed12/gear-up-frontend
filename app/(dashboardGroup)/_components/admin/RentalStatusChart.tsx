// app/(dashboardGroup)/_components/admin/RentalStatusChart.tsx
import type { RentalStatus } from '@/lib/types';

interface RentalStatusChartProps {
  data: Record<RentalStatus, number>;
}

// Same status → color mapping as <OrderStatusBadge>, kept consistent so
// a "CONFIRMED" bar here and a "CONFIRMED" badge on the orders table
// always mean the same color across the whole app.
const statusConfig: Record<RentalStatus, { label: string; barClass: string; dotClass: string }> = {
  PLACED: { label: 'Placed', barClass: 'bg-amber-500', dotClass: 'bg-amber-500' },
  CONFIRMED: { label: 'Confirmed', barClass: 'bg-blue-500', dotClass: 'bg-blue-500' },
  PAID: { label: 'Paid', barClass: 'bg-purple-500', dotClass: 'bg-purple-500' },
  PICKED_UP: { label: 'Picked up', barClass: 'bg-primary', dotClass: 'bg-primary' },
  RETURNED: { label: 'Returned', barClass: 'bg-muted-foreground/40', dotClass: 'bg-muted-foreground/40' },
  CANCELLED: { label: 'Cancelled', barClass: 'bg-destructive', dotClass: 'bg-destructive' },
};

export function RentalStatusChart({ data }: RentalStatusChartProps) {
  const total = Object.values(data).reduce((sum, n) => sum + n, 0);
  const statuses = Object.keys(statusConfig) as RentalStatus[];

  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center text-sm text-muted-foreground">
        No rental orders yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Rentals by status</h3>

      {/* Stacked bar */}
      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {statuses.map((status) => {
          const count = data[status];
          if (count === 0) return null;
          const pct = (count / total) * 100;
          return (
            <div
              key={status}
              className={statusConfig[status].barClass}
              style={{ width: `${pct}%` }}
              title={`${statusConfig[status].label}: ${count}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        {statuses.map((status) => (
          <div key={status} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusConfig[status].dotClass}`} />
            <span className="text-xs text-muted-foreground">{statusConfig[status].label}</span>
            <span className="ml-auto text-xs font-semibold text-foreground">{data[status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
