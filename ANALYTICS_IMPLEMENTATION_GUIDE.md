# Analytics Implementation Guide

## Overview
This guide explains how to use the comprehensive event tracking system implemented for Google Analytics (GA4) and Microsoft Clarity.

## What's Been Implemented

### 1. Core Analytics Utility (`src/utils/analytics.js`)
A centralized utility that sends events to both GA4 and Clarity automatically.

### 2. Automatic Tracking (`src/hooks/useAnalytics.js`)
- **Page Views**: Automatically tracked on every route change
- **Scroll Depth**: Tracks when users scroll to 25%, 50%, 75%, and 100% of the page

### 3. Already Tracked Events

#### Authentication Events
- ✅ **Login** (Email, OTP, Google OAuth)
- ✅ **Registration** (Email signup)
- ✅ **Logout**

#### E-commerce Events
- ✅ **Add to Cart**
- ✅ **Remove from Cart**
- ✅ **PDF Downloads** (Product catalogs)

#### User Behavior
- ✅ **Page Views** (automatic)
- ✅ **Scroll Depth** (automatic at 25%, 50%, 75%, 100%)

## How to Add More Tracking

### Example 1: Track Product Views
```javascript
import { trackProductView } from '@/utils/analytics';

// In your product detail component
useEffect(() => {
  if (product) {
    trackProductView(product);
  }
}, [product]);
```

### Example 2: Track Search
```javascript
import { trackSearch } from '@/utils/analytics';

const handleSearch = (searchTerm) => {
  trackSearch(searchTerm);
  // ... rest of your search logic
};
```

### Example 3: Track Add to Wishlist
```javascript
import { trackAddToWishlist } from '@/utils/analytics';

const handleAddToWishlist = (product) => {
  trackAddToWishlist(product);
  // ... rest of your wishlist logic
};
```

### Example 4: Track Button Clicks
```javascript
import { trackButtonClick } from '@/utils/analytics';

<button onClick={() => {
  trackButtonClick('Contact Us', 'Header');
  // ... rest of your logic
}}>
  Contact Us
</button>
```

### Example 5: Track Checkout
```javascript
import { trackBeginCheckout, trackPurchase } from '@/utils/analytics';

// When user starts checkout
const handleCheckout = () => {
  trackBeginCheckout(cartItems, totalValue);
  // ... rest of checkout logic
};

// When order is completed
const handleOrderComplete = (orderId, total, items) => {
  trackPurchase(orderId, total, items);
  // ... rest of order completion logic
};
```

### Example 6: Track Video Plays
```javascript
import { trackVideoPlay } from '@/utils/analytics';

<video onPlay={() => trackVideoPlay('Product Demo Video')}>
  {/* video content */}
</video>
```

### Example 7: Track Form Submissions
```javascript
import { trackFormSubmit } from '@/utils/analytics';

const handleSubmit = (e) => {
  e.preventDefault();
  trackFormSubmit('Contact Form');
  // ... rest of form logic
};
```

### Example 8: Track Errors
```javascript
import { trackError } from '@/utils/analytics';

try {
  // some operation
} catch (error) {
  trackError(error.message, 'Checkout Page');
  // ... error handling
}
```

## Available Tracking Functions

| Function | Purpose | Parameters |
|----------|---------|------------|
| `trackEvent` | Generic event tracking | `eventName`, `eventParams` |
| `trackPageView` | Track page views | `url`, `title` |
| `trackLogin` | Track user login | `method`, `userId` |
| `trackSignup` | Track user registration | `method` |
| `trackLogout` | Track user logout | none |
| `trackDownload` | Track file downloads | `fileName`, `fileType`, `productId` |
| `trackScrollDepth` | Track scroll depth | `percentage` |
| `trackProductView` | Track product views | `product` |
| `trackAddToCart` | Track add to cart | `product`, `quantity` |
| `trackRemoveFromCart` | Track remove from cart | `product` |
| `trackAddToWishlist` | Track add to wishlist | `product` |
| `trackSearch` | Track search queries | `searchTerm` |
| `trackBeginCheckout` | Track checkout start | `items`, `value` |
| `trackPurchase` | Track completed purchase | `orderId`, `value`, `items` |
| `trackButtonClick` | Track button clicks | `buttonName`, `location` |
| `trackFormSubmit` | Track form submissions | `formName` |
| `trackVideoPlay` | Track video plays | `videoTitle` |
| `trackError` | Track errors | `errorMessage`, `errorLocation` |
| `trackCustomAction` | Track custom events | `actionName`, `actionData` |

## Viewing Your Analytics Data

### Google Analytics (GA4)
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to **Reports** > **Engagement** > **Events**
4. You'll see all tracked events including:
   - `login` (with method: email/otp/google)
   - `sign_up`
   - `file_download`
   - `scroll` (with percent_scrolled)
   - `add_to_cart`
   - `remove_from_cart`
   - `page_view`
   - Custom events you add

### Microsoft Clarity
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Select your project
3. View:
   - **Heatmaps**: See where users click and scroll
   - **Session Recordings**: Watch actual user sessions
   - **Dashboard**: Overview of user behavior
   - **Events**: Custom events you've tracked

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

Or configure them in your SiteSettings API (they will be fetched automatically).

## Testing in Development

Events are logged to the console in development mode:
```
📊 Analytics Event: login { method: 'email', user_id: '12345' }
```

## Best Practices

1. **Track User Intent**: Focus on actions that indicate user interest (clicks, views, searches)
2. **E-commerce Funnel**: Track the complete journey (view → add to cart → checkout → purchase)
3. **Error Tracking**: Track errors to identify pain points
4. **Custom Events**: Use `trackCustomAction` for business-specific events
5. **Privacy**: Never track PII (personally identifiable information) in event parameters

## Common Use Cases

### Track Category Views
```javascript
import { trackEvent } from '@/utils/analytics';

trackEvent('view_category', {
  category_name: 'Fabrics',
  category_id: 'cat_123'
});
```

### Track Filter Usage
```javascript
import { trackEvent } from '@/utils/analytics';

trackEvent('filter_applied', {
  filter_type: 'price',
  filter_value: '100-500'
});
```

### Track Social Shares
```javascript
import { trackEvent } from '@/utils/analytics';

trackEvent('share', {
  method: 'facebook',
  content_type: 'product',
  item_id: product._id
});
```

### Track Newsletter Signup
```javascript
import { trackFormSubmit } from '@/utils/analytics';

trackFormSubmit('Newsletter Subscription');
```

## Troubleshooting

### Events Not Showing in GA4
1. Check that `NEXT_PUBLIC_GA_ID` is set correctly
2. Wait 24-48 hours for data to appear in reports
3. Use GA4 DebugView for real-time testing
4. Check browser console for errors

### Events Not Showing in Clarity
1. Check that `NEXT_PUBLIC_CLARITY_ID` is set correctly
2. Clarity data appears within minutes
3. Check that scripts are loading (Network tab in DevTools)

### Scripts Not Loading
1. Check Content Security Policy in `next.config.js`
2. Verify analytics domains are whitelisted
3. Check for ad blockers

## Next Steps

1. ✅ Analytics system is fully implemented
2. ✅ Automatic tracking is enabled (page views, scroll depth)
3. ✅ Key events are tracked (login, cart, downloads)
4. 🔄 Add more tracking as needed using the examples above
5. 🔄 Monitor your analytics dashboards regularly
6. 🔄 Use insights to improve user experience

## Support

For questions or issues:
1. Check this guide first
2. Review the code in `src/utils/analytics.js`
3. Test in development mode (check console logs)
4. Verify environment variables are set correctly
