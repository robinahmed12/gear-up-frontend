// app/(dashboardGroup)/_components/PageHeader.tsx
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
}

/**
 * Consistent page title block for every dashboard screen. Keeps the title,
 * supporting copy, and page-level actions aligned to the same rhythm so the
 * three role dashboards feel like one product.
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}
