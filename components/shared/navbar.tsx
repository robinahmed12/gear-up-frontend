"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { logoutAction } from "@/service/logout";

interface NavbarProps {
  user?: User | null;
}

const DASHBOARD_PATH: Record<User["role"], string> = {
  CUSTOMER: "/dashboard",
  PROVIDER: "/provider-dashboard",
  ADMIN: "/admin-dashboard",
};

export function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/gear", label: "Browse Gear" },
  ];

  const dashboardPath = user ? DASHBOARD_PATH[user.role] : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <PackageSearch className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GearUp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {dashboardPath && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href={dashboardPath}>Dashboard</Link>
                  </Button>
                )}

                <form
                  action={async () => {
                    await logoutAction();
                    window.location.href = "/login"; // force reload
                  }}
                >
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

          {/* Mobile Toggle */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
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
                <>
                  {dashboardPath && (
                    <Link
                      href={dashboardPath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  )}

                  <form
                    action={async () => {
                      await logoutAction();
                      window.location.href = "/login"; // force reload
                    }}
                  >
                    <Button type="submit" variant="outline" size="sm">
                      Log out
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  </Button>

                  <Button className="flex-1">
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
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
