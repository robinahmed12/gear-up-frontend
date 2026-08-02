// app/(dashboardGroup)/_components/admin/StatCard.tsx
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {trend && (
        <p
          className={`mt-3 text-xs font-medium ${
            trend.positive ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {trend.value}
        </p>
      )}
    </div>
  );
}