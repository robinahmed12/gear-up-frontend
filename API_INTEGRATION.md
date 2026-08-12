# GearUp Frontend — API Integration Documentation

## 1. Overview

GearUp is a sports and outdoor equipment rental platform built with **Next.js App Router** and **TypeScript**.

The frontend communicates with the GearUp backend through REST APIs.

### Frontend Stack

* Next.js 16
* TypeScript
* React
* Tailwind CSS v4
* React Hook Form
* Zod
* TanStack Query
* Stripe.js
* Server Actions
* JWT Authentication
* HTTP-only Cookies

### Backend

The frontend uses the GearUp backend API through:

```env
BACKEND_API_URL=https://your-backend-url.com
```

For local development:

```env
BACKEND_API_URL=http://localhost:5000
```

---

# 2. API Communication Architecture

GearUp uses two different approaches depending on the requirement.

### Server-side API requests

Server Actions and server-side service functions communicate with the backend.

Example:

```text
Next.js Server
      |
      | Authorization: Bearer <JWT>
      v
GearUp Backend API
      |
      v
Database
```

Server-side requests can safely access the HTTP-only authentication cookie.

Example:

```ts
const cookieStore = await cookies();
const token = cookieStore.get("accessToken")?.value;

const response = await fetch(
  `${process.env.BACKEND_API_URL}/api/gear`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

---

# 3. Authentication

Authentication is handled using JWT.

After successful login:

```text
User
 ↓
Login Form
 ↓
POST /api/auth/login
 ↓
Backend
 ↓
JWT
 ↓
HTTP-only accessToken Cookie
```

The JWT is stored in an HTTP-only cookie:

```text
accessToken
```

The token is not exposed to client-side JavaScript.

---

# 4. Authentication API

## Login

### Endpoint

```http
POST /api/auth/login
```

### Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Robin",
      "email": "user@example.com",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt-token"
  }
}
```

The frontend stores the access token in an HTTP-only cookie.

---

# 5. Registration

### Endpoint

```http
POST /api/auth/register
```

### Example Request

```json
{
  "name": "Robin Ahmed",
  "email": "robin@example.com",
  "password": "password123",
  "phone": "+8801712345678"
}
```

---

# 6. Current User

### Endpoint

```http
GET /api/auth/me
```

### Authentication

```http
Authorization: Bearer <JWT>
```

