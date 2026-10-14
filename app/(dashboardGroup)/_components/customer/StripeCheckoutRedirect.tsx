// Client Component — loads @stripe/stripe-js, redirects to Stripe Checkout using the clientSecret/session URL returned by paymentActions.ts createPaymentAction
// app/(dashboardGroup)/_components/customer/CheckoutForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { Button } from '@/components/ui/button';

interface CheckoutFormProps {
  orderId: string;
  amount: number;
  currency: string;
}

export function CheckoutForm({ orderId, amount, currency }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // This confirmPayment call is the actual charge attempt — it talks
    // directly to Stripe, not our backend. Stripe then fires the
    // payment_intent.succeeded/failed webhook your backend already
    // handles, which is what actually flips Payment.status and
    // RentalOrder.status to PAID. This redirect is just for the UI.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed. Please try again.');
      setIsProcessing(false);
      router.push(`/payment/cancel?orderId=${orderId}`);
    }
    // On success, Stripe redirects to return_url itself — no manual
    // router.push needed in the happy path.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <p
          role="alert"
          className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
        >
          {errorMessage}
        </p>
      )}

      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        size="lg"
      >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${formatMoney(amount, currency)}`
          )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />
        Payments are processed securely by Stripe
      </p>
    </form>
  );
}