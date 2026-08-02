// Customer overview — renders <OrderHistoryTable/> + <PaymentHistoryTable/>. Consumes service/getMyRentals.ts, service/getMyPayments.ts for initial SSR data

export default async function CustomerDashboardPage() {
  return (
    <main className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>

        <p className="text-muted-foreground">
          Manage your rentals, payments and orders.
        </p>
      </div>

      {/* Order History */}
      {/* 
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Rental Order History</h2>

          <p className="text-sm text-muted-foreground">
            Track your gear rental status.
          </p>
        </div>

        <OrderHistoryTable rentals={rentals} />
      </section> */}

      {/* Payment History */}

      {/* <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Payment History</h2>

          <p className="text-sm text-muted-foreground">
            View all your payment records.
          </p>
        </div>

        <PaymentHistoryTable payments={payments} />
      </section> */}
    </main>
  );
}