### Example Response

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Robin",
      "email": "robin@example.com",
      "role": "CUSTOMER",
      "status": "ACTIVE"
    }
  }
}
```

The frontend uses this endpoint for:

* User information
* Dashboard authentication
* Role detection
* Navbar user information
* Server-side authorization checks

---

# 7. Public Gear APIs

Public gear APIs do not require authentication.

## Get Gear

### Endpoint

```http
GET /api/gear
```

### Supported Query Parameters

| Parameter       | Type   | Description            |
| --------------- | ------ | ---------------------- |
| `search`        | string | Search gear by keyword |
| `category`      | string | Filter by category     |
| `minPrice`      | number | Minimum daily price    |
| `maxPrice`      | number | Maximum daily price    |
| `availableFrom` | string | Rental start date      |
| `availableTo`   | string | Rental end date        |
| `sort`          | string | Sorting option         |
| `page`          | number | Current page           |
| `limit`         | number | Items per page         |

### Example

```http
GET /api/gear?page=1&limit=12
```

With filters:

```http
GET /api/gear?search=canon&category=Cameras&minPrice=20&maxPrice=100&page=1&limit=12
```

---

# 8. Gear Response

Example:

```json
{
  "success": true,
  "message": "Gear fetched successfully",
  "data": [
    {
      "id": "gear-id",
      "title": "Canon EOS R5 Camera",
      "description": "Professional mirrorless camera",
      "brand": "Canon",
      "pricePerDay": "50",
      "stock": 3,
      "isAvailable": true,
      "images": [
        "https://example.com/image.jpg"
      ],
      "averageRating": 0,
      "reviewCount": 0,
      "categoryId": "category-id",
      "category": {
        "id": "category-id",
        "name": "Cameras"
      },
      "providerId": "provider-id",
      "provider": {
        "id": "provider-id",
        "name": "Provider Name"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 20,
    "totalPages": 2
  }
}
```

The frontend uses:

```ts
const gears = response.data ?? [];
const total = response.meta?.total;
```

---

# 9. Get Gear Details

### Endpoint

```http
GET /api/gear/:id
```

Example:

```http
GET /api/gear/93bf606c-ce6c-4ad9-a8b8-44bbaaa89ca0
```

Used by:

```text
/gear/[id]
```

---

# 10. Categories

### Endpoint

```http
GET /api/categories
```

Used by:

* Gear filters
* Gear forms
* Category selection
* Gear browsing

---

# 11. Gear Reviews

### Endpoint

```http
GET /api/gear/:id/reviews
```

Used on the gear details page.

---

# 12. Customer Rental APIs

## Create Rental

### Endpoint

```http
POST /api/rentals
```

### Authentication

```http
Authorization: Bearer <JWT>
```

### Example

```json
{
  "gearId": "gear-id",
  "startDate": "2026-08-15",
  "endDate": "2026-08-18"
}
```

The rental is initially created with:

```text
PLACED
```

---

# 13. Rental Order Lifecycle

The main order lifecycle is:

```text
PLACED
   ↓
CONFIRMED
   ↓
PAID
   ↓
PICKED_UP
   ↓
RETURNED
```

### Responsibility

| Status      | Responsible | Action         |
| ----------- | ----------- | -------------- |
| `PLACED`    | Provider    | Confirm order  |
| `CONFIRMED` | Customer    | Pay            |
| `PAID`      | Provider    | Mark picked up |
| `PICKED_UP` | Provider    | Mark returned  |
| `RETURNED`  | Customer    | Leave review   |

---

# 14. Customer Rental History

### Endpoint

```http
GET /api/rentals
```

Authentication is required.

Used by:

```text
/dashboard
```

and the customer order history.

---

# 15. Payment API

## Create Stripe Payment

### Endpoint

```http
POST /api/payments/create
```

### Authentication

Required.

### Example Request

```json
{
  "rentalOrderId": "rental-order-id",
  "method": "STRIPE"
}
```

### Response

```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "data": {
    "payment": {
      "id": "payment-id",
      "transactionId": "pi_xxxxxxxxx",
      "amount": "150",
      "method": "STRIPE",
      "status": "PENDING"
    },
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

The `clientSecret` is passed to Stripe.js on the frontend.

---

# 16. Stripe Payment Flow

```text
Customer
   |
   | Click Pay Now
   v
POST /api/payments/create
   |
   v
Stripe PaymentIntent
   |
   | clientSecret
   v
Stripe.js
   |
   | Customer completes payment
   v
Stripe
   |
   | payment_intent.succeeded
   v
POST /api/payments/webhook/stripe
   |
   v
Backend Webhook
   |
   +--> Payment = COMPLETED
   |
   +--> RentalOrder = PAID
```

The frontend should **not** directly mark an order as `PAID`.

The Stripe webhook is the trusted source for payment confirmation.

---

# 17. Stripe Webhook

### Endpoint

```http
POST /api/payments/webhook/stripe
```

This endpoint is called by Stripe.

It requires:

```http
Stripe-Signature
```

The backend validates the signature using:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxx
```

Supported events:

```text
payment_intent.succeeded
payment_intent.payment_failed
```

---

# 18. Payment History

### Endpoint

```http
GET /api/payments
```

Used by the customer dashboard.

Example response:

```json
{
  "success": true,
  "message": "Your payment history fetched successfully",
  "data": [
    {
      "id": "payment-id",
      "transactionId": "pi_xxxxx",
      "amount": "150",
      "method": "STRIPE",
      "status": "COMPLETED",
      "paidAt": "2026-08-05T06:40:12.000Z",
      "rentalOrderId": "order-id"
    }
  ]
}
```

---

# 19. Provider APIs

Provider APIs require authentication and provider authorization.

## Get Provider Gear

```http
GET /api/provider/gear
```

Used by:

```text
/provider-dashboard/gear
```

---

# 20. Create Gear

### Endpoint

```http
POST /api/provider/gear
```

### Authentication

```http
Authorization: Bearer <JWT>
```

### Example

```json
{
  "title": "Canon EOS R5 Camera",
  "description": "Professional mirrorless camera",
  "brand": "Canon",
  "pricePerDay": 50,
  "stock": 3,
  "categoryId": "category-id",
  "images": [
    "https://example.com/image.jpg"
  ]
}
```

---

# 21. Update Gear

### Endpoint

```http
PUT /api/provider/gear/:id
```

Example:

```http
PUT /api/provider/gear/gear-id
```

---

# 22. Delete Gear

### Endpoint

```http
DELETE /api/provider/gear/:id
```

Example:

```http
DELETE /api/provider/gear/gear-id
```

After deletion, the frontend invalidates the provider gear query:

```ts
queryClient.invalidateQueries({
  queryKey: ["provider-gear"],
});
```

The UI can also optimistically remove the item before the server response.

---

# 23. Toggle Gear Availability

### Endpoint

```http
PUT /api/provider/gear/:id
```

### Request

```json
{
  "isAvailable": false
}
```

The frontend updates the UI optimistically and then synchronizes with the backend.

---

# 24. Provider Orders

### Endpoint

```http
GET /api/provider/orders
```

Optional query parameters:

```text
status
page
limit
```

Example:

```http
GET /api/provider/orders?page=1&limit=20
```

---

# 25. Provider Order Status

### Endpoint

```http
PATCH /api/provider/orders/:id/status
```

### Request

```json
{
  "status": "CONFIRMED"
}
```

Supported provider transitions:

```text
PLACED → CONFIRMED
PAID → PICKED_UP
PICKED_UP → RETURNED
```

---

# 26. Optimistic Order Updates

The provider order table uses TanStack Query.

When the provider clicks:

```text
Confirm
```

the frontend immediately changes:

```text
PLACED
```

to:

```text
CONFIRMED
```

without waiting for the API response.

If the API fails, the previous state is restored.

Example:

```ts
queryClient.setQueryData<RentalOrder[]>(
  ["provider-orders"],
  (old = []) =>
    old.map((order) =>
      order.id === orderId
        ? { ...order, status }
        : order
    )
);
```

---

# 27. Admin APIs

Admin APIs require an authenticated ADMIN user.

## Users

```http
GET /api/admin/users
```

### Update User

```http
PATCH /api/admin/users/:id
```

---

# 28. Admin Gear

```http
GET /api/admin/gear
```

Used by:

```text
/admin-dashboard/gear
```

---

# 29. Admin Rentals

```http
GET /api/admin/rentals
```

Used by:

```text
/admin-dashboard/rentals
```

---

# 30. Authentication Header

Authenticated API requests use:

```http
Authorization: Bearer <accessToken>
```

Server-side example:

```ts
const cookieStore = await cookies();

const token = cookieStore.get("accessToken")?.value;

const response = await fetch(
  `${process.env.BACKEND_API_URL}/api/provider/gear`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

---

# 31. Error Handling

The backend follows a consistent response structure.

### Successful response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Failed response

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

The frontend checks both HTTP status and the `success` property:

```ts
if (!response.ok || !result.success) {
  return {
    success: false,
    message: result.message ?? "Request failed",
  };
}
```

---

# 32. Server Actions

Server Actions are used for mutations that require authentication.

Examples:

```text
createGearAction
updateGearAction
deleteGearAction
toggleAvailabilityAction
updateOrderStatusAction
createRentalAction
createPaymentAction
```

Typical structure:

```ts
"use server";

import { cookies } from "next/headers";

export async function exampleAction() {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value;

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/example`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.json();
}
```

---

# 33. Cache and Revalidation

GearUp uses Next.js cache tags for server-rendered data.

### Gear list

```ts
next: {
  tags: ["gear-list"],
}
```

After provider mutations:

```ts
revalidateTag("gear-list", "max");
```

### Provider gear

```ts
next: {
  tags: ["provider-gear"],
}
```

After mutations:

```ts
revalidateTag("provider-gear", "max");
```

### Gear details

```ts
next: {
  tags: [`gear-detail-${gearId}`],
}
```

After updating:

```ts
revalidateTag(`gear-detail-${gearId}`, "max");
```

---

# 34. TanStack Query

TanStack Query is used for interactive client-side state.

Main query keys:

```ts
["provider-orders"]
["provider-gear"]
```

Example:

```ts
const { data } = useQuery({
  queryKey: ["provider-orders"],
  queryFn: fetchOrders,
});
```

Mutations invalidate the relevant query:

```ts
queryClient.invalidateQueries({
  queryKey: ["provider-orders"],
});
```

---

# 35. Cache Strategy

GearUp uses different strategies depending on the page.

### Public gear

```text
Server fetch
    ↓
Next.js cache
    ↓
revalidateTag()
```

### Interactive provider orders

```text
Server initial data
        ↓
TanStack Query
        ↓
Optimistic update
        ↓
Server Action
        ↓
Invalidate query
```

### Provider gear

```text
Server initial data
        ↓
TanStack Query
        ↓
Create / Update / Delete / Toggle
        ↓
Optimistic UI
        ↓
Invalidate query
```

---

# 36. API Integration File Structure

```text
gearup-frontend/
│
├── app/
│   ├── (publicGroup)/
│   │   └── _actions/
│   │       ├── getGearList.ts
│   │       ├── getGearById.ts
│   │       ├── getCategories.ts
│   │       └── getGearReviews.ts
│   │
│   └── (dashboardGroup)/
│       └── _actions/
│           ├── rentalActions.ts
│           ├── paymentActions.ts
│           ├── providerGearActions.ts
│           ├── providerOrderActions.ts
│           ├── reviewActions.ts
│           └── adminActions.ts
│
├── service/
│   ├── getMe.ts
│   ├── getMyRentals.ts
│   ├── getMyPayments.ts
│   ├── getProviderGear.ts
│   ├── getProviderOrders.ts
│   ├── getAdminUsers.ts
│   └── getAdminRentals.ts
│
├── hooks/
│   ├── use-provider-gear-query.ts
│   └── use-provider-orders-query.ts
│
└── lib/
    ├── types.ts
    └── query-client.ts
```

---

# 37. API Endpoint Summary

| Feature             | Method | Endpoint                          | Auth             |
| ------------------- | ------ | --------------------------------- | ---------------- |
| Register            | POST   | `/api/auth/register`              | No               |
| Login               | POST   | `/api/auth/login`                 | No               |
| Current user        | GET    | `/api/auth/me`                    | Yes              |
| Gear list           | GET    | `/api/gear`                       | No               |
| Gear details        | GET    | `/api/gear/:id`                   | No               |
| Categories          | GET    | `/api/categories`                 | No               |
| Reviews             | GET    | `/api/gear/:id/reviews`           | No               |
| Create rental       | POST   | `/api/rentals`                    | Yes              |
| My rentals          | GET    | `/api/rentals`                    | Yes              |
| Create payment      | POST   | `/api/payments/create`            | Yes              |
| Payment history     | GET    | `/api/payments`                   | Yes              |
| Stripe webhook      | POST   | `/api/payments/webhook/stripe`    | Stripe Signature |
| Provider gear       | GET    | `/api/provider/gear`              | Provider         |
| Create gear         | POST   | `/api/provider/gear`              | Provider         |
| Update gear         | PUT    | `/api/provider/gear/:id`          | Provider         |
| Delete gear         | DELETE | `/api/provider/gear/:id`          | Provider         |
| Provider orders     | GET    | `/api/provider/orders`            | Provider         |
| Update order status | PATCH  | `/api/provider/orders/:id/status` | Provider         |
| Admin users         | GET    | `/api/admin/users`                | Admin            |
| Update user         | PATCH  | `/api/admin/users/:id`            | Admin            |
| Admin gear          | GET    | `/api/admin/gear`                 | Admin            |
| Admin rentals       | GET    | `/api/admin/rentals`              | Admin            |

---

# 38. Environment Variables

Create `.env.local`:

```env
BACKEND_API_URL=http://localhost:5000
```

For production:

```env
BACKEND_API_URL=https://your-production-backend.com
```

Stripe client-side configuration:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxx
```

The Stripe secret key must **never** be exposed to the frontend.

---

# 39. Security Rules

The frontend follows these rules:

1. JWT is stored in an HTTP-only cookie.
2. JWT is never stored in `localStorage`.
3. JWT is never exposed to client components.
4. Server Actions forward authentication to the backend.
5. Stripe secret keys are only stored on the backend.
6. Stripe webhook signatures are verified on the backend.
7. Customers cannot directly mark orders as `PAID`.
8. Providers cannot modify another provider's gear.
9. Admin APIs require ADMIN authorization.
10. Backend authorization remains the final source of truth.

---

# 40. Complete Application Flow

```text
                         ┌──────────────┐
                         │    User      │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Next.js    │
                         └──────┬───────┘
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
                  ▼             ▼             ▼
              Public API    Server Actions   TanStack
                  │             │             │
                  └─────────────┼─────────────┘
                                ▼
                       ┌─────────────────┐
                       │ GearUp Backend  │
                       └────────┬────────┘
                                │
                                ▼
                          ┌────────────┐
                          │ PostgreSQL │
                          └────────────┘

Payment flow:

Customer
   │
   ▼
Next.js
   │
   ▼
Backend
   │
   ▼
Stripe PaymentIntent
   │
   ▼
Stripe Checkout
   │
   ▼
payment_intent.succeeded
   │
   ▼
Stripe Webhook
   │
   ▼
Backend
   ├── Payment → COMPLETED
   └── Order → PAID
```

---

# 41. Development Checklist

Before considering API integration complete:

* [ ] Authentication API connected
* [ ] JWT stored securely in HTTP-only cookie
* [ ] Current-user API connected
* [ ] Public gear API connected
* [ ] Category API connected
* [ ] Gear details API connected
* [ ] Rental creation connected
* [ ] Customer rental history connected
* [ ] Stripe payment creation connected
* [ ] Stripe webhook configured
* [ ] Payment history connected
* [ ] Provider gear CRUD connected
* [ ] Provider availability toggle connected
* [ ] Provider orders connected
* [ ] Provider order status updates connected
* [ ] Optimistic provider order updates implemented
* [ ] Optimistic gear deletion implemented
* [ ] Admin users API connected
* [ ] Admin gear API connected
* [ ] Admin rentals API connected
* [ ] Error handling implemented
* [ ] Cache tags configured
* [ ] TanStack Query invalidation configured
* [ ] Production environment variables configured

---

# 42. Production Deployment

Before deploying the frontend, update:

```env
BACKEND_API_URL=https://your-production-backend.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxx
```

The backend must also configure the Stripe webhook:

```text
https://your-production-backend.com/api/payments/webhook/stripe
```

The Stripe webhook endpoint must listen for:

```text
payment_intent.succeeded
payment_intent.payment_failed
```

The production webhook signing secret must be configured on the backend:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxx
```

Never put:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

inside frontend `NEXT_PUBLIC_*` variables.

---

# Conclusion

GearUp's frontend follows a hybrid architecture:

```text
Next.js Server Components
        +
Server Actions
        +
TanStack Query
        +
JWT HTTP-only Cookies
        +
Stripe.js
        +
Next.js Cache/Revalidation
```

This architecture provides:

* Secure authentication
* Server-side API communication
* Optimistic UI updates
* Reliable payment processing
* Cache invalidation
* Responsive customer/provider dashboards
* Clear separation between frontend and backend responsibilities
