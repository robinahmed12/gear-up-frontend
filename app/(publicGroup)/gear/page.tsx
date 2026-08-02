// app/(publicGroup)/gear/page.tsx
import { getGear } from '../_actions/getGearList';
import { getCategories } from '../_actions/getCategories';
import GearFilters from '../_components/gear/GearFilters';
import GearGrid from '../_components/gear/GearGrid';

interface GearPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    availableFrom?: string;
    availableTo?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function PublicGroupGearPage({ searchParams }: GearPageProps) {
  const params = await searchParams;

  const [gearResponse, categoryResponse] = await Promise.all([
    getGear({
      search: params.search,
      category: params.category,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      availableFrom: params.availableFrom,
      availableTo: params.availableTo,
      sort: params.sort,
      page: params.page ? Number(params.page) : 1,
    }),
    getCategories(),
  ]);

  const gears = gearResponse?.data ?? [];
  const total = gearResponse?.meta?.total;

  return (
    <main className="bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Browse sports gear
          </h1>
          <p className="mt-2 text-muted-foreground">
            Rent quality sports and outdoor equipment instantly.
            {typeof total === 'number' && (
              <span className="ml-1 font-medium text-foreground">{total} items available</span>
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters — desktop sidebar + mobile drawer, both live in this one component */}
          <aside>
            <div className="lg:sticky lg:top-20">
              <GearFilters categories={categoryResponse?.data ?? []} />
            </div>
          </aside>

          {/* Gear list */}
          <section>
            <GearGrid gears={gears} />
          </section>
        </div>
      </div>
    </main>
  );
}