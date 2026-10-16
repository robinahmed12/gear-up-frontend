// Server-compatible component (no hooks) — can be used in a Server or Client tree.
import { CreditCard, Receipt } from 'lucide-react';

import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Payment } from '@/lib/types';

interface PaymentHistoryTableProps {
  payments: Payment[];
}

/* ---------- status styling (theme tokens, works in light + dark) ---------- */

const STATUS: Record<string, { label: string; badge: string; dot: string }> = {
  PENDING: {
    label: 'Pending',
    badge: 'bg-accent/15 text-accent',
    dot: 'bg-accent',
  },
  COMPLETED: {
    label: 'Completed',
    badge: 'bg-primary/15 text-primary',
    dot: 'bg-primary',
  },
  PARTIALLY_REFUNDED: {
    label: 'Partially refunded',
    badge: 'bg-rating/20 text-foreground',
    dot: 'bg-rating',
  },
  REFUNDED: {
    label: 'Refunded',
    badge: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  FAILED: {
    label: 'Failed',
    badge: 'bg-destructive/15 text-destructive',
    dot: 'bg-destructive',
  },
};

function humanize(value?: string | null) {
  if (!value) return '—';
  const text = value.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? {
    label: humanize(status),
    badge: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium',
        s.badge,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} aria-hidden />
      {s.label}
    </span>
  );
}

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function paidAt(value?: string | Date | null) {
  return value ? dateFmt.format(new Date(value)) : null;
}

function gearName(payment: Payment) {
  const rental = (payment as any).rental;
  return rental?.gear?.title ?? rental?.gear?.name ?? 'Gear rental';
}

/* ---------- component ---------- */

export default function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Receipt className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">No payments yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Payments for your rentals will appear here once you check out.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Gear</th>
              <th scope="col" className="px-5 py-3 font-medium">Method</th>
              <th scope="col" className="px-5 py-3 font-medium">Status</th>
              <th scope="col" className="px-5 py-3 font-medium">Paid on</th>
              <th scope="col" className="px-5 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => {
              const currency = payment.currency ?? 'USD';
              const date = paidAt(payment.paidAt);
              return (
                <tr key={payment.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-4">
                    <p className="max-w-[260px] truncate font-medium text-foreground">
                      {gearName(payment)}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      #{String(payment.id).slice(0, 8)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-foreground">
                      <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden />
                      {humanize(payment.method)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-5 py-4">
                    {date ? (
                      <span className="text-foreground">{date}</span>
                    ) : (
                      <span className="text-muted-foreground">Not paid yet</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <p className="font-semibold tabular-nums text-foreground">
                      {formatMoney(payment.amount, currency)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{currency}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-border md:hidden">
        {payments.map((payment) => {
          const currency = payment.currency ?? 'USD';
          const date = paidAt(payment.paidAt);
          return (
            <li key={payment.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{gearName(payment)}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    #{String(payment.id).slice(0, 8)}
                  </p>
                </div>
                <StatusBadge status={payment.status} />
              </div>

              <div className="flex items-end justify-between gap-3">
                <div className="space-y-1 text-sm">
                  <p className="inline-flex items-center gap-1.5 text-foreground">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                    {humanize(payment.method)}
                  </p>
                  <p className={date ? 'text-muted-foreground' : 'text-muted-foreground/80'}>
                    {date ?? 'Not paid yet'}
                  </p>
                </div>
                <p className="text-lg font-semibold tabular-nums text-foreground">
                  {formatMoney(payment.amount, currency)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
        {payments.length} {payments.length === 1 ? 'payment' : 'payments'}
      </div>
    </div>
  );
}