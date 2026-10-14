// app/(dashboardGroup)/admin-dashboard/payments/page.tsx
import { getAdminPaymentsAction } from '@/app/(dashboardGroup)/_actions/adminPaymentActions';
import { formatMoney } from '@/lib/format';

export default async function AdminPaymentsPage() {
  const result = await getAdminPaymentsAction();
  const payments = Array.isArray(result.data) ? result.data : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {payments.length} payments
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No payments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted">
              <tr>
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p: any) => (
                <tr key={p.id} className="border-b">
                  <td className="p-4">{p.rentalOrderId?.slice(0, 8)}</td>
                  <td className="p-4">{formatMoney(Number(p.amount), p.currency ?? 'USD')}</td>
                  <td className="p-4">{p.status}</td>
                  <td className="p-4">{p.method}</td>
                  <td className="p-4 text-muted-foreground text-xs">
                    Actions available via refund/deposit endpoints.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
