# Blog JSON-LD - Same Pattern as Breadcrumb

## ✅ Implementation Complete

I've updated the Blog JSON-LD to use the **EXACT same pattern** as the working Breadcrumb JSON-LD.

## Changes Made

### 1. Updated `src/utils/blogPageStructuredData.js`

Added `BlogPageJsonLd` component that follows the same pattern as `BreadcrumbJsonLd`:

```javascript
export function BlogPageJsonLd({ topicPageData, blogs = [], baseUrl = 'https://www.amrita-fashions.com' }) {
  const structuredData = generateBlogPageStructuredData(topicPageData, blogs, baseUrl);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### 2. Updated `src/app/blog/page.jsx`

Now uses `BlogPageJsonLd` component exactly like `BreadcrumbJsonLd`:

```javascript
return (
  <>
    {/* Blog Page Structured Data - Same pattern as BreadcrumbJsonLd */}
    <BlogPageJsonLd 
      topicPageData={topicPageData} 
      blogs={blogs} 
      baseUrl={baseUrl} 
    />
    
    {/* Breadcrumb Structured Data */}
    <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
    
    <Wrapper>...</Wrapper>
  </>
);
```

## Side-by-Side Comparison

### Breadcrumb Pattern (Working ✅)
```javascript
// Component
export function BreadcrumbJsonLd({ breadcrumbItems }) {
  const structuredData = generateBreadcrumbStructuredData(breadcrumbItems);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Usage
<BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
```

### Blog Pattern (Now Matching ✅)
```javascript
// Component
export function BlogPageJsonLd({ topicPageData, blogs, baseUrl }) {
  const structuredData = generateBlogPageStructuredData(topicPageData, blogs, baseUrl);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Usage
<BlogPageJsonLd 
  topicPageData={topicPageData} 
  blogs={blogs} 
  baseUrl={baseUrl} 
/>
```

## Why This Should Work

1. **Identical Structure**: Both components use the exact same pattern
2. **Same Rendering Method**: Both use `dangerouslySetInnerHTML`
3. **Same Location**: Both render in the same place (before `<Wrapper>`)
4. **Proven Pattern**: Breadcrumb works, so Blog should work too

## Testing Steps

### 1. Clear Cache & Rebuild
```bash
rm -rf .next
npm run build
npm run dev
```

### 2. Check Elements Tab
1. Open DevTools → Elements
2. Search for `application/ld+json`
3. Should see TWO script tags:
   - One for Blog (with `@type: "Blog"`)
   - One for Breadcrumb (with `@type: "BreadcrumbList"`)

### 3. Test with Google Rich Results
1. Go to: https://search.google.com/test/rich-results
2. Enter: `https://www.amrita-fashions.com/blog`
3. Click "Test URL"
4. Should now detect:
   - ✅ Breadcrumbs (was already working)
   - ✅ Blog (should now work with same pattern)
   - ✅ Local businesses
   - ✅ Organisation

## Expected HTML Output

```html
<!-- Blog JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Latest Textile & Fabric Insights | Amrita Global Blog",
  "description": "Explore our latest insights...",
  "url": "https://www.amrita-fashions.com/blog",
  "publisher": {
    "@id": "https://www.amrita-fashions.com/#org"
  },
  "blogPost": {
    "@type": "ItemList",
    "itemListOrder": "https://schema.org/ItemListUnordered",
    "numberOfItems": 6,
    "itemListElement": [...]
  }
}
</script>

<!-- Breadcrumb JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
</script>
```

## Key Points

### ✅ What's the Same
- Component structure
- Rendering method
- Props pattern
- Return statement
- Location in page

### ✅ What's Different
- Data source (Topic Page API + Blogs vs Breadcrumb items)
- Schema type (Blog vs BreadcrumbList)
- Props passed (topicPageData, blogs, baseUrl vs breadcrumbItems)

### ✅ Why It Should Work
- Uses proven pattern from Breadcrumb
- No special handling needed
- Google treats both the same way
- Both are server-side rendered

## Troubleshooting

### If Blog Still Not Detected

1. **Check HTML Source**
   - View page source
   - Search for `"@type": "Blog"`
   - Should be present

2. **Compare with Breadcrumb**
   - Both should be in same format
   - Both should be `<script type="application/ld+json">`
   - Both should be before `<Wrapper>`

3. **Check Console**
   - Look for errors
   - Check if data is loading
   - Verify topicPageData is not null

4. **Test Code Instead of URL**
   - Copy HTML from page source
   - Use "Code" tab in Rich Results Test
   - Paste and test

## Files Modified

1. ✅ `src/utils/blogPageStructuredData.js` - Added BlogPageJsonLd component
2. ✅ `src/app/blog/page.jsx` - Now uses BlogPageJsonLd component

## Success Criteria

- [ ] Blog JSON-LD visible in Elements tab
- [ ] Breadcrumb JSON-LD visible in Elements tab
- [ ] Both use same `<script type="application/ld+json">` format
- [ ] Both render before `<Wrapper>`
- [ ] No JavaScript errors
- [ ] Google Rich Results Test detects both

## Next Steps

1. **Deploy Changes**
   ```bash
   git add .
   git commit -m "Blog JSON-LD: Use same pattern as Breadcrumb"
   git push
   ```

2. **Test Locally First**
   - Clear cache
   - Rebuild
   - Check Elements tab
   - Verify both JSON-LDs present

3. **Test with Google**
   - Use Rich Results Test
   - Check if Blog is detected
   - Compare with Breadcrumb detection

4. **Monitor**
   - Check Search Console
   - Look for structured data errors
   - Track indexing status

---

**Status**: ✅ Updated to match Breadcrumb pattern  
**Method**: BlogPageJsonLd component (same as BreadcrumbJsonLd)  
**Expected Result**: Google should detect Blog schema  
**Date**: February 2026
