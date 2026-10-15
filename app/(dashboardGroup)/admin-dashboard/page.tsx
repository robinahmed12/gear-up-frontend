// app/(dashboardGroup)/admin-dashboard/page.tsx
import { Users, Store, PackageCheck, ClipboardList, Wallet, ShieldCheck } from 'lucide-react';
import { getAdminStats } from '@/service/getAdminStats';
import { StatCard } from '../_components/admin/StatCard';
import { PageHeader } from '../_components/PageHeader';
import { RentalStatusChart } from '../_components/admin/RentalStatusChart';

export default async function AdminDashboardPage() {
  const { data: stats } = await getAdminStats();

  const pendingActions = stats.rentalsByStatus.PLACED + stats.rentalsByStatus.CONFIRMED;

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        icon={ShieldCheck}
        title="Platform overview"
        description="Everything happening across the marketplace."
      />


      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: `${stats.totalCustomers} customers · ${stats.totalProviders} providers` }}
        />
        <StatCard
          label="Active gear"
          value={stats.activeGear}
          icon={PackageCheck}
          trend={{ value: `of ${stats.totalGear} total listings` }}
        />
        <StatCard
          label="Total rentals"
          value={stats.totalRentals}
          icon={ClipboardList}
          trend={
            pendingActions > 0
              ? { value: `${pendingActions} awaiting action`, positive: false }
              : { value: 'All caught up', positive: true }
          }
        />
        <StatCard
          label="Revenue"
          value={`৳${stats.totalRevenue.toLocaleString()}`}
          icon={Wallet}
          trend={{ value: 'From picked-up & returned rentals' }}
        />
      </div>

      {/* Status breakdown + quick links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RentalStatusChart data={stats.rentalsByStatus} />
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Needs attention</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Newly placed orders</span>
            <span className="font-semibold text-foreground">{stats.rentalsByStatus.PLACED}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Providers</span>
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <Store className="h-3.5 w-3.5 text-primary" />
              {stats.totalProviders}
            </span>
          </div>
          <p className="pt-2 text-xs text-muted-foreground">
            Visit Users or Rentals from the sidebar to take action on these.
          </p>
        </div>
      </div>
    </div>
  );
}
