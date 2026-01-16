# Practical Optimization Examples for Your Codebase

## Real Examples from Your App

### 1. Icon Library Optimization (Tree-Shaking)

#### ❌ Before (Loads Entire Library)
```javascript
import * as Icons from 'react-icons/fa';

function MyComponent() {
  return <Icons.FaShoppingCart />;
}
// Result: Entire react-icons/fa library (~500 KB) loaded
```

#### ✅ After (Loads Only What's Needed)
```javascript
import { FaShoppingCart } from 'react-icons/fa';

function MyComponent() {
  return <FaShoppingCart />;
}
// Result: Only FaShoppingCart (~2 KB) loaded
// Savings: 498 KB (99.6% reduction)
```

**Your config automatically handles this:**
```javascript
// next.config.js
modularizeImports: {
  'react-icons': {
    transform: 'react-icons/{{member}}',
  },
}
```

---

### 2. Image Optimization

#### ❌ Before (No Optimization)
```jsx
// src/components/products/fashion/product-item.jsx
<img 
  src={product.image} 
  alt={product.title}
  style={{ width: '300px', height: '300px' }}
/>
// Result: Original image size (e.g., 500 KB JPEG)
```

#### ✅ After (Automatic Optimization)
```jsx
import Image from 'next/image';

<Image 
  src={product.image} 
  alt={product.title}
  width={300}
  height={300}
  loading="lazy"
/>
// Result: WebP/AVIF format (~150 KB), lazy loaded
// Savings: 350 KB (70% reduction) + lazy loading
```

---

### 3. Heavy Component Lazy Loading

#### ❌ Before (Loads Immediately)
```jsx
// src/app/shop/page.jsx
import ShopArea from '@/components/shop/shop-area';
import EnhancedShopSidebarFilters from '@/components/shop/EnhancedShopSidebarFilters';

function ShopPage() {
  return (
    <>
      <ShopArea />
      <EnhancedShopSidebarFilters />
    </>
  );
}
// Result: All components loaded upfront, even if not visible
```

#### ✅ After (Lazy Load Below-the-Fold)
```jsx
import dynamic from 'next/dynamic';
import ShopArea from '@/components/shop/shop-area';

// Lazy load sidebar (not immediately visible)
const EnhancedShopSidebarFilters = dynamic(
  () => import('@/components/shop/EnhancedShopSidebarFilters'),
  { 
    loading: () => <div>Loading filters...</div>,
    ssr: false // Don't render on server if not needed
  }
);

function ShopPage() {
  return (
    <>
      <ShopArea />
      <EnhancedShopSidebarFilters />
    </>
  );
}
// Result: Sidebar code loaded only when needed
// Savings: ~50 KB initial bundle reduction
```

---

### 4. Third-Party Script Optimization

#### ❌ Before (Blocks Page Load)
```jsx
// src/app/layout.jsx
<script src="https://www.googletagmanager.com/gtag/js" />
// Result: Blocks page rendering until script loads
```

#### ✅ After (Lazy Load)
```jsx
import Script from 'next/script';

<Script 
  src="https://www.googletagmanager.com/gtag/js" 
  strategy="lazyOnload" // Loads after page is interactive
/>
// Result: Page loads immediately, analytics loads later
// Improvement: 1-2 seconds faster First Contentful Paint
```

---

### 5. CSS Optimization (Your Actual Styles)

#### ❌ Before (All CSS Loaded)
```scss
// src/app/globals.scss - 200 KB
.btn-primary { ... }
.btn-secondary { ... }
.btn-danger { ... }
// ... 1000+ more classes
```

#### ✅ After (Only Used Classes)
```scss
// Production build - 20 KB
.btn-primary { ... } // Used in your app
.container { ... }   // Used in your app
// Unused classes automatically removed
// Savings: 180 KB (90% reduction)
```

**Your PostCSS config handles this:**
```javascript
// postcss.config.js
'@fullhuman/postcss-purgecss': {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: {
    standard: [/^slick-/, /^swiper-/], // Keep carousel classes
  },
}
```

---

### 6. Redux Store Optimization

#### ❌ Before (Import Entire Store)
```javascript
import { store } from '@/redux/store';
import { useSelector } from 'react-redux';

// Entire Redux store loaded even if only using one slice
```

#### ✅ After (Selective Imports)
```javascript
// src/redux/features/newProductApi.js
import { createApi } from '@reduxjs/toolkit/query/react';

// Only import what you need
export const productApi = createApi({
  reducerPath: 'productApi',
  // ... config
});

// In components, import only specific hooks
import { useGetProductsQuery } from '@/redux/features/newProductApi';
// Result: Tree-shaking removes unused Redux code
```

