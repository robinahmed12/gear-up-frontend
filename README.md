# GearUp Frontend — Structure (matching Apollo Level 2's `project-nextjs-press-frontend` conventions)

This scaffold mirrors the folder/file conventions of
[`project-nextjs-press-frontend`](https://github.com/Apollo-Level2-Web-Dev/project-nextjs-press-frontend/tree/module-32)
— fetched and inspected directly to get this right — rather than a generic
`src/`-based Next.js layout. Structure only, no implementation yet.

## What's different from a "default" Next.js scaffold, and why

- **No `src/` folder.** `app/`, `components/`, `lib/`, `service/`, `hooks/`, `utils/` all live at the project root, matching the reference exactly.
- **`proxy.ts`, not `middleware.ts`.** Next.js 16 renamed the file (and the exported function) from `middleware` to `proxy` — this project is on Next 16, so it uses the current convention. The old name still works but is deprecated.
- **Route groups named `(publicGroup)`, `(authGroup)`, `(dashboardGroup)`** — the reference's exact naming pattern, one group per access level.
- **Colocated `_actions/`, `_components/`, `_config/`** inside each route group — private folders (the `_` prefix excludes them from routing) holding server actions, UI, and config specific to that group, instead of one giant global `components/` and `lib/api/` split by resource.
- **`service/`, not `lib/api/`** — server-only fetchers (`"use server"` + `cookies()` + `fetch`), one file per specific query, mirroring `service/getMe.ts` / `logout.ts` / `refreshToken.ts` in the reference.
- **Role-specific dashboard routes get their own top-level path** — `/dashboard` (customer, the default role), `/provider-dashboard`, `/admin-dashboard` — rather than `/dashboard/customer`, `/dashboard/provider`, `/dashboard/admin`. This matches the reference's `/dashboard` + `/admin-dashboard` + `/author-dashboard` pattern exactly.
- **`lib/types.ts` and `lib/validation.ts` as single files**, not split per-resource — matches the reference's single `lib/types.ts`.
- **Tailwind v4, CSS-first config** (`app/globals.css` with `@import "tailwindcss"`) — no `tailwind.config.ts`, matching the reference's Tailwind version.

## What's added on top, since the assignment mandates it (the reference repo doesn't use these)

The reference repo is server-actions-only with no client data-fetching library and no payment integration. GearUp's assignment explicitly requires:
- **React Hook Form + Zod** — `lib/validation.ts` holds every schema; form components in each group's `_components/` use them as resolvers
- **TanStack Query** — `lib/query-client.ts` + `hooks/use-*-query.ts`, layered on top of server-rendered initial data for the interactive tables that need optimistic updates (incoming orders, admin user management) or client-side re-filtering (gear browsing)
- **Stripe.js** — `_components/customer/StripeCheckoutRedirect.tsx` + `_actions/paymentActions.ts`

## Folder Structure
```
gearup-frontend/
├── app/
│   ├── (publicGroup)/
│   │   ├── _actions/                    # getGearList, getGearById, getCategories, getGearReviews
│   │   ├── _components/gear/             # GearCard, GearGrid, GearFilters, GearGallery, RentNowForm
│   │   ├── _components/reviews/          # ReviewList
│   │   ├── gear/page.tsx, gear/[id]/page.tsx
│   │   ├── payment/success|cancel/page.tsx
│   │   └── page.tsx                      # home
│   ├── (authGroup)/
│   │   ├── _actions/authActions.ts       # loginAction, registerAction
│   │   ├── _components/                  # LoginForm, RegisterForm
│   │   └── login|register/page.tsx
│   ├── (dashboardGroup)/                 # protected by proxy.ts
│   │   ├── _actions/                     # rentalActions, paymentActions, providerGearActions,
│   │   │                                  # providerOrderActions, reviewActions, adminActions
│   │   ├── _components/customer|provider|admin/
│   │   ├── _config/                      # *SidebarItems.ts per role
│   │   ├── dashboard/                    # CUSTOMER — overview, orders/:id/pay, profile
│   │   ├── provider-dashboard/            # PROVIDER — overview, gear CRUD, orders
│   │   └── admin-dashboard/               # ADMIN — overview, users, gear, rentals
│   ├── layout.tsx, error.tsx, loading.tsx, not-found.tsx, globals.css
├── components/
│   ├── shared/                           # navbar, footer, order-status-badge, pagination, empty-state
│   └── ui/                               # shadcn primitives
├── hooks/                                # TanStack Query hooks + use-mobile (shadcn sidebar dep)
├── lib/                                  # types.ts, validation.ts, utils.ts, query-client.ts
├── service/                              # server-only fetchers: getMe, logout, refreshToken, getMy*, getProvider*, getAdmin*
├── utils/jwt.ts                          # token verify/decode, used by proxy.ts
├── proxy.ts                              # Next.js 16 route protection (was middleware.ts)
├── components.json                       # shadcn config
├── next.config.ts
├── postcss.config.mjs                    # Tailwind v4
├── eslint.config.mjs
└── package.json
```

## Route ↔ Backend API mapping
| Route | Backend endpoint(s) |
|---|---|
| `/` | `GET /api/gear` |
| `/gear`, `/gear/:id` | `GET /api/gear`, `GET /api/categories`, `GET /api/gear/:id`, `GET /api/gear/:id/reviews` |
| `/login`, `/register` | `POST /api/auth/login`, `POST /api/auth/register` |
| `/dashboard` (CUSTOMER) | `GET /api/rentals`, `GET /api/payments` |
| `/dashboard/orders/:id/pay` | `POST /api/payments/create` |
| `/provider-dashboard` | `GET /api/provider/gear`, `GET /api/provider/orders` |
| `/provider-dashboard/gear[/new,/:id/edit]` | `POST` / `PUT` / `DELETE /api/provider/gear[/:id]` |
| `/provider-dashboard/orders` | `GET /api/provider/orders`, `PATCH /api/provider/orders/:id/status` |
| `/admin-dashboard/users` | `GET /api/admin/users`, `PATCH /api/admin/users/:id` |
| `/admin-dashboard/gear`, `/rentals` | `GET /api/admin/gear`, `GET /api/admin/rentals` |

## Auth flow (matches the reference's cookie + proxy pattern)
1. `authActions.ts` posts credentials to the backend, gets back a JWT, sets it as an **httpOnly** `accessToken` cookie (never exposed to client JS).
2. `proxy.ts` reads that cookie on every request, decodes the role via `utils/jwt.ts`, and redirects based on route + role — unauthenticated users trying to hit `/dashboard*` get sent to `/login?redirectTo=...`; wrong-role access gets sent to `/not-found`.
3. `(dashboardGroup)/layout.tsx` independently calls `service/getMe.ts` server-side as defense-in-depth, so a stale/tampered cookie can't render a dashboard shell even if `proxy.ts` were somehow bypassed.

## Getting Started
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Next steps (implementation, not covered by this scaffold)
1. `npx shadcn init` then `npx shadcn add button input label textarea select dialog dropdown-menu table badge card skeleton sonner tabs checkbox sidebar sheet separator tooltip`
2. `service/getMe.ts` + `authActions.ts` + `proxy.ts` first — nothing else works without auth
3. Public gear browsing (no auth dependency)
4. Rental → payment (Stripe) → provider status-update loop
5. Reviews, then admin oversight tables last
