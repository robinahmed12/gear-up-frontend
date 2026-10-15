// app/(publicGroup)/_components/CategoryShowcase.tsx
import Link from 'next/link';
import { Tent, Bike, Waves, Snowflake, Dumbbell, ArrowRight } from 'lucide-react';

const categories = [
  { label: 'Camping', icon: Tent, href: '/gear?category=camping', count: 'Tents, packs, cookware' },
  { label: 'Cycling', icon: Bike, href: '/gear?category=cycling', count: 'Bikes, helmets, racks' },
  { label: 'Water Sports', icon: Waves, href: '/gear?category=water-sports', count: 'Kayaks, boards, vests' },
  { label: 'Winter Sports', icon: Snowflake, href: '/gear?category=winter-sports', count: 'Skis, boards, boots' },
  { label: 'Fitness', icon: Dumbbell, href: '/gear?category=fitness', count: 'Weights, mats, benches' },
];

export function CategoryShowcase() {
  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Shop by category
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map(({ label, icon: Icon, href, count }) => (
          <Link
            key={label}
            href={href}
            className="group relative overflow-hidden rounded-lg bg-primary p-5 text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Icon className="h-7 w-7 text-primary-foreground/70 transition-colors group-hover:text-accent" />
            <h3 className="mt-4 font-semibold">{label}</h3>
            <p className="mt-1 text-xs text-primary-foreground/60">{count}</p>
            <ArrowRight className="mt-3 h-4 w-4 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  );
}