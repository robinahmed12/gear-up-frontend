import { redirect } from "next/navigation";
import { createPaymentAction } from "../../../../_actions/paymentActions";
import StripeCheckout from "@/app/(dashboardGroup)/_components/customer/StripeCheckout";

interface PayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { id } = await params;

  const result = await createPaymentAction(id);

  if (!result.success || !result.data) {
    redirect(
      `/dashboard?paymentError=${encodeURIComponent(result.message)}`
    );
  }

  return (
    <StripeCheckout
      orderId={id}
      clientSecret={result.data.clientSecret}
      amount={result.data.amount}
    />
  );
}