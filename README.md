# GearUp Frontend

> A modern, production-oriented sports and outdoor equipment rental platform built with Next.js, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, and Stripe.

GearUp allows customers to browse and rent sports/outdoor equipment, providers to manage their inventory and rental orders, and administrators to oversee users, gear, and rental activity.

The frontend follows the folder and route conventions of Apollo Level 2's `project-nextjs-press-frontend`, while extending the architecture with TanStack Query, React Hook Form + Zod, and Stripe.js to satisfy the application's requirements.

---

## ✨ Features

### Customer

* Browse sports and outdoor equipment
* Search gear by keyword
* Filter by category
* Filter by minimum/maximum daily price
* Sort gear by latest or price
* View detailed gear information
* View gear reviews and ratings
* Select rental dates and quantity
* Place rental orders
* Track rental order status
* Pay confirmed orders through Stripe
* View payment history
* Leave reviews after completing a rental
* Manage customer profile

### Provider

* Provider dashboard
* View provider gear inventory
* Add new gear
* Edit existing gear
* Delete gear
* View incoming rental orders
* Confirm rental orders
* Mark paid rentals as picked up
* Mark returned rentals as returned
* Manage rental lifecycle from the provider dashboard

### Admin

* Admin dashboard
* View all users
* Search and filter users
* Activate/suspend users
* View all gear listings
* Monitor rental activity
* Moderate platform activity

### Authentication & Security

* JWT-based authentication
* HTTP-only authentication cookie
* Role-based route protection
* Customer / Provider / Admin access control
* Next.js 16 `proxy.ts` route protection
* Server-side authentication verification
* Backend authorization on protected requests
* Token forwarding through server-side services/actions

### Payments

* Stripe Payment Element
* Stripe PaymentIntent integration
* Secure server-side payment initialization
* Stripe webhook-based payment confirmation
* Payment status synchronization
* Customer payment success/cancel pages

---

# 🛠️ Technology Stack

| Technology      | Purpose                             |
| --------------- | ----------------------------------- |
| Next.js 16      | Full-stack React framework          |
| React           | UI development                      |
| TypeScript      | Type safety                         |
| Tailwind CSS v4 | Styling                             |
| shadcn/ui       | UI primitives                       |
| React Hook Form | Form management                     |
| Zod             | Validation                          |
| TanStack Query  | Client-side server-state management |
| Stripe.js       | Payment UI                          |
| Sonner          | Toast notifications                 |
| Lucide React    | Icons                               |
| JWT             | Authentication                      |
| ESLint          | Code quality                        |
| Git / GitHub    | Version control                     |

---

# 🏗️ Architecture

GearUp follows a server-first Next.js architecture.

```text
Browser
   │
   ▼
Next.js App Router
   │
   ├── Public Routes
   │
   ├── Authentication Routes
   │
   └── Protected Dashboard Routes
           │
           ▼
       Server Actions
           │
           ▼
        Services
           │
           ▼
      GearUp Backend API
           │
           ▼
        Database
```

For interactive dashboard features, TanStack Query is layered on top of server-rendered initial data.

```text
Server Component
      │
      ▼
Server Service
      │
      ▼
Initial Data
      │
      ▼
Client Component
      │
      ▼
TanStack Query
      │
      ├── Optimistic Updates
      ├── Loading States
      └── Cache Management
```

---

# 📁 Project Structure

