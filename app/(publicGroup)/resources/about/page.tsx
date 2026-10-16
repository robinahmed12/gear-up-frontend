import { Target, Users, Leaf, ShieldCheck } from 'lucide-react';

const values = [
  { icon: Target, title: 'Accessibility', desc: 'Make outdoor and utility gear accessible to everyone, regardless of budget or storage space.' },
  { icon: Users, title: 'Community', desc: 'Connect people who need gear with people who have it, building trust through every transaction.' },
  { icon: Leaf, title: 'Sustainability', desc: 'Reduce waste by maximizing the use of existing gear instead of buying new.' },
  { icon: ShieldCheck, title: 'Trust & Safety', desc: 'Verified accounts, secure payments, and clear agreements protect both renters and providers.' },
];

const stats = [
  { value: '2,500+', label: 'Gear Listed' },
  { value: '8,000+', label: 'Rentals Completed' },
  { value: '4.8/5', label: 'Average Rating' },
  { value: '98%', label: 'On-time Returns' },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">About Us</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Mission
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            GearUp was founded on a simple idea: everyone deserves access to quality gear without the cost of ownership. We are building the most trusted marketplace for peer-to-peer gear rental.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
              <p className="text-2xl font-bold text-foreground sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-foreground">Our Values</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
