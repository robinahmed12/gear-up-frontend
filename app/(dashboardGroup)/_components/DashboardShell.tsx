"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/service/logout";
import type { User } from "@/lib/types";
import {
  DashboardSidebar,
  getActiveHref,
  getDashboardNavItems,
} from "./DashboardSidebar";

const ROLE_HOME: Record<User["role"], string> = {
  CUSTOMER: "/dashboard",
  PROVIDER: "/provider-dashboard",
  ADMIN: "/admin-dashboard",
};

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

interface DashboardShellProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const items = getDashboardNavItems(user.role);
  const activeHref = getActiveHref(pathname, items);
  const sectionTitle =
    items.find((item) => item.href === activeHref)?.title ?? "Dashboard";

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <DashboardSidebar user={user} />
      </aside>

      {/* Mobile drawer + scrim */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <DashboardSidebar
          user={user}
          onNavigate={() => setMobileOpen(false)}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {user.role === "ADMIN" ? "Admin console" : "Dashboard"}
            </p>
            <p className="truncate text-sm font-semibold text-foreground">
              {sectionTitle}
            </p>
          </div>

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 transition-colors hover:bg-muted"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {getInitials(user.name)}
              </span>
              <span className="hidden max-w-[10rem] truncate text-sm font-medium text-foreground sm:block">
                {user.name}
              </span>
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  aria-hidden
                  tabIndex={-1}
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-border bg-card p-1.5 shadow-lg"
                >
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href={ROLE_HOME[user.role]}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {user.role === "CUSTOMER" && (
                    <Link
                      href="/dashboard/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <UserRound className="h-4 w-4" />
                      Profile
                    </Link>
                  )}

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl">{children}</main>
      </div>
    </div>
  );
}

export default DashboardShell;
