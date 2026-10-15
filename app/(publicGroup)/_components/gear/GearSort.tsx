// app/(publicGroup)/_components/gear/GearSort.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

const sortOptions = [
  { value: 'latest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

export default function GearSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'latest') {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');
    router.push(`/gear?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="gear-sort"
        className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:inline-flex"
      >
        <ArrowUpDown className="h-3.5 w-3.5" />
        Sort
      </label>
      <select
        id="gear-sort"
        aria-label="Sort gear"
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:ring-1 focus-visible:ring-ring sm:w-auto"
        value={searchParams.get('sort') ?? 'latest'}
        onChange={(e) => updateSort(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
