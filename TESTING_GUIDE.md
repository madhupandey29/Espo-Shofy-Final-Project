# Testing Blog Structured Data - Complete Guide

## Method 1: Local Development Testing

### Step 1: Run the test script
```bash
node test-structured-data.js
```
This will show you exactly what JSON-LD will be generated.

### Step 2: Start your development server
```bash
npm run dev
```

### Step 3: Visit a blog post
Navigate to: `http://localhost:3000/blog-details/[any-blog-id]`

### Step 4: Check in Browser DevTools
1. **Right-click** → **Inspect Element**
2. Go to **Elements** tab
3. **Ctrl+F** (or Cmd+F) and search for: `application/ld+json`
4. You should see two `<script>` tags with your structured data

## Method 2: Online Validators (Recommended)

### Google Rich Results Test
1. **Visit**: https://search.google.com/test/rich-results
2. **Enter your blog URL** or **paste the JSON-LD code**
3. **Click "Test URL"** or **"Test Code"**
4. **Check results** - should show "BlogPosting" as valid

### Schema.org Validator
1. **Visit**: https://validator.schema.org/
2. **Paste your JSON-LD code**
3. **Click "Validate"**
4. **Check for errors** - should show green checkmarks

### JSON-LD Playground
1. **Visit**: https://json-ld.org/playground/
2. **Paste your JSON-LD code**
3. **View the expanded/compacted versions**
4. **Check the visual graph**

## Method 3: Production Testing

### After Deployment
1. **Deploy your changes** to production
2. **Visit your live blog post URL**
3. **Use Google Search Console**:
   - Go to URL Inspection tool
   - Enter your blog post URL
   - Check "Live Test" for structured data

### Google Search Console
1. **Property** → **Enhancements** → **Articles**
2. **Check for "BlogPosting" entries**
3. **Look for any errors or warnings**

## Method 4: Browser Extension Testing

### Structured Data Testing Tool (Chrome Extension)
1. **Install**: "Structured Data Testing Tool" extension
2. **Visit your blog post**
3. **Click the extension icon**
4. **View detected structured data**

## Method 5: Command Line Testing

### Using curl and jq (if you have them installed)
```bash
# Fetch the page and extract JSON-LD
curl -s "http://localhost:3000/blog-details/your-blog-id" | grep -o '<script type="application/ld+json"[^>]*>[^<]*</script>' | sed 's/<[^>]*>//g' | jq .
```

## What to Look For

### ✅ Successful Test Results Should Show:

**BlogPosting Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.amrita-fashions.com/blog-details/your-slug"
  },
  "headline": "Your Blog Title",
  "description": "Your blog excerpt...",
  "image": "https://your-image-url.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://linkedin.com/in/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Amrita Global Enterprise",
    "logo": {
      "@type": "ImageObject",
      "url": "https://your-logo-url.jpg"
    }
  },
  "datePublished": "2026-01-31T18:30:00",
  "dateModified": "2026-02-02T12:05:52"
}
```

**BreadcrumbList Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.amrita-fashions.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.amrita-fashions.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Your Blog Title",
      "item": "https://www.amrita-fashions.com/blog-details/your-slug"
    }
  ]
}
```

## Common Issues to Check

### ❌ Potential Problems:

1. **Missing Script Tags**: Check if `<script type="application/ld+json">` appears in HTML
2. **Invalid JSON**: Use JSON validator to check syntax
3. **Missing Required Fields**: Ensure headline, author, datePublished are present
4. **Incorrect URLs**: Verify all URLs are absolute and accessible
5. **HTML in Text Fields**: Make sure title/description don't contain HTML tags

### 🔧 Debugging Steps:

1. **Check Console Errors**: Look for JavaScript errors in browser console
2. **Verify API Data**: Ensure blog and author APIs return expected data
3. **Test Fallbacks**: Try with missing author data to test fallback logic
4. **Check Environment Variables**: Verify `NEXT_PUBLIC_SITE_URL` is set correctly

## Testing Checklist

- [ ] Run local test script successfully
- [ ] See structured data in browser DevTools
- [ ] Pass Google Rich Results Test
- [ ] Pass Schema.org Validator
- [ ] No errors in browser console
- [ ] Author data loads correctly
- [ ] Fallbacks work when data is missing
- [ ] URLs are absolute and correct
- [ ] Dates are in proper ISO format
- [ ] Images load and display correctly

## Expected SEO Benefits After Testing

Once validated, you should see:
- **Rich snippets** in Google search results
- **Author information** displayed in search
- **Breadcrumb navigation** in search results
- **Article metadata** (publish date, reading time)
- **Enhanced social media previews**

## Monitoring After Launch

### Google Search Console
- Monitor **Coverage** reports for structured data
- Check **Enhancements** → **Articles** section
- Watch for **Rich Results** performance

### Search Results
- Search for your blog posts by title
- Look for enhanced search result displays
- Check if author and date information appears

Remember: It can take a few days to weeks for Google to process and display rich results after implementation!