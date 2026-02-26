# Bailout Fix - Current Status

## What Was Done ✅

### 1. Root Layout Cleaned
- Removed `<Providers>` (Redux Provider) from `src/app/layout.jsx`
- Removed `<ErrorBoundary>` wrapper
- RootLayout is now purely server-side

### 2. CSR Layout Created
- Created `src/app/(csr)/layout.jsx` with Redux Provider
- Redux now only wraps CSR routes (login, cart, profile, checkout)

### 3. ISR-Compatible Components Created
- `src/layout/wrapper-isr.jsx` - Wrapper without Redux
- `src/layout/headers/header-2-isr.jsx` - Header without Redux (no cart, no wishlist, just search + sign in)
- `src/layout/footers/footer-isr.jsx` - Simple footer without Redux API calls

### 4. Fixed ClientOnlyFloating
- Replaced `next/dynamic({ ssr: false })` with mount-after-hydration pattern
- Uses `useState` + `useEffect` to avoid bailout

### 5. Updated ISR Pages
All pages in `src/app/(isr)/` now use:
- `WrapperISR` instead of `Wrapper`
- `HeaderTwoISR` instead of `HeaderTwo`
- Some still use `Footer` (needs to be replaced with `FooterISR`)

## Current Build Error ❌

```
Error occurred prerendering page "/about"
TypeError: Cannot destructure property 'store' of 'b(...)' as it is null.
```

## Root Cause

ISR pages are importing client components that use Redux hooks (`useSelector`, `useDispatch`, Redux RTK Query).

### Components That Need Fixing:

1. **Footer** (`src/layout/footers/footer.jsx`)
   - Uses `useGetOfficeInformationQuery()` from Redux
   - Solution: Replace with `FooterISR` in all ISR pages

2. **Client Components in ISR Pages**
   - Many page-specific client components (AboutClient, CapabilitiesClient, etc.) likely use Redux
   - These need to be refactored to NOT use Redux, or fetch data via props from server components

## Next Steps to Complete the Fix

### Step 1: Replace Footer in All ISR Pages

Find all ISR pages using `Footer` and replace with `FooterISR`:

```bash
# Files to update:
src/app/(isr)/about/page.jsx
src/app/(isr)/capabilities/page.jsx
src/app/(isr)/contact/page.jsx
src/app/(isr)/fabric/page.jsx
src/app/(isr)/fabric/[slug]/page.jsx
src/app/(isr)/product-details/page.jsx
src/app/(isr)/shop-category/page.jsx
src/app/(isr)/shop-hidden-sidebar/page.jsx
src/app/(isr)/shop-right-sidebar/page.jsx
src/app/(isr)/blog/page.jsx
src/app/(isr)/blog/tag/[tagname]/page.jsx
# ... and any others
```

### Step 2: Identify Client Components Using Redux

Search for Redux usage in client components:

```bash
# Find all client components in ISR pages that use Redux
grep -r "useSelector\|useDispatch\|useGetQuery\|useMutation" src/app/(isr)/ --include="*Client.jsx"
```

### Step 3: Refactor Client Components

For each client component using Redux:

**Option A: Pass Data as Props (Recommended)**
```jsx
// Server Component (page.jsx)
export default async function Page() {
  const data = await fetch(...).then(r => r.json());
  return <ClientComponent data={data} />;
}

// Client Component
'use client';
export default function ClientComponent({ data }) {
  // Use data prop instead of Redux
}
```

**Option B: Fetch in Client Component (Not ISR)**
```jsx
'use client';
export default function ClientComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(...).then(r => r.json()).then(setData);
  }, []);
  
  // Use data state
}
```

**Option C: Move to CSR Route Group**
- If the page MUST have user-specific features (cart, wishlist, profile data)
- Move it from `(isr)/` to `(csr)/` route group

### Step 4: Test Build

After each fix:
```bash
npm run build
```

Watch for the next error and repeat.

## Architecture Summary

```
src/app/
├── layout.jsx (Server-only, no Redux)
├── not-found.jsx (Uses WrapperISR + HeaderTwoISR + FooterISR)
│
├── (isr)/ [ISR Route Group - NO REDUX]
│   ├── page.jsx (Home)
│   ├── about/page.jsx
│   ├── blog/page.jsx
│   ├── fabric/page.jsx
│   └── ... (All use WrapperISR, HeaderTwoISR, FooterISR)
│
└── (csr)/ [CSR Route Group - HAS REDUX]
    ├── layout.jsx (Provides Redux Provider)
    ├── login/page.jsx
    ├── cart/page.jsx
    ├── profile/page.jsx
    └── checkout/page.jsx
```

## Key Rules for ISR Pages

1. ❌ NO `useSelector` or `useDispatch`
2. ❌ NO Redux RTK Query hooks (`useGetQuery`, `useMutation`)
3. ❌ NO `next/dynamic({ ssr: false })`
4. ✅ Use server-side data fetching with `fetch()` and `revalidate`
5. ✅ Pass data as props to client components
6. ✅ Use `WrapperISR`, `HeaderTwoISR`, `FooterISR`

## Testing Checklist

Once build succeeds:

1. Run production build:
   ```bash
   npm run build
   npm run start
   ```

2. Check View Source on home page:
   - ✅ NO `BAILOUT_TO_CLIENT_SIDE_RENDERING` template
   - ✅ Actual HTML content visible
   - ✅ Products/blogs rendered in HTML

3. Test ISR revalidation:
   - Visit home page
   - Wait 60 seconds (revalidate time)
   - Refresh - should see updated content

4. Test CSR pages still work:
   - Login
   - Add to cart
   - View wishlist
   - Checkout

## Files Created

- `src/app/(csr)/layout.jsx` - CSR layout with Redux
- `src/layout/wrapper-isr.jsx` - ISR wrapper without Redux
- `src/layout/headers/header-2-isr.jsx` - ISR header without Redux
- `src/layout/footers/footer-isr.jsx` - ISR footer without Redux

## Files Modified

- `src/app/layout.jsx` - Removed Providers
- `src/components/common/ClientOnlyFloating.jsx` - Removed dynamic({ ssr: false })
- `src/components/provider.jsx` - Still includes ClientOnlyFloating (now safe)
- All files in `src/app/(isr)/` - Updated imports

## Estimated Time to Complete

- Replacing Footer in ISR pages: 15 minutes
- Finding and refactoring client components: 1-2 hours (depends on complexity)
- Testing: 30 minutes

Total: 2-3 hours

## Alternative: Quick Win Approach

If you want ISR working ASAP for just the home page:

1. Keep only home page in `(isr)/`
2. Move all other pages to `(csr)/`
3. This gives you ISR for home page immediately
4. Gradually move pages back to `(isr)/` as you refactor them

```
src/app/
├── (isr)/
│   └── page.jsx (Home only - works with ISR)
│
└── (csr)/
    ├── layout.jsx (Redux Provider)
    ├── about/page.jsx
    ├── blog/page.jsx
    ├── fabric/page.jsx
    └── ... (Everything else - works with Redux)
```

This approach gets you:
- ✅ Home page fully ISR with revalidate: 60
- ✅ All other pages still work (with Redux)
- ✅ No build errors
- ⏰ Can refactor other pages to ISR gradually
