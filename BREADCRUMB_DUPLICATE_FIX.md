# Breadcrumb Duplicate JSON-LD Fix

## Problem
The blog details page was outputting **two identical BreadcrumbList JSON-LD** structured data blocks:
1. One from `StructuredDataScripts` component (client-side injection)
2. One from `BreadcrumbJsonLd` component (server-side rendering)

This caused Schema validators to show "All (2)" BreadcrumbList items, which is redundant and could confuse search engines.

## Root Cause
In `src/app/blog-details/[id]/page.jsx`, the page was:
1. Generating breadcrumb data using `generateBlogBreadcrumbStructuredData()` 
2. Passing it to `<StructuredDataScripts breadcrumbStructuredData={...} />`
3. ALSO generating breadcrumb data separately as `breadcrumbJsonLdData`
4. Passing it to `<BreadcrumbJsonLd breadcrumbItems={...} />`

Both components were rendering the same breadcrumb structure, resulting in duplication.

## Solution
**Removed the duplicate breadcrumb generation** by:

1. Removed import of `generateBlogBreadcrumbStructuredData` from blogStructuredData.js
2. Removed `breadcrumbStructuredData` generation in the component
3. Removed `breadcrumbStructuredData` prop from `<StructuredDataScripts />`
4. Kept only the server-side `<BreadcrumbJsonLd />` component

### Changes Made

**File: `src/app/blog-details/[id]/page.jsx`**

**Before:**
```jsx
import { generateBlogStructuredData, generateBlogBreadcrumbStructuredData } from "@/utils/blogStructuredData";

// ...

const blogStructuredData = generateBlogStructuredData(blog, author, baseUrl);
const breadcrumbStructuredData = generateBlogBreadcrumbStructuredData(blog, baseUrl);

return (
  <>
    <StructuredDataScripts 
      blogStructuredData={blogStructuredData}
      breadcrumbStructuredData={breadcrumbStructuredData}  // ❌ DUPLICATE
    />
    <BreadcrumbJsonLd breadcrumbItems={breadcrumbJsonLdData} />  // ❌ DUPLICATE
```

**After:**
```jsx
import { generateBlogStructuredData } from "@/utils/blogStructuredData";

// ...

const blogStructuredData = generateBlogStructuredData(blog, author, baseUrl);

return (
  <>
    {/* Blog structured data only - no breadcrumb here to avoid duplication */}
    <StructuredDataScripts 
      blogStructuredData={blogStructuredData}
    />
    {/* Single breadcrumb JSON-LD - server-side rendered */}
    <BreadcrumbJsonLd breadcrumbItems={breadcrumbJsonLdData} />  // ✅ SINGLE SOURCE
```

## Result
Now the blog details page outputs **only ONE BreadcrumbList JSON-LD** block:
- Server-side rendered via `<BreadcrumbJsonLd />` component
- Clean, consistent URLs (no trailing slash issues)
- Schema validators will show "All (1)" BreadcrumbList

## Testing
To verify the fix:
1. Visit any blog details page (e.g., `/blog-details/[id]`)
2. View page source (Ctrl+U or Cmd+U)
3. Search for `"@type":"BreadcrumbList"` or `"BreadcrumbList"`
4. Confirm only **ONE** occurrence exists
5. Use Google's Rich Results Test or Schema.org validator
6. Confirm only **ONE** BreadcrumbList is detected

## Notes
- The `generateBlogBreadcrumbStructuredData()` function still exists in `src/utils/blogStructuredData.js` but is no longer used in production
- It's only used in the test page (`src/app/test-structured-data/page.jsx`)
- The `StructuredDataScripts` component still has breadcrumb handling code, but since we don't pass `breadcrumbStructuredData` prop, it won't inject anything
