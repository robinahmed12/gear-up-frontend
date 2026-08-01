// Payment history table w/ status + method + paidAt columns
"use client";

interface Payment {
  id: string;

  amount: number;

  status: string;

  method: string;

  paidAt?: string;

  rental?: {
    gear?: {
      name: string;
    };
  };
}

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

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted">
          <tr>
            <th className="p-4 text-left">Gear</th>

            <th className="p-4 text-left">Amount</th>

            <th className="p-4 text-left">Status</th>

            <th className="p-4 text-left">Method</th>

            <th className="p-4 text-left">Paid At</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b">
              <td className="p-4">
                {payment.rental?.gear?.name ?? "Gear Rental"}
              </td>

              <td className="p-4 font-medium">৳{payment.amount}</td>

              <td className="p-4">
                <span
                  className={`
                      rounded-full px-3 py-1 text-xs font-medium
                      ${
                        payment.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }
                    `}
                >
                  {payment.status}
                </span>
              </td>

              <td className="p-4">{payment.method}</td>

              <td className="p-4 text-muted-foreground">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString()
                  : "Not paid yet"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
