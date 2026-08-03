"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { CheckoutForm } from "./StripeCheckoutRedirect";

interface Props {
  orderId: string;
  clientSecret: string;
  amount: number;
}

export default function StripeCheckout({
  orderId,
  clientSecret,
  amount,
}: Props) {
  return (
    <div className="mx-auto max-w-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Complete Payment
        </h1>

        <p className="text-muted-foreground">
          Order #{orderId.slice(0, 8)}
        </p>
      </div>

      <div className="rounded-lg border p-5">
        <div className="mb-5 flex justify-between border-b pb-4">
          <span>Total Due</span>

          <span className="font-bold">
            ৳{amount.toLocaleString()}
          </span>
        </div>

        <Elements
          stripe={getStripe()}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          <CheckoutForm
            orderId={orderId}
            amount={amount}
          />
        </Elements>
      </div>
    </div>
  );
}