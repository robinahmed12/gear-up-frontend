# Frontend Implementation Plan

**Project:** `gear-up-frontend` (Next.js 16 App Router, React 19, TypeScript, TanStack Query 5, React Hook Form + Zod, Stripe Payment Element, shadcn/ui, Tailwind v4)
**Backend reference:** `gear-up-beckend` — Phase 1 (hardening) and Phase 2 (booking & money) are implemented and verified.
**Goal:** Wire the frontend to the backend's Phase 1 & Phase 2 API, plus fix the contract mismatches that block those features.

---

## Delivery cadence

One sub-phase at a time, backend-style. After each sub-phase:

1. `npm run type-check`
2. `npm run lint`
3. `npm run build`
4. Manual smoke test
5. Stop for review before committing.

Decisions locked in:

- **Currency:** dynamic formatter reading `order.currency` (backend default USD). Remove hardcoded `৳`.
- **Deposit:** two-step flow — confirm the rental charge, then authorize the deposit hold via the separate `deposit.clientSecret`.
- **Sequence:** F0 → F1 → F2 → F3 → F4 → F5 → F6 → F7, then cross-cutting cleanup.

---

## F0 — Contract fixes (blocking)

The frontend was written against an assumed API shape; several contracts drifted. Must land first.

### F0.1 Extend `lib/types.ts`

- Add `PARTIALLY_REFUNDED` to `PaymentStatus`.
- Add money fields to `RentalOrder`: `subtotal`, `serviceFee`, `depositAmount`, `taxAmount`, `currency`, `lineItems`.
- Add `currency` to `Payment`; align `Payment` fields with backend (`id`, `orderId`, `amount`, `method`, `status`, `type`, `currency`, `stripePaymentIntentId`, timestamps).
- Add new types: `OrderLineItem`, `Deposit`, `Refund`, `AvailabilityCheckResult`, `CancellationOutcome`.
- Fix `Gear` usage of `provider`: backend returns `provider: { id: string; name: string }` (no `email`, `id` is a string not a number).

### F0.2 Fix gear detail contract drift

Backend gear object exposes `title`, `images[]`, `isAvailable`, `provider.{id,name}`. The page uses `name`, `image`, `availability`, `provider.email` — all `undefined`, so the public gear detail page renders empty.

- `app/(publicGroup)/gear/[id]/page.tsx` — replace `gear.name`→`gear.title`, `gear.image`→`gear.images[0]`, `gear.availability`→`gear.isAvailable`, `gear.provider.email`→`gear.provider.name`.
- `app/(publicGroup)/_components/gear/GearGallery.tsx` — accept `images[]` (+ `title`) instead of a single `image`.
- `app/(publicGroup)/_components/gear/RentNowForm.tsx` — prop is `available={gear.isAvailable}` (already `boolean`); confirm no `name` reference remains.

### F0.3 Auth token contract

Backend register/login/refresh all return `{ user, token, refreshToken }`. Frontend only ever stores `accessToken`; refresh is dead.

- `app/(authGroup)/_actions/authActions.ts` — set a `refreshToken` cookie (httpOnly, long-lived) alongside `accessToken` in `registerAction` and `loginAction`.
- `service/refreshToken.ts` — read `result.data.token` (not `accessToken`); return the rotated `refreshToken` too.
- `proxy.ts` — on refresh, persist the rotated `refreshToken` cookie before forwarding the new access token.
- `.env` — align `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` with the backend's signing secret so proxy-side verification passes.

---

## F1 — Auth hardening UI (backend Phase 1)

Backend now supports email verification, resend, forgot password, and reset password.

- New server actions + Zod schemas (`emailSchema`, `passwordSchema`):
  - `verifyEmailAction(token)` → `POST /api/auth/verify-email`
  - `resendVerificationAction(email)` → `POST /api/auth/resend-verification`
  - `forgotPasswordAction(email)` → `POST /api/auth/forgot-password`
  - `resetPasswordAction(token, password)` → `POST /api/auth/reset-password`
- New pages:
  - `/verify-email?token=` — auto-verify + result state.
  - `/forgot-password` — request reset link.
  - `/reset-password?token=` — set new password.
- Register flow: after success show "check your email to verify" (user is `PENDING_VERIFICATION`).
- Rental/payment 403 from `requireVerifiedEmail`: surface the message + a "resend verification" action.

---

## F2 — Availability (backend 2A)

