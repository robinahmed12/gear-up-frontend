// app/(publicGroup)/_components/HeroBanner.tsx
import Link from 'next/link';
import { Search, ArrowRight, Tent, Bike, Waves, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickCategories = [
  { label: 'Camping', icon: Tent, href: '/gear?category=camping' },
  { label: 'Cycling', icon: Bike, href: '/gear?category=cycling' },
  { label: 'Water Sports', icon: Waves, href: '/gear?category=water-sports' },
  { label: 'Winter Sports', icon: Snowflake, href: '/gear?category=winter-sports' },
];

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Topographic contour-line texture — ties directly to the trail-map
          world of outdoor gear rather than a generic gradient */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={i}
            cx={620 - i * 15}
            cy={120 + i * 10}
            rx={260 - i * 34}
            ry={180 - i * 24}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse
            key={`b-${i}`}
            cx={140 + i * 12}
            cy={480 - i * 10}
            rx={200 - i * 28}
            ry={140 - i * 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium tracking-wide uppercase">
            Rent gear, not regrets
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Gear up. Get outside.
            <br />
            <span className="text-accent">Bring it back.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
            Tents, bikes, kayaks, and everything else your next trip needs —
            rented by the day, from real gear shops and outdoor pros near you.
          </p>

          {/* Search row */}
          <form
            action="/gear"
            className="mt-8 flex flex-col gap-2 rounded-lg bg-background p-2 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                name="search"
                placeholder="Search for a tent, mountain bike, kayak..."
                className="w-full bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Find Gear
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick category links */}
          <div className="mt-6 flex flex-wrap gap-2">
            {quickCategories.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 px-3 py-1.5 text-sm text-primary-foreground/90 transition-colors hover:bg-primary-foreground/10"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}