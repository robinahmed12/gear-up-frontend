// app/(dashboardGroup)/dashboard/page.tsx
import Link from 'next/link';
import { ClipboardList, Wallet, Clock, ArrowRight, Star } from 'lucide-react';
import { getMyRentals } from '@/service/getMyRentals';
import { getMyPayments } from '@/service/getMyPayments';
import { StatCard } from '../_components/admin/StatCard';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { Button } from '@/components/ui/button';
import { Payment, RentalOrder } from '@/lib/types';

export default async function CustomerDashboardPage() {
  const [rentalsResult, paymentsResult] = await Promise.all([
    getMyRentals(),
    getMyPayments(),
  ]);

  const rentals = rentalsResult.success ? rentalsResult.data : [];
  const payments = paymentsResult.success ? paymentsResult.data : [];

  const activeRentals = rentals.filter((r: RentalOrder) =>
    ['CONFIRMED', 'PAID', 'PICKED_UP'].includes(r.status),
  );
  const awaitingPayment = rentals.filter((r :RentalOrder) => r.status === 'CONFIRMED');
  const readyToReview = rentals.filter((r : RentalOrder) => r.status === 'RETURNED');

  const totalSpent = payments
    .filter((p: Payment) => p.status === 'COMPLETED')
    .reduce((sum: number, p: Payment) => sum + Number(p.amount), 0);

  const recentRentals = [...rentals]
    .sort((a, b) => (a.status === 'CONFIRMED' ? -1 : b.status === 'CONFIRMED' ? 1 : 0))
    .slice(0, 5);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your rentals, payments, and orders.
        </p>
      </div>

      {/* Awaiting payment banner — only shows when relevant */}
      {awaitingPayment.length > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {awaitingPayment.length} order{awaitingPayment.length === 1 ? '' : 's'} waiting on payment
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Complete payment to lock in your rental.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href={`/dashboard/orders/${awaitingPayment[0].id}/pay`}>Pay now</Link>
          </Button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total rentals"
          value={rentals.length}
          icon={ClipboardList}
          trend={{ value: `${activeRentals.length} currently active` }}
        />
        <StatCard
          label="Total spent"
          value={`৳${totalSpent.toLocaleString()}`}
          icon={Wallet}
          trend={{ value: `${payments.length} payment${payments.length === 1 ? '' : 's'}` }}
        />
        <StatCard
          label="Pending"
          value={awaitingPayment.length}
          icon={Clock}
          trend={
            awaitingPayment.length > 0
              ? { value: 'Needs payment', positive: false }
              : { value: 'Nothing pending', positive: true }
          }
        />
      </div>

      {/* Ready to review — only shows when relevant */}
      {readyToReview.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-rating/30 bg-rating/10 p-4">
          <Star className="mt-0.5 h-4 w-4 shrink-0 fill-rating text-rating" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              {readyToReview.length} rental{readyToReview.length === 1 ? '' : 's'} ready for a review
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Let other renters know how it went.
            </p>
          </div>
        </div>
      )}

      {/* Recent rentals + quick links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-sm font-semibold text-foreground">Recent rentals</h2>
            <Link
              href="/dashboard/my-orders"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentRentals.length === 0 ? (
            <div className="flex flex-col items-center p-8 text-center">
              <p className="text-sm text-muted-foreground">No rentals yet.</p>
              <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/gear">Browse gear</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentRentals.map((rental) => (
                <div key={rental.id} className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {rental.id.slice(0, 8)}...
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {new Date(rental.startDate).toLocaleDateString()} –{' '}
                      {new Date(rental.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">
                      ৳{rental.totalAmount.toLocaleString()}
                    </span>
                    <OrderStatusBadge status={rental.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Quick links</h2>
          <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/gear">Browse gear</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/my-orders">My orders</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/profile">Profile settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}