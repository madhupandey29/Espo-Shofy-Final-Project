# Category Showcase - Debugging Guide

## Issue Fixed

The error "Failed to fetch categories" was happening because:
1. Client components can't directly access `process.env` variables
2. The API endpoint wasn't set up properly

## Solution Implemented

### 1. Created API Route
**File**: `src/app/api/categories/route.js`

This route:
- Runs on the server (has access to env variables)
- Fetches categories from your backend API
- Returns data to the client component
- Handles errors gracefully

### 2. Updated Component
**File**: `src/components/category/CategoryShowcase.jsx`

Changes:
- Now fetches from `/api/categories` instead of direct API call
- Added detailed console logging for debugging
- Better error handling
- Shows loading skeleton while fetching
- Hides section if no categories found

## How to Debug

### Step 1: Check Browser Console
Open browser console (F12) and look for these logs:
```
Fetching categories from /api/categories...
Categories response: { data: [...] }
Setting categories: X
```

### Step 2: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for request to `/api/categories`
5. Check the response

### Step 3: Check Server Terminal
Look for these logs in your terminal:
```
Fetching categories from: https://espobackend.vercel.app/api/category/view
Categories fetched successfully: X categories
```

## Common Issues & Solutions

### Issue 1: "Failed to fetch categories"
**Cause**: API endpoint not responding
**Solution**: 
1. Check if backend API is running
2. Verify URL: `https://espobackend.vercel.app/api/category/view`
3. Test in browser or Postman

### Issue 2: Component not showing
**Cause**: No categories returned from API
**Solution**:
1. Check browser console for logs
2. Verify API returns `{ data: [...] }` structure
3. Check if `data.data` is an array with items

### Issue 3: Images not loading
**Cause**: Invalid image URLs or missing images
**Solution**:
1. Check `category.image` field in API response
2. Verify image URLs are accessible
3. Add fallback image at `/public/assets/img/category/default.jpg`

## Testing Steps

### 1. Test API Route Directly
Visit in browser:
```
http://localhost:3000/api/categories
```

Should return:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Category Name",
      "slug": "category-slug",
      "image": "https://..."
    }
  ]
}
```

### 2. Test Backend API Directly
Visit in browser:
```
https://espobackend.vercel.app/api/category/view
```

Should return categories data.

### 3. Test Component
1. Visit home page: `http://localhost:3000`
2. Look for "SHOP BY CATEGORY" section
3. Should see category cards
4. Click a category
5. Should navigate to `/categories/[slug]`

## Expected API Response Structure

Your backend should return:
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-001",
      "name": "Woven Fabrics",
      "slug": "woven-fabrics",
      "image": "https://cdn.example.com/woven.jpg",
      "description": "Category description"
    },
    {
      "id": "cat-002",
      "name": "Knit Fabrics",
      "slug": "knit-fabrics",
      "image": "https://cdn.example.com/knit.jpg",
      "description": "Category description"
    }
  ]
}
```

## Console Logs to Check

### Browser Console (Client Side)
```
✅ Fetching categories from /api/categories...
✅ Categories response: { data: [...] }
✅ Setting categories: 2
```

### Server Terminal (Server Side)
```
✅ Fetching categories from: https://espobackend.vercel.app/api/category/view
✅ Categories fetched successfully: 2 categories
```

## Quick Fixes

### If API is down or slow:
The component will:
1. Show loading skeleton for a few seconds
2. Hide the section if no data received
3. Not break the page

### If you want to force show categories:
Add test data in `CategoryShowcase.jsx`:
```javascript
// Add after line 11
const [categories, setCategories] = useState([
  {
    id: '1',
    name: 'Woven Fabrics',
    slug: 'woven-fabrics',
    image: '/assets/img/category/default.jpg'
  }
]);
```

## Files to Check

1. **Component**: `src/components/category/CategoryShowcase.jsx`
2. **API Route**: `src/app/api/categories/route.js`
3. **Home Page**: `src/app/HomePageTwoClient.jsx`
4. **Styles**: `src/styles/components/_category-showcase.scss`
5. **Environment**: `.env` (check NEXT_PUBLIC_API_BASE_URL)

## Next Steps

1. **Restart Dev Server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear Cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check Logs**:
   - Browser console (F12)
   - Terminal where dev server is running

4. **Test API**:
   - Visit: `http://localhost:3000/api/categories`
   - Should see JSON response

5. **Test Home Page**:
   - Visit: `http://localhost:3000`
   - Look for category section
   - Check console for logs

## Success Indicators

✅ No errors in browser console
✅ No errors in server terminal
✅ Category section visible on home page
✅ Categories load from API
✅ Images display correctly
✅ Clicking category navigates to `/categories/[slug]`

## Still Having Issues?

1. Share the browser console output
2. Share the server terminal output
3. Share the response from `/api/categories`
4. Check if backend API is accessible
