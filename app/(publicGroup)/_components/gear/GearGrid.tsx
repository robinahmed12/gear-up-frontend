// app/(publicGroup)/_components/gear/GearGrid.tsx
import Image from "next/image";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Gear } from "@/lib/types";



interface GearGridProps {
  gears: Gear[];
}

export default function GearGrid({ gears }: GearGridProps) {
  

  if (!gears.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <PackageSearch className="h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-sm font-medium text-foreground">
          No gear matches your filters
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try widening your price range or clearing a filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
  {gears.map((gear) => (
    <Link
      key={gear.id}
      href={`/gear/${gear.id}`}
      className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        <Image
          src={gear.images?.[0] ?? "/placeholder.png"}
          alt={gear.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            gear.isAvailable
              ? "bg-primary text-primary-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {gear.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="space-y-2 p-4">
        {gear.category?.name && (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {gear.category.name}
          </p>
        )}

        <h3 className="line-clamp-1 text-base font-semibold text-foreground">
          {gear.title}
        </h3>

        <div className="flex items-baseline justify-between pt-1">
          <p className="text-lg font-bold text-foreground">
            ৳{gear.pricePerDay}
            <span className="text-sm font-normal text-muted-foreground">
              /day
            </span>
          </p>
          <span className="text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </div>
    </Link>
  ))}
</div>

  );
}
