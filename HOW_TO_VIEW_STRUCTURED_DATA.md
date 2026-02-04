# How to View Blog Structured Data

## ✅ Updated Implementation

The structured data now includes ALL the fields from your example:

### Data Mapping:
- **@id**: `${baseUrl}/blog-details/${blog.slug}` 
- **headline**: `blog.title` (HTML stripped)
- **description**: `blog.excerpt` (from blog API)
- **image**: `blog.blogimage1` (from blog API)
- **author.name**: `author.name` (from author API)
- **author.url**: `author.authorLinkedinURL` (from author API)
- **publisher.name**: "Amrita Global Enterprise" (static)
- **publisher.logo.url**: Same as `blog.blogimage1`
- **datePublished**: `blog.publishedAt` (from blog API)
- **dateModified**: `blog.modifiedAt` (from blog API)

## 🔍 How to View in Browser

### Method 1: Developer Tools (Elements Tab)
1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Visit any blog post**:
   ```
   http://localhost:3000/blog-details/[your-blog-slug]
   ```

3. **Open Developer Tools**:
   - Right-click anywhere on the page
   - Click "Inspect Element" or "Inspect"
   - Or press `F12`

4. **Find the structured data**:
   - Go to the **Elements** tab
   - Press `Ctrl+F` (or `Cmd+F` on Mac)
   - Search for: `application/ld+json`
   - You should see **2 script tags** highlighted

5. **View the JSON**:
   - Click on the `<script type="application/ld+json">` tag
   - The JSON will be visible in the HTML structure
   - You can expand/collapse the script content

### Method 2: View Page Source
1. **Visit your blog post** (same URL as above)

2. **View source**:
   - Right-click on the page
   - Click "View Page Source"
   - Or press `Ctrl+U` (or `Cmd+U` on Mac)

3. **Search for structured data**:
   - Press `Ctrl+F` (or `Cmd+F` on Mac)
   - Search for: `application/ld+json`
   - You'll see the complete JSON-LD code

### Method 3: Browser Console
1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Run this JavaScript**:
   ```javascript
   // Find all JSON-LD scripts
   const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
   jsonLdScripts.forEach((script, index) => {
     console.log(`JSON-LD Script ${index + 1}:`, JSON.parse(script.textContent));
   });
   ```

## 📱 Expected Output in Browser

You should see **2 script tags** in the `<head>` section:

### Script 1: BlogPosting
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.amrita-fashions.com/blog-details/your-blog-slug"
  },
  "headline": "Your Blog Title",
  "description": "Your blog excerpt",
  "image": "https://your-blog-image-url.jpg",
  "author": {
    "@type": "Person",
    "name": "Rajesh Goyal",
    "url": "https://www.linkedin.com/in/rajesh-m-goyal/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Amrita Global Enterprise",
    "logo": {
      "@type": "ImageObject",
      "url": "https://your-blog-image-url.jpg"
    }
  },
  "datePublished": "2026-01-25",
  "dateModified": "2026-02-04"
}
</script>
```

### Script 2: BreadcrumbList
```html
<script type="application/ld+json">
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
      "item": "https://www.amrita-fashions.com/blog-details/your-blog-slug"
    }
  ]
}
</script>
```

## 🧪 Testing Steps

### Step 1: Test Locally
```bash
# Run the test script to see expected output
node test-structured-data.js

# Start development server
npm run dev

# Visit a blog post
# http://localhost:3000/blog-details/[blog-slug]
```

### Step 2: Check in Browser
1. **Elements Tab**: Search for `application/ld+json`
2. **Page Source**: Search for `application/ld+json`
3. **Verify all fields are present**:
   - ✅ @context, @type, mainEntityOfPage
   - ✅ headline, description, image
   - ✅ author (name + url)
   - ✅ publisher (name + logo)
   - ✅ datePublished, dateModified

### Step 3: Validate Online
1. **Copy the JSON** from browser DevTools
2. **Test at**: https://search.google.com/test/rich-results
3. **Should show**: "BlogPosting" as valid

## 🔧 Troubleshooting

### If you don't see the structured data:
1. **Check console for errors**
2. **Verify blog data is loading** (check Network tab)
3. **Verify author data is loading** (check Network tab)
4. **Check if `NEXT_PUBLIC_SITE_URL` is set correctly**

### If author shows wrong name:
1. **Check if author API returns data**
2. **Verify `assignedUserId` matches author `id`**
3. **Check author API endpoint** (should be `/author`)

### If image is missing:
1. **Check if `blogimage1` field exists in blog data**
2. **Verify image URL is accessible**
3. **Check fallback to site logo**

## 📍 Location in HTML

The structured data will appear in the `<head>` section of your HTML, specifically:

```html
<head>
  <!-- Other head elements -->
  
  <!-- Blog Structured Data -->
  <script id="blog-structured-data" type="application/ld+json">
    {/* BlogPosting JSON-LD */}
  </script>
  
  <!-- Breadcrumb Structured Data -->
  <script id="blog-breadcrumb-structured-data" type="application/ld+json">
    {/* BreadcrumbList JSON-LD */}
  </script>
  
  <!-- Other head elements -->
</head>
```

The scripts are added with `strategy="beforeInteractive"` to ensure they load before the page becomes interactive, which is optimal for SEO.