// Read-only moderation table — all gear listings across every provider
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImageOff, PackageSearch, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Gear } from "@/lib/types";

interface AdminGearTableProps {
  gears: Gear[];
}

/* ---------- small pieces ---------- */

function Thumb({ src, alt, size }: { src?: string; alt: string; size: string }) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md border border-border bg-muted",
        size,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes="64px" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageOff className="h-4 w-4" aria-hidden />
        </div>
      )}
    </div>
  );
}

function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        available
          ? "bg-primary/15 text-primary"
          : "bg-destructive/15 text-destructive",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          available ? "bg-primary" : "bg-destructive",
        )}
        aria-hidden
      />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

const price = (value: number | string) => `৳${Number(value).toLocaleString("en-US")}`;

/* ---------- component ---------- */

export default function AdminGearTable({ gears }: AdminGearTableProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const names = new Set<string>();
    gears.forEach((g) => g.category?.name && names.add(g.category.name));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [gears]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return gears.filter((g) => {
      if (category !== "all" && g.category?.name !== category) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        (g.brand ?? "").toLowerCase().includes(q) ||
        (g.provider?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [gears, query, category]);

  const hasFilters = query !== "" || category !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  if (gears.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <PackageSearch className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">No gear found</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Listings from providers will appear here once they add gear.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search gear, brand or provider"
            aria-label="Search gear"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-52"
        >
          <option value="all">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <p className="text-sm text-muted-foreground sm:ml-auto" aria-live="polite">
          {visible.length} of {gears.length} {gears.length === 1 ? "listing" : "listings"}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {visible.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-foreground">No gear matches your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or category.
            </p>
            {hasFilters && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Gear</th>
                    <th scope="col" className="px-5 py-3 font-medium">Category</th>
                    <th scope="col" className="px-5 py-3 font-medium">Provider</th>
                    <th scope="col" className="px-5 py-3 font-medium">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Price per day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((gear) => (
                    <tr key={gear.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Thumb src={gear.images?.[0]} alt={gear.title} size="h-12 w-12" />
                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate font-medium text-foreground">
                              {gear.title}
                            </p>
                            {gear.brand && (
                              <p className="mt-0.5 text-xs text-muted-foreground">{gear.brand}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {gear.category?.name ? (
                          <span className="inline-flex rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            {gear.category.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Uncategorised</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-foreground">
                        {gear.provider?.name ?? (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <AvailabilityBadge available={!!gear.isAvailable} />
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                        {price(gear.pricePerDay)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-border md:hidden">
              {visible.map((gear) => (
                <li key={gear.id} className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    <Thumb src={gear.images?.[0]} alt={gear.title} size="h-16 w-16" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{gear.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {[gear.brand, gear.category?.name].filter(Boolean).join(" • ") ||
                          "Uncategorised"}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold tabular-nums text-foreground">
                        {price(gear.pricePerDay)}
                        <span className="font-normal text-muted-foreground"> / day</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                    <p className="min-w-0 truncate text-xs text-muted-foreground">
                      Provider:{" "}
                      <span className="font-medium text-foreground">
                        {gear.provider?.name ?? "Unknown"}
                      </span>
                    </p>
                    <AvailabilityBadge available={!!gear.isAvailable} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}