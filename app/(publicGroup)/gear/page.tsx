// app/(publicGroup)/gear/page.tsx
import { getGear, type GearSort } from '../_actions/getGearList';
import { getCategories } from '../_actions/getCategories';
import GearFilters from '../_components/gear/GearFilters';
import GearGrid from '../_components/gear/GearGrid';
import GearSortSelect from '../_components/gear/GearSort';
import GearPagination from '../_components/gear/GearPagination';

const PAGE_SIZE = 12;
const SORT_VALUES: GearSort[] = ['latest', 'price_asc', 'price_desc', 'rating'];

interface GearPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    isAvailable?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function PublicGroupGearPage({ searchParams }: GearPageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const sort = SORT_VALUES.includes(params.sort as GearSort)
    ? (params.sort as GearSort)
    : undefined;
  const isAvailable = params.isAvailable === 'true' ? true : undefined;

  const [gearResponse, categoryResponse] = await Promise.all([
    getGear({
      search: params.search,
      category: params.category,
      minPrice: params.minPrice !== undefined && params.minPrice !== '' ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice !== undefined && params.maxPrice !== '' ? Number(params.maxPrice) : undefined,
      isAvailable,
      sort,
      page,
      limit: PAGE_SIZE,
    }),
    getCategories(),
  ]);

  const gears = gearResponse?.data ?? [];
  const meta = gearResponse?.meta;
  const total = meta?.total ?? gears.length;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? page;
  const limit = meta?.limit ?? PAGE_SIZE;

  const showingFrom = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const showingTo = Math.min(currentPage * limit, total);

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Gear marketplace
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Browse sports gear
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Rent quality sports and outdoor equipment by the day, from real local providers.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters — desktop sidebar + mobile drawer, both in this one component */}
          <aside>
            <div className="lg:sticky lg:top-20">
              <GearFilters categories={categoryResponse?.data ?? []} />
            </div>
          </aside>

          {/* Gear list */}
          <section className="min-w-0">
            {/* Results toolbar */}
            <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {total === 0 ? (
                  'No items found'
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-medium text-foreground">
                      {showingFrom}–{showingTo}
                    </span>{' '}
                    of <span className="font-medium text-foreground">{total}</span>{' '}
                    {total === 1 ? 'item' : 'items'}
                  </>
                )}
              </p>
              <GearSortSelect />
            </div>

            <GearGrid gears={gears} />

            {totalPages > 1 && (
              <GearPagination
                page={currentPage}
                totalPages={totalPages}
                className="mt-10"
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