```text
gearup-frontend/
│
├── app/
│   │
│   ├── (publicGroup)/
│   │   ├── _actions/
│   │   │   ├── getGearList.ts
│   │   │   ├── getGearById.ts
│   │   │   ├── getCategories.ts
│   │   │   └── getGearReviews.ts
│   │   │
│   │   ├── _components/
│   │   │   ├── gear/
│   │   │   │   ├── GearCard.tsx
│   │   │   │   ├── GearGrid.tsx
│   │   │   │   ├── GearFilters.tsx
│   │   │   │   ├── GearGallery.tsx
│   │   │   │   └── RentNowForm.tsx
│   │   │   │
│   │   │   └── reviews/
│   │   │       └── ReviewList.tsx
│   │   │
│   │   ├── gear/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   │
│   │   ├── payment/
│   │   │   ├── success/
│   │   │   │   └── page.tsx
│   │   │   └── cancel/
│   │   │       └── page.tsx
│   │   │
│   │   └── page.tsx
│   │
│   ├── (authGroup)/
│   │   ├── _actions/
│   │   │   └── authActions.ts
│   │   │
│   │   ├── _components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboardGroup)/
│   │   ├── _actions/
│   │   │   ├── rentalActions.ts
│   │   │   ├── paymentActions.ts
│   │   │   ├── providerGearActions.ts
│   │   │   ├── providerOrderActions.ts
│   │   │   ├── reviewActions.ts
│   │   │   └── adminActions.ts
│   │   │
│   │   ├── _components/
│   │   │   ├── customer/
│   │   │   ├── provider/
│   │   │   └── admin/
│   │   │
│   │   ├── _config/
│   │   │   ├── customerSidebarItems.ts
│   │   │   ├── providerSidebarItems.ts
│   │   │   └── adminSidebarItems.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── [id]/
│   │   │   │       └── pay/
│   │   │   │           └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   ├── provider-dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── gear/
│   │   │   └── orders/
│   │   │
│   │   └── admin-dashboard/
│   │       ├── page.tsx
│   │       ├── users/
│   │       ├── gear/
│   │       └── rentals/
│   │
│   ├── layout.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── shared/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── order-status-badge.tsx
│   │   ├── pagination.tsx
│   │   └── empty-state.tsx
│   │
│   └── ui/
│       └── shadcn components
│
├── hooks/
│   ├── use-provider-orders-query.ts
│   ├── use-admin-users-query.ts
│   ├── use-gear-query.ts
│   └── use-mobile.ts
│
├── lib/
│   ├── types.ts
│   ├── validation.ts
│   ├── utils.ts
│   └── query-client.ts
│
├── service/
│   ├── getMe.ts
│   ├── logout.ts
│   ├── refreshToken.ts
│   ├── getMyRentals.ts
│   ├── getMyPayments.ts
│   ├── getProviderGear.ts
│   ├── getProviderOrders.ts
│   ├── getAdminUsers.ts
│   ├── getAdminGear.ts
│   └── getAdminRentals.ts
│
├── utils/
│   └── jwt.ts
│
├── proxy.ts
├── components.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── package.json
└── README.md
```

---

# 🔗 Route & API Mapping

| Frontend Route               | Backend API                             |
| ---------------------------- | --------------------------------------- |
| `/`                          | `GET /api/gear`                         |
| `/gear`                      | `GET /api/gear`                         |
| `/gear/:id`                  | `GET /api/gear/:id`                     |
| `/gear/:id`                  | `GET /api/gear/:id/reviews`             |
| `/gear`                      | `GET /api/categories`                   |
| `/login`                     | `POST /api/auth/login`                  |
| `/register`                  | `POST /api/auth/register`               |
| `/dashboard`                 | `GET /api/rentals`                      |
| `/dashboard`                 | `GET /api/payments`                     |
| `/dashboard/orders/:id/pay`  | `POST /api/payments/create`             |
| `/provider-dashboard`        | `GET /api/provider/gear`                |
| `/provider-dashboard`        | `GET /api/provider/orders`              |
| `/provider-dashboard/gear`   | Provider Gear APIs                      |
| `/provider-dashboard/orders` | `GET /api/provider/orders`              |
| `/provider-dashboard/orders` | `PATCH /api/provider/orders/:id/status` |
| `/admin-dashboard/users`     | `GET /api/admin/users`                  |
| `/admin-dashboard/users`     | `PATCH /api/admin/users/:id`            |
| `/admin-dashboard/gear`      | `GET /api/admin/gear`                   |
| `/admin-dashboard/rentals`   | `GET /api/admin/rentals`                |

---

# 🔐 Authentication Flow

GearUp uses JWT authentication stored in an HTTP-only cookie.

```text
Login/Register
      │
      ▼
Backend returns JWT
      │
      ▼
Next.js Server Action
      │
      ▼
HTTP-only accessToken cookie
      │
      ▼
proxy.ts
      │
      ├── Decode JWT
      ├── Check authentication
      └── Check role
      │
      ▼
Protected Dashboard
```

The access token is never exposed directly to client-side JavaScript.

Protected server-side requests forward the token to the backend:

```ts
headers: {
  Authorization: `Bearer ${token}`,
}
```

---

# 👥 Role-Based Access

GearUp supports three roles:

```text
CUSTOMER
PROVIDER
ADMIN
```

### Customer

```text
/dashboard
```

Customers can:

* Browse gear
* Create rentals
* Pay for confirmed rentals
* Track orders
* View payment history
* Submit reviews

### Provider

```text
/provider-dashboard
```

Providers can:

* Manage gear
* View rental orders
* Confirm orders
* Mark orders as picked up
* Mark orders as returned

### Admin

```text
/admin-dashboard
```

Admins can:

* Manage users
* Suspend/activate users
* Review gear
* Monitor rentals

---

# 🔄 Rental Order Lifecycle

The rental workflow follows a controlled state transition:

```text
PLACED
   │
   │ Provider confirms
   ▼
CONFIRMED
   │
   │ Customer pays
   │ Stripe webhook
   ▼
PAID
   │
   │ Provider picks up
   ▼
PICKED_UP
   │
   │ Provider receives return
   ▼
RETURNED
   │
   │ Customer leaves review
   ▼
REVIEWED
```

