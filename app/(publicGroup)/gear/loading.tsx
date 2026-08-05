// app/(publicGroup)/gear/loading.tsx

export default function PublicgroupGearLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-96 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filter Sidebar */}
          <aside className="hidden lg:block">
            <div className="rounded-xl border p-5">
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

          {/* Gear Grid */}
          <section>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border bg-card"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] animate-pulse bg-muted" />

                  {/* Content */}
                  <div className="space-y-4 p-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

                    <div className="flex items-center justify-between">
                      <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}