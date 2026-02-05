# Corporation JSON-LD Implementation

## Overview
This implementation adds **Corporation JSON-LD structured data** to **all pages** of your website using data from:
- **Company Information API** (AGE company data)
- **Site Settings API** (eCatalogue settings)

## Files Created/Modified

### ✅ New Files Created:
1. **`src/utils/corporationStructuredData.js`** - Utility functions to generate Corporation JSON-LD
2. **`src/components/seo/GlobalStructuredData.jsx`** - Global component that injects Corporation JSON-LD on all pages
3. **`src/app/test-structured-data/TestStructuredDataClient.jsx`** - Test component to verify implementation

### ✅ Files Modified:
1. **`src/components/seo/StructuredDataScripts.jsx`** - Added support for Corporation structured data
2. **`src/app/layout.jsx`** - Added GlobalStructuredData component to inject JSON-LD on all pages
3. **`src/app/test-structured-data/page.jsx`** - Enhanced test page with Corporation JSON-LD testing

## How It Works

### 1. **Global Implementation**
- The `GlobalStructuredData` component is loaded in `layout.jsx`
- It runs on **every page** of your website
- Fetches data from both APIs and generates Corporation JSON-LD
- Injects the JSON-LD script into the `<head>` section

### 2. **Data Sources**
```javascript
// Company Information API (AGE company)
const companyInfo = useGetOfficeInformationQuery(); // Filtered for AGE company

// Site Settings API (eCatalogue settings)  
const siteSettings = await getDefaultSeoSettings(); // Filtered for eCatalogue
```

### 3. **Generated JSON-LD Structure**
```json
{
  "@context": "https://schema.org",
  "@type": "Corporation",
  "@id": "https://www.amrita-fashions.com/#org",
  "name": "Amrita Global Enterprises",
  "alternateName": ["AGE", "Amrita Fashions"],
  "url": "https://www.amrita-fashions.com/",
  "logo": { "@type": "ImageObject", "url": "..." },
  "image": ["..."],
  "description": "...",
  "telephone": "+919824003484",
  "email": "sales@amrita-fashions.com",
  "areaServed": ["Worldwide"],
  "availableLanguage": ["en", "hi", "gu"],
  "contactPoint": [...],
  "sameAs": [...],
  "knowsAbout": [...]
}
```

## Field Mappings

| JSON-LD Field | Data Source | API Field |
|---------------|-------------|-----------|
| `name` | Company Info | `legalName` or `name` |
| `alternateName` | Company Info | `name` + "Amrita Fashions" |
| `url` | Environment | `NEXT_PUBLIC_SITE_URL` |
| `logo.url` | Company Info | `faviconUrl` |
| `image` | Company Info | `defaultOgImage` |
| `description` | Company Info | `description` |
| `telephone` | Company Info | `phone1` |
| `email` | Company Info | `primaryEmail` or `salesEmail` |
| `areaServed` | Company Info | `areaServed` |
| `availableLanguage` | Company Info | `languages` |
| `contactPoint` | Company Info | `phone1`, `phone2`, `phone1Dept`, `phone2Dept` |
| `sameAs` | Company Info | All social URLs |
| `knowsAbout` | Site Settings | `knowsAbout` array |
| `foundingDate` | Company Info | `foundingYear` |
| `address` | Company Info | Address fields |

## Testing

### 1. **Visit Test Page**
Navigate to: `/test-structured-data`

### 2. **Check Browser DevTools**
1. Open DevTools (F12)
2. Go to Elements/Inspector tab
3. Search for `application/ld+json`
4. Look for script with `data-type="corporation"`

### 3. **Google Rich Results Test**
1. Copy the JSON-LD from the test page
2. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
3. Click "Test Code" and paste the JSON
4. Should validate as "Corporation" schema

### 4. **Schema.org Validator**
1. Visit [Schema.org Validator](https://validator.schema.org/)
2. Paste your JSON-LD
3. Should show no errors

## Environment Variables Required

Make sure these are set in your `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=https://www.amrita-fashions.com
NEXT_PUBLIC_COMPANY_FILTER=AGE
NEXT_PUBLIC_SITE_FILTER=catalogue
```

## Benefits

### ✅ **SEO Benefits**
- Enhanced search engine understanding of your business
- Rich snippets in search results
- Better local search visibility
- Improved knowledge graph presence

### ✅ **Technical Benefits**
- Automatic deployment on all pages
- Dynamic data from APIs
- No manual maintenance required
- Consistent structured data across site

## Troubleshooting

### **JSON-LD Not Appearing**
1. Check if APIs are returning data
2. Verify environment variables are set
3. Check browser console for errors
4. Ensure Redux store is properly configured

### **Invalid JSON-LD**
1. Test with Google Rich Results Test
2. Check for missing required fields
3. Verify URL formats are correct
4. Ensure arrays are properly formatted

## Next Steps

The Corporation JSON-LD is now implemented on **all pages**. You can:
1. Test the implementation using the test page
2. Verify with Google Search Console
3. Monitor rich snippets in search results
4. Add additional schema types for specific pages if needed