The important payment transition is:

```text
CONFIRMED
     │
     ▼
Stripe PaymentIntent
     │
     ▼
payment_intent.succeeded
     │
     ▼
Stripe Webhook
     │
     ├── Payment → COMPLETED
     │
     └── RentalOrder → PAID
```

The Stripe webhook is treated as the authoritative source for successful payment confirmation.

---

# 💳 Stripe Payment Flow

The frontend uses Stripe Elements / Payment Element.

```text
Customer
   │
   ▼
Confirmed Order
   │
   ▼
POST /api/payments/create
   │
   ▼
PaymentIntent
   │
   ▼
clientSecret
   │
   ▼
Stripe Payment Element
   │
   ▼
stripe.confirmPayment()
   │
   ▼
Stripe
   │
   ▼
payment_intent.succeeded
   │
   ▼
Backend Webhook
   │
   ├── Payment = COMPLETED
   └── RentalOrder = PAID
```

The frontend never directly changes an order to `PAID`.

---

# ⚡ TanStack Query

TanStack Query is used for interactive client-side server state.

Primary use cases include:

* Provider order status updates
* Admin user management
* Gear browsing interactions
* Optimistic UI updates
* Cache management

Example:

```text
User clicks "Confirm"
        │
        ▼
Optimistic update
        │
        ▼
UI immediately shows CONFIRMED
        │
        ▼
Server Action
        │
        ▼
Backend API
        │
        ▼
Database
```

This prevents unnecessary UI delays while the server mutation completes.

---

# 📝 Form Validation

Forms use:

* React Hook Form
* Zod

Schemas are centralized in:

```text
lib/validation.ts
```

Example validation flow:

```text
User Input
    │
    ▼
React Hook Form
    │
    ▼
Zod Resolver
    │
    ├── Invalid → Display validation error
    │
    └── Valid
          │
          ▼
      Server Action
```

---

# 🔎 Gear Browsing

Customers can filter gear using:

* Search
* Category
* Minimum price
* Maximum price
* Availability dates
* Sorting
* Pagination

Example URL:

```text
/gear?search=camera&category=abc&minPrice=20&maxPrice=100&sort=price_asc&page=1
```

The filters are URL-based so that:

* Pages can be refreshed without losing filters
* URLs can be shared
* Browser navigation works naturally
* Server Components can consume the search parameters

---

# 🗂️ Server Actions & Services

The application separates backend communication into two concepts.

### Server Actions

Used for mutations:

```text
app/**/_actions/
```

Examples:

```text
loginAction()
registerAction()
createRentalAction()
cancelRentalAction()
createPaymentAction()
updateOrderStatusAction()
```

### Services

Used for server-side data fetching:

```text
service/
```

Examples:

```text
getMe()
getMyRentals()
getMyPayments()
getProviderOrders()
getProviderGear()
getAdminUsers()
getAdminGear()
```

This separation keeps components focused on UI and business workflows.

---

# 🛡️ Security

Security considerations include:

* HTTP-only authentication cookies
* JWT-based role verification
* Server-side token forwarding
* Backend authorization
* Protected dashboard routes
* Role-based route restrictions
* Stripe webhook signature verification
* Server-side payment creation
* Zod request validation
* No sensitive authentication tokens exposed to client JavaScript

---

# 🎨 UI & Design

The application uses:

* Tailwind CSS v4
* shadcn/ui
* Lucide icons
* Responsive layouts
* Accessible form controls
* Loading states
* Empty states
* Error states
* Toast notifications
* Mobile-friendly dashboards

The UI is designed around a clean SaaS/dashboard experience while maintaining a marketplace-style gear browsing experience.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

Then clone the repository:

```bash
git clone <your-repository-url>
cd gearup-frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env.local
```

Configure the required environment variables.

Example:

```env
BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧩 shadcn/ui Setup

Initialize shadcn:

```bash
npx shadcn init
```

Install the required components:

```bash
npx shadcn add button input label textarea select dialog dropdown-menu table badge card skeleton sonner tabs checkbox sidebar sheet separator tooltip
```

---

# 🏭 Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# 🌐 Deployment

The frontend is designed to be deployed on Vercel.

Typical deployment flow:

```bash
npm install
npm run build
```

Then configure the required environment variables in the Vercel project.

Important:

```text
BACKEND_API_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

The backend must also allow requests from the deployed frontend domain.

---

# 🔧 Environment Variables

Create:

```text
.env.local
```

Example:

```env
BACKEND_API_URL=https://your-backend-domain.com

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
```

