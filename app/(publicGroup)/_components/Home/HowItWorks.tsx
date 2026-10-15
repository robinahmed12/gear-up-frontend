// app/(publicGroup)/_components/HowItWorks.tsx
import { Search, CalendarCheck, PackageCheck, Undo2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Find your gear',
    description: 'Search by category, price, or availability. Every listing shows real stock and provider ratings.',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Pick your dates',
    description: 'Choose a rental window, pay securely, and get instant confirmation from the provider.',
  },
  {
    number: '03',
    icon: PackageCheck,
    title: 'Pick it up',
    description: "Grab your gear from the provider once they've confirmed and marked it ready.",
  },
  {
    number: '04',
    icon: Undo2,
    title: 'Bring it back',
    description: 'Return it, get marked complete, and leave a review for the next renter.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-accent">
          How it works
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Four steps, no hassle
        </h2>
      </div>

      <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ number, icon: Icon, title, description }, i) => (
          <li key={number} className="relative">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-secondary">{number}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

            {/* connecting line to next step, desktop only */}
            {i < steps.length - 1 && (
              <div className="absolute right-[-1rem] top-5 hidden h-px w-8 bg-border lg:block" />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}