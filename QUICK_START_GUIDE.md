# Quick Start Guide - ISR/CSR Split

## ✅ Implementation Complete!

Your Next.js app now uses route groups to separate ISR and CSR pages.

## How to Test

### 1. Build and Run Production
```bash
npm run build
npm run start
```

### 2. Test ISR Pages (SEO Pages)
Visit these URLs and check "View Page Source":
- http://localhost:3000/ (Home)
- http://localhost:3000/fabric (Fabric listing)
- http://localhost:3000/blog (Blog listing)
- http://localhost:3000/about
- http://localhost:3000/contact

**What to look for:**
- ✅ Real content visible in HTML source (not just loading spinner)
- ✅ Meta tags present
- ✅ Structured data (JSON-LD) in source
- ✅ Fast initial load

### 3. Test CSR Pages (User Pages)
Visit these URLs and test functionality:
- http://localhost:3000/cart
- http://localhost:3000/profile
- http://localhost:3000/wishlist
- http://localhost:3000/login

**What to test:**
- ✅ Redux state works (cart count, wishlist count)
- ✅ Add to cart works
- ✅ Add to wishlist works
- ✅ Login/logout works
- ✅ Profile page loads

## Project Structure

```
src/app/
├── (isr)/                    # ISR routes (SEO pages)
│   ├── page.jsx             # Home → /
│   ├── fabric/
│   │   ├── page.jsx         # Fabric listing → /fabric
│   │   └── [slug]/
│   │       └── page.jsx     # Product detail → /fabric/[slug]
│   ├── blog/
│   │   ├── page.jsx         # Blog listing → /blog
│   │   └── tag/[tagname]/
│   │       └── page.jsx     # Blog by tag → /blog/tag/[tagname]
│   ├── about/page.jsx       # About → /about
│   ├── contact/page.jsx     # Contact → /contact
│   ├── capabilities/page.jsx # Capabilities → /capabilities
│   └── ... (other ISR pages)
│
├── (csr)/                    # CSR routes (User pages)
│   ├── layout.jsx           # Redux Provider wrapper
│   ├── cart/page.jsx        # Cart → /cart
│   ├── profile/page.jsx     # Profile → /profile
│   ├── wishlist/page.jsx    # Wishlist → /wishlist
│   ├── login/page.jsx       # Login → /login
│   ├── register/page.jsx    # Register → /register
│   └── ... (other CSR pages)
│
├── api/                      # API routes (unchanged)
├── layout.jsx               # Root layout (with Redux)
├── not-found.jsx            # 404 page
└── ... (other root files)
```

## Important Notes

### URLs Haven't Changed!
Route groups `(isr)` and `(csr)` are NOT in the URL:
- ✅ `/fabric` still works (not `/isr/fabric`)
- ✅ `/cart` still works (not `/csr/cart`)

### Redux Still Works Everywhere
- Redux Provider is in root layout
- All components can use Redux hooks
- ISR pages still benefit from server-side data fetching

### Revalidation Times
- Home: 60 seconds
- Fabric: 120 seconds
- Blog: 60 seconds
- Product details: 600 seconds

## Common Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Run production server
npm run start

# Lint
npm run lint

# Format code
npm run format
```

## Troubleshooting

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Pages Not Loading
1. Check browser console for errors
2. Verify Redux DevTools shows state
3. Check Network tab for failed requests

### ISR Not Working
1. Make sure you're in production mode (`npm run start`)
2. Check revalidation times in page files
3. Verify `export const revalidate = 60` is present

## What's Next?

### Optional Improvements

1. **Add Blog Redirects** (if you had `/blog-details/[id]` before):
   ```javascript
   // next.config.js
   async redirects() {
     return [
       {
         source: '/blog-details/:id',
         destination: '/blog/:id',
         permanent: true,
       },
     ];
   }
   ```

2. **Optimize Revalidation Times**:
   - Adjust based on how often content changes
   - Longer times = better performance
   - Shorter times = fresher content

3. **Monitor Performance**:
   - Use Lighthouse
   - Check Core Web Vitals
   - Monitor server logs

## Success Criteria

✅ Build completes without errors
✅ All pages load correctly
✅ ISR pages show content in View Source
✅ CSR pages have working Redux
✅ No console errors
✅ Cart/wishlist functionality works
✅ Auth protection works

## Need Help?

Check these files for details:
- `ISR_CSR_IMPLEMENTATION_COMPLETE.md` - Full implementation details
- `IMPLEMENTATION_PLAN.md` - Original plan
- `ISR_CSR_SPLIT_ANALYSIS.md` - Technical analysis

---

**Status: ✅ READY FOR TESTING**
