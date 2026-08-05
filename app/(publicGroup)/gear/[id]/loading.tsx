// Skeleton for gear detail page
// app/(publicGroup)/gear/[id]/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function PublicgroupGearByIdLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-xl" />

          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-square rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Gear Details */}
        <div className="space-y-6">
          <Skeleton className="h-5 w-28" />

          <Skeleton className="h-10 w-3/4" />

          <Skeleton className="h-5 w-40" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[70%]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>

          <Skeleton className="h-14 w-full rounded-lg" />

          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}