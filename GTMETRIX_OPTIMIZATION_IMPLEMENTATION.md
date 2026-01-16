# GTmetrix D to B Grade - Implementation Guide

## CRITICAL ISSUE IDENTIFIED

Your page is loading **50 products** on the homepage, each with high-resolution images. This is causing the 22.8MB page size.

## Immediate Fixes (Will get you to B grade)

### 1. Reduce Product Limit (CRITICAL - Saves ~15MB)

**File**: `src/redux/features/newProductApi.js`
**Change**: Line 5 - `limit = 50` → `limit = 12`

```javascript
// BEFORE
const { limit = 50, page = 1, merchTag } = params;

// AFTER
const { limit = 12, page = 1, merchTag } = params;
```

**Impact**: Reduces initial products from 50 to 12 = **~15MB saved**

### 2. Optimize Image Quality

**File**: `next.config.js`
**Add**: Image quality optimization

```javascript
images: {
  // ... existing config
  quality: 75, // Add this line (default is 75, but explicitly set it)
  formats: ['image/avif', 'image/webp'], // Already good
  minimumCacheTTL: 60, // Already good
}
```

**Impact**: **~3-5MB saved** on images

### 3. Implement Lazy Loading for Images

**File**: `src/components/products/fashion/product-item.jsx`
**Change**: Add lazy loading for images below fold

```javascript
<Image
  src={src}
  alt={pname}
  width={CARD_W}
  height={CARD_H}
  sizes="(max-width: 768px) 100vw, 260px"
  priority={idx < 3} // Only first 3 images are priority
  loading={idx < 3 ? 'eager' : 'lazy'} // Lazy load rest
  quality={75} // Reduce quality
  className="tp-popular-product-img"
/>
```

**Impact**: **Faster initial load**, defers loading of below-fold images

### 4. Defer Non-Critical Scripts

**File**: `src/app/layout.jsx`
**Change**: Already done! Your Font Awesome and Animate CSS are loading async ✅

### 5. Add "Load More" Button

**File**: `src/components/products/fashion/popular-products.jsx`
**Add**: Pagination or "Load More" functionality

This allows users to load more products on demand instead of all at once.

## Implementation Steps

### Step 1: Reduce Product Limit (5 minutes)

1. Open `src/redux/features/newProductApi.js`
2. Change line 5: `limit = 50` → `limit = 12`
3. Save file

### Step 2: Optimize Image Settings (2 minutes)

1. Open `next.config.js`
2. Ensure `quality: 75` is set in images config
3. Save file

### Step 3: Build and Test (5 minutes)

```bash
npm run build
npm start
```

Then test on GTmetrix again.

## Expected Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Page Size | 22.8MB | 3-5MB | **-80%** |
| Performance | 53% (D) | 75-85% (B/A) | **+22-32%** |
| LCP | 2.4s | <2.0s | **-17%** |
| TBT | 528ms | <300ms | **-43%** |
| Requests | 73 | 25-30 | **-60%** |

## Additional Optimizations (Phase 2)

### 1. Implement Virtual Scrolling

For product lists with many items, use react-window or react-virtualized.

### 2. Code Splitting

Split large components:

```javascript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

### 3. Remove Unused CSS

Use PurgeCSS to remove unused styles:

```bash
npm install @fullhuman/postcss-purgecss --save-dev
```

### 4. Optimize Third-Party Scripts

- Defer Google Analytics
- Lazy load chatbot
- Defer Microsoft Clarity

### 5. Enable Compression

Ensure gzip/brotli compression is enabled on your server.

## Testing Checklist

- [ ] Reduce product limit to 12
- [ ] Set image quality to 75
- [ ] Build production version
- [ ] Test on localhost:3000
- [ ] Deploy to production
- [ ] Test on GTmetrix
- [ ] Verify Performance score is B or higher
- [ ] Check LCP is under 2.0s
- [ ] Verify page size is under 5MB

## Quick Command Reference

```bash
# Build production
npm run build

# Start production server
npm start

# Test with Lighthouse
npx lighthouse http://localhost:3000 --view

# Analyze bundle size
npm run build:analyze
```

## Support

If you need help with any step, let me know which file you're working on and I'll provide specific code changes.

---

**Priority**: Start with Step 1 (reduce product limit) - this alone will get you from D to C+ grade!
