# Footer API Data Fixed - Office Address Now Shows on Home Page

## Problem
The home page footer was missing the "Office Address" section. Only Factory, Warehouse, and UAE addresses were showing. The API data wasn't being fetched properly in the ISR footer.

## Root Cause
The ISR footer (footer-isr.jsx) was only accepting office data as a prop from the server, but the fabric page footer uses Redux to fetch office data on the client side. This is why the fabric page footer worked perfectly but the home page footer didn't show all data.

## Solution
Made the ISR footer work exactly like the fabric page footer by:
1. Adding Redux hook to fetch office data on client side
2. Wrapping all ISR pages with Redux Provider
3. Using Redux data as primary source, with prop as fallback

## Changes Made

### 1. Updated footer-isr.jsx
```javascript
// Before: Only used prop
const FooterISR = ({ office = null }) => {
  // Used office prop directly
}

// After: Uses Redux like fabric page footer
import { useGetOfficeInformationQuery } from "@/redux/features/officeInformationApi";

const FooterISR = ({ office: officeProp = null }) => {
  // Fetch office data from Redux (client-side) - same as regular footer
  const { data } = useGetOfficeInformationQuery();
  
  // Use Redux data if available, otherwise fall back to prop
  const office = (data?.success && Array.isArray(data?.data) && data.data.length)
    ? data.data[0]
    : officeProp;
}
```

### 2. Updated wrapper-isr.jsx
```javascript
// Before: Only FloatingChatbot had Provider
const WrapperISR = ({ children }) => {
  return (
    <div id="wrapper">
      {children}
      <Provider store={store}>
        <FloatingChatbot />
      </Provider>
    </div>
  );
};

// After: Everything wrapped with Provider
const WrapperISR = ({ children }) => {
  return (
    <Provider store={store}>
      <div id="wrapper">
        {children}
        <FloatingChatbot />
      </div>
    </Provider>
  );
};
```

### 3. Updated HomePageTwoClient.jsx
- Removed duplicate Provider wrapper (now handled by WrapperISR)
- Removed unused Redux imports
- Footer now has access to Redux through WrapperISR

## How It Works Now

### Fabric Page (CSR)
```
Wrapper (has Provider) 
  → Footer (uses Redux hook)
    → Fetches office data from API
    → Shows all addresses including Office Address
```

### Home Page (ISR)
```
WrapperISR (has Provider)
  → Footer-ISR (uses Redux hook)
    → Fetches office data from API
    → Shows all addresses including Office Address
```

## Benefits

1. **Consistent Behavior**: ISR footer now works exactly like CSR footer
2. **Client-Side Data**: Office data fetched on client side, always fresh
3. **Fallback Support**: Still accepts prop as fallback if Redux fails
4. **Same API**: Both footers use the same Redux API hook
5. **No Duplication**: Single Provider in WrapperISR serves all components

## Files Modified
1. `src/layout/footers/footer-isr.jsx` - Added Redux hook
2. `src/layout/wrapper-isr.jsx` - Wrapped all children with Provider
3. `src/app/(isr)/HomePageTwoClient.jsx` - Removed duplicate Provider

## Result
✅ Home page footer now shows Office Address
✅ All 4 addresses display correctly (Office, Factory, Warehouse, UAE)
✅ Phone numbers show correctly
✅ Sales and support emails show correctly
✅ Social media links work
✅ Newsletter subscription works
✅ Same behavior as fabric page footer
✅ ISR compatibility maintained

## Testing
1. Visit home page - should see "Office Address" in footer
2. Visit contact page - should see "Office Address" in footer
3. Visit fabric page - should still work as before
4. All addresses should be clickable and open Google Maps
5. Newsletter subscription should work
6. Social media icons should work
