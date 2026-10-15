// app/(publicGroup)/_components/FeaturedGear.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import GearGrid from '../gear/GearGrid';
import { getGear } from '../../_actions/getGearList';



export async function FeaturedGear() {
  const gear = await getGear();
    

  if (gear.length === 0) return null;

  return (
    <section id="featured-gear" className="scroll-mt-20 bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-accent">
              Top rated
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured gear
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/gear">
              Browse all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10">
          <GearGrid gears={gear.data} />
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/gear">
              Browse all gear
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}