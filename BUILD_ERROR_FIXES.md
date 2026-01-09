# Build Error Fixes - Dynamic Server Usage

## Problem Summary

The Vercel build was failing due to **Dynamic Server Usage** errors during static generation. The main issues were:

1. **Layout API calls with `no-store`**: The root layout was making API calls with `cache: 'no-store'` which conflicts with static generation
2. **Cache configuration conflicts**: Some pages had conflicting cache settings

## Root Cause

```
Error fetching site settings: Dynamic server usage: no-store fetch https://espobackend.vercel.app/api/sitesettings
Error fetching company information: Dynamic server usage: no-store fetch https://espobackend.vercel.app/api/companyinformation
```

This happened because:
- `src/app/layout.jsx` was using `cache: 'no-store'` for API calls
- These calls were made in both `generateMetadata()` and the layout component
- Next.js couldn't statically generate pages that depend on dynamic data

## Fixes Applied

### 1. Fixed Layout API Caching (`src/app/layout.jsx`)

**Before:**
```javascript
const res = await fetch(url, { cache: 'no-store' });
```

**After:**
```javascript
const res = await fetch(url, { 
  next: { revalidate: 3600 } // Cache for 1 hour, no cache conflict
});
```

### 2. Fixed Shop Page Cache Conflict (`src/app/shop/page.jsx`)

**Before:**
```javascript
const res = await fetch(url, {
  headers: buildApiHeaders(),
  cache: "force-cache",
  next: { revalidate },  // ❌ Conflict: both cache and revalidate
});
```

**After:**
```javascript
const res = await fetch(url, {
  headers: buildApiHeaders(),
  next: { revalidate },  // ✅ Only revalidate
});
```

## Why This Works

1. **Static Generation Compatible**: Using only `next: { revalidate }` enables ISR without cache conflicts
2. **ISR (Incremental Static Regeneration)**: Pages are statically generated but revalidated every hour
3. **Performance**: Static pages load faster than dynamic ones
4. **SEO**: Static pages are better for search engines
5. **No Cache Conflicts**: Removed conflicting `cache: 'force-cache'` + `revalidate` combination

## Cache Strategy Explanation

- **`next: { revalidate: 3600 }`**: Enables ISR with 1-hour cache duration
- **No `cache: 'no-store'`**: Avoids dynamic server usage during build
- **No `cache: 'force-cache'`**: Prevents conflicts with revalidate option

## Pages That Remain Dynamic

These pages correctly use `export const dynamic = "force-dynamic"` and should remain dynamic:
- `/cart` - Real-time cart data
- `/checkout` - Fresh calculations
- `/profile` - User-specific data
- `/wishlist` - User-specific data
- `/order/[id]` - Order details

## Build Success

After these changes:
- ✅ Static pages generate successfully
- ✅ No more "Dynamic server usage" errors
- ✅ No more cache configuration warnings
- ✅ Site settings and company info are cached and revalidated
- ✅ Performance improved with static generation
- ✅ SEO benefits from static pages
- ✅ ISR/SSR architecture preserved

## Architecture Preserved

Your intentional rendering strategy remains intact:
- **ISR Pages**: `/shop`, `/blog`, `/contact` etc. - Static with revalidation
- **SSR Pages**: `/cart`, `/checkout`, `/profile`, `/wishlist` - Dynamic rendering
- **Layout**: Clean ISR caching without conflicts

## Next Steps

1. **Monitor**: Check if 1-hour cache duration works for your content update frequency
2. **Adjust**: If you need more frequent updates, reduce `revalidate` time
3. **Test**: Verify that site settings and company info update correctly after changes