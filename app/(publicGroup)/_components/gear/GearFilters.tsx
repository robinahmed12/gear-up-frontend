// app/(publicGroup)/_components/gear/GearFilters.tsx
'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
}

interface GearFiltersProps {
  categories: Category[];
}

const FILTER_KEYS = ['search', 'category', 'minPrice', 'maxPrice', 'isAvailable'] as const;

export default function GearFilters({ categories }: GearFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urlSearch = searchParams.get('search') ?? '';
  const urlMin = searchParams.get('minPrice') ?? '';
  const urlMax = searchParams.get('maxPrice') ?? '';
  const urlSignature = `${urlSearch}\u0000${urlMin}\u0000${urlMax}`;

  // Local input state, kept in sync with the URL during render rather than in
  // an effect, so back/forward and "clear all" reset the fields immediately.
  const [search, setSearch] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState(urlMin);
  const [maxPrice, setMaxPrice] = useState(urlMax);
  const [prevSignature, setPrevSignature] = useState(urlSignature);

  if (urlSignature !== prevSignature) {
    setPrevSignature(urlSignature);
    setSearch(urlSearch);
    setMinPrice(urlMin);
    setMaxPrice(urlMax);
  }

  const category = searchParams.get('category') ?? '';
  const availableOnly = searchParams.get('isAvailable') === 'true';

  function navigate(params: URLSearchParams) {
    params.set('page', '1');
    router.push(`/gear?${params.toString()}`);
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(params);
  }

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    navigate(params);
  }

  // Search updates the URL 400ms after typing stops, not on every keystroke.
  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => updateFilter('search', value), 400);
  }

  // Price has two fields; debounce both together so we only navigate once.
  function handlePriceChange(key: 'minPrice' | 'maxPrice', value: string) {
    const nextMin = key === 'minPrice' ? value : minPrice;
    const nextMax = key === 'maxPrice' ? value : maxPrice;

    if (key === 'minPrice') setMinPrice(value);
    else setMaxPrice(value);

    if (priceTimer.current) clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      // Skip the request when the range is impossible — backend rejects min > max.
      if (nextMin && nextMax && Number(nextMin) > Number(nextMax)) return;
      const params = new URLSearchParams(searchParams.toString());
      if (nextMin) params.set('minPrice', nextMin);
      else params.delete('minPrice');
      if (nextMax) params.set('maxPrice', nextMax);
      else params.delete('maxPrice');
      navigate(params);
    }, 500);
  }

  function clearFilters() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (priceTimer.current) clearTimeout(priceTimer.current);
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setIsMobileOpen(false);
    router.push('/gear');
  }

  const activeFilterCount = FILTER_KEYS.filter((key) => searchParams.get(key)).length;

  const activeChips: { key: string; label: string }[] = [];
  if (urlSearch) activeChips.push({ key: 'search', label: `“${urlSearch}”` });
  if (category) {
    const name = categories.find((c) => c.id === category)?.name ?? 'Category';
    activeChips.push({ key: 'category', label: name });
  }
  if (urlMin) activeChips.push({ key: 'minPrice', label: `Min ৳${urlMin}` });
  if (urlMax) activeChips.push({ key: 'maxPrice', label: `Max ৳${urlMax}` });
  if (availableOnly) activeChips.push({ key: 'isAvailable', label: 'Available only' });

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
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Category</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateFilter('category', '')}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition',
              category === ''
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input bg-background text-foreground hover:bg-secondary',
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => updateFilter('category', c.id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition',
                category === c.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background text-foreground hover:bg-secondary',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Price per day</span>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ৳
            </span>
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Min"
              className="pl-7"
              value={minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ৳
            </span>
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Max"
              className="pl-7"
              value={maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Availability</span>
        <button
          type="button"
          role="switch"
          aria-checked={availableOnly}
          onClick={() => updateFilter('isAvailable', availableOnly ? '' : 'true')}
          className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition hover:bg-secondary"
        >
          <span>Available only</span>
          <span
            className={cn(
              'relative h-5 w-9 rounded-full transition-colors',
              availableOnly ? 'bg-primary' : 'bg-muted-foreground/30',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                availableOnly ? 'translate-x-4' : 'translate-x-0.5',
              )}
            />
          </span>
        </button>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear all filters
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
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close filters"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filterBody}</div>
            <div className="border-t border-border p-4">
              <Button className="w-full" onClick={() => setIsMobileOpen(false)}>
                Show results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden rounded-xl border border-border bg-card p-5 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {activeFilterCount} active
            </span>
          )}
        </div>

        {activeChips.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeFilter(chip.key)}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/70"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        {filterBody}
      </div>
    </>
  );
}
