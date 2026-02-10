# Blog Structured Data Implementation

## Overview

This document explains the Blog page structured data (JSON-LD) implementation that dynamically uses Topic Page SEO API data and blog list data.

## Implementation Details

### Files Created/Modified

1. **`src/utils/blogPageStructuredData.js`** - New utility for generating Blog structured data
2. **`src/app/blog/page.jsx`** - Updated to include Blog JSON-LD
3. **`scripts/verify-blog-jsonld.js`** - Test script for validation

### Data Sources

#### 1. Topic Page SEO API (name: "blog")

The blog page fetches SEO metadata from the Topic Page API where `name: "blog"`:

```javascript
{
  "id": "6986ebc7799fab2bb",
  "name": "blog",
  "metaTitle": "blog meta title",           // → Used for Blog name
  "description": "blog meta description",    // → Used for Blog description
  "canonicalUrl": "www.amrita-fashions.com/blog", // → Used for Blog URL
  "excerpt": "blog meta excerpt",            // → Fallback for description
  "ogType": "blog",
  "keywords": ["blog keywords 1", "..."]
}
```

#### 2. Blog List API

Fetches all blog posts from `/blog` endpoint:

```javascript
{
  "id": "697de99534ba364a2",
  "title": "Blog Post Title",
  "slug": "blog-post-slug",
  "publishedAt": "2026-01-25 18:30:00",
  "excerpt": "Blog excerpt...",
  "category": "Updates",
  "tags": ["Technology"]
}
```

### Generated Structured Data

The implementation generates the following JSON-LD schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "blog meta title",
  "description": "blog meta description",
  "url": "https://www.amrita-fashions.com/blog",
  "publisher": {
    "@id": "https://www.amrita-fashions.com/#org"
  },
  "blogPost": {
    "@type": "ItemList",
    "itemListOrder": "https://schema.org/ItemListUnordered",
    "numberOfItems": 2,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://www.amrita-fashions.com/blog-details/blog-slug-1",
        "name": "Blog Post Title 1"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "url": "https://www.amrita-fashions.com/blog-details/blog-slug-2",
        "name": "Blog Post Title 2"
      }
    ]
  }
}
```

## Key Features

### 1. Dynamic Data Integration

- **Blog name**: Uses `metaTitle` from Topic Page SEO
- **Blog description**: Uses `description` from Topic Page SEO
- **Blog URL**: Uses `canonicalUrl` from Topic Page SEO
- **Blog posts**: Dynamically generated from blog list API

### 2. Smart URL Handling

The utility handles various URL formats:

- **Full URLs**: `https://www.amrita-fashions.com/blog-details/slug` → Extracts `slug`
- **Relative URLs**: `blog-details/slug` → Uses as-is
- **Domain prefixes**: `www.amrita-fashions.com/blog` → Removes domain, keeps path

### 3. Fallback Logic

```javascript
// Title fallback chain
metaTitle → name → "Blog"

// Description fallback chain
description → excerpt → "Read our latest articles and insights"

// Blog slug fallback chain
blog.slug → blog.id → blog._id
```

### 4. HTML Tag Stripping

Blog titles are cleaned of HTML tags for structured data:

```javascript
"<strong>Blog Title</strong>" → "Blog Title"
```

### 5. Empty State Handling

If no blogs are available, the structured data still renders with basic Blog schema (without `blogPost` property).

## Usage in Blog Page

### Server Component Implementation

```javascript
export default async function BlogPage() {
  // 1. Fetch blogs server-side
  const blogs = await fetchBlogs();
  
  // 2. Fetch Topic Page SEO data
  const topicPageData = await getPageSeoMetadata(PAGE_NAMES.BLOG, {
    title: null,
    description: null,
    keywords: null,
  });
  
  // 3. Generate Blog structured data
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amrita-fashions.com';
  const blogStructuredData = generateBlogPageStructuredData(topicPageData, blogs, baseUrl);
  
  return (
    <>
      {/* Blog Page Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData)
        }}
      />
      
      {/* Rest of the page */}
    </>
  );
}
```

## Testing

### Run Verification Script

```bash
node scripts/verify-blog-jsonld.js
```

### Test Coverage

The verification script tests:

1. ✅ Blog structured data generation
2. ✅ Required fields validation
3. ✅ blogPost ItemList validation
4. ✅ Topic Page SEO integration
5. ✅ Empty blogs array handling
6. ✅ Full URL slug extraction

### Manual Testing

1. **View in Browser**:
   - Navigate to `/blog`
   - View page source
   - Search for `application/ld+json`
   - Verify Blog schema is present

2. **Google Rich Results Test**:
   - Visit: https://search.google.com/test/rich-results
   - Enter your blog page URL
   - Verify Blog schema is detected

3. **Schema.org Validator**:
   - Visit: https://validator.schema.org/
   - Paste the JSON-LD
   - Verify no errors

## SEO Benefits

### 1. Enhanced Search Results

Blog structured data helps Google understand:
- Your blog's name and purpose
- List of all blog posts
- Relationship between blog and posts

### 2. Rich Snippets Eligibility

Proper Blog schema can enable:
- Blog post carousels in search results
- Enhanced blog listings
- Better indexing of blog content

### 3. Knowledge Graph Integration

Structured data helps Google build knowledge about:
- Your blog as an entity
- Your organization as publisher
- Content relationships

## Best Practices

### 1. Keep Data Fresh

The blog page uses `revalidate: 60` to refresh data every 60 seconds:

```javascript
export const revalidate = 60;
```

### 2. Validate Regularly

Run the verification script after:
- Adding new blogs
- Updating Topic Page SEO
- Changing blog structure

### 3. Monitor Search Console

Check Google Search Console for:
- Structured data errors
- Rich result eligibility
- Index coverage

## Troubleshooting

### Issue: Blog structured data not appearing

**Solution**: Check that:
1. Topic Page SEO API returns data for `name: "blog"`
2. Blog API returns valid blog array
3. Server-side rendering is working

### Issue: Invalid URLs in ItemList

**Solution**: Verify:
1. Blog slugs are valid strings
2. Base URL is correctly configured
3. URL extraction logic handles your slug format

### Issue: Missing blogPost property

**Solution**: Ensure:
1. Blogs array is not empty
2. Blogs have valid `title` and `slug` fields
3. No errors in blog fetching

## Future Enhancements

### Potential Improvements

1. **Add datePublished to ItemList items**
   ```javascript
   {
     "@type": "ListItem",
     "position": 1,
     "url": "...",
     "name": "...",
     "datePublished": "2026-01-25"
   }
   ```

2. **Add author information**
   ```javascript
   {
     "@type": "Blog",
     "author": {
       "@type": "Person",
       "name": "Author Name"
     }
   }
   ```

3. **Add image to Blog**
   ```javascript
   {
     "@type": "Blog",
     "image": "https://example.com/blog-image.jpg"
   }
   ```

## Related Documentation

- [Blog Details Structured Data](./src/utils/blogStructuredData.js)
- [Breadcrumb Structured Data](./src/utils/breadcrumbStructuredData.js)
- [Topic Page SEO Integration](./src/utils/topicPageSeoIntegration.js)
- [SEO Utilities](./src/utils/seo.js)

## Support

For issues or questions:
1. Check the verification script output
2. Review Google Search Console
3. Validate with Schema.org validator
4. Test with Google Rich Results Test

---

**Last Updated**: February 2026  
**Version**: 1.0.0
