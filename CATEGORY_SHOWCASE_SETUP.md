# Category Showcase Component - Setup Guide

## Overview
A beautiful, responsive category showcase component has been created for your home page. When users click on a category, they'll be redirected to the fabric page with the appropriate category filter.

## Files Created

1. **Component**: `src/components/category/CategoryShowcase.jsx`
2. **Styles**: `src/styles/components/_category-showcase.scss`
3. **Data**: `src/data/category-data.js`

## Features

✅ Responsive grid layout (6 categories)
✅ Hover animations and effects
✅ Discount badges with custom colors
✅ Smooth transitions
✅ Mobile-friendly design
✅ SEO-optimized
✅ Lazy loading images
✅ Links to fabric page with category filters

## Setup Instructions

### 1. Add Category Images

You need to add 6 category images to your project. Place them in:
```
public/assets/img/category/
```

Required images:
- `ethnic-wear.jpg` (300x400px recommended)
- `casual-wear.jpg` (300x400px recommended)
- `mens-activewear.jpg` (300x400px recommended)
- `womens-activewear.jpg` (300x400px recommended)
- `western-wear.jpg` (300x400px recommended)
- `sportswear.jpg` (300x400px recommended)

**Image Guidelines:**
- Aspect ratio: 3:4 (portrait)
- Recommended size: 300x400px or 600x800px
- Format: JPG or WebP
- File size: Keep under 200KB for optimal performance

### 2. Customize Categories

Edit `src/data/category-data.js` to customize:
- Category names
- Discount percentages
- Links (category filters)
- Badge colors
- Images

Example:
```javascript
{
  id: 1,
  name: "Your Category Name",
  discount: "50-80% OFF",
  image: "/assets/img/category/your-image.jpg",
  link: "/fabric?category=your-filter",
  bgColor: "#8B5CF6", // Purple
  description: "Category description"
}
```

### 3. Update Fabric Page Filters

Make sure your fabric page (`src/app/fabric/page.jsx`) handles the category query parameter:
```
/fabric?category=ethnic
/fabric?category=casual
etc.
```

You may need to update the `ShopArea` component to filter products based on the category parameter.

## Customization Options

### Change Colors
Edit the `bgColor` property in `src/data/category-data.js` for each category's discount badge.

### Adjust Layout
In `src/styles/components/_category-showcase.scss`, you can modify:
- Grid spacing: `.g-20` class
- Card height: `.category-card-inner { height: 380px; }`
- Hover effects: `.category-card-inner:hover`
- Responsive breakpoints

### Change Section Title
In `src/components/category/CategoryShowcase.jsx`, update:
```jsx
<h2 className="category-showcase-title">
  SHOP BY <span className="text-gradient">CATEGORY</span>
</h2>
```

### Modify Animations
Edit the SCSS file to adjust:
- Hover lift effect: `transform: translateY(-8px);`
- Image zoom: `transform: scale(1.1);`
- Transition timing: `transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);`

## Integration

The component has been automatically added to your home page in `src/app/HomePageTwoClient.jsx` right after the banner section.

Current order:
1. Fashion Banner
2. **Category Showcase** ← NEW
3. Popular Products
4. Weeks Featured
5. Feature Area
6. Testimonials
7. Blog Area

## Responsive Behavior

- **Desktop (XL)**: 6 columns (all categories in one row)
- **Desktop (LG)**: 4 columns
- **Tablet (MD)**: 3 columns
- **Mobile (SM)**: 2 columns
- **Mobile (XS)**: 1 column

## API Integration (Optional)

If you want to fetch categories from your API instead of using static data, use the `fetchCategories` function in `src/data/category-data.js`:

```javascript
// In your component
import { fetchCategories } from "@/data/category-data";

const categories = await fetchCategories();
```

Make sure your API endpoint returns data in this format:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Category Name",
      "slug": "category-slug",
      "image": "image-url",
      "discount": "50-80% OFF",
      "color": "#8B5CF6"
    }
  ]
}
```

## Testing

1. Start your development server
2. Navigate to the home page
3. Verify all 6 categories are displayed
4. Test hover effects
5. Click on each category to ensure navigation works
6. Test on mobile devices for responsiveness

## Troubleshooting

**Images not showing?**
- Check image paths in `public/assets/img/category/`
- Verify image names match exactly (case-sensitive)
- Check browser console for 404 errors

**Styles not applied?**
- Verify `src/app/globals.scss` imports the category styles
- Clear Next.js cache: `rm -rf .next`
- Restart development server

**Links not working?**
- Verify the fabric page route exists
- Check if category filtering is implemented in ShopArea component
- Test the URL manually: `/fabric?category=ethnic`

## Next Steps

1. Add your category images
2. Customize category names and links
3. Implement category filtering in the fabric page
4. Test on different devices
5. Optimize images for web (compress, convert to WebP)

## Support

If you need to modify the component further, the main files to edit are:
- Component logic: `src/components/category/CategoryShowcase.jsx`
- Styles: `src/styles/components/_category-showcase.scss`
- Data: `src/data/category-data.js`