- New action `getGearAvailability(gearId, startDate, endDate, quantity)` → `GET /api/gear/:id/availability?startDate&endDate&quantity` → `AvailabilityCheckResult { available, reason? }`.
- `RentNowForm` — re-check availability whenever dates/quantity change; disable submit and show `reason` when unavailable.
- Provider availability blocks UI (provider gear page or a "blocked dates" dialog):
  - `listBlocksAction` → `GET /api/provider/gear/:id/blocks`
  - `createBlockAction` → `POST /api/provider/gear/:id/blocks`
  - `deleteBlockAction` → `DELETE /api/provider/gear/:id/blocks/:blockId`

---

## F3 — Pricing & line items (backend 2B)

- New action `getRentalBreakdown(rentalOrderId)` → `GET /api/rentals/:id/breakdown` → `{ rentalCharges, serviceFee, taxAmount, depositAmount, totalAmount, currency }`.
- Pay page (`dashboard/orders/[id]/pay`) shows the itemized breakdown instead of just "Total Due".
- `OrderHistoryTable` — expandable row showing the breakdown + status badges for the new statuses.
- Update `RentalOrder` type (F0.1) to carry the breakdown fields.

---

## F4 — Idempotency (backend 2C)

- `rentalActions.createRentalAction` and `paymentActions.createPaymentAction` send an `Idempotency-Key` header (client-generated `crypto.randomUUID()`).
- On response, inspect `Idempotency-Replayed` to show the original result instead of a duplicate.
- Disable submit buttons while in flight to prevent accidental double POSTs.

---

## F5 — Deposits & refunds (backend 2D)

- Pay page shows the charge (`total − deposit`) separately from the deposit held.
- **Two-step deposit flow:** after `stripe.confirmPayment` for the charge succeeds, authorize the deposit hold with the returned `deposit.clientSecret` (second `confirmPayment`).
- `PaymentHistoryTable` — show deposit state (pending capture / captured / released) and `REFUNDED` / `PARTIALLY_REFUNDED` statuses; replace its divergent local `Payment` shape with the shared type.
- Admin: wire the empty `getAdminPayments.ts`, add an admin payments page (`admin-dashboard/payments`), and add controls for:
  - `POST /api/payments/refund` (amount + reason)
  - `POST /api/payments/deposit/capture`
  - `POST /api/payments/deposit/release`
- New admin actions: `refundPaymentAction`, `captureDepositAction`, `releaseDepositAction`.

---

## F6 — Cancellation (backend 2E)

- Customer cancel (`rentalActions.cancelRentalAction` → `PATCH /api/rentals/:id/cancel`):
  - Show the refund tier (full / partial / none) computed from `CANCELLATION_FULL_REFUND_HOURS` / `CANCELLATION_PARTIAL_REFUND_PERCENT` before confirming.
  - Surface the returned `CancellationOutcome { cancelled, refundAmount, depositRefunded, orderStatus }` after confirming.
- Provider cancel — button in `IncomingOrdersTable` → `PATCH /api/provider/orders/:id/cancel`.
- Admin status override — `PATCH /api/admin/rentals/:id/status` in `AdminRentalsTable`.
- Update `RentalOrder.status` transitions and `OrderStatusBadge` for `REVIEWED` / `PARTIALLY_REFUNDED`.

---

## F7 — Tax & receipts (backend 2F)

- Pay page: optional billing-address section (country required, 2-letter); pass `billingAddress` to `createPaymentAction`.
- Show the tax line in the summary and on the success page.
- Receipt is emailed backend-side; show a "receipt sent to your email" confirmation.
- Show `taxAmount` in the breakdown and payment history.

---

## Cross-cutting cleanup

- Fix dead redirect paths: `app/(dashboardGroup)/layout.tsx` and `RentNowForm.tsx` point to `/auth/login` (route is `/login`).
- Introduce a currency formatter (e.g. `utils/format.ts` using `Intl.NumberFormat` with the order's `currency`) and replace all hardcoded `৳`.
- Remove empty stubs: `app/(dashboardGroup)/_actions/getAdminPayments.ts`, `hooks/use-gear-query.ts`, `hooks/use-mobile.ts`.

---

## Verification

Per sub-phase: `npm run type-check`, `npm run lint`, `npm run build`, plus manual smoke:

`login → browse gear → rent → provider confirm → pay (charge + deposit hold) → webhook flips to PAID → pickup → return → review → cancellation path`.

Note: the frontend currently has **no test runner**; the frontend README lists test setup as a future phase.

---

## Open items

- `.env` secrets (`JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`) must match the backend; confirm the backend's actual secret value before F0.3.
- Confirm whether the backend refresh endpoint rotates + returns a new `refreshToken` (plan assumes yes; adjust `proxy.ts` if it returns only an access token).