Never commit secrets such as:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
JWT_SECRET
DATABASE_URL
```

These belong on the backend or secure deployment environment.

---

# 📋 Development Roadmap

### Phase 1 — Foundation

* [x] Next.js App Router
* [x] TypeScript
* [x] Tailwind CSS
* [x] shadcn/ui
* [x] Shared components
* [x] Project architecture

### Phase 2 — Authentication

* [x] Login
* [x] Registration
* [x] JWT cookie
* [x] Proxy authentication
* [x] Role-based protection
* [x] Server-side user verification

### Phase 3 — Gear Marketplace

* [x] Gear listing
* [x] Gear details
* [x] Search
* [x] Filtering
* [x] Sorting
* [x] Categories
* [x] Reviews
* [x] Rental form

### Phase 4 — Rental Management

* [x] Create rental
* [x] Customer rental history
* [x] Provider incoming orders
* [x] Order status management
* [x] Optimistic status updates

### Phase 5 — Payments

* [x] Stripe PaymentIntent
* [x] Stripe Payment Element
* [x] Payment success page
* [x] Payment cancellation page
* [x] Stripe webhook integration
* [x] Payment history

### Phase 6 — Reviews

* [x] Review listing
* [x] Review submission
* [x] Rating display

### Phase 7 — Administration

* [x] Admin dashboard
* [x] User management
* [x] Activate/suspend users
* [x] Gear moderation
* [x] Rental monitoring

### Phase 8 — Production Improvements

* [ ] Automated testing
* [ ] Performance optimization
* [ ] Improved caching strategy
* [ ] Better error monitoring
* [ ] Accessibility audit
* [ ] SEO optimization
* [ ] Production deployment

---

# 🧪 Testing Strategy

The project can be tested at multiple levels.

### Component Testing

Test individual UI components such as:

```text
GearCard
GearFilters
RentNowForm
OrderStatusBadge
```

### Integration Testing

Test flows such as:

```text
Login → Dashboard
Gear → Rental
Rental → Payment
Provider → Order Status
```

### End-to-End Testing

Critical user journeys should eventually cover:

```text
Customer registration
       ↓
Browse gear
       ↓
Place rental
       ↓
Provider confirms
       ↓
Customer pays
       ↓
Stripe webhook
       ↓
Provider picks up
       ↓
Provider marks returned
       ↓
Customer leaves review
```

---

# 📐 Architecture Principles

GearUp follows several important architectural principles:

### Server First

Server Components and server-side services are preferred for data fetching and authentication-sensitive operations.

### Secure by Default

Authentication tokens remain in HTTP-only cookies and are forwarded to the backend from server-side code.

### Separation of Responsibilities

```text
UI
 ↓
Server Action / Service
 ↓
Backend API
 ↓
Database
```

### Reusable Components

Common UI elements are centralized inside:

```text
components/shared/
components/ui/
```

### Role Isolation

Customer, provider, and admin functionality are separated into their own dashboard areas.

### Optimistic UX

Operations such as provider order status changes update the interface immediately while the backend mutation completes.

---

# 📊 Core User Flow

```text
                    ┌──────────────┐
                    │    Customer  │
                    └──────┬───────┘
                           │
                           ▼
                    Browse Gear
                           │
                           ▼
                    Select Rental
                           │
                           ▼
                     Place Order
                           │
                           ▼
                       PLACED
                           │
                           │ Provider
                           ▼
                     CONFIRMED
                           │
                           │ Customer
                           ▼
                       Payment
                           │
                           ▼
                     Stripe Webhook
                           │
                           ▼
                         PAID
                           │
                           │ Provider
                           ▼
                      PICKED_UP
                           │
                           │ Provider
                           ▼
                       RETURNED
                           │
                           │ Customer
                           ▼
                        REVIEW
```

---

# 📌 Project Goals

The primary goals of GearUp are:

* Provide a simple equipment rental experience
* Maintain a secure authentication architecture
* Provide clear role-based dashboards
* Support reliable Stripe payments
* Maintain consistent rental state transitions
* Provide responsive and accessible UI
* Keep the frontend maintainable and scalable
* Follow modern Next.js application architecture

---

# 👨‍💻 Development

Recommended development order:

```text
1. Authentication
       ↓
2. Public Gear Marketplace
       ↓
3. Rental System
       ↓
4. Provider Dashboard
       ↓
5. Stripe Payments
       ↓
6. Reviews
       ↓
7. Admin Dashboard
       ↓
8. Testing & Optimization
       ↓
9. Production Deployment
```

---

# 📄 License

This project was developed as part of the GearUp application/assignment project.

All rights reserved unless otherwise specified by the repository owner.

---

## 🙌 Acknowledgements

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* React Hook Form
* Zod
* Stripe
* Lucide
* Apollo Level 2
