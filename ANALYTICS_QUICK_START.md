# Analytics Quick Start Guide

## ✅ What's Already Working

Your analytics system is fully set up and tracking:

1. **Page Views** - Automatic on every route change
2. **Scroll Depth** - Tracks 25%, 50%, 75%, 100% scroll
3. **User Login** - Email, OTP, and Google OAuth
4. **User Registration** - Email signup
5. **Add to Cart** - When products are added
6. **Remove from Cart** - When products are removed
7. **PDF Downloads** - Product catalog downloads

## 🚀 Quick Implementation Examples

### Track Product Views
```javascript
import { trackProductView } from '@/utils/analytics';

// In your product detail page
trackProductView(product);
```

### Track Search
```javascript
import { trackSearch } from '@/utils/analytics';

trackSearch(searchQuery);
```

### Track Wishlist
```javascript
import { trackAddToWishlist } from '@/utils/analytics';

trackAddToWishlist(product);
```

### Track Checkout
```javascript
import { trackBeginCheckout, trackPurchase } from '@/utils/analytics';

// Start checkout
trackBeginCheckout(cartItems, totalValue);

// Complete order
trackPurchase(orderId, totalValue, items);
```

### Track Button Clicks
```javascript
import { trackButtonClick } from '@/utils/analytics';

trackButtonClick('Contact Us', 'Header');
```

### Track Custom Events
```javascript
import { trackEvent } from '@/utils/analytics';

trackEvent('custom_event_name', {
  param1: 'value1',
  param2: 'value2'
});
```

## 📊 View Your Data

### Google Analytics
- URL: https://analytics.google.com/
- Go to: Reports > Engagement > Events
- Real-time: Reports > Realtime

### Microsoft Clarity
- URL: https://clarity.microsoft.com/
- View: Heatmaps, Session Recordings, Dashboard

## 🔧 Environment Setup

Make sure these are in your `.env`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

## 📝 Files Created

1. `src/utils/analytics.js` - Main analytics utility
2. `src/hooks/useAnalytics.js` - React hooks for automatic tracking
3. `src/components/analytics/AnalyticsTracker.jsx` - Auto-tracking component
4. `ANALYTICS_IMPLEMENTATION_GUIDE.md` - Full documentation

## ✨ That's It!

Your analytics are now tracking user activity automatically. Add more tracking as needed using the examples above.

For detailed documentation, see `ANALYTICS_IMPLEMENTATION_GUIDE.md`.
