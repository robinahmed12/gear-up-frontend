import Link from 'next/link';
import { PlusCircle, DollarSign, Calendar, ShieldCheck, TrendingUp, Package } from 'lucide-react';

const steps = [
  { icon: PlusCircle, title: 'Create Account', desc: 'Sign up as a provider in under two minutes. No listing fees.' },
  { icon: Package, title: 'Add Your Gear', desc: 'Upload photos, write descriptions, and set your daily price.' },
  { icon: Calendar, title: 'Manage Availability', desc: 'Set blocked dates and control when your gear is available.' },
  { icon: DollarSign, title: 'Get Paid', desc: 'Receive secure payouts after each completed rental.' },
];

const benefits = [
  { icon: TrendingUp, title: 'Earn Passive Income', desc: 'Turn unused gear into a steady revenue stream.' },
  { icon: ShieldCheck, title: 'Protected Rentals', desc: 'Security deposits and verified renters keep you safe.' },
  { icon: Calendar, title: 'Full Control', desc: 'Set your own prices, availability, and rental terms.' },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">For Providers</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Rent Out Your Gear
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Turn your unused gear into income. List items in minutes, set your prices, and reach thousands of renters.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Start Earning
            </Link>
            <Link href="/gear" className="inline-flex h-10 items-center rounded-md border border-input bg-background px-5 text-sm font-medium text-foreground hover:bg-secondary">
              View Listings
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-foreground">How It Works</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
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

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-foreground">Why List on GearUp?</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
