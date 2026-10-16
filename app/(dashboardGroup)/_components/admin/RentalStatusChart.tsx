'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { RentalStatus } from '@/lib/types';

interface RentalStatusChartProps {
  data: Record<RentalStatus, number>;
}

const statusConfig: Record<RentalStatus, { label: string; color: string }> = {
  PLACED: { label: 'Placed', color: '#f59e0b' },
  CONFIRMED: { label: 'Confirmed', color: '#3b82f6' },
  PAID: { label: 'Paid', color: '#a855f7' },
  PICKED_UP: { label: 'Picked up', color: '#2f6b4f' },
  RETURNED: { label: 'Returned', color: '#9ca3af' },
  CANCELLED: { label: 'Cancelled', color: '#ef4444' },
};

export function RentalStatusChart({ data }: RentalStatusChartProps) {
  const total = Object.values(data).reduce((sum, n) => sum + n, 0);
  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center text-sm text-muted-foreground">
        No rental orders yet.
      </div>
    );
  }

  const chartData = (Object.keys(statusConfig) as RentalStatus[])
    .filter((s) => data[s] > 0)
    .map((s) => ({ name: statusConfig[s].label, value: data[s], color: statusConfig[s].color }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Rentals by status</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
