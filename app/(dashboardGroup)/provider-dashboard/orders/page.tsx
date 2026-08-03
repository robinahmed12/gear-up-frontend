
import { getProviderOrders } from '@/service/getProviderOrders';
import { IncomingOrdersTable } from '../../_components/provider/IncomingOrdersTable';

export default async function ProviderDashboardOrdersPage() {
  const result = await getProviderOrders({ limit: 50 });
  const orders = result.success ? result.data : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Incoming orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm, mark picked up, and mark returned as customers move through their rentals.
        </p>
      </div>

      <IncomingOrdersTable initialOrders={orders} />
    </div>
  );
}
