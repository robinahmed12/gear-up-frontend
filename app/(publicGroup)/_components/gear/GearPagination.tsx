// app/(publicGroup)/_components/gear/GearPagination.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GearPaginationProps {
  page: number;
  totalPages: number;
  className?: string;
}

/** Builds a compact page list, e.g. [1, '…', 4, 5, 6, '…', 12]. */
function buildPages(page: number, totalPages: number): Array<number | 'ellipsis'> {
  const pages: Array<number | 'ellipsis'> = [];
  const window = 1;

  for (let p = 1; p <= totalPages; p += 1) {
    const isEdge = p === 1 || p === totalPages;
    const isNear = Math.abs(p - page) <= window;
    if (isEdge || isNear) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return pages;
}

export default function GearPagination({ page, totalPages, className }: GearPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = buildPages(page, totalPages);

  function goTo(target: number) {
    if (target < 1 || target > totalPages || target === page) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(target));
    router.push(`/gear?${params.toString()}`);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const baseButton =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition hover:bg-secondary disabled:pointer-events-none disabled:opacity-50';

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1.5', className)}>
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={baseButton}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => goTo(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              baseButton,
              item === page &&
                'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={baseButton}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
