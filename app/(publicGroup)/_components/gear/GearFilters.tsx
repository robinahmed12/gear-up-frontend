// app/(publicGroup)/_components/gear/GearFilters.tsx
'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
}

interface GearFiltersProps {
  categories: Category[];
}

const sortOptions = [
  { value: '', label: 'Sort by' },
  { value: 'latest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

export default function GearFilters({ categories }: GearFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urlSearchValue = searchParams.get('search') ?? '';

  // Local input state, kept in sync with the URL during render rather than
  // in a useEffect. React's own guidance: when local state needs to reset
  // whenever an external value (here, the URL) changes, compare against a
  // tracked "previous" value and call setState directly in the render body
  // — React re-renders immediately with the corrected state before
  // painting, instead of committing a stale render then firing an effect
  // that causes a second, cascading render.
  const [prevUrlSearchValue, setPrevUrlSearchValue] = useState(urlSearchValue);
  const [searchValue, setSearchValue] = useState(urlSearchValue);

  if (urlSearchValue !== prevUrlSearchValue) {
    setPrevUrlSearchValue(urlSearchValue);
    setSearchValue(urlSearchValue);
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set('page', '1');
    router.push(`/gear?${params.toString()}`);
  }

  // Search updates the URL 400ms after typing stops, not on every keystroke.
  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateFilter('search', value), 400);
  }

  function clearFilters() {
    setSearchValue('');
    router.push('/gear');
    setIsMobileOpen(false);
  }

  const activeFilterCount = ['search', 'category', 'minPrice', 'maxPrice', 'sort'].filter((key) =>
    searchParams.get(key),
  ).length;

  const filterBody = (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label htmlFor="gear-search" className="text-sm font-medium text-foreground">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="gear-search"
            placeholder="Tent, mountain bike, kayak..."
            className="pl-9"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="gear-category" className="text-sm font-medium text-foreground">
          Category
        </label>
        <select
          id="gear-category"
          className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchParams.get('category') ?? ''}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Price per day</span>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={searchParams.get('minPrice') ?? ''}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
          />
          <Input
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={searchParams.get('maxPrice') ?? ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label htmlFor="gear-sort" className="text-sm font-medium text-foreground">
          Sort
        </label>
        <select
          id="gear-sort"
          className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchParams.get('sort') ?? ''}
          onChange={(e) => updateFilter('sort', e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile trigger bar */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-card p-3 lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setIsMobileOpen(true)} className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-background p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close filters"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterBody}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden rounded-lg border border-border bg-card p-5 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {activeFilterCount} active
            </span>
          )}
        </div>
        {filterBody}
      </div>
    </>
  );
}