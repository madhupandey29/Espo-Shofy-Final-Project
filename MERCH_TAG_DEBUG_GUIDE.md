# MerchTag Filtering Debug Guide

## Current Issue Analysis

### Problem:
- API has 123 total products
- Shop page shows 50 products 
- All products have empty `merchTags: []` arrays
- Filter is set to `NEXT_PUBLIC_MERCH_TAG_FILTER=E-catalogue`
- Result: 0 products should match, but 50 are showing

### Root Cause:
1. **Empty MerchTags**: Your API products have `"merchTags": []` (empty arrays)
2. **API Limit**: Previously fetching only 50 products out of 123 total
3. **Filter Logic**: Working correctly - filtering out products without required tag

## Solutions

### Option 1: Disable Filtering (Show All Products)
```env
# Comment out or remove this line in .env.local
# NEXT_PUBLIC_MERCH_TAG_FILTER=E-catalogue
```

### Option 2: Add MerchTags to Your API Products
Update your products in the API to include proper merchTags:
```json
{
  "id": "695fa90e82b1eba51",
  "name": "Majestica-767",
  "merchTags": ["E-catalogue", "Premium"],  // ← Add this
  // ... other fields
}
```

### Option 3: Use Different Filter Field
If you want to filter by a different field that has values, update the filtering logic.

## Current Implementation Status

### ✅ Fixed:
- Removed visual filter indicator strip
- Increased API fetch limit to 200 products
- Added detailed debug logging
- Better handling of empty merchTags arrays

### 🔍 Debug Information:
Check your browser console for detailed filtering logs:
- `🔍 Filtering products by merchTag: "E-catalogue"`
- `📊 Total products before filtering: 200`
- `⚪ Product X - Empty merchTags array`
- `📈 Filtered results: 0 products out of 200 total`

## Recommended Next Steps

1. **Check Console Logs**: Open browser dev tools and check console for filtering details

2. **Verify API Data**: Check if your products actually have merchTags values:
   ```bash
   curl "https://espobackend.vercel.app/api/product?limit=5" | jq '.data[].merchTags'
   ```

3. **Choose Your Approach**:
   - **For Testing**: Disable filtering temporarily
   - **For Production**: Add proper merchTags to your API products

## Environment Variable Options

```env
# Show all products (no filtering)
# NEXT_PUBLIC_MERCH_TAG_FILTER=

# Filter by E-catalogue (requires products to have this tag)
NEXT_PUBLIC_MERCH_TAG_FILTER=E-catalogue

# Filter by any other tag
NEXT_PUBLIC_MERCH_TAG_FILTER=Premium
```

## API Product Structure Required

For filtering to work, products need:
```json
{
  "merchTags": ["E-catalogue", "Featured", "Premium"]  // Non-empty array
}
```

Not:
```json
{
  "merchTags": []  // Empty array - will be filtered out
}
```