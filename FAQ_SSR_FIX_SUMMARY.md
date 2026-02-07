# FAQ Structured Data - Server-Side Rendering Fix

## Problem
FAQ JSON-LD was being injected **client-side** using `FaqStructuredDataHead` component:
- ❌ Visible in Elements tab (DevTools)
- ❌ NOT visible in View Page Source
- ❌ Schema validators couldn't detect it
- ❌ Search engines might not index it properly

## Solution
Changed to **server-side rendering** following the same pattern as BreadcrumbList:
- ✅ Rendered during server-side page generation
- ✅ Visible in View Page Source
- ✅ Schema validators can detect it
- ✅ Search engines can reliably index it

## Changes Made

### 1. Added Server-Side FAQ Fetcher
**File**: `src/app/fabric/[slug]/page.jsx`

```javascript
// New function to fetch website FAQs on the server
async function getWebsiteFaqs() {
  try {
    const res = await fetch(`${API_BASE}/websitefaq`, {
      next: { revalidate },
    });
    // ... handle response
    return faqs;
  } catch (error) {
    return [];
  }
}
```

### 2. Updated Page Component to Render FAQ Server-Side
**File**: `src/app/fabric/[slug]/page.jsx`

```javascript
import { FaqJsonLd } from '@/utils/faqStructuredData';

export default async function Page({ params }) {
  const product = await getProductBySlug(slug);
  const websiteFaqs = await getWebsiteFaqs(); // ✅ Fetch on server
  
  return (
    <>
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      <FaqJsonLd product={product} websiteFaqs={websiteFaqs} /> {/* ✅ Render on server */}
      <Wrapper>...</Wrapper>
    </>
  );
}
```

### 3. Removed Client-Side FAQ Injection
**File**: `src/app/fabric/[slug]/ProductDetailsClient.jsx`

Removed:
- ❌ `import FaqStructuredDataHead`
- ❌ `useGetWebsiteFaqsQuery()` hook
- ❌ Client-side FAQ generation
- ❌ `<FaqStructuredDataHead />` component

## Architecture Comparison

### Before (Client-Side) ❌
```
Browser Request
    ↓
Server sends HTML (no FAQ JSON-LD)
    ↓
Browser loads JavaScript
    ↓
React hydrates
    ↓
useGetWebsiteFaqsQuery() fetches FAQs
    ↓
FaqStructuredDataHead injects JSON-LD via JavaScript
    ↓
FAQ appears in Elements tab only
```

### After (Server-Side) ✅
```
Browser Request
    ↓
Server fetches product + website FAQs
    ↓
Server generates FAQ JSON-LD
    ↓
Server sends complete HTML with FAQ JSON-LD
    ↓
Browser receives page with FAQ in source
    ↓
FAQ visible in both View Source and Elements tab
```

## Structured Data Rendering Strategy

| Type | Component | Rendering | Reason |
|------|-----------|-----------|--------|
| **Website** | layout.jsx | Server-side | Global, static data |
| **BreadcrumbList** | page.jsx | Server-side | SEO critical, static per page |
| **FAQPage** | page.jsx | Server-side | SEO critical, static per page |
| **Product** | ProductStructuredDataHead | Client-side | Dynamic, may change based on user interaction |

## Testing Results

### Before Fix:
```bash
# View Page Source
<html>
  <head>
    <!-- No FAQ JSON-LD here -->
  </head>
  ...
</html>

# Elements Tab (DevTools)
<html>
  <head>
    <script type="application/ld+json" data-type="faq-structured-data">
      {"@type": "FAQPage", ...}  <!-- Injected by JavaScript -->
    </script>
  </head>
  ...
</html>
```

### After Fix:
```bash
# View Page Source
<html>
  <head>
    <script type="application/ld+json">
      {"@type": "FAQPage", ...}  <!-- ✅ Present in source! -->
    </script>
  </head>
  ...
</html>

# Elements Tab (DevTools)
<html>
  <head>
    <script type="application/ld+json">
      {"@type": "FAQPage", ...}  <!-- ✅ Also visible here -->
    </script>
  </head>
  ...
</html>
```

## Verification Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Visit a product page**:
   ```
   http://localhost:3000/fabric/[any-product-slug]
   ```

4. **View Page Source** (Ctrl+U):
   - Search for `"@type": "FAQPage"`
   - ✅ Should be present in the HTML source

5. **Test with Schema Validator**:
   - Go to: https://validator.schema.org/
   - Enter your product page URL
   - ✅ FAQPage should be detected

6. **Test with Google Rich Results**:
   - Go to: https://search.google.com/test/rich-results
   - Enter your product page URL
   - ✅ FAQ rich results should be detected

## Benefits of Server-Side Rendering

1. **Immediate Availability**: FAQ data is in the initial HTML response
2. **SEO Friendly**: Search engines can read it without executing JavaScript
3. **Validator Compatible**: Schema validators can parse the page source
4. **Performance**: No additional client-side API calls needed
5. **Reliability**: Works even if JavaScript is disabled
6. **Caching**: Server-side data is cached with Next.js revalidation

## Files Modified Summary

✅ **Modified**:
- `src/app/fabric/[slug]/page.jsx` - Added server-side FAQ fetching and rendering
- `src/app/fabric/[slug]/ProductDetailsClient.jsx` - Removed client-side FAQ injection
- `FAQ_STRUCTURED_DATA_IMPLEMENTATION.md` - Updated documentation

📝 **Created** (already existed):
- `src/utils/faqStructuredData.js` - FAQ generation utilities
- `src/components/seo/FaqStructuredDataHead.jsx` - (Not used, can be deleted)

## Result

FAQ structured data is now properly rendered server-side and will be detected by:
- ✅ Google Rich Results Test
- ✅ Schema.org Validator
- ✅ Search engine crawlers
- ✅ Any tool that reads page source
