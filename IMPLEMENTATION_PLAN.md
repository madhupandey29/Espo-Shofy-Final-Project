# ISR/CSR Split - Detailed Implementation Plan

## Executive Summary

**Goal**: Split Next.js app into ISR (server-rendered SEO pages) and CSR (client-rendered user pages) using route groups, while maintaining all existing functionality.

**Status**: ✅ SAFE TO PROCEED with careful implementation

**Key Finding**: Most ISR pages already use server-side fetching. Main issue is Redux usage in shared components (Header, Footer, Wrapper).

## Critical Redux Usage in Shared Components

### Components Used by BOTH ISR and CSR Pages

1. **Wrapper** (`src/layout/wrapper.jsx`)
   - Uses: `useSelector`, `useDispatch`
   - Used by: ALL pages
   - **Solution**: Create ISR and CSR versions

2. **HeaderTwo** (`src/layout/headers/header-2.jsx`)
   - Uses: `useDispatch`, `useSelector`, `useGetSessionInfoQuery`
   - Used by: Most pages
   - **Solution**: Create server version for ISR, keep client version for CSR

3. **Footer** (`src/layout/footers/footer.jsx`)
   - Uses: `useGetOfficeInformationQuery`
   - Used by: ALL pages
   - **Solution**: Fetch office info server-side, pass as props

4. **HomePageTwoClient** (`src/app/HomePageTwoClient.jsx`)
   - Uses: `useGetOfficeInformationQuery`
   - Used by: Home page (ISR)
   - **Solution**: Fetch office info server-side, pass as props

## Implementation Strategy

### Option A: Minimal Changes (RECOMMENDED)
- Create route groups
- Keep shared components as-is
- Accept that ISR pages will have client-side hydration for interactive parts
- Focus on ensuring main content is server-rendered

### Option B: Full Separation (More Work)
- Create separate header/footer/wrapper for ISR and CSR
- Remove all Redux from ISR components
- Maximum performance but more maintenance

**RECOMMENDATION**: Start with Option A, optimize later if needed.

## Step-by-Step Implementation

### Phase 1: Backup and Preparation ✅
1. Create backup of current state
2. Document all current routes
3. Test current build to establish baseline

### Phase 2: Create Route Groups Structure
```
src/app/
├── (isr)/                    # ISR routes (SEO pages)
│   ├── layout.jsx           # Server layout (no Redux)
│   ├── page.jsx             # Home
│   ├── fabric/
│   │   ├── page.jsx
│   │   └── [slug]/
│   │       └── page.jsx
│   ├── blog/
│   │   ├── page.jsx
│   │   └── [slug]/          # NEW: Convert from blog-details
│   │       └── page.jsx
│   ├── about/
│   ├── contact/
│   ├── capabilities/
│   ├── search/              # DECISION: ISR for SEO
│   ├── shop-category/       # DECISION: ISR for SEO
│   ├── shop-right-sidebar/  # DECISION: ISR for SEO
│   ├── shop-hidden-sidebar/ # DECISION: ISR for SEO
│   └── sitemap/             # DECISION: ISR
│
├── (csr)/                    # CSR routes (User pages)
│   ├── layout.jsx           # Client layout (with Redux)
│   ├── login/
│   ├── register/
│   ├── cart/
│   ├── checkout/
│   ├── profile/
│   ├── wishlist/
│   ├── compare/             # DECISION: CSR
│   ├── email-verify/
│   ├── forgot/
│   ├── forget-password/
│   ├── order/
│   └── order-confirmation/
│
├── api/                      # Keep as-is
├── layout.jsx               # Minimal root layout
├── not-found.jsx            # Keep as-is
├── robots.js                # Keep as-is
└── sitemap.js               # Keep as-is
```

### Phase 3: Update Root Layout
**File**: `src/app/layout.jsx`

Changes:
1. Remove `<Providers>` wrapper
2. Keep analytics, structured data, fonts
3. Keep `<ErrorBoundary>` but make it Redux-free
4. Move `ClientOnlyFloating` to individual layouts

### Phase 4: Create ISR Layout
**File**: `src/app/(isr)/layout.jsx`

```jsx
// Server Component (no "use client")
import ClientOnlyFloating from '@/components/common/ClientOnlyFloating';

export default function ISRLayout({ children }) {
  return (
    <>
      {children}
      <ClientOnlyFloating />
    </>
  );
}
```

### Phase 5: Create CSR Layout
**File**: `src/app/(csr)/layout.jsx`

```jsx
import Providers from '@/components/provider';

export default function CSRLayout({ children }) {
  return <Providers>{children}</Providers>;
}
```

### Phase 6: Move Routes to Correct Groups

