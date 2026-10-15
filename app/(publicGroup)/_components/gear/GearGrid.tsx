// app/(publicGroup)/_components/gear/GearGrid.tsx
import Link from 'next/link';
import { PackageSearch } from 'lucide-react';
import type { Gear } from '@/lib/types';
import GearCard from './GearCard';

interface GearGridProps {
  gears: Gear[];
}

export default function GearGrid({ gears }: GearGridProps) {
  if (!gears || gears.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <PackageSearch className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="mt-4 text-base font-semibold text-foreground">
          No gear matches your filters
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try widening your price range, choosing another category, or clearing your filters.
        </p>
        <Link
          href="/gear"
          className="mt-5 inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:bg-accent/90"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {gears.map((gear) => (
        <GearCard key={gear.id} gear={gear} />
      ))}
    </div>
  );
}
