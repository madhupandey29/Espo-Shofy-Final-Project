# Layout JSON-LD Implementation

## Overview
Corporation and WebSite JSON-LD structured data are now implemented directly in `layout.jsx` to appear on **every page** of your website.

## Implementation Details

### **Server-Side Generation**
- JSON-LD is generated server-side during the layout rendering
- Uses direct API call to `/companyinformation` endpoint
- Filters for AGE company using `NEXT_PUBLIC_COMPANY_FILTER` environment variable
- Caches API response for 1 hour using Next.js `revalidate`

### **Files Modified**
1. **`src/app/layout.jsx`** - Main implementation
   - Server-side API call to fetch company data
   - Generates Corporation and WebSite JSON-LD
   - Injects scripts into `<head>` section

### **Generated JSON-LD Scripts**

#### **1. Corporation JSON-LD**
```html
<script id="corporation-jsonld" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Corporation",
  "@id": "https://www.amrita-fashions.com/#org",
  "name": "Amrita Global Enterprises",
  "alternateName": ["AGE", "Amrita Fashions"],
  "url": "https://www.amrita-fashions.com/",
  "logo": { "@type": "ImageObject", "url": "..." },
  "contactPoint": [...],
  "address": {...},
  "sameAs": [...]
}
</script>
```

#### **2. WebSite JSON-LD with SearchAction**
```html
<script id="website-jsonld" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.amrita-fashions.com/#website",
  "url": "https://www.amrita-fashions.com/",
  "name": "Amrita Global Enterprises",
  "publisher": { "@id": "https://www.amrita-fashions.com/#org" },
  "inLanguage": "en",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.amrita-fashions.com/fabric?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

## Field Mappings

### **Corporation JSON-LD**
| JSON-LD Field | API Field | Notes |
|---------------|-----------|-------|
| `name` | `legalName` or `name` | Company legal name |
| `alternateName` | `name` + "Amrita Fashions" | Array of alternate names |
| `telephone` | `phone1` | Primary phone number |
| `email` | `primaryEmail` or `salesEmail` | Primary contact email |
| `address` | Address fields | Complete postal address |
| `contactPoint` | `phone1`, `phone2` with departments | Multiple contact points |
| `sameAs` | Social media URLs | All social media profiles |

### **WebSite JSON-LD**
| JSON-LD Field | API Field | Notes |
|---------------|-----------|-------|
| `name` | `legalName` or `name` | Company name |
| `inLanguage` | `languages[0]` | Primary language |
| `potentialAction.target` | Static + site URL | Search endpoint |

## Benefits

### **SEO Benefits**
- **Corporation Schema**: Enhanced business information in search results
- **WebSite Schema**: Enables Google Sitelinks Search Box
- **Global Coverage**: Appears on every page automatically
- **Search Integration**: Direct search functionality from Google results

### **Technical Benefits**
- **Server-Side Rendering**: Better performance and SEO
- **Automatic Updates**: Uses live API data
- **Global Implementation**: No need to add to individual pages
- **Caching**: 1-hour cache reduces API calls

## Testing

### **1. View Source**
- Right-click on any page → "View Page Source"
- Search for `corporation-jsonld` and `website-jsonld`
- Both scripts should be present in the `<head>` section

### **2. Developer Tools**
- Open DevTools (F12) → Elements tab
- Search for the script IDs
- Verify JSON-LD content is correct

### **3. Test Page**
- Visit `/test-structured-data`
- Use the "Check DOM for JSON-LD Scripts" button
- Verify both scripts are found

### **4. Google Rich Results Test**
1. Copy JSON-LD content from browser
2. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
3. Test both Corporation and WebSite schemas
4. Should validate without errors

## Environment Variables Required

```bash
NEXT_PUBLIC_API_BASE_URL=https://espobackend.vercel.app/api
NEXT_PUBLIC_SITE_URL=https://www.amrita-fashions.com
NEXT_PUBLIC_COMPANY_FILTER=AGE
```

## Error Handling

- If API call fails, JSON-LD scripts are not generated (graceful degradation)
- If company not found, no scripts are added
- Console errors are logged for debugging
- Page continues to load normally even if structured data fails

## Performance

- **Server-Side**: Generated during SSR, no client-side JavaScript needed
- **Caching**: API response cached for 1 hour
- **Minimal Impact**: Only adds ~2KB to page size
- **Strategy**: `beforeInteractive` ensures scripts load early

## Maintenance

- **Automatic**: Uses live API data, no manual updates needed
- **Consistent**: Same data across all pages
- **Scalable**: Works for any number of pages
- **Future-Proof**: Easy to modify or extend

The implementation is now complete and both Corporation and WebSite JSON-LD will appear on every page of your website!