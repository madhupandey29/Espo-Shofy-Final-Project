# Shared Data Source Fix - Popular & Top Rated Sections

## Problem Solved ✅

**Issue**: Popular and Top Rated sections were experiencing intermittent failures where one would work while the other failed, despite having identical logic.

**Root Cause**: Both sections were making separate API calls to the same unstable backend API (`https://espobackend.vercel.app/api`), causing cache conflicts and race conditions.

## Solution Implemented

### 1. **Shared Data Source**
- Created `getAllProductsForFiltering` endpoint that fetches all products once
- Both Popular and Top Rated sections now use the same data source
- Eliminates multiple API calls and cache conflicts

### 2. **Client-Side Filtering** 
- **Popular Products**: Filters shared data for products with BOTH `PopularFabrics` AND `ecatalogue` tags
- **Top Rated Products**: Filters shared data for products with BOTH `TopRatedFabrics` AND `ecatalogue` tags
- **No Logic Changes**: The dual tag filtering logic remains exactly the same

### 3. **Benefits**
- ✅ **Eliminates Cache Conflicts**: Only one API call instead of two separate calls
- ✅ **Better Performance**: Shared data is cached and reused
- ✅ **Consistent Results**: Both sections always have the same data availability
- ✅ **Preserved Logic**: All existing filtering logic remains unchanged
- ✅ **Better Error Handling**: Single point of failure instead of two

## Technical Implementation

### API Changes
```javascript
// New shared endpoint
getAllProductsForFiltering: builder.query({
  query: () => `/product/?limit=200&shared=true`,
  // Returns raw products for client-side filtering
})
```

### Component Changes
```javascript
// Popular Products
const { data: sharedData } = useGetAllProductsForFilteringQuery();
const data = React.useMemo(() => {
  // Filter for PopularFabrics AND ecatalogue
  return filterProducts(sharedData, ['PopularFabrics', 'ecatalogue']);
}, [sharedData]);

// Top Rated Products  
const { data: sharedData } = useGetAllProductsForFilteringQuery();
const products = React.useMemo(() => {
  // Filter for TopRatedFabrics AND ecatalogue
  return filterProducts(sharedData, ['TopRatedFabrics', 'ecatalogue']);
}, [sharedData]);
```

## Files Modified

1. **`src/redux/features/newProductApi.js`**
   - Added `getAllProductsForFiltering` endpoint
   - Added `useGetAllProductsForFilteringQuery` export

2. **`src/components/products/fashion/popular-products.jsx`**
   - Changed from `useGetPopularNewProductsQuery` to `useGetAllProductsForFilteringQuery`
   - Added client-side filtering with `React.useMemo`
   - Preserved all existing dual tag filtering logic

3. **`src/components/products/fashion/weeks-featured.jsx`**
   - Changed from `useGetTopRatedQuery` to `useGetAllProductsForFilteringQuery`
   - Added client-side filtering with `React.useMemo`
   - Preserved all existing dual tag filtering logic

## Expected Results

### ✅ When Backend API Works:
- Both Popular and Top Rated sections will show simultaneously
- No more "one works, other fails" scenarios
- Consistent filtering results
- Better performance due to shared caching

### ✅ When Backend API Fails:
- Both sections will show the same error message
- No inconsistent states between sections
- Graceful error handling maintained

## Testing

1. **Load Homepage**: Both sections should load together or fail together
2. **Refresh Page**: Consistent behavior across refreshes
3. **Network Issues**: Both sections handle errors gracefully
4. **Filtering Logic**: Products still filtered correctly by dual tags

The fix maintains all existing functionality while eliminating the cache conflicts that caused intermittent failures.