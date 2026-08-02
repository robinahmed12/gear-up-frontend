// components/shared/navbar.tsx
'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Menu, X, PackageSearch, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { User } from '@/lib/types';
import { logoutAction } from '@/service/logout';

interface NavbarProps {
  user?: User | null;
}

const DASHBOARD_PATH: Record<User['role'], string> = {
  CUSTOMER: '/dashboard',
  PROVIDER: '/provider-dashboard',
  ADMIN: '/admin-dashboard',
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gear', label: 'Browse Gear' },
];

function getInitials(name: string) {
   if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dashboardPath = user ? DASHBOARD_PATH[user.role] : null;

  const openProfile = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsProfileOpen(true);
  };

  const scheduleCloseProfile = () => {
    closeTimeout.current = setTimeout(() => setIsProfileOpen(false), 150);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <PackageSearch className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">GearUp</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {user ? (
              <div
                className="relative"
                onMouseEnter={openProfile}
                onMouseLeave={scheduleCloseProfile}
              >
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted"
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {getInitials(user.name)}
                  </span>
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-56 rounded-md border border-border bg-card p-1 shadow-lg"
                  >
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>

                    {dashboardPath && (
                      <Link
                        href={dashboardPath}
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="flex flex-col gap-3 border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {getInitials(user.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  {dashboardPath && (
                    <Link
                      href={dashboardPath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 border-t border-border pt-4">
                  <Button asChild variant="ghost" className="flex-1">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}