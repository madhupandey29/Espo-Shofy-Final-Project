# Analytics Event Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Next.js App                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User Actions
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Event Tracking Layer                          │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Automatic       │  │  Manual          │  │  Redux        │ │
│  │  Tracking        │  │  Tracking        │  │  Integration  │ │
│  │                  │  │                  │  │               │ │
│  │  • Page Views    │  │  • Button Clicks │  │  • Login      │ │
│  │  • Scroll Depth  │  │  • Form Submits  │  │  • Cart       │ │
│  │                  │  │  • Custom Events │  │  • Wishlist   │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ trackEvent()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              src/utils/analytics.js (Central Hub)                │
│                                                                   │
│  • Validates events                                              │
│  • Formats data                                                  │
│  • Sends to multiple platforms                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   Google Analytics (GA4)  │   │   Microsoft Clarity       │
│                           │   │                           │
│  • Event tracking         │   │  • Session recording      │
│  • User properties        │   │  • Heatmaps              │
│  • E-commerce data        │   │  • User identification    │
│  • Custom dimensions      │   │  • Custom events          │
└───────────────────────────┘   └───────────────────────────┘
```

## Event Flow Examples

### 1. User Login Flow
```
User clicks "Login" button
         │
         ▼
Login form submitted
         │
         ▼
authApi.loginUser mutation
         │
         ▼
onQueryStarted hook
         │
         ▼
trackLogin('email', userId)
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
    GA4: login      Clarity: login    Console: 📊
    event with      event              (dev mode)
    user_id
```

### 2. Add to Cart Flow
```
User clicks "Add to Cart"
         │
         ▼
cartApi.addToCart mutation
         │
         ▼
onQueryStarted hook
         │
         ▼
trackAddToCart(product, quantity)
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
    GA4:            Clarity:          Console: 📊
    add_to_cart     add_to_cart       (dev mode)
    with items      event
    and value
```

### 3. Page View Flow (Automatic)
```
User navigates to new page
         │
         ▼
Next.js router change
         │
         ▼
usePageTracking hook
         │
         ▼
trackPageView(url, title)
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
    GA4:            Clarity:          Console: 📊
    page_view       page update       (dev mode)
    event
```

### 4. Scroll Tracking Flow (Automatic)
```
User scrolls page
         │
         ▼
Scroll event listener (throttled)
         │
         ▼
Calculate scroll percentage
         │
         ▼
Reached milestone? (25%, 50%, 75%, 100%)
         │
         ▼
trackScrollDepth(percentage)
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
    GA4:            Clarity:          Console: 📊
    scroll event    scroll event      (dev mode)
    with %
```

## Component Integration Map

```
src/app/layout.jsx
    │
    ├─ AnalyticsTracker (automatic tracking)
    │   └─ useAnalytics()
    │       ├─ usePageTracking()
    │       └─ useScrollTracking()
    │
    └─ Google Analytics & Clarity Scripts

src/redux/features/
    │
    ├─ auth/authApi.js
    │   ├─ loginUser → trackLogin()
    │   ├─ verifyLoginOTP → trackLogin()
    │   └─ verifyOTPAndRegister → trackSignup()
    │
    ├─ cartApi.js
    │   ├─ addToCart → trackAddToCart()
    │   └─ removeCartItem → trackRemoveFromCart()
    │
    └─ wishlist-slice.js
        └─ add_to_wishlist_2 → trackAddToWishlist()

src/components/
    │
    ├─ product-details/product-details-area.jsx
    │   └─ useEffect → trackProductView()
    │
    └─ login-register/google-sign-up.jsx
        └─ handleGoogleSignIn → trackLogin()

src/hooks/
    │
    └─ use-search-form-submit.js
        └─ handleSubmit → trackSearch()

src/utils/
    │
    └─ productPdf.js
        └─ downloadProductPdf → trackDownload()
```

## Data Flow to Analytics Platforms

### Google Analytics (GA4)
```
Event Data Structure:
{
  event_name: "add_to_cart",
  event_params: {
    currency: "INR",
    value: 500,
    items: [{
      item_id: "prod_123",
      item_name: "Cotton Fabric",
      item_category: "Fabrics",
      price: 500,
      quantity: 1
    }]
  }
}
```

### Microsoft Clarity
```
Event Data Structure:
{
  event_name: "add_to_cart"
}

User Identification:
{
  user_id: "user_12345"
}
```

## Tracking Coverage

```
┌─────────────────────────────────────────────────────────────┐
│                    User Journey                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Landing Page ────────────► ✅ Page View                    │
│       │                      ✅ Scroll Depth                │
│       │                                                      │
│       ▼                                                      │
│  Search ──────────────────► ✅ Search Event                 │
│       │                                                      │
│       ▼                                                      │
│  Product List ────────────► ✅ Page View                    │
│       │                      ✅ Scroll Depth                │
│       │                                                      │
│       ▼                                                      │
│  Product Details ─────────► ✅ Page View                    │
│       │                      ✅ Product View                │
│       │                      ✅ Scroll Depth                │
│       │                                                      │
│       ├─► Add to Cart ─────► ✅ Add to Cart                 │
│       │                                                      │
│       ├─► Add to Wishlist ─► ✅ Add to Wishlist             │
│       │                                                      │
│       └─► Download PDF ────► ✅ File Download               │
│                                                              │
│  Cart Page ───────────────► ✅ Page View                    │
│       │                      ✅ Scroll Depth                │
│       │                                                      │
│       ├─► Remove Item ─────► ✅ Remove from Cart            │
│       │                                                      │
│       └─► Checkout ────────► 🔄 Add trackBeginCheckout()   │
│                                                              │
│  Login/Register ──────────► ✅ Login Event                  │
│                              ✅ Signup Event                │
│                              ✅ User ID Set                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Legend:
✅ = Already Implemented
🔄 = Easy to Add (see ANALYTICS_IMPLEMENTATION_GUIDE.md)
```

## Quick Reference: Where Events Are Tracked

| Event | File | Function/Hook |
|-------|------|---------------|
| Page View | `src/hooks/useAnalytics.js` | `usePageTracking()` |
| Scroll Depth | `src/hooks/useAnalytics.js` | `useScrollTracking()` |
| Login (Email) | `src/redux/features/auth/authApi.js` | `loginUser.onQueryStarted` |
| Login (OTP) | `src/redux/features/auth/authApi.js` | `verifyLoginOTP.onQueryStarted` |
| Login (Google) | `src/components/login-register/google-sign-up.jsx` | `handleGoogleSignIn` |
| Signup | `src/redux/features/auth/authApi.js` | `verifyOTPAndRegister.onQueryStarted` |
| Product View | `src/components/product-details/product-details-area.jsx` | `useEffect` |
| Add to Cart | `src/redux/features/cartApi.js` | `addToCart.onQueryStarted` |
| Remove from Cart | `src/redux/features/cartApi.js` | `removeCartItem.onQueryStarted` |
| Add to Wishlist | `src/redux/features/wishlist-slice.js` | `add_to_wishlist_2` |
| Search | `src/hooks/use-search-form-submit.js` | `handleSubmit` |
| Download PDF | `src/utils/productPdf.js` | `downloadProductPdf` |

---

This diagram shows how events flow through your application to both analytics platforms!