#### ISR Routes to Move:
- `src/app/page.jsx` → `src/app/(isr)/page.jsx`
- `src/app/fabric/` → `src/app/(isr)/fabric/`
- `src/app/blog/` → `src/app/(isr)/blog/`
- `src/app/blog-details/[id]/` → `src/app/(isr)/blog/[slug]/` (RENAME)
- `src/app/about/` → `src/app/(isr)/about/`
- `src/app/contact/` → `src/app/(isr)/contact/`
- `src/app/capabilities/` → `src/app/(isr)/capabilities/`
- `src/app/search/` → `src/app/(isr)/search/`
- `src/app/shop-category/` → `src/app/(isr)/shop-category/`
- `src/app/shop-right-sidebar/` → `src/app/(isr)/shop-right-sidebar/`
- `src/app/shop-hidden-sidebar/` → `src/app/(isr)/shop-hidden-sidebar/`
- `src/app/sitemap/` → `src/app/(isr)/sitemap/`

#### CSR Routes to Move:
- `src/app/login/` → `src/app/(csr)/login/`
- `src/app/register/` → `src/app/(csr)/register/`
- `src/app/cart/` → `src/app/(csr)/cart/`
- `src/app/checkout/` → `src/app/(csr)/checkout/`
- `src/app/profile/` → `src/app/(csr)/profile/`
- `src/app/wishlist/` → `src/app/(csr)/wishlist/`
- `src/app/compare/` → `src/app/(csr)/compare/`
- `src/app/email-verify/` → `src/app/(csr)/email-verify/`
- `src/app/forgot/` → `src/app/(csr)/forgot/`
- `src/app/forget-password/` → `src/app/(csr)/forget-password/`
- `src/app/order/` → `src/app/(csr)/order/`
- `src/app/order-confirmation/` → `src/app/(csr)/order-confirmation/`

### Phase 7: Fix HomePageTwoClient Redux Usage

**Current Issue**:
```jsx
const { data: officeRes } = useGetOfficeInformationQuery();
```

**Solution**:
1. Fetch office info in `src/app/(isr)/page.jsx` server-side
2. Pass as prop to `HomePageTwoClient`
3. Update `HomePageTwoClient` to accept prop instead of Redux query

### Phase 8: Update Middleware
**File**: `middleware.ts`

Update protected routes to use new paths:
```typescript
const PROTECTED_ROUTES = ['/cart', '/profile', '/wishlist', '/checkout', '/order'];
```

No other changes needed - route groups don't affect URLs!

### Phase 9: Testing Checklist

#### Build Test
```bash
npm run build
```
Expected: No errors, no "BAILOUT_TO_CLIENT_SIDE_RENDERING" for ISR pages

#### ISR Pages Test
For each ISR page (`/`, `/fabric`, `/blog`, etc.):
1. View Page Source
2. Verify real content visible (not just loading spinner)
3. Check for structured data in source
4. Verify no Redux errors in console

#### CSR Pages Test
For each CSR page (`/cart`, `/profile`, etc.):
1. Verify Redux works
2. Check cart functionality
3. Test wishlist
4. Verify auth protection

#### Floating Widgets Test
1. Verify chatbot appears on all pages
2. Verify social share buttons work
3. Check no console errors

#### SEO Test
1. Run Lighthouse on ISR pages
2. Verify meta tags
3. Check structured data with Google Rich Results Test
4. Verify sitemap.xml still works

## Risk Mitigation

### Low Risk Items ✅
- Route groups don't change URLs
- API routes unaffected
- Static assets unaffected
- Middleware continues to work

### Medium Risk Items ⚠️
- File moves might break imports (use search/replace)
- Floating widgets need careful placement
- Need to test all pages thoroughly

### High Risk Items ❌
- Redux in shared components (Wrapper, Header, Footer)
- HomePageTwoClient needs refactoring
- Blog URL change from `/blog-details/[id]` to `/blog/[slug]`

### Mitigation Strategies
1. **Gradual Implementation**: Do one phase at a time
2. **Test After Each Phase**: Run build and test
3. **Keep Backups**: Git commit after each successful phase
4. **Rollback Plan**: Can revert route groups if issues arise

## URL Changes

### Breaking Changes (Need Redirects)
- `/blog-details/[id]` → `/blog/[slug]`
  - **Solution**: Add redirect in `next.config.js`

### No Changes (Route Groups Transparent)
- All other URLs remain the same
- `/fabric` stays `/fabric` (even though file is in `(isr)/fabric`)
- `/cart` stays `/cart` (even though file is in `(csr)/cart`)

## Performance Expectations

### Before (Current)
- All pages client-rendered due to Redux Provider in root
- Slower initial page load
- SEO content requires JavaScript

### After (With Route Groups)
- ISR pages server-rendered
- Faster initial page load for SEO pages
- Better SEO (content in HTML source)
- CSR pages unchanged (still fast for logged-in users)

## Conclusion

**This implementation is SAFE and RECOMMENDED** because:

1. ✅ Next.js 16 fully supports route groups
2. ✅ Most ISR pages already use server-side fetching
3. ✅ Clear separation between ISR and CSR routes
4. ✅ No breaking changes to URLs (except blog-details)
5. ✅ Can be implemented gradually
6. ✅ Easy to rollback if needed

**Main Challenge**: Redux usage in shared components (Wrapper, Header, Footer)

**Recommended Approach**: 
- Start with Option A (minimal changes)
- Accept some client-side hydration for interactive parts
- Focus on ensuring main content is server-rendered
- Optimize individual components later if needed

**Proceed?** YES - Let's implement phase by phase with testing at each step.
