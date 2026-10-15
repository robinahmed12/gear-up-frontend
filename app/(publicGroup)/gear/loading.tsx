// app/(publicGroup)/gear/loading.tsx

import GearSkeleton from '../_components/gear/GearSkeleton';

export default function PublicgroupGearLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-9 w-72 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filter sidebar */}
          <aside className="hidden lg:block">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-5 h-6 w-28 animate-pulse rounded bg-muted" />
              <div className="space-y-5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                  </div>
                ))}
                <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          </aside>

          {/* Results + grid */}
          <section className="min-w-0">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <GearSkeleton key={index} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
