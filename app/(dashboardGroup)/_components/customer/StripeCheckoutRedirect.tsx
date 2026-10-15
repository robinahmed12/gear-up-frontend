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
  clientSecret: string;
  deposit?: { amount: number; clientSecret: string; status: string };
}

export function CheckoutForm({
  orderId,
  amount,
  currency,
  clientSecret,
  deposit,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage(
        'Payment form is still loading. Please wait a moment and try again.',
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // confirmPayment drives the Payment Element (cards, wallets, redirect
      // methods). `redirect: 'if_required'` keeps us on the page for the
      // non-redirect case so we can also authorize the deposit hold before
      // navigating; 3-D Secure / redirect methods fall back to return_url.
      const { error: chargeError, paymentIntent: chargeIntent } =
        await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
          },
          redirect: 'if_required',
        });

      if (chargeError) {
        setErrorMessage(chargeError.message ?? 'Charge could not be completed.');
        router.push(`/payment/cancel?orderId=${orderId}`);
        return;
      }

      if (!chargeIntent) {
        // Stripe is redirecting the customer (3-D Secure or a redirect-based
        // method); it will return to `return_url` on its own.
        return;
      }

      // Authorize the security-deposit hold (manual capture) on the same
      // payment method that just paid the rental charge.
      if (deposit?.clientSecret && chargeIntent.payment_method) {
        const paymentMethodId =
          typeof chargeIntent.payment_method === 'string'
            ? chargeIntent.payment_method
            : chargeIntent.payment_method.id;

        const { error: depositError } = await stripe.confirmCardPayment(
          deposit.clientSecret,
          { payment_method: paymentMethodId },
        );

        if (depositError) {
          setErrorMessage(
            depositError.message ??
              'Security deposit authorization failed; contact support.',
          );
          return;
        }
      }

      router.push(`/payment/success?orderId=${orderId}`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Payment failed unexpectedly. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
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
