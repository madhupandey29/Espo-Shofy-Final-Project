# MerchTag Filtering Implementation

## Overview
Added filtering functionality to show only products with specific `merchTags` values in the shop page.

## Environment Variable Setup

Add this to your `.env.local` file:

```env
# MerchTag Filter - Only show products with this merchTag
NEXT_PUBLIC_MERCH_TAG_FILTER=E-catalogue
```

## How It Works

### 1. **API Response Structure**
Your API returns products with `merchTags` field:
```json
{
  "success": true,
  "data": [
    {
      "id": "695fa90e82b1eba51",
      "name": "Majestica-767",
      "merchTags": ["E-catalogue", "Premium"],  // ← This field is used for filtering
      // ... other fields
    }
  ]
}
```

### 2. **Filtering Logic**
- **Environment Variable**: `NEXT_PUBLIC_MERCH_TAG_FILTER=E-catalogue`
- **Filter Applied**: Only products where `merchTags` array contains "E-catalogue"
- **No Filter**: If env variable is not set, all products are shown

### 3. **Server-Side Filtering**
```javascript
// Filter products by merchTags if MERCH_TAG_FILTER is set
if (MERCH_TAG_FILTER && products.length > 0) {
  const filteredProducts = products.filter(product => {
    return product.merchTags && 
           Array.isArray(product.merchTags) && 
           product.merchTags.includes(MERCH_TAG_FILTER);
  });
}
```

## Configuration Options

### Show E-catalogue Products Only
```env
NEXT_PUBLIC_MERCH_TAG_FILTER=E-catalogue
```

### Show Premium Products Only
```env
NEXT_PUBLIC_MERCH_TAG_FILTER=Premium
```

### Show All Products (No Filter)
```env
# Comment out or remove the line
# NEXT_PUBLIC_MERCH_TAG_FILTER=E-catalogue
```

## Benefits

✅ **Environment-Based**: Easy to change filter without code changes  
✅ **Server-Side**: Filtering happens during build/SSR for better performance  
✅ **Flexible**: Can filter by any merchTag value  
✅ **Debug-Friendly**: Console logs show filtering process  
✅ **SEO-Friendly**: Filtered collection info in page title  

## Debug Information

The implementation includes console logs to help debug:
- Shows which merchTag filter is being applied
- Logs products that don't have required merchTag
- Shows total filtered vs original product count

## Visual Indicator

When filtering is active, users see:
```
Filtered Collection: Showing 25 products with merchTag "E-catalogue"
```

## API Requirements

For this to work, your products must have:
1. `merchTags` field as an array
2. Appropriate merchTag values in the array

Example product with correct structure:
```json
{
  "id": "123",
  "name": "Product Name",
  "merchTags": ["E-catalogue", "Featured"],  // ← Required
  // ... other fields
}
```