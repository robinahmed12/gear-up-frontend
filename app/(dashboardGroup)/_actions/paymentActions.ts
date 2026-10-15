// app/(dashboardGroup)/_actions/paymentActions.ts
'use server';

import { cookies } from 'next/headers';

interface CreatePaymentResult {
  success: boolean;
  message: string;
  replayed?: boolean;
  data?: {
    paymentId: string;
    clientSecret: string;
    amount: number;
    gearTitle: string;
    deposit?: {
      amount: number;
      clientSecret: string | null;
      status: string;
    };
  };
}

/**
 * Calls the backend's PaymentIntent creation endpoint. The backend's real
 * "confirm" step never happens through a client-called endpoint — it's the
 * Stripe webhook that's the only trustworthy source of "did this actually
 * succeed." This action just gets us the clientSecret so Stripe Elements
 * can collect card details and call stripe.confirmPayment() directly
 * against Stripe, client-side.
 */
export async function createPaymentAction(
  rentalOrderId: string,
  idempotencyKey?: string,
): Promise<CreatePaymentResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const key = idempotencyKey ?? crypto.randomUUID();

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Idempotency-Key': key,
      },
      body: JSON.stringify({ rentalOrderId, method: 'STRIPE' }),
    });

    const replayed = res.headers.get('Idempotency-Replayed') === 'true';

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to start payment' };
    }

    return {
      success: true,
      message: result.message,
      replayed,
      data: {
        paymentId: result.data.payment.id,
        clientSecret: result.data.clientSecret,
        // amount is a stringified Decimal ("600") over the wire — coerce
        // once, here, so every consumer downstream gets a real number.
        amount: Number(result.data.payment.amount),
        gearTitle: result.data.payment.rentalOrder.gear.title,
        deposit: result.data.deposit?.clientSecret
          ? {
              amount: Number(result.data.deposit.amount),
              clientSecret: result.data.deposit.clientSecret,
              status: result.data.deposit.status,
            }
          : undefined,
      },
    };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}