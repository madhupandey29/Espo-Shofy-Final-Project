# Open Graph Meta Tags Setup

## Overview
I've successfully added dynamic Open Graph meta tags to your product details page and other key pages. The logo URL now uses Next.js optimized images with your base URL from environment variables.

## What's Been Added

### 1. Dynamic Product Image (`og:image`)
- **Product Details Page**: Uses the first product image (`image1CloudUrl`) dynamically
- **Other Pages**: Uses a default logo image
- **Fallback**: If no product image is available, falls back to default images

### 2. Optimized Company Logo (`og:logo`)
- **All Pages**: Now include `<meta property="og:logo" content="optimized_logo_url" />`
- **Next.js Optimized**: Uses `/_next/image?url=%2Fassets%2Fimg%2Flogo%2Fage.jpg&w=256&q=90`
- **Dynamic Base URL**: Uses `NEXT_PUBLIC_SITE_URL` environment variable
- **Fallback**: Falls back to `https://espo-shofy-final-project.vercel.app` if env not set

## Files Modified

### 1. `src/utils/seo.js`
- Added `getOptimizedLogoUrl()` utility function
- Added `ogLogo` parameter to `generateMetadata` function
- Added logic to handle absolute logo URLs
- Added `og:logo` meta tag to the output

### 2. `src/app/product-details/page.jsx`
- **Dynamic OG Image**: Uses first product image from API
- **Optimized OG Logo**: Uses Next.js optimized logo URL
- **Product-specific**: Title, description, and keywords from product data

### 3. Other Pages Updated
- `src/app/page.jsx` (Home page)
- `src/app/fabric/page.jsx` (Fabric collection)
- `src/app/contact/page.jsx` (Contact page)

## Configuration

### Environment Variable (Required for Production)
Add to your `.env.local` file:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

If not set, it defaults to `https://espo-shofy-final-project.vercel.app`

## Generated Logo URL Format

The system generates optimized logo URLs like:
```
https://your-domain.com/_next/image?url=%2Fassets%2Fimg%2Flogo%2Fage.jpg&w=256&q=90
```

### URL Parameters:
- `url`: URL-encoded path to the logo (`%2Fassets%2Fimg%2Flogo%2Fage.jpg`)
- `w`: Width (256px)
- `q`: Quality (90%)

## How It Works

### Product Details Page
```html
<!-- Dynamic based on product data -->
<meta property="og:image" content="https://cloudinary.com/product-image.jpg" />
<meta property="og:logo" content="https://your-domain.com/_next/image?url=%2Fassets%2Fimg%2Flogo%2Fage.jpg&w=256&q=90" />
<meta property="og:title" content="Product Name - Shofy" />
<meta property="og:description" content="Product description..." />
```

### Other Pages
```html
<!-- Static images with optimized logo -->
<meta property="og:image" content="https://your-domain.com/default-image.svg" />
<meta property="og:logo" content="https://your-domain.com/_next/image?url=%2Fassets%2Fimg%2Flogo%2Fage.jpg&w=256&q=90" />
```

## Utility Function

The `getOptimizedLogoUrl()` function can be customized:

```javascript
// Default usage
const logoUrl = getOptimizedLogoUrl();

// Custom parameters
const logoUrl = getOptimizedLogoUrl("/path/to/logo.jpg", 512, 95);
```

## Benefits

1. **Next.js Optimization**: Logo images are automatically optimized for performance
2. **Better Social Sharing**: Pages display properly when shared on social media
3. **Brand Consistency**: Your optimized logo appears consistently across all shared content
4. **Dynamic Content**: Product pages show actual product images when shared
5. **Environment Flexibility**: Works across different deployment environments

## Testing

To test the Open Graph tags:
1. Use Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Use LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/)
3. Use Twitter's [Card Validator](https://cards-dev.twitter.com/validator)

## Next Steps

1. **Set Base URL**: Add `NEXT_PUBLIC_SITE_URL` to your environment variables
2. **Test Sharing**: Share a product page on social media to see the results
3. **Monitor**: Check social media analytics to see improved engagement