---

### 7. Lodash/Utility Library Optimization

#### ❌ Before (Entire Library)
```javascript
import _ from 'lodash';

const debounced = _.debounce(fn, 300);
// Result: Entire lodash library (~70 KB) loaded
```

#### ✅ After (Specific Function)
```javascript
import debounce from 'lodash/debounce';

const debounced = debounce(fn, 300);
// Result: Only debounce function (~2 KB) loaded
// Savings: 68 KB (97% reduction)
```

---

### 8. Conditional Component Loading

#### ❌ Before (Always Loaded)
```jsx
// src/components/Chatbot.tsx
import Chatbot from 'react-simple-chatbot';

function MyChatbot() {
  return <Chatbot steps={steps} />;
}
// Result: Chatbot library always loaded (~100 KB)
```

#### ✅ After (Load on User Action)
```jsx
import { useState } from 'react';
import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('react-simple-chatbot'), {
  ssr: false,
  loading: () => <div>Loading chat...</div>
});

function MyChatbot() {
  const [showChat, setShowChat] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowChat(true)}>Open Chat</button>
      {showChat && <Chatbot steps={steps} />}
    </>
  );
}
// Result: Chatbot loaded only when user clicks button
// Savings: 100 KB initial bundle reduction
```

---

### 9. Font Optimization

#### ❌ Before (Multiple Font Files)
```css
/* public/assets/fonts/ - Multiple formats */
@font-face {
  font-family: 'Jost';
  src: url('/assets/fonts/jost/Jost-Regular.ttf');
  src: url('/assets/fonts/jost/Jost-Regular.woff');
  src: url('/assets/fonts/jost/Jost-Regular.woff2');
}
// Result: Browser downloads all formats
```

#### ✅ After (Next.js Font Optimization)
```jsx
// src/app/layout.jsx
import { Jost } from 'next/font/google';

const jost = Jost({ 
  subsets: ['latin'],
  display: 'swap', // Prevents invisible text
  preload: true
});

export default function RootLayout({ children }) {
  return (
    <html className={jost.className}>
      <body>{children}</body>
    </html>
  );
}
// Result: Optimal font format, preloaded, self-hosted
// Improvement: Faster font loading, no layout shift
```

---

### 10. API Response Optimization

#### ❌ Before (Large Response)
```javascript
// Fetching all product data
const products = await fetch('/api/products');
// Result: 500 KB response with all fields
```

#### ✅ After (Selective Fields)
```javascript
// src/redux/features/newProductApi.js
export const productApi = createApi({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: '/products',
        params: {
          fields: 'id,title,price,image', // Only needed fields
        }
      }),
    }),
  }),
});
// Result: 100 KB response with only needed fields
// Savings: 400 KB (80% reduction)
```

---

## 🎯 Quick Wins for Your App

### High Impact (Do First)
1. ✅ Replace all `<img>` with `<Image>` from next/image
2. ✅ Use dynamic imports for heavy components (Chatbot, PDF renderer)
3. ✅ Import specific functions from lodash/react-icons
4. ✅ Lazy load below-the-fold content

### Medium Impact
5. ✅ Use Next.js font optimization
6. ✅ Lazy load third-party scripts
7. ✅ Optimize API responses (selective fields)

### Low Impact (Nice to Have)
8. ✅ Code split Redux slices
9. ✅ Optimize SVG icons
10. ✅ Use CSS modules for component-specific styles

---

## 📊 Expected Results for Your App

| Component | Before | After | Savings |
|-----------|--------|-------|---------|
| Icons | 500 KB | 10 KB | 98% |
| Images | 2 MB | 600 KB | 70% |
| CSS | 200 KB | 20 KB | 90% |
| Chatbot | 100 KB | 0 KB* | 100%* |
| Fonts | 300 KB | 150 KB | 50% |
| **Total** | **3.1 MB** | **780 KB** | **75%** |

*Loaded on-demand

---

## 🚀 Implementation Checklist

- [x] Tree-shaking configured (next.config.js)
- [x] CSS purging enabled (postcss.config.js)
- [x] Minification enabled (next.config.js)
- [x] Code splitting configured (webpack)
- [ ] Replace `<img>` with `<Image>` (manual)
- [ ] Add dynamic imports for heavy components (manual)
- [ ] Optimize font loading (manual)
- [ ] Lazy load third-party scripts (manual)

---

**Next Step:** Run `npm run build:analyze` to see your current bundle composition!
