// lib/stripe.ts
import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | undefined;

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();

// A real Stripe key is `pk_test_` / `pk_live_` followed by at least 20
// alphanumerics. The placeholder shipped in `.env.example` is
// `pk_test_xxxxx...`, which Stripe rejects with a 401. Detect a missing or
// placeholder key up front so the UI can explain the problem instead of
// silently failing to load.
export function isStripeConfigured(): boolean {
  return Boolean(
    PUBLISHABLE_KEY &&
      /^pk_(test|live)_[A-Za-z0-9]{20,}$/.test(PUBLISHABLE_KEY) &&
      !/x{10,}/i.test(PUBLISHABLE_KEY),
  );
}

// Singleton — loadStripe() should only ever be called once per page load,
// calling it on every render would re-inject Stripe.js repeatedly.
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(PUBLISHABLE_KEY as string);
  }
  return stripePromise;
}
