# Mobile Performance Optimization Guide

## Current Status
- Performance Score: 40/100
- Main Issue: Render-blocking requests (870ms savings potential)
- Legacy JavaScript: 22 KiB savings
- First Party resources: 5,110ms load time

## Optimizations Implemented

### 1. Next.js Configuration Improvements
- ✅ Added CSS chunking strategy (`cssChunking: 'loose'`)
- ✅ Optimized package imports (Bootstrap, Swiper, React-Slick)
- ✅ Reduced image device sizes (removed 2048, 3840)
- ✅ Increased image cache TTL (60s → 3600s)
- ✅ Enhanced code splitting with specific vendor chunks
- ✅ Added `runtimeChunk: 'single'` for better caching
- ✅ Increased `maxInitialRequests` to 25 for better splitting

### 2. Script Loading Optimization
- ✅ Changed Google Analytics from `beforeInteractive` → `lazyOnload`
- ✅ Changed Microsoft Clarity from `beforeInteractive` → `lazyOnload`
- ✅ Removed unnecessary DNS prefetch for Clarity
- ✅ Removed preload for non-critical CSS files

### 3. Font Optimization
- ✅ Using next/font for self-hosted Google Fonts
- ✅ Reduced font weights (removed 300, 500, 800)
- ✅ Using `font-display: swap` for better FCP

### 4. CSS Optimization Strategy
- ✅ Created `bootstrap-critical.scss` (only essential Bootstrap)
- ✅ Created `bootstrap-deferred.scss` (non-critical components)
- ⏳ Need to update imports in components

## Next Steps to Implement

### 1. Update Component Imports
Replace full Bootstrap imports with critical-only:

\`\`\`scss
// In components that need full Bootstrap
@import '@/styles/bootstrap-deferred.scss';
\`\`\`

### 2. Lazy Load Heavy Components
- Carousel components (react-slick, swiper)
- Modal components
- Chatbot
- Video players

### 3. Image Optimization
- Ensure all images use Next.js Image component
- Add `priority` prop to above-the-fold images
- Use `loading="lazy"` for below-the-fold images
- Consider using blur placeholders

### 4. Code Splitting Recommendations
\`\`\`jsx
// Lazy load heavy components
const Chatbot = dynamic(() => import('@/components/chatbot/FloatingChatbot'), {
  ssr: false,
  loading: () => null
});

const ProductCarousel = dynamic(() => import('@/components/carousel/ProductCarousel'), {
  loading: () => <div>Loading...</div>
});
\`\`\`

### 5. Remove Unused CSS
- Audit and remove unused Bootstrap components
- Consider using PurgeCSS in production
- Remove duplicate styles

### 6. Optimize Third-Party Scripts
- Defer non-critical analytics
- Use facade pattern for heavy embeds (YouTube, etc.)
- Consider removing or deferring Clarity if not critical

## Expected Improvements

After implementing all optimizations:
- **Performance Score**: 40 → 70-80
- **FCP (First Contentful Paint)**: Reduced by ~800ms
- **LCP (Largest Contentful Paint)**: Reduced by ~1000ms
- **TBT (Total Blocking Time)**: Reduced by ~300ms

## Build and Test

\`\`\`bash
# Build with optimizations
npm run build

# Analyze bundle
npm run build:analyze

# Test locally
npm start
\`\`\`

## Monitoring

After deployment, monitor:
1. Lighthouse scores (Mobile & Desktop)
2. Core Web Vitals in Google Search Console
3. Real User Monitoring (RUM) data
4. Bundle size changes

## Additional Recommendations

1. **Enable Compression**: Ensure Brotli/Gzip is enabled on server
2. **CDN**: Use CDN for static assets
3. **HTTP/2**: Ensure HTTP/2 is enabled
4. **Preconnect**: Keep only critical preconnects
5. **Resource Hints**: Use dns-prefetch sparingly
