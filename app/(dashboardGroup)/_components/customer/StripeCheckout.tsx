"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { formatMoney } from "@/lib/format";
import { CheckoutForm } from "./StripeCheckoutRedirect";
import type { RentalBreakdown } from "@/lib/types";

interface Props {
  orderId: string;
  clientSecret: string;
  amount: number;
  breakdown?: RentalBreakdown;
  deposit?: { amount: number; clientSecret: string; status: string };
}

export default function StripeCheckout({
  orderId,
  clientSecret,
  amount,
  breakdown,
  deposit,
}: Props) {
  const currency = breakdown?.currency ?? "USD";
  const stripeConfigured = isStripeConfigured();

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Complete Payment</h1>
        <p className="text-muted-foreground">Order #{orderId.slice(0, 8)}</p>
      </div>

      <div className="rounded-lg border p-5">
        {breakdown && (
          <div className="mb-5 space-y-1.5 border-b pb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatMoney(breakdown.subtotal, currency)}</span>
            </div>
            {breakdown.serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span>{formatMoney(breakdown.serviceFee, currency)}</span>
              </div>
            )}
            {breakdown.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatMoney(breakdown.taxAmount, currency)}</span>
              </div>
            )}
            {breakdown.depositAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Security deposit (refundable, held separately)
                </span>
                <span>{formatMoney(breakdown.depositAmount, currency)}</span>
              </div>
            )}
          </div>
        )}

        <div className="mb-5 flex justify-between border-b pb-4">
          <span>Total Due</span>
          <span className="font-bold">{formatMoney(amount, currency)}</span>
        </div>

        {stripeConfigured ? (
          <Elements
            stripe={getStripe()}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <CheckoutForm orderId={orderId} amount={amount} currency={currency} clientSecret={clientSecret} deposit={deposit} />
          </Elements>
        ) : (
          <p
            role="alert"
            className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            Payment is unavailable because Stripe is not configured. Set a valid
            <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
            </code>
            in the frontend environment and restart the app.
          </p>
        )}
      </div>
    </div>
  );
}

