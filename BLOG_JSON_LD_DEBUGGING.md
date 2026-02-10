# Blog JSON-LD Debugging Guide

## Issue: Blog Structured Data Not Showing in Google Rich Results Test

### Possible Causes & Solutions

## 1. Check if JSON-LD is in the HTML Source

### Steps:
1. Navigate to your blog page: `https://www.amrita-fashions.com/blog`
2. Right-click → "View Page Source" (or press `Ctrl+U`)
3. Search for `application/ld+json` (press `Ctrl+F`)
4. Look for the Blog schema

### What to Look For:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "...",
  "description": "...",
  "url": "https://www.amrita-fashions.com/blog",
  "publisher": {
    "@id": "https://www.amrita-fashions.com/#org"
  },
  "blogPost": {
    "@type": "ItemList",
    ...
  }
}
</script>
```

### If NOT Found:
- The component is not rendering
- Check server logs for errors
- Verify the page is server-side rendered

---

## 2. Verify Topic Page API is Returning Data

### Check API Response:
```bash
curl https://espobackend.vercel.app/api/topicpage
```

### Look for Blog Entry:
```json
{
  "success": true,
  "data": [
    {
      "name": "blog",
      "metaTitle": "...",
      "description": "...",
      "canonicalUrl": "..."
    }
  ]
}
```

### If Blog Entry Missing:
- Add blog entry to Topic Page API
- Ensure `name: "blog"` (lowercase)
- Include `metaTitle`, `description`, `canonicalUrl`

---

## 3. Check Blog API is Returning Posts

### Check API Response:
```bash
curl https://espobackend.vercel.app/api/blog
```

### Expected Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Blog Title",
      "slug": "blog-slug",
      ...
    }
  ]
}
```

### If No Blogs:
- The `blogPost` property won't be added
- Blog schema will still render (without ItemList)
- Add at least one blog post

---

## 4. Check Server Console Logs

### Look for Debug Logs:
```
[Blog Page] Topic Page Data: { ... }
[Blog Page] Blogs count: 2
```

### If Logs Missing:
- Server-side rendering may not be working
- Check Next.js build logs
- Verify environment variables

---

## 5. Verify Environment Variables

### Required Variables:
```env
NEXT_PUBLIC_API_BASE_URL=https://espobackend.vercel.app
NEXT_PUBLIC_API_BLOG_PATH=/api/blog
NEXT_PUBLIC_SITE_URL=https://www.amrita-fashions.com
```

### Check in Code:
```javascript
console.log('API_BASE:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('BLOG_PATH:', process.env.NEXT_PUBLIC_API_BLOG_PATH);
console.log('SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
```

---

## 6. Test with Different Tools

### A. Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- Enter: `https://www.amrita-fashions.com/blog`
- Wait for results
- Check "Detected structured data"

### B. Schema.org Validator
- URL: https://validator.schema.org/
- Paste the JSON-LD directly
- Check for errors

### C. Browser DevTools
1. Open DevTools (F12)
2. Go to "Elements" tab
3. Search for `application/ld+json`
4. Verify Blog schema is present

---

## 7. Common Issues & Fixes

### Issue: "topicPageData is null"
**Cause**: Topic Page API not returning data for "blog"  
**Fix**: Add blog entry to Topic Page API with `name: "blog"`

### Issue: "blogs array is empty"
**Cause**: Blog API not returning posts  
**Fix**: Add blog posts to your database

### Issue: "JSON-LD not in HTML source"
**Cause**: Component not rendering server-side  
**Fix**: Ensure page is async server component

### Issue: "Invalid JSON in JSON-LD"
**Cause**: Data contains invalid characters  
**Fix**: Check for unescaped quotes in titles/descriptions

### Issue: "Google not detecting Blog schema"
**Cause**: Multiple possible reasons  
**Fix**: Follow all steps in this guide

---

## 8. Manual Testing Checklist

- [ ] Blog page loads without errors
- [ ] View page source shows JSON-LD
- [ ] JSON-LD contains `@type: "Blog"`
- [ ] Blog name is from Topic Page API
- [ ] Blog description is from Topic Page API
- [ ] Blog URL is correct
- [ ] blogPost ItemList is present
- [ ] ItemList has correct number of items
- [ ] Each item has position, url, name
- [ ] URLs are absolute (start with https://)
- [ ] No JavaScript errors in console
- [ ] Server logs show data fetching
- [ ] Google Rich Results Test detects schema

---

## 9. Quick Debug Commands

### Test Locally:
```bash
# Run verification script
node scripts/verify-blog-jsonld.js

# Test HTML output
node scripts/test-blog-html-output.js

# Start dev server
npm run dev

# Build for production
npm run build
```

### Check Live Site:
```bash
# Fetch blog page HTML
curl https://www.amrita-fashions.com/blog | grep "application/ld+json" -A 50

# Check if Blog schema is present
curl https://www.amrita-fashions.com/blog | grep '"@type": "Blog"'
```

---

## 10. Expected vs Actual Comparison

### Expected JSON-LD:
```json
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
    "numberOfItems": 2,
    "itemListElement": [...]
  }
}
```

### What You See:
- Compare with actual output
- Check for missing fields
- Verify data values

---

## 11. Next Steps After Fixing

1. **Clear Cache**:
   - Clear browser cache
   - Clear CDN cache (if using)
   - Rebuild Next.js app

2. **Retest**:
   - View page source
   - Test with Google Rich Results
   - Validate with Schema.org

3. **Monitor**:
   - Check Google Search Console
   - Monitor for structured data errors
   - Track rich result eligibility

4. **Submit to Google**:
   - Request indexing in Search Console
   - Wait 24-48 hours for processing
   - Check "Enhancements" section

---

## 12. Contact Support

If issues persist after following this guide:

1. **Provide**:
   - Page URL
   - Screenshot of page source
   - Screenshot of Google Rich Results Test
   - Server console logs
   - API response samples

2. **Check**:
   - Next.js version
   - Node.js version
   - Deployment platform
   - Build logs

---

## Summary

The Blog JSON-LD should render if:
- ✅ Topic Page API returns data for `name: "blog"`
- ✅ Blog API returns blog posts
- ✅ Environment variables are set
- ✅ Page is server-side rendered
- ✅ No JavaScript errors
- ✅ Component is properly imported

**Most Common Issue**: Topic Page API not returning data for "blog" entry.

**Quick Fix**: Add blog entry to Topic Page API with proper fields.
