'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, PackageSearch, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { User } from '@/lib/types'
import { logoutAction } from '@/service/logout'
import { topNav, type NavItem } from './navData'

interface NavbarProps {
  user?: User | null
}

const DASHBOARD_PATH: Record<User['role'], string> = {
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

  const hasNested = (item: NavItem) => !!item.children?.length

  const mega = topNav.find((i) => i.label === activeMenu)

  const renderMega = () => {
    if (!mega?.children) return null
    const [groups, flat] = [mega.children.filter((c) => c.children?.length), mega.children.filter((c) => c.href)]
    return (
      <div className="hidden lg:block border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8">
            {groups.map((g) => (
              <div key={g.label} className="min-w-[160px]">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{g.label}</p>
                <div className="flex flex-col gap-1.5">
                  {g.children?.map((leaf) => (
                    <Link
                      key={leaf.label}
                      href={leaf.href!}
                      onClick={() => setActiveMenu(null)}
                      className="text-sm text-foreground hover:text-primary"
                    >
                      {leaf.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {flat.length > 0 && (
              <div className="min-w-[160px]">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{mega.label}</p>
                <div className="flex flex-col gap-1.5">
                  {flat.map((leaf) => (
                    <Link
                      key={leaf.label}
                      href={leaf.href!}
                      onClick={() => setActiveMenu(null)}
                      className="text-sm text-foreground hover:text-primary"
                    >
                      {leaf.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <PackageSearch className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">GearUp</span>
            </Link>

            <div className="hidden lg:flex lg:items-center lg:gap-6">
              {topNav.map((link) => (
                <div key={link.label} className="relative">
                  {link.children ? (
                    <button
                      type="button"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 px-1"
                      onMouseEnter={() => openMenu(link.label)}
                      onMouseLeave={scheduleCloseMenu}
                      onClick={() => setActiveMenu(activeMenu === link.label ? null : link.label)}
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === link.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.href!}
                      className={`text-sm font-medium transition-colors hover:text-foreground px-1 ${
                        isActive(link.href) ? 'text-accent-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden lg:flex lg:items-center lg:gap-3">
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
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 rounded-md border border-border bg-card p-1 shadow-lg">
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
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
              )}
            </div>

            <button
              type="button"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>
      </div>

      {activeMenu && renderMega()}

      {isMobileMenuOpen && (
        <div className="border-t border-border py-4 lg:hidden">
          <div className="flex flex-col gap-2 px-4">
            {topNav.map((link) => (
              <div key={link.label}>
                {link.href ? (
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium ${isActive(link.href) ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{link.label}</p>
                    <div className="flex flex-col gap-1 pl-2">
                      {link.children?.map((g) =>
                        g.children ? (
                          <div key={g.label}>
                            <p className="text-xs font-medium text-foreground mt-1">{g.label}</p>
                            {g.children.map((leaf) => (
                              <Link
                                key={leaf.label}
                                href={leaf.href!}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-sm text-muted-foreground py-0.5"
                              >
                                {leaf.label}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link
                            key={g.label}
                            href={g.href!}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm text-muted-foreground"
                          >
                            {g.label}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {user ? (
              <>
                {dashboardPath && (
                  <Link href={dashboardPath} onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-foreground">
                    Dashboard
                  </Link>
                )}
                <button type="button" onClick={handleLogout} className="text-left text-sm text-destructive">
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-foreground">
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
