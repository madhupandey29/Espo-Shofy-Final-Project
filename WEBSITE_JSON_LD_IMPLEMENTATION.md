# WebSite JSON-LD Implementation

## Overview
This implementation adds **WebSite JSON-LD structured data with SearchAction** to **all pages** of your website using data from:
- **Company Information API** (AGE company data)
- **Site Settings API** (eCatalogue settings)

## Files Created/Modified

### ✅ New Files Created:
1. **`src/utils/websiteStructuredData.js`** - Utility functions to generate WebSite JSON-LD with SearchAction

### ✅ Files Modified:
1. **`src/components/seo/GlobalStructuredData.jsx`** - Added WebSite JSON-LD generation alongside Corporation JSON-LD
2. **`src/app/test-structured-data/TestStructuredDataClient.jsx`** - Enhanced test page with WebSite JSON-LD testing

## How It Works

### 1. **Global Implementation**
- The `GlobalStructuredData` component now generates both Corporation and WebSite JSON-LD
- Runs on **every page** of your website
- Fetches data from APIs and generates WebSite JSON-LD with SearchAction
- Injects the JSON-LD script into the `<head>` section

### 2. **Generated JSON-LD Structure**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.amrita-fashions.com/#website",
  "url": "https://www.amrita-fashions.com/",
  "name": "Amrita Global Enterprises",
  "publisher": {
    "@id": "https://www.amrita-fashions.com/#org"
  },
  "inLanguage": "en",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.amrita-fashions.com/fabric?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## Field Mappings

| JSON-LD Field | Data Source | API Field | Notes |
|---------------|-------------|-----------|-------|
| `@id` | Environment | `NEXT_PUBLIC_SITE_URL` + `#website` | Static suffix |
| `url` | Environment | `NEXT_PUBLIC_SITE_URL` | Site URL |
| `name` | Company Info | `legalName` or `name` | Company legal name |
| `publisher.@id` | Environment | `NEXT_PUBLIC_SITE_URL` + `#org` | Links to Corporation |
| `inLanguage` | Company Info | `languages[0]` | First language from array |
| `potentialAction.target` | Environment | `NEXT_PUBLIC_SITE_URL` + `/fabric?q={search_term_string}` | Search endpoint |
| `potentialAction.query-input` | Static | `required name=search_term_string` | Search parameter |

## SearchAction Benefits

### ✅ **SEO Benefits**
- **Google Sitelinks Search Box**: Enables search box in Google search results
- **Enhanced Search Results**: Users can search your site directly from Google
- **Better User Experience**: Quick access to your site's search functionality
- **Increased Click-Through Rates**: More prominent presence in search results

### ✅ **Technical Benefits**
- Automatic deployment on all pages
- Dynamic data from APIs
- Consistent with your existing search functionality
- Links to your fabric search page

## Search Endpoint Configuration

The SearchAction points to your fabric search page:
```
https://www.amrita-fashions.com/fabric?q={search_term_string}
```

This means when users search from Google's sitelinks search box, they'll be directed to your fabric search page with their query.

## Testing

### 1. **Visit Test Page**
Navigate to: `/test-structured-data`

### 2. **Check Browser DevTools**
1. Open DevTools (F12)
2. Go to Elements/Inspector tab
3. Search for `application/ld+json`
4. Look for script with `data-type="website"`

### 3. **Google Rich Results Test**
1. Copy the WebSite JSON-LD from the test page
2. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
3. Click "Test Code" and paste the JSON
4. Should validate as "WebSite" schema with SearchAction

### 4. **Live Testing**
After deployment, search for your site on Google. You should eventually see a search box appear in your site's search result.

## Environment Variables Required

Make sure these are set in your `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=https://www.amrita-fashions.com
NEXT_PUBLIC_COMPANY_FILTER=AGE
NEXT_PUBLIC_SITE_FILTER=catalogue
```

## Implementation Details

### **Data Flow**
```
API Data → Redux Store → GlobalStructuredData → websiteStructuredData.js → JSON-LD Script
```

### **Language Detection**
- Uses first language from `companyInfo.languages` array
- Fallback to 'en' if no languages specified
- Supports multilingual sites

### **Publisher Linking**
- Links to Corporation JSON-LD via `publisher.@id`
- Creates relationship between WebSite and Organization
- Improves entity recognition by search engines

## Troubleshooting

### **JSON-LD Not Appearing**
1. Check if APIs are returning data
2. Verify environment variables are set
3. Check browser console for errors
4. Ensure Redux store is properly configured

### **Search Box Not Showing in Google**
1. Wait for Google to re-crawl your site (can take weeks)
2. Verify JSON-LD validates correctly
3. Ensure your search endpoint works properly
4. Check Google Search Console for structured data errors

### **Invalid SearchAction**
1. Verify search endpoint URL is correct
2. Test the search functionality manually
3. Ensure query parameter format matches your search page

## Next Steps

The WebSite JSON-LD with SearchAction is now implemented on **all pages**. You can:
1. Test the implementation using the test page
2. Submit your sitemap to Google Search Console
3. Monitor for sitelinks search box appearance in search results
4. Track search queries from Google in your analytics

## Benefits Summary

- **Enhanced Search Presence**: Sitelinks search box in Google results
- **Better User Experience**: Direct search access from Google
- **Improved SEO**: Better entity recognition and search visibility
- **Automatic Implementation**: Works on all pages without manual setup