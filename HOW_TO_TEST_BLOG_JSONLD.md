# How to Test Blog JSON-LD

## Quick Test Steps

### Step 1: Visit the Test Page

Navigate to: **`http://localhost:3000/test-blog-jsonld`** (or your production URL)

This page will show you:
1. Topic Page Data (raw from API)
2. Blogs Data (all blog posts)
3. Generated Blog Structured Data
4. HTML Output ready to test

### Step 2: Check the Data

Look at the checklist on the test page:
- ✓ Topic Page Data loaded
- ✓ metaTitle present
- ✓ description present
- ✓ canonicalUrl present
- ✓ Blogs loaded
- ✓ Blog schema generated
- ✓ blogPost ItemList present

**If any item shows ✗, that's the problem!**

### Step 3: Copy HTML Output

1. Scroll to section 4 on the test page
2. Copy the entire content from the textarea
3. It should look like:
   ```html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "Blog",
     ...
   }
   </script>
   ```

### Step 4: Test with Google

1. Go to: https://search.google.com/test/rich-results
2. Click "Code" tab
3. Paste the HTML you copied
4. Click "Test Code"
5. Wait for results
6. Check if "Blog" appears in detected structured data

## Common Issues & Solutions

### Issue 1: Topic Page Data is null

**Problem**: API not returning data for "blog"

**Solution**:
```bash
# Check API directly
curl https://espobackend.vercel.app/api/topicpage

# Look for entry with "name": "blog"
# If missing, add it to your database
```

### Issue 2: No blogs loaded

**Problem**: Blog API not returning posts

**Solution**:
```bash
# Check Blog API
curl https://espobackend.vercel.app/api/blog

# Should return array of blog posts
# If empty, add blog posts to database
```

### Issue 3: metaTitle/description missing

**Problem**: Topic Page entry exists but missing fields

**Solution**:
- Edit the blog entry in Topic Page API
- Ensure these fields are present:
  - `metaTitle`: "Your Blog Title"
  - `description`: "Your blog description"
  - `canonicalUrl`: "https://www.amrita-fashions.com/blog"

### Issue 4: JSON-LD not in page source

**Problem**: Component not rendering

**Solution**:
1. Check server console logs
2. Look for errors during build
3. Verify environment variables are set
4. Try rebuilding: `npm run build`

## Testing on Production

### Method 1: View Page Source

1. Go to: https://www.amrita-fashions.com/blog
2. Right-click → "View Page Source" (Ctrl+U)
3. Search for: `application/ld+json`
4. Look for Blog schema

### Method 2: Use Test Page

1. Go to: https://www.amrita-fashions.com/test-blog-jsonld
2. Follow steps above
3. Copy HTML output
4. Test with Google Rich Results

### Method 3: Direct Google Test

1. Go to: https://search.google.com/test/rich-results
2. Enter URL: `https://www.amrita-fashions.com/blog`
3. Click "Test URL"
4. Wait for results
5. Check detected structured data

## What Success Looks Like

### In Test Page:
- All checkboxes show ✓
- Generated structured data has:
  - `@type: "Blog"`
  - `name` from metaTitle
  - `description` from description
  - `url` from canonicalUrl
  - `blogPost` with ItemList
  - Multiple items in itemListElement

### In Google Rich Results Test:
- "Blog" appears in detected structured data
- No errors or warnings
- Shows "Valid items" count

### In Page Source:
```html
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
```

## Troubleshooting Commands

```bash
# Run quick check
node scripts/quick-check-blog-jsonld.js

# Test HTML output
node scripts/test-blog-html-output.js

# Verify structured data
node scripts/verify-blog-jsonld.js

# Start dev server
npm run dev

# Build for production
npm run build

# Check production build
npm run start
```

## Need Help?

1. Visit the test page first: `/test-blog-jsonld`
2. Check which items show ✗
3. Follow the solution for that specific issue
4. See `BLOG_JSON_LD_DEBUGGING.md` for detailed help

## Quick Checklist

Before asking for help, verify:
- [ ] Test page loads without errors
- [ ] Topic Page Data shows on test page
- [ ] Blogs Data shows on test page
- [ ] Generated structured data looks correct
- [ ] All checkboxes show ✓
- [ ] Copied HTML to Google Rich Results Test
- [ ] Checked page source on live site
- [ ] Cleared browser cache
- [ ] Rebuilt the application

---

**Test Page URL**: `/test-blog-jsonld`  
**Live Blog URL**: `/blog`  
**Google Tool**: https://search.google.com/test/rich-results
