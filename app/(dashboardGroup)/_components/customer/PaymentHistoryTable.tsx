import { formatMoney } from '@/lib/format';
import { Payment } from '@/lib/types';

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export default function PaymentHistoryTable({
  payments,
}: PaymentHistoryTableProps) {
  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No payment history found.</p>
      </div>
    );
  }

  const statusClass: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    PARTIALLY_REFUNDED: 'bg-orange-100 text-orange-700',
    REFUNDED: 'bg-gray-100 text-gray-700',
    FAILED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted">
          <tr>
            <th className="p-4 text-left">Gear</th>

            <th className="p-4 text-left">Amount</th>

            <th className="p-4 text-left">Currency</th>

            <th className="p-4 text-left">Status</th>

            <th className="p-4 text-left">Method</th>

            <th className="p-4 text-left">Paid At</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b">
              <td className="p-4">
                {(payment as any).rental?.gear?.title ??
                  (payment as any).rental?.gear?.name ??
                  'Gear Rental'}
              </td>

              <td className="p-4 font-medium">
                {formatMoney(payment.amount, payment.currency ?? 'USD')}
              </td>

              <td className="p-4">{payment.currency ?? 'USD'}</td>

              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusClass[payment.status] ?? 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {payment.status}
                </span>
              </td>

              <td className="p-4">{payment.method}</td>

              <td className="p-4 text-muted-foreground">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString()
                  : 'Not paid yet'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
