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
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Collect the card payment method once so the same card can authorize
    // both the rental charge and the separate security-deposit hold.
    const { paymentMethod, error: pmError } =
      await stripe.createPaymentMethod({ elements });
    if (pmError || !paymentMethod) {
      setErrorMessage(pmError?.message ?? 'Unable to process card details.');
      setIsProcessing(false);
      return;
    }

    const { error: chargeError, paymentIntent: chargeIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
        return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
      });

    if (chargeError || !chargeIntent || chargeIntent.status !== 'succeeded') {
      setErrorMessage(chargeError?.message ?? 'Charge could not be completed.');
      setIsProcessing(false);
      router.push(`/payment/cancel?orderId=${orderId}`);
      return;
    }

    // Authorize the security-deposit hold (manual capture) on the same card.
    if (deposit?.clientSecret) {
      const { error: depositError, paymentIntent: depositIntent } =
        await stripe.confirmCardPayment(deposit.clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (depositError || !depositIntent) {
        setErrorMessage(
          depositError?.message ??
            'Security deposit authorization failed; contact support.',
        );
        setIsProcessing(false);
        return;
      }
    }

    router.push(`/payment/success?orderId=${orderId}`);
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
