import { ShieldCheck, CreditCard, UserCheck, FileText, AlertTriangle, Lock } from 'lucide-react';

const features = [
  { icon: UserCheck, title: 'Identity Verification', desc: 'All providers and renters are verified before their first transaction.' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'All payments are processed through Stripe with PCI-DSS compliance.' },
  { icon: ShieldCheck, title: 'Security Deposits', desc: 'Optional deposits protect providers against damage or loss.' },
  { icon: FileText, title: 'Rental Agreements', desc: 'Clear terms are set for every listing so both sides know what to expect.' },
  { icon: AlertTriangle, title: 'Damage Protection', desc: 'Report issues immediately and our team will mediate fairly.' },
  { icon: Lock, title: 'Data Privacy', desc: 'Your personal information is encrypted and never shared without consent.' },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Safety & Trust</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your Safety, Our Priority
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Every transaction on GearUp is protected by multiple layers of security and verification.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-foreground">Need Help?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              If you encounter any issue during a rental, contact our support team at{' '}
              <span className="font-medium text-primary">support@gearup.com</span> and we will respond within 24 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
