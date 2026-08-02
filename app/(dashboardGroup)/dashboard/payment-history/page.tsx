import { getMyPayments } from "@/service/getMyPayments";
import PaymentHistoryTable from "../../_components/customer/PaymentHistoryTable";

export default async function PaymentsPage() {
  const response = await getMyPayments();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        Payment History
      </h1>

      <PaymentHistoryTable payments={response.data ?? []} />
    </>
  );
}