# FAQ Structured Data Implementation - Server-Side Rendering

## Overview
Added FAQ JSON-LD structured data to product details pages that combines both product-specific FAQs and website-wide FAQs for better SEO. The structured data is rendered **server-side** so it appears in the page source and is visible to search engine crawlers and schema validators.

## Files Created

### 1. `src/utils/faqStructuredData.js`
Utility functions to generate FAQ structured data:
- `generateFaqStructuredData(product, websiteFaqs)` - Generates FAQ JSON-LD object
- `FaqJsonLd({ product, websiteFaqs })` - React component for **server-side rendering**

**Logic:**
- Combines website FAQs (question1-4, answer1-4) and product FAQs (productQ1-Q6, productA1-A6)
- Website FAQs appear first, then product FAQs
- Strips HTML tags from questions and answers for clean structured data
- Returns null if no FAQs exist

### 2. `src/components/seo/FaqStructuredDataHead.jsx`
Client-side component (NOT USED - kept for reference):
- Originally created for client-side injection
- Replaced with server-side rendering approach
- Can be deleted if not needed

## Files Modified

### 3. `src/app/fabric/[slug]/page.jsx` ⭐ MAIN CHANGES
Updated to fetch and render FAQ structured data **server-side**:

```javascript
// Added import
import { FaqJsonLd } from '@/utils/faqStructuredData';

// Added server-side fetcher
async function getWebsiteFaqs() {
  try {
    const res = await fetch(`${API_BASE}/websitefaq`, {
      next: { revalidate },
    });
    // ... handle response
  } catch (error) {
    return [];
  }
}

// In Page component
export default async function Page({ params }) {
  const product = await getProductBySlug(slug);
  const websiteFaqs = await getWebsiteFaqs(); // ✅ Fetch server-side
  
  return (
    <>
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      <FaqJsonLd product={product} websiteFaqs={websiteFaqs} /> {/* ✅ Server-side render */}
      <Wrapper>...</Wrapper>
    </>
  );
}
```

### 4. `src/app/fabric/[slug]/ProductDetailsClient.jsx`
Removed client-side FAQ structured data injection (no longer needed):
- Removed `FaqStructuredDataHead` import
- Removed `useGetWebsiteFaqsQuery` hook
- Removed `generateFaqStructuredData` call
- Simplified to only render ProductDetailsArea

## How It Works

### Data Flow (Server-Side):
1. **Product Details Page** (`/fabric/[slug]`) loads on server
2. **Server fetches**:
   - Product data via `getProductBySlug()` (includes productQ1-Q6, productA1-A6)
   - Website FAQs via `getWebsiteFaqs()` (includes question1-4, answer1-4)
3. **generateFaqStructuredData()** combines both FAQ sources
4. **FaqJsonLd** component renders `<script type="application/ld+json">` in JSX
5. **HTML is sent to browser** with FAQ structured data already in source
6. **Search engines and validators** can read FAQ data from page source

### Comparison with Other Structured Data:

| Type | Location | Rendering |
|------|----------|-----------|
| **Website** | `layout.jsx` | Server-side ✅ |
| **BreadcrumbList** | `fabric/[slug]/page.jsx` | Server-side ✅ |
| **FAQPage** | `fabric/[slug]/page.jsx` | Server-side ✅ |
| **Product** | `ProductStructuredDataHead` | Client-side (dynamic) |

### FAQ Sources:
- **Website FAQs**: From `/websitefaq` API endpoint (global FAQs)
- **Product FAQs**: From product object fields (product-specific FAQs)

### JSON-LD Output Example:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer 30-day returns on all products..."
      }
    },
    {
      "@type": "Question",
      "name": "What is the fabric composition?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This fabric is 100% cotton..."
      }
    }
  ]
}
```

## Benefits

1. **SEO Enhancement**: Google can display FAQs in rich snippets
2. **Better Visibility**: FAQ rich results in search results
3. **Combined Data**: Both global and product-specific FAQs in one place
4. **Clean Data**: HTML tags stripped for proper structured data format
5. **Dynamic**: Updates automatically when FAQ data changes
6. **✅ Server-Side Rendered**: Visible in page source for validators and crawlers
7. **✅ Schema Validator Compatible**: Works with Google Rich Results Test

## Testing

To verify the implementation:
1. Visit any product page: `/fabric/[product-slug]`
2. **View page source** (Ctrl+U or right-click → View Page Source)
3. Search for `"@type": "FAQPage"` in the source
4. Verify FAQ data is present in the HTML source (not just Elements tab)
5. Test with Google's Rich Results Test: https://search.google.com/test/rich-results
6. ✅ The FAQ structured data should now be detected by the validator

## Key Difference from Client-Side Approach

### ❌ Client-Side (Old - Not Used):
- FAQ JSON-LD injected via JavaScript after page load
- Visible in Elements tab but NOT in page source
- Schema validators cannot see it
- Search engines may not index it properly

### ✅ Server-Side (Current):
- FAQ JSON-LD rendered during server-side page generation
- Visible in both page source AND Elements tab
- Schema validators can read it
- Search engines can reliably index it

## Notes

- FAQ structured data only appears if at least one FAQ exists
- HTML content in FAQs is stripped to plain text for structured data
- Website FAQs are prioritized (appear first) over product FAQs
- Uses same server-side pattern as BreadcrumbList and Website structured data
- Data is cached with `revalidate: 600` (10 minutes) for performance
