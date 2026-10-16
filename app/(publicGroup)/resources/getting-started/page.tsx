import Link from 'next/link';
import { Search, CalendarCheck, CreditCard, Package, PlusCircle, DollarSign, ShieldCheck } from 'lucide-react';

const rentSteps = [
  { icon: Search, title: 'Browse & Filter', desc: 'Search by category, price range, and availability to find the perfect gear.' },
  { icon: CalendarCheck, title: 'Pick Your Dates', desc: 'Select rental dates and check real-time availability.' },
  { icon: CreditCard, title: 'Pay Securely', desc: 'Checkout with Stripe. Your payment is protected end-to-end.' },
  { icon: Package, title: 'Pick Up & Enjoy', desc: 'Meet the provider, grab your gear, and make memories.' },
];

const listSteps = [
  { icon: PlusCircle, title: 'Create Account', desc: 'Sign up as a provider in under two minutes.' },
  { icon: Package, title: 'Add Your Gear', desc: 'Upload photos, set a daily price, and describe your item.' },
  { icon: DollarSign, title: 'Earn Income', desc: 'Get paid securely when renters book your gear.' },
  { icon: ShieldCheck, title: 'Stay Protected', desc: 'Security deposits and verification keep you safe.' },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Getting Started</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How GearUp Works
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Whether you want to rent gear for your next adventure or earn money listing your own, GearUp makes it simple.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-foreground">Renting Gear</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rentSteps.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-xs font-medium text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-foreground">Listing Your Gear</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listSteps.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <step.icon className="h-5 w-5 text-accent" />
              </div>
              <p className="mt-4 text-xs font-medium text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-xl font-semibold text-foreground">Ready to get started?</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/gear" className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Browse Gear
              </Link>
              <Link href="/register" className="inline-flex h-10 items-center rounded-md border border-input bg-background px-5 text-sm font-medium text-foreground hover:bg-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
