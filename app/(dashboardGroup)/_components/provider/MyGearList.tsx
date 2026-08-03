// Client Component — TanStack Query (hooks/use-provider-gear-query.ts), edit/delete/availability-toggle actions per row
// app/(dashboardGroup)/_components/provider/MyGearList.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, PackagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteGear, useToggleGearAvailability } from '@/hooks/use-provider-gear-query';
import type { Gear } from '@/lib/types';

interface MyGearListProps {
  gear: Gear[];
}

export function MyGearList({ gear }: MyGearListProps) {
  const deleteGear = useDeleteGear();
  const toggleAvailability = useToggleGearAvailability();

  if (gear.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <PackagePlus className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No gear listed yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first item to start earning from it.
        </p>
        <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/provider-dashboard/gear/new">Add gear</Link>
        </Button>
      </div>
    );
  }

  function handleDelete(id: string, title: string) {
    if (confirm(`Delete "${title}"? This can't be undone.`)) {
      deleteGear.mutate(id);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm sm:table">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-4 py-3 font-medium text-muted-foreground">Gear</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Price/day</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Stock</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {gear.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.images?.[0] ?? '/placeholder.png'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.category?.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-foreground">৳{item.pricePerDay}</td>
              <td className="px-4 py-3 text-foreground">{item.stock}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() =>
                    toggleAvailability.mutate({ gearId: item.id, isAvailable: !item.isAvailable })
                  }
                  disabled={toggleAvailability.isPending}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    item.isAvailable
                      ? 'bg-primary/15 text-primary hover:bg-primary/25'
                      : 'bg-destructive/15 text-destructive hover:bg-destructive/25'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/provider-dashboard/gear/${item.id}/edit`} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={deleteGear.isPending}
                    aria-label="Delete"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {deleteGear.isPending ? (
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

      {/* Mobile cards */}
      <div className="divide-y divide-border sm:hidden">
        {gear.map((item) => (
          <div key={item.id} className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.images?.[0] ?? '/placeholder.png'}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  ৳{item.pricePerDay}/day · Stock {item.stock}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  toggleAvailability.mutate({ gearId: item.id, isAvailable: !item.isAvailable })
                }
                disabled={toggleAvailability.isPending}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  item.isAvailable
                    ? 'bg-primary/15 text-primary'
                    : 'bg-destructive/15 text-destructive'
                }`}
              >
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </button>

              <div className="flex items-center gap-1">
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
                  disabled={deleteGear.isPending}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}