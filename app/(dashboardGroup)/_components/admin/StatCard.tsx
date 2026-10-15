// app/(dashboardGroup)/_components/admin/StatCard.tsx
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {trend && (
        <p
          className={cn(
            'mt-3 text-xs font-medium',
            trend.positive ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {trend.value}
        </p>
      )}
    </div>
  );
}
