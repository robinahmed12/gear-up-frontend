// app/(publicGroup)/_components/TrustFeatures.tsx
import { ShieldCheck, Star, CreditCard, MapPin } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified providers',
    description: 'Every provider is a registered account with a tracked rental history — not an anonymous listing.',
  },
  {
    icon: CreditCard,
    title: 'Secure payments',
    description: 'Payments run through Stripe. Your card details never touch our servers.',
  },
  {
    icon: Star,
    title: 'Real reviews only',
    description: "Reviews are locked to renters who actually completed a rental. No fake five-stars.",
  },
  {
    icon: MapPin,
    title: 'Local pickup',
    description: 'Gear stays local — pick up and return in person, no shipping wait.',
  },
];

export function TrustFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-lg border border-border bg-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}