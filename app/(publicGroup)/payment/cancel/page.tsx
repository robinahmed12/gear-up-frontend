// app/(publicGroup)/payment/cancel/page.tsx
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentCancelPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentCancelPage({ searchParams }: PaymentCancelPageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-8 w-8 text-destructive" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-foreground">Payment didn't go through</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order is still confirmed and waiting — no charge was made. You can try again
          anytime.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {orderId && (
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href={`/dashboard/orders/${orderId}/pay`}>Try again</Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Back to my orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}