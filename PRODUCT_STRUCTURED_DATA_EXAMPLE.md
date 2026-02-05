# Product Structured Data Implementation

## Overview
This implementation adds dynamic JSON-LD structured data to product detail pages using the product API response, following the same pattern as the blog structured data.

## Files Created/Modified

### 1. `src/utils/productStructuredData.js`
Utility functions to generate structured data from product API response.

### 2. `src/components/seo/StructuredDataScripts.jsx`
Modified existing component to support product structured data alongside blog and breadcrumb data.

### 3. `src/app/product-details/page.jsx`
Modified to include the StructuredDataScripts component with product data.

## Implementation Pattern

The implementation follows the same client-side injection pattern used by the blog:

1. **Server-side data fetching**: Product data is fetched on the server
2. **Structured data generation**: JSON-LD is generated from the product data
3. **Client-side injection**: The `StructuredDataScripts` component dynamically injects the script into the document head

## Example Output

For the Nokia-601 product, the generated JSON-LD will be:

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Nokia-601 Red Cotton Poplin 146cm 125gsm Mercerized Fabric",
  "image": "https://res.cloudinary.com/age-fabric/image/upload/v1769258644/epxegcord4h3fo74tm5j.jpg",
  "description": "Vibrant red cotton poplin with premium finishes, ideal for apparel and uniforms. Partner with a wholesale fabric supplier focused on design, consistency, and fast shipment.",
  "brand": {
    "@type": "Brand",
    "name": "AGE"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "120"
  }
}
```

## Dynamic Fields Mapping

| JSON-LD Field | API Field | Fallback |
|---------------|-----------|----------|
| name | productTitle | name → "Product" |
| image | image1CloudUrl | "" |
| description | shortProductDescription | description → "" |
| ratingValue | ratingValue | "4" |
| ratingCount | ratingCount | "0" |

## Static Fields

- `@context`: "https://schema.org/"
- `@type`: "Product"
- `brand.name`: "AGE"
- `aggregateRating.bestRating`: "5"
- `aggregateRating.worstRating`: "1"

## How It Works

1. The product details page fetches product data server-side
2. Structured data is generated using `generateProductStructuredData()`
3. The `StructuredDataScripts` component is dynamically imported with `ssr: false`
4. On client-side mount, the component injects the JSON-LD script into `document.head`
5. The script has `data-structured-data="true"` and `data-type="product"` attributes for identification

## Testing

Run the tests to verify the structured data generation:

```bash
npm test src/utils/__tests__/productStructuredData.test.js
```

## Verification

1. Visit a product details page
2. Open browser developer tools
3. Check the `<head>` section for `<script type="application/ld+json" data-type="product">`
4. Use Google's Rich Results Test tool to validate the structured data

## Benefits

- Improved SEO with structured product data
- Better search engine understanding of product information
- Potential for rich snippets in search results
- Dynamic generation based on actual product data
- Consistent with existing blog structured data implementation