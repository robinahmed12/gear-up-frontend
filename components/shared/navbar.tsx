
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, PackageSearch } from 'lucide-react';
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

export function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/gear', label: 'Browse Gear' },
  ];

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <PackageSearch className="h-6 w-6 text-primary" />
          GearUp
        </Link>

        {/* Desktop links */}
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

        {/* Desktop auth area */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {user ? (
            <>
              <Link href={DASHBOARD_PATH[user.role]}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
  <Link href="/login">Log in</Link>
</Button>

<Button asChild size="sm">
  <Link href="/register">Sign up</Link>
</Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
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
        <div className="border-t px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href={DASHBOARD_PATH[user.role]}
                  className="text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <form action={logoutAction}>
                  <Button type="submit" variant="outline" size="sm" className="w-full">
                    Log out
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button size="sm" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}