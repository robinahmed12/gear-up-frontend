// Single gear card — image, availability, rating, provider, price/day
import Image from 'next/image';
import Link from 'next/link';
import { Star, Store } from 'lucide-react';
import type { Gear } from '@/lib/types';
import { cn } from '@/lib/utils';

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i <= rounded ? 'fill-rating text-rating' : 'text-muted-foreground/40',
          )}
        />
      ))}
    </span>
  );
}

export default function GearCard({ gear }: { gear: Gear }) {
  const rating = Number(gear.averageRating) || 0;
  const reviews = Number(gear.reviewCount) || 0;

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={gear.images?.[0] ?? '/placeholder.png'}
          alt={gear.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={cn(
            'absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm',
            gear.isAvailable
              ? 'bg-primary text-primary-foreground'
              : 'bg-destructive text-white',
          )}
        >
          {gear.isAvailable ? 'Available' : 'Unavailable'}
        </span>
        {gear.category?.name && (
          <span className="absolute right-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
            {gear.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
          {gear.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          <Stars rating={rating} />
          <span className="font-medium text-foreground">
            {reviews > 0 ? rating.toFixed(1) : 'New'}
          </span>
          {reviews > 0 && <span>({reviews})</span>}
        </div>

        {gear.provider?.name && (
          <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Store className="h-3.5 w-3.5 shrink-0" />
            {gear.provider.name}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <p className="text-lg font-bold text-foreground">
            ৳{gear.pricePerDay}
            <span className="text-sm font-normal text-muted-foreground">/day</span>
          </p>
          <span className="text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
