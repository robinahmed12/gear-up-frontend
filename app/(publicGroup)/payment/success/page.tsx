// app/(publicGroup)/payment/success/page.tsx
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentSuccessPageProps {
  searchParams: Promise<{ orderId?: string; payment_intent?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-foreground">Payment successful</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your rental is confirmed. The provider has been notified to prepare your gear.
        </p>
        <p className="mt-4 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          A receipt has been sent to your email address in case you need it for
          your records.
        </p>
        {orderId && (
          <p className="mt-1 text-xs text-muted-foreground">Order #{orderId.slice(0, 8)}</p>
        )}

        <Button asChild className="mt-6 w-full">
          <Link href="/dashboard">Go to my orders</Link>
        </Button>
      </div>
    </div>
  );
}