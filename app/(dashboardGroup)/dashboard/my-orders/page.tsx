import { getMyRentals } from "@/service/getMyRentals";
import OrderHistoryTable from "../../_components/customer/OrderHistoryTable";

export default async function OrdersPage() {
  const response = await getMyRentals();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      <OrderHistoryTable rentals={response.data ?? []} />
    </>
  );
}