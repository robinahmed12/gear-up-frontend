// Client Component — search + category + price range + availability filter controls, syncs to URL search params via useRouter/useSearchParams
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface Category {
  id: string;
  name: string;
}


interface GearFiltersProps {
  categories: Category[];
}


export default function GearFilters({
  categories,
}: GearFiltersProps) {

  const router = useRouter();
  const searchParams = useSearchParams();


  function updateFilter(
    key: string,
    value: string
  ) {

    const params = new URLSearchParams(
      searchParams.toString()
    );


    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }


    params.set("page", "1");

    router.push(`/gear?${params.toString()}`);
  }



  function clearFilters() {
    router.push("/gear");
  }



  return (
    <div className="space-y-5 rounded-lg border p-5">

      <h2 className="text-xl font-semibold">
        Filters
      </h2>


      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Search
        </label>

        <Input
          placeholder="Search gear..."
          defaultValue={
            searchParams.get("search") ?? ""
          }
          onChange={(e) =>
            updateFilter(
              "search",
              e.target.value
            )
          }
        />

      </div>



      {/* Category */}
      <div>

        <label className="mb-2 block text-sm font-medium">
          Category
        </label>


        <select
          className="w-full rounded-md border p-2"
          value={
            searchParams.get("category") ?? ""
          }
          onChange={(e)=>
            updateFilter(
              "category",
              e.target.value
            )
          }
        >

          <option value="">
            All Categories
          </option>


          {
            categories.map((category)=>(
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))
          }

        </select>

      </div>




      {/* Price */}
      <div className="grid grid-cols-2 gap-3">

        <Input
          type="number"
          placeholder="Min price"
          defaultValue={
            searchParams.get("minPrice") ?? ""
          }
          onChange={(e)=>
            updateFilter(
              "minPrice",
              e.target.value
            )
          }
        />


        <Input
          type="number"
          placeholder="Max price"
          defaultValue={
            searchParams.get("maxPrice") ?? ""
          }
          onChange={(e)=>
            updateFilter(
              "maxPrice",
              e.target.value
            )
          }
        />

      </div>




      {/* Sort */}

      <select
        className="w-full rounded-md border p-2"
        value={
          searchParams.get("sort") ?? ""
        }
        onChange={(e)=>
          updateFilter(
            "sort",
            e.target.value
          )
        }
      >

        <option value="">
          Sort By
        </option>

        <option value="price_asc">
          Price Low to High
        </option>

        <option value="price_desc">
          Price High to Low
        </option>

        <option value="latest">
          Latest
        </option>

      </select>



      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Clear Filters
      </Button>


    </div>
  );
}