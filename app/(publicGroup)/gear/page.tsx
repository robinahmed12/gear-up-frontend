// /gear — Browse & filter. Server Component reading searchParams, delegates to _actions/getGearList.ts + getCategories.ts, renders <GearFilters/> + <GearGrid/>




import { getGear } from "../_actions/getGearList";
import { getCategories } from "../_actions/getCategories";
import GearFilters from "../_components/gear/GearFilters";
import GearGrid from "../_components/gear/GearGrid";


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


export default async function PublicgroupGearPage({
  searchParams,
}: GearPageProps) {


  const params = await searchParams;


  const [
    gearResponse,
    categoryResponse,
  ] = await Promise.all([
    getGear({
      search: params.search,
      category: params.category,
      minPrice: params.minPrice
        ? Number(params.minPrice)
        : undefined,
      maxPrice: params.maxPrice
        ? Number(params.maxPrice)
        : undefined,
      availableFrom: params.availableFrom,
      availableTo: params.availableTo,
      sort: params.sort,
      page: params.page
        ? Number(params.page)
        : 1,
    }),

    getCategories(),
  ]);



  return (
    <main className="container mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Browse Sports Gear
        </h1>

        <p className="text-muted-foreground">
          Rent quality sports and outdoor equipment instantly.
        </p>
      </div>


      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">


        {/* Filters */}
        <aside className="lg:col-span-1">
          <GearFilters
            categories={
              categoryResponse?.data ?? []
            }
          />
        </aside>



        {/* Gear List */}
        <section className="lg:col-span-3">

          <GearGrid
            gears={
              gearResponse?.data ?? []
            }
          />

        </section>


      </div>

    </main>
  );
}