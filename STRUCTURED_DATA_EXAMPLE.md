# Blog Structured Data Implementation

## Example Output

Based on your sample blog and author data, here's what the JSON-LD structured data will look like:

### BlogPosting Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.amrita-fashions.com/blog-details/denim-manufacturers-in-west-bengal-for-garment-bran"
  },
  "headline": "Why Is the Textile Industry in West Bengal Ideal for Denim Fabric Manufacturing?",
  "description": "West Bengal is rapidly becoming a preferred destination for garment brands and exporters seeking reliable denim manufacturers in India...",
  "image": "https://res.cloudinary.com/age-fabric/image/upload/v1770115088/ic9rrjwrd7vibkgsia98.avif",
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
      "url": "https://res.cloudinary.com/age-fabric/image/upload/v1770115088/ic9rrjwrd7vibkgsia98.avif"
    }
  },
  "datePublished": "2026-01-31T18:30:00",
  "dateModified": "2026-02-02T12:05:52"
}
```

### BreadcrumbList Structured Data

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
      "name": "Why Is the Textile Industry in West Bengal Ideal for Denim Fabric Manufacturing?",
      "item": "https://www.amrita-fashions.com/blog-details/denim-manufacturers-in-west-bengal-for-garment-bran"
    }
  ]
}
```

## Data Mapping

### From Blog API:
- **@id**: `${baseUrl}/blog-details/${blog.slug || blog.id}`
- **headline**: `blog.title` (HTML stripped)
- **description**: `blog.excerpt` (fallback to paragraph1 excerpt)
- **image**: `blog.blogimage1` (fallback to blogimage2)
- **datePublished**: `blog.publishedAt`
- **dateModified**: `blog.modifiedAt`

### From Author API:
- **author.name**: `author.name`
- **author.url**: `author.authorLinkedinURL`

### Publisher (Static):
- **publisher.name**: "Amrita Global Enterprise"
- **publisher.logo.url**: Uses blog image or fallback to site logo

## Fallback Handling

The implementation includes robust fallback handling:

1. **Missing Author**: Falls back to `blog.assignedUserName`
2. **Missing Excerpt**: Uses first 160 characters of `paragraph1`
3. **Missing Images**: Uses fallback site logo for publisher
4. **Missing Dates**: Uses `createdAt` as fallback for `publishedAt`

## SEO Benefits

This structured data will help with:

1. **Rich Snippets**: Enhanced search results with author, date, and image
2. **Knowledge Graph**: Better understanding of content relationships
3. **Voice Search**: Improved discoverability for voice queries
4. **Social Sharing**: Better preview cards on social platforms
5. **Search Rankings**: Potential ranking boost from structured data

## Testing

You can test the structured data using:
- [Google's Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)

## Implementation Notes

- Structured data is added server-side for better SEO
- Uses `beforeInteractive` strategy for optimal loading
- Automatically handles HTML cleanup in titles
- Supports both slug and ID-based URLs
- Includes comprehensive error handling