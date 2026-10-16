// app/(dashboardGroup)/_components/provider/MyGearList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarOff,
  Loader2,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useDeleteGear,
  useToggleGearAvailability,
} from "@/hooks/use-provider-gear-query";
import type { Gear } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AvailabilityBlocksDialog } from "./AvailabilityBlocksDialog";

interface MyGearListProps {
  gear: Gear[];
}

type StatusFilter = "all" | "available" | "unavailable";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

/* ---------- small presentational pieces ---------- */

function Thumb({
  src,
  alt,
  size,
}: {
  src?: string;
  alt: string;
  size: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md border border-border bg-muted",
        size,
      )}
    >
      <Image
        src={src ?? "/placeholder.png"}
        alt={alt}
        fill
        sizes="64px"
        className="object-cover"
      />
    </div>
  );
}

function StatusSwitch({
  checked,
  disabled,
  onToggle,
  title,
}: {
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${checked ? "Mark unavailable" : "Mark available"}: ${title}`}
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-card shadow-sm transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
      <span
        className={cn(
          "text-xs font-medium",
          checked ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {checked ? "Available" : "Unavailable"}
      </span>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const out = stock <= 0;
  const low = stock > 0 && stock <= 2;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm tabular-nums",
        out ? "text-destructive" : low ? "text-accent" : "text-foreground",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          out ? "bg-destructive" : low ? "bg-accent" : "bg-primary",
        )}
        aria-hidden
      />
      {out ? "Out of stock" : `${stock} in stock`}
    </span>
  );
}

/* ---------- main component ---------- */

export function MyGearList({ gear }: MyGearListProps) {
  const deleteGear = useDeleteGear();
  const toggleAvailability = useToggleGearAvailability();
  const [items, setItems] = useState<Gear[]>(gear);
  const [blocksGear, setBlocksGear] = useState<Gear | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    setItems(gear);
  }, [gear]);

  const counts = useMemo(() => {
    const available = items.filter((g) => g.isAvailable).length;
    return {
      all: items.length,
      available,
      unavailable: items.length - available,
    };
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((g) => {
      if (filter === "available" && !g.isAvailable) return false;
      if (filter === "unavailable" && g.isAvailable) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        (g.category?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  function handleDelete(id: string, title: string) {
    toast.warning(`Delete "${title}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          deleteGear.mutate(id, {
            onSuccess: (result) => {
              if (result.success) {
                setItems((prev) => prev.filter((g) => g.id !== id));
              }
            },
          });
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  }

  function handleToggle(item: Gear) {
    toggleAvailability.mutate({
      gearId: item.id,
      isAvailable: !item.isAvailable,
    });
  }

  const isDeleting = (id: string) =>
    deleteGear.isPending && deleteGear.variables === id;
  const isToggling = (id: string) =>
    toggleAvailability.isPending &&
    (toggleAvailability.variables as { gearId?: string } | undefined)
      ?.gearId === id;

  /* ----- empty state (no gear at all) ----- */
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <PackagePlus className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-foreground">
          No gear listed yet
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          List your first item and renters can start booking it.
        </p>
        <Button
          asChild
          className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/provider-dashboard/gear/new">
            <Plus className="h-4 w-4" />
            Add gear
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or category"
              aria-label="Search gear"
              className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div
            role="tablist"
            aria-label="Filter by status"
            className="inline-flex w-full rounded-md bg-secondary p-0.5 sm:w-auto"
          >
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "flex-1 rounded-[5px] px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                  <span className="ml-1.5 tabular-nums text-muted-foreground">
                    {counts[f.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {visible.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              No gear matches your filters
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or status.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Gear
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Price per day
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Stock
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-right font-medium"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((item) => (
                    <tr
                      key={item.id}
                      className={cn(
                        "transition-colors hover:bg-muted/30",
                        !item.isAvailable && "bg-muted/20",
                      )}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Thumb
                            src={item.images?.[0]}
                            alt={item.title}
                            size="h-12 w-12"
                          />
                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate font-medium text-foreground">
                              {item.title}
                            </p>
                            {item.category?.name && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {item.category.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium tabular-nums text-foreground">
                        ৳{item.pricePerDay}
                      </td>
                      <td className="px-5 py-3.5">
                        <StockBadge stock={item.stock} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusSwitch
                          checked={item.isAvailable}
                          disabled={isToggling(item.id)}
                          onToggle={() => handleToggle(item)}
                          title={item.title}
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setBlocksGear(item)}
                            aria-label={`Blocked dates for ${item.title}`}
                            title="Blocked dates"
                          >
                            <CalendarOff className="h-4 w-4" />
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            title="Edit"
                          >
                            <Link
                              href={`/provider-dashboard/gear/${item.id}/edit`}
                              aria-label={`Edit ${item.title}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id, item.title)}
                            disabled={isDeleting(item.id)}
                            aria-label={`Delete ${item.title}`}
                            title="Delete"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            {isDeleting(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-border md:hidden">
              {visible.map((item) => (
                <li key={item.id} className="space-y-4 p-4">
                  <div className="flex items-start gap-3">
                    <Thumb
                      src={item.images?.[0]}
                      alt={item.title}
                      size="h-16 w-16"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {item.title}
                      </p>
                      {item.category?.name && (
                        <p className="text-xs text-muted-foreground">
                          {item.category.name}
                        </p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          ৳{item.pricePerDay}
                          <span className="font-normal text-muted-foreground">
                            {" "}
                            / day
                          </span>
                        </span>
                        <StockBadge stock={item.stock} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
                    <StatusSwitch
                      checked={item.isAvailable}
                      disabled={isToggling(item.id)}
                      onToggle={() => handleToggle(item)}
                      title={item.title}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBlocksGear(item)}
                    >
                      <CalendarOff className="h-3.5 w-3.5" />
                      Dates
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/provider-dashboard/gear/${item.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={isDeleting(item.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      {isDeleting(item.id) ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
              Showing {visible.length} of {items.length}{" "}
              {items.length === 1 ? "item" : "items"}
            </div>
          </>
        )}
      </div>

      <AvailabilityBlocksDialog
        gearId={blocksGear?.id ?? ""}
        gearName={blocksGear?.title}
        open={blocksGear !== null}
        onOpenChange={(open) => {
          if (!open) setBlocksGear(null);
        }}
      />
    </section>
  );
}
