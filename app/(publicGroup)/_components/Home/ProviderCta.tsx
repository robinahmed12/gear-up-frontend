// app/(publicGroup)/_components/ProviderCta.tsx
import Link from 'next/link';
import { ArrowRight, Tent } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProviderCta() {
  return (
    <section
      id="become-a-provider"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-2xl bg-accent px-6 py-12 text-accent-foreground sm:px-12 sm:py-16">
        <Tent className="absolute -right-6 -top-6 h-40 w-40 text-accent-foreground/10" />

        <div className="relative max-w-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Have gear sitting in storage?</h2>
          <p className="mt-3 text-sm text-accent-foreground/85 sm:text-base">
            List it on GearUp and earn from the days it is not being used. You set the price,
            the stock, and the availability — we handle bookings and payments.
          </p>
          <Button asChild size="lg" className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/register">
              Become a provider
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}