'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, PackageSearch, LayoutDashboard, LogOut, ChevronDown, ChevronRight, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { User as UserType } from '@/lib/types'
import { logoutAction } from '@/service/logout'
import { topNav, type NavItem } from './navData'

interface NavbarProps {
  user?: UserType | null
}

const DASHBOARD_PATH: Record<UserType['role'], string> = {
  CUSTOMER: '/dashboard',
  PROVIDER: '/provider-dashboard',
  ADMIN: '/admin-dashboard',
}

function getInitials(name: string) {
  if (!name) return ''
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dashboardPath = user ? DASHBOARD_PATH[user.role] : null

  const openProfile = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setIsProfileOpen(true)
  }

  const scheduleCloseProfile = () => {
    closeTimeout.current = setTimeout(() => setIsProfileOpen(false), 150)
  }

  const openMenu = (label: string) => {
    if (menuCloseTimeout.current) clearTimeout(menuCloseTimeout.current)
    setActiveMenu(label)
  }

  const scheduleCloseMenu = () => {
    menuCloseTimeout.current = setTimeout(() => setActiveMenu(null), 150)
  }

  const handleLogout = async () => {
    await logoutAction()
    window.location.href = '/login'
  }

  const isActive = (href?: string) => {
    if (!href) return false
    if (href.includes('#')) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const toggleMobileGroup = (label: string) => {
    setExpandedMobile((prev) => (prev === label ? null : label))
  }

  const mega = topNav.find((i) => i.label === activeMenu)

  const renderMega = () => {
    if (!mega?.children) return null
    const groups = mega.children.filter((c) => c.children?.length)
    const flat = mega.children.filter((c) => c.href)

    if (mega.label === 'Resources') {
      return (
        <div className="hidden lg:block absolute right-0 top-full pt-2 z-50">
          <div className="w-72 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Resources</p>
              <p className="text-xs text-muted-foreground mt-0.5">Help, guides, and company info</p>
            </div>
            <div className="p-2">
              {flat.map((leaf) => (
                <Link
                  key={leaf.label}
                  href={leaf.href!}
                  onClick={() => setActiveMenu(null)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
                    <ChevronRight className="h-3.5 w-3.5 text-primary" />
                  </span>
                  {leaf.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (mega.label === 'Explore') {
      return (
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-[720px] max-w-[calc(100vw-2rem)]">
          <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-border">
              {groups.map((g) => (
                <div key={g.label} className="p-5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">{g.label}</p>
                  <div className="flex flex-col gap-2.5">
                    {g.children?.map((leaf) => (
                      <Link
                        key={leaf.label}
                        href={leaf.href!}
                        onClick={() => setActiveMenu(null)}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {leaf.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-[820px] max-w-[calc(100vw-2rem)]">
        <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-border">
            {groups.slice(0, 3).map((g) => (
              <div key={g.label} className="p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{g.label}</p>
                <div className="flex flex-col gap-2.5">
                  {g.children?.map((leaf) => (
                    <Link
                      key={leaf.label}
                      href={leaf.href!}
                      onClick={() => setActiveMenu(null)}
                      className="text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {leaf.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderMobileMenu = () => {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-background shadow-xl">
          <div className="flex items-center justify-between border-b border-border p-4">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <PackageSearch className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground">GearUp</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-1">
              {topNav.map((link) => {
                if (link.href) {
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                }

                const isExpanded = expandedMobile === link.label
                return (
                  <div key={link.label}>
                    <button
                      type="button"
                      onClick={() => toggleMobileGroup(link.label)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      aria-expanded={isExpanded}
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-border pl-3">
                        {link.children?.map((g) =>
                          g.children ? (
                            <div key={g.label} className="mt-1">
                              <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {g.label}
                              </p>
                              <div className="flex flex-col">
                                {g.children.map((leaf) => (
                                  <Link
                                    key={leaf.label}
                                    href={leaf.href!}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                  >
                                    {leaf.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link
                              key={g.label}
                              href={g.href!}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              {g.label}
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className="mt-6 border-t border-border pt-4">
              {user ? (
                <div className="flex flex-col gap-1">
                  {dashboardPath && (
                    <Link
                      href={dashboardPath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <PackageSearch className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">GearUp</span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {topNav.map((link) => (
              <div key={link.label} className="relative">
                {link.children ? (
                  <button
                    type="button"
                    className={`text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                      activeMenu === link.label
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onMouseEnter={() => openMenu(link.label)}
                    onMouseLeave={scheduleCloseMenu}
                    onClick={() => setActiveMenu(activeMenu === link.label ? null : link.label)}
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeMenu === link.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={link.href!}
                    className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
                      isActive(link.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {user ? (
              <div className="relative" onMouseEnter={openProfile} onMouseLeave={scheduleCloseProfile}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {getInitials(user.name)}
                  </span>
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                    <div className="border-b border-border px-3 py-2.5 mb-1">
                      <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {dashboardPath && (
                      <Link
                        href={dashboardPath}
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {activeMenu && (
        <div
          className="absolute left-0 right-0 z-50"
          onMouseEnter={() => openMenu(activeMenu)}
          onMouseLeave={scheduleCloseMenu}
        >
          {renderMega()}
        </div>
      )}

      {isMobileMenuOpen && renderMobileMenu()}
    </header>
  )
}
