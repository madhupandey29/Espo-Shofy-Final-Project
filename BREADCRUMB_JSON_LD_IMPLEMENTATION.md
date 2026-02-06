# Breadcrumb JSON-LD Implementation Guide

## Overview
Dynamic breadcrumb structured data (JSON-LD) has been added to all major pages for improved SEO.

## Implementation Details

### Utility Function
**File:** `src/utils/breadcrumbStructuredData.js`

This utility provides:
- `generateBreadcrumbStructuredData(breadcrumbItems)` - Generates structured data object
- `BreadcrumbJsonLd({ breadcrumbItems })` - React component that renders the script tag

### Dynamic URL Generation
- Uses `NEXT_PUBLIC_SITE_URL` from environment variables
- Fallback: `https://www.amrita-fashions.com`
- Automatically constructs full canonical URLs

## Pages Updated

### 1. Fabric Page (`/fabric`)
**Breadcrumb:** Home > Fabrics
```javascript
const breadcrumbStructuredData = [
  { name: 'Home', url: '/' },
  { name: 'Fabrics', url: '/fabric' }
];
```

### 2. Product Details Page (`/fabric/[slug]`)
**Breadcrumb:** Home > Fabric > [Product Name]
```javascript
const breadcrumbStructuredData = [
  { name: 'Home', url: '/' },
  { name: 'Fabric', url: '/fabric' },
  { name: productTitle, url: `/fabric/${slug}` }
];
```

### 3. About Page (`/about`)
**Breadcrumb:** Home > About
```javascript
const breadcrumbStructuredData = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' }
];
```

### 4. Capabilities Page (`/capabilities`)
**Breadcrumb:** Home > Capabilities
```javascript
const breadcrumbStructuredData = [
  { name: 'Home', url: '/' },
  { name: 'Capabilities', url: '/capabilities' }
];
```

### 5. Blog Page (`/blog`)
**Breadcrumb:** Home > Blog
```javascript
const breadcrumbStructuredData = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' }
];
```

### 6. Blog Details Page (`/blog-details/[id]`)
**Breadcrumb:** Home > Blog > [Blog Title]
```javascript
const breadcrumbJsonLdData = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: blogTitle, url: `/blog-details/${params.id}` }
];
```

### 7. Contact Page (`/contact`)
**Breadcrumb:** Home > Contact
```javascript
const breadcrumbStructuredData = [
  { name: 'Home', url: '/' },
  { name: 'Contact', url: '/contact' }
];
```

## Usage in Pages

Each page now includes:
```jsx
import { BreadcrumbJsonLd } from '@/utils/breadcrumbStructuredData';

// Define breadcrumb items
const breadcrumbStructuredData = [
  { name: 'Home', url: '/' },
  { name: 'Page Name', url: '/page-url' }
];

// Render in component
<BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
```

## Generated JSON-LD Example

For a product page, the generated structured data looks like:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.amrita-fashions.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Fabric",
      "item": "https://www.amrita-fashions.com/fabric"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Premium Cotton Fabric",
      "item": "https://www.amrita-fashions.com/fabric/premium-cotton"
    }
  ]
}
```

## Environment Variable

Make sure your `.env.local` or `.env` file contains:
```env
NEXT_PUBLIC_SITE_URL=https://www.amrita-fashions.com
```

## Testing

### 1. View Page Source
- Visit any page
- Right-click > View Page Source
- Search for `"@type": "BreadcrumbList"`

### 2. Google Rich Results Test
- Visit: https://search.google.com/test/rich-results
- Enter your page URL
- Verify breadcrumb structured data is detected

### 3. Schema Markup Validator
- Visit: https://validator.schema.org/
- Enter your page URL
- Check for BreadcrumbList validation

## Benefits

✅ **SEO Improvement** - Search engines understand page hierarchy  
✅ **Rich Snippets** - Breadcrumbs may appear in search results  
✅ **Dynamic URLs** - Automatically uses correct domain from env  
✅ **Consistent Structure** - All pages follow same pattern  
✅ **Easy Maintenance** - Single utility function for all pages

## Notes

- The breadcrumb JSON-LD is separate from the visual breadcrumb component
- Both should be kept in sync for consistency
- The structured data is rendered server-side for optimal SEO
- URLs are automatically cleaned (trailing slashes removed)
