// app/(publicGroup)/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function PublicgroupLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/5 rounded-lg" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />

            <div className="flex gap-4 pt-2">
              <Skeleton className="h-11 w-36 rounded-lg" />
              <Skeleton className="h-11 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gear */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border bg-card"
            >
              <Skeleton className="aspect-[4/3] w-full" />

              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />

                <div className="flex items-center justify-between pt-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}