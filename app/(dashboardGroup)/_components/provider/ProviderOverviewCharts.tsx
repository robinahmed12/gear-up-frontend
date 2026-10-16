'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Package, Clock, TrendingUp } from 'lucide-react';

interface StatusDatum {
  name: string;
  value: number;
}

interface Props {
  statusData: StatusDatum[];
  gearAvailable: number;
  gearTotal: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2,300 70% 50%))', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

// Fallback simple palette in case chart CSS vars are not defined.
const FALLBACK = ['#2f6b4f', '#f97316', '#eab308', '#6366f1', '#ec4899', '#14b8a6'];

export default function ProviderOverviewCharts({ statusData, gearAvailable, gearTotal }: Props) {
  const palette = FALLBACK;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Orders by status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
              >
                {statusData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {statusData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: palette[index % palette.length] }}
              />
              <span className="text-muted-foreground">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Inventory snapshot</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Gear', available: gearAvailable, total: gearTotal }]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="total" fill="#d1d5db" radius={[6, 6, 0, 0]} name="Total" />
              <Bar dataKey="available" fill="#2f6b4f" radius={[6, 6, 0, 0]} name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">{gearTotal}</div>
            <div className="text-xs text-muted-foreground">Listed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{gearAvailable}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{gearTotal - gearAvailable}</div>
            <div className="text-xs text-muted-foreground">Unavailable</div>
          </div>
        </div>
      </div>
    </div>
  );
}
