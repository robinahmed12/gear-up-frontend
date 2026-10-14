import { redirect } from "next/navigation";
import { createPaymentAction } from "../../../../_actions/paymentActions";
import { getRentalBreakdownAction } from "../../../../_actions/rentalActions";
import StripeCheckout from "@/app/(dashboardGroup)/_components/customer/StripeCheckout";

interface PayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { id } = await params;

  const [paymentResult, breakdownResult] = await Promise.all([
    createPaymentAction(id),
    getRentalBreakdownAction(id),
  ]);

  if (!paymentResult.success || !paymentResult.data) {
    redirect(`/dashboard?paymentError=${encodeURIComponent(paymentResult.message)}`);
  }

  return (
    <StripeCheckout
      orderId={id}
      clientSecret={paymentResult.data.clientSecret}
      amount={paymentResult.data.amount}
      breakdown={breakdownResult.success ? breakdownResult.data : undefined}
    />
  );
}
