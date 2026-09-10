# Brain — E-com Architecture Map

## Root

```
D:\Web\E-com
├── package.json            # concurrently runs backend + frontend dev servers
├── docker-compose.yml
├── README.md
└── AGENTS.md
```

## Frontend (`frontend/`)

```
frontend/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── .env                         # VITE_API_URL=http://localhost:5000/api
    ├── types/                       # User, Role, Product, ApiResponse
    ├── utils/
    │   ├── validators.ts            # zod schemas (login/register)
    │   ├── formatters.ts
    │   └── printReceipt.ts
    ├── data/
    │   └── catalog.ts               # local fallback products/categories
    ├── services/
    │   ├── api.ts                   # re-exports apiClient
    │   ├── apiClient.ts             # axios instance, 401 refresh interceptor
    │   ├── authService.ts
    │   ├── productService.ts
    │   ├── categoryService.ts
    │   ├── sellerService.ts
    │   └── ...
    ├── stores/
    │   ├── useAuthStore.ts          # login/register/checkAuth/logout
    │   ├── useCartStore.ts
    │   ├── useWishlistStore.ts
    │   └── ...
    ├── hooks/
    │   └── useProducts.ts           # useSearchProducts, useGetProducts, useGetCategories
    ├── layouts/
    │   ├── MainLayout.tsx
    │   ├── AuthLayout.tsx
    │   ├── AdminLayout.tsx
    │   └── SellerLayout.tsx
    ├── routes/
    │   ├── AppRoutes.tsx
    │   ├── ProtectedRoute.tsx
    │   ├── AdminRoute.tsx
    │   └── SellerRoute.tsx
    ├── components/
    │   ├── ui/                      # Input, Button, Card, Badge
    │   ├── products/ProductCard.tsx
    │   ├── home/                    # HeroCarousel, ProductShelf
    │   ├── common/                  # Navbar, Footer, BackButton, CartGlassToast
    │   ├── seller/ProductForm.tsx
    │   └── orders/OrderTrackingTimeline.tsx
    ├── features/
    │   ├── reviews/
    │   ├── ai/
    │   └── products/                # recommendations
    └── pages/
        ├── HomePage.tsx
        ├── ProductsPage.tsx
        ├── SearchPage.tsx
        ├── ProductDetailPage.tsx
        ├── LoginPage.tsx
        ├── RegisterPage.tsx
        ├── CartPage.tsx
        ├── CheckoutPage.tsx
        ├── WishlistPage.tsx
        ├── ProfilePage.tsx
        ├── AddressesPage.tsx
        ├── OrdersPage.tsx
        ├── SalesmanApplyPage.tsx
        ├── admin/
        └── seller/
```

## Backend (`backend/`)

```
backend/
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/
    │   │   │   ├── login/route.ts
    │   │   │   ├── register/route.ts
    │   │   │   ├── me/route.ts
    │   │   │   ├── refresh/route.ts       # issues new access token
    │   │   │   └── logout/route.ts
    │   │   ├── products/
    │   │   │   ├── list/route.ts
    │   │   │   ├── [slug]/route.ts        # get/put/delete
    │   │   │   ├── views/route.ts
    │   │   │   └── analytics/route.ts
    │   │   ├── search/
    │   │   │   ├── list/route.ts
    │   │   │   └── autocomplete/route.ts
    │   │   ├── categories/
    │   │   ├── cart/
    │   │   ├── wishlist/
    │   │   ├── orders/
    │   │   ├── payments/
    │   │   ├── reviews/
    │   │   ├── addresses/
    │   │   ├── coupons/validate
    │   │   ├── admin/*
    │   │   ├── seller/*
    │   │   ├── salesman/apply
    │   │   └── ai/                       # chatbot, summarize-reviews, generate-description, recommendations
    ├── services/
    │   ├── searchService.ts
    │   ├── productService.ts
    │   ├── cartService.ts
    │   └── ...
    ├── repositories/
    │   ├── productRepository.ts
    │   └── userRepository.ts
    ├── utils/
    │   ├── auth.ts                       # bcrypt/jwt/cookie helpers
    │   ├── rateLimiter.ts
    │   ├── errorHandler.ts
    │   ├── apiResponse.ts
    │   └── env.ts
    ├── lib/
    │   ├── prisma.ts
    │   ├── cors.ts
    │   └── ai/
    └── validators/
        ├── authValidator.ts
        ├── productValidator.ts
        └── ...
```

## Data Model (Prisma)

```
User ──┬── addresses ── Order
       ├── carts ── CartItem
       ├── wishlists ── WishlistItem
       ├── orders ── OrderItem ── Product
       ├── reviews ── Product
       ├── refreshTokens
       ├── recommendations
       ├── productViews
       ├── searchEvents
       └── salesmanApplication / Store

Product ──┬── images
          ├── cartItems
          ├── wishlistItems
          ├── orderItems
          ├── reviews
          ├── recommendationEvents
          └── productViews

Category ── Product
```

## Key Flows

### Auth Flow

1. `App.tsx` → `useAuthStore.checkAuth()` → `GET /auth/me` (reads HttpOnly `accessToken` cookie)
2. Login/Register → backend issues `accessToken` (15m) + `refreshToken` (7d) as HttpOnly cookies
3. On 401 → `apiClient` interceptor calls `POST /auth/refresh` → retries original request
4. On refresh failure → dispatches `auth:logout` event → store clears user

### Product Card Click

- `ProductCard.tsx` image/title → `<Link to="/products/${slug}">` → `ProductDetailPage`
- `ProductDetailPage` → `GET /products/:slug` → records view

### Search Flow

- Navbar autocomplete → `GET /search/autocomplete?q=` → dropdown suggestions
- SearchPage → `GET /search` with filters → `SearchService.searchProducts`
- Supports: `q`, `category`, `brand`, `minPrice`, `maxPrice`, `minRating`, `inStock`, `sort`, pagination

## Important Files

| File | Role |
|---|---|
| `frontend/src/services/apiClient.ts` | Axios instance, 401 refresh interceptor |
| `frontend/src/stores/useAuthStore.ts` | Auth state machine |
| `frontend/src/hooks/useProducts.ts` | `useSearchProducts`, `useGetProducts`, `useGetCategories` |
| `frontend/src/pages/SearchPage.tsx` | Search UI + filters |
| `frontend/src/components/common/Navbar.tsx` | Autocomplete, nav actions |
| `frontend/src/components/products/ProductCard.tsx` | Product card + click/navigation |
| `backend/src/services/searchService.ts` | Search + autocomplete logic |
| `backend/src/app/api/auth/refresh/route.ts` | Refresh token endpoint |
| `backend/middleware.ts` | Global CORS for `/api/*` |
| `backend/prisma/schema.prisma` | Data model |

## Ports

- Backend: `http://localhost:5000` (Next.js dev)
- Frontend: `http://localhost:5173` (Vite)
- CORS allows `localhost:5173`

## Known Issues Fixed

- Auth: added 401 → refresh-token interceptor (`apiClient.ts`)
- Search: removed `enabled` gate in `useSearchProducts` (`useProducts.ts`)
- Search: fixed `minRating` pagination/counts (`searchService.ts`)
- Search: fixed brand suggestion `[object Object]` (`Navbar.tsx`)
