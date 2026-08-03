// Provider overview — total gear listed, active rentals, pending orders. Consumes service/getProviderGear.ts, service/getProviderOrders.ts
// app/(dashboardGroup)/provider-dashboard/page.tsx
import Link from 'next/link';
import { Package, Clock, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react';
import { getProviderGear } from '@/service/getProviderGear';
import { getProviderOrders } from '@/service/getProviderOrders';
import { StatCard } from '../_components/admin/StatCard';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { Button } from '@/components/ui/button';

export default async function DashboardgroupProviderDashboardPage() {
  const [gearResult, ordersResult] = await Promise.all([
    getProviderGear(),
    getProviderOrders({ limit: 50 }),
  ]);

  const gear = gearResult.success ? gearResult.data : [];
  const orders = ordersResult.success ? ordersResult.data : [];

  const pendingOrders = orders.filter((o) => o.status === 'PLACED');
  const activeRentals = orders.filter((o) =>
    ['CONFIRMED', 'PAID', 'PICKED_UP'].includes(o.status),
  );
  const lowStockGear = gear.filter((g) => g.isAvailable && g.stock <= 1);

  // Most recent orders needing a glance, prioritizing anything the
  // provider actually needs to act on (PLACED) over settled ones.
  const recentOrders = [...orders]
    .sort((a, b) => (a.status === 'PLACED' ? -1 : b.status === 'PLACED' ? 1 : 0))
    .slice(0, 5);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What is happening with your listings right now.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Gear listed"
          value={gear.length}
          icon={Package}
          trend={{ value: `${gear.filter((g) => g.isAvailable).length} currently available` }}
        />
        <StatCard
          label="Active rentals"
          value={activeRentals.length}
          icon={TrendingUp}
          trend={{ value: 'Confirmed, paid, or picked up' }}
        />
        <StatCard
          label="Pending orders"
          value={pendingOrders.length}
          icon={Clock}
          trend={
            pendingOrders.length > 0
              ? { value: 'Awaiting your confirmation', positive: false }
              : { value: 'All caught up', positive: true }
          }
        />
      </div>

      {/* Low stock warning — only shows if relevant, not a permanent fixture */}
      {lowStockGear.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              {lowStockGear.length} item{lowStockGear.length === 1 ? '' : 's'} running low on stock
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {lowStockGear.map((g) => g.title).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Recent orders + quick links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-sm font-semibold text-foreground">Recent orders</h2>
            <Link
              href="/provider-dashboard/orders"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {order.id.slice(0, 8)}...
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {new Date(order.startDate).toLocaleDateString()} –{' '}
                      {new Date(order.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">
                      ৳{order.totalAmount.toLocaleString()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Quick actions</h2>
          <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/provider-dashboard/gear/new">List new gear</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/provider-dashboard/orders">Manage orders</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/provider-dashboard/gear">View inventory</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}