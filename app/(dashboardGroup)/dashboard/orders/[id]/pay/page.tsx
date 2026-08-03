// app/(dashboardGroup)/dashboard/orders/[id]/pay/page.tsx
import { redirect } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { createPaymentAction } from '../../../../_actions/paymentActions';
import { CheckoutForm } from '@/app/(dashboardGroup)/_components/customer/StripeCheckoutRedirect';


interface PayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { id } = await params;

  const result = await createPaymentAction(id);

  if (!result.success || !result.data) {
    // Most likely cause: order isn't CONFIRMED yet, or doesn't belong to
    // this customer — the backend's own error message explains why.
    redirect(`/dashboard?paymentError=${encodeURIComponent(result.message)}`);
  }

  const { clientSecret, amount } = result.data;

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Complete payment</h1>
        <p className="mt-1 text-sm text-muted-foreground">Order #{id.slice(0, 8)}</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
          <span className="text-sm text-muted-foreground">Total due</span>
          <span className="text-xl font-bold text-foreground">৳{amount.toLocaleString()}</span>
        </div>

        <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <CheckoutForm orderId={id} amount={amount} />
        </Elements>
      </div>
    </div>
  );
}