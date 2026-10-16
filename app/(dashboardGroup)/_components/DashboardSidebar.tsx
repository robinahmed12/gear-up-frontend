"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ElementType } from "react";
import { LogOut, PackageSearch, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/service/logout";
import type { User } from "@/lib/types";
import { customerSidebarItems } from "../_config/customerSidebarItems";
import { providerSidebarItems } from "../_config/providerSidebarItems";
import { adminSidebarItems } from "../_config/adminSidebarItems";

type NavItem = { title: string; href: string; icon: ElementType };

const ROLE_LABEL: Record<User["role"], string> = {
  CUSTOMER: "Customer workspace",
  PROVIDER: "Provider workspace",
  ADMIN: "Admin console",
};

export function getDashboardNavItems(role: User["role"]): NavItem[] {
  switch (role) {
    case "PROVIDER":
      return providerSidebarItems;
    case "ADMIN":
      return adminSidebarItems;
    default:
      return customerSidebarItems;
  }
}

// Highlight the most specific route that matches, so nested pages such as
// /provider-dashboard/gear/new still light up their parent nav item without
// two entries being active at once.
export function getActiveHref(pathname: string, items: NavItem[]): string | undefined {
  return items
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface DashboardSidebarProps {
  user: User;
  onNavigate?: () => void;
  onClose?: () => void;
}

export function DashboardSidebar({
  user,
  onNavigate,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = getDashboardNavItems(user.role);

  const activeHref = getActiveHref(pathname, items);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center justify-between gap-2 px-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-sidebar-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3L2 20h20L12 3z" />
              <path d="M12 3v17" />
              <path d="M7 13h10" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight">
              Gear<span className="text-sidebar-primary">Up</span>
            </span>
            <span className="text-[10px] font-medium text-sidebar-foreground/60 tracking-widest uppercase">Rentals</span>
          </span>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          {ROLE_LABEL[user.role]}
        </p>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === activeHref;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/60 px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            {getInitials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {user.email}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Log out"
              title="Log out"
              className="rounded-md p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;
