import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: 'How do I rent gear?', a: 'Browse available gear, filter by category or price, select your dates, and complete checkout. You will receive a confirmation with pickup details.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards through Stripe. Some listings may also support wallet payments like Apple Pay or Google Pay.' },
  { q: 'What is a security deposit?', a: 'Some providers require a temporary hold on your card to cover potential damage. The hold is released automatically after the gear is returned in good condition.' },
  { q: 'How do I list my gear?', a: 'Register as a provider, add your gear with photos and pricing, set your availability, and start receiving bookings. Payouts are processed after each completed rental.' },
  { q: 'Can I cancel a booking?', a: 'Cancellations depend on the order status. You can cancel placed orders before confirmation. Once confirmed, contact the provider directly.' },
  { q: 'What if the gear is damaged?', a: 'Report any damage immediately through your order page. Our support team will mediate between you and the provider to resolve the issue fairly.' },
  { q: 'How do I contact a provider?', a: 'Once you place an order, you can message the provider directly from your dashboard to arrange pickup details.' },
  { q: 'Is there a late return fee?', a: 'Late returns may incur additional daily charges set by the provider. Always confirm the return date and time before your rental period ends.' },
];

export default function Page() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Help Center</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Everything you need to know about renting and listing gear on GearUp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border bg-card shadow-sm">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                aria-expanded={open === i}
              >
                <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="border-t border-border px-5 py-4">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
