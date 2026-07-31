// Customer overview — renders <OrderHistoryTable/> + <PaymentHistoryTable/>. Consumes service/getMyRentals.ts, service/getMyPayments.ts for initial SSR data

export default function DashboardgroupDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">dashboardGroup / dashboard — page</h1>
      <p className="text-sm text-muted-foreground">
        Placeholder — see the comment above this component for what belongs here.
      </p>
    </div>
  );
}
