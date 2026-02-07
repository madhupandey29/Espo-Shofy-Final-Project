# 📍 Where is Collection ItemList JSON-LD Located?

## 🎯 Quick Answer

Your **Collection ItemList JSON-LD** appears on:

### ✅ **FABRIC DETAIL PAGES ONLY**

**URL Pattern**: `https://your-site.com/fabric/[product-slug]`

**Examples**:
- `https://your-site.com/fabric/nokia-red-fabric`
- `https://your-site.com/fabric/majestica-blue-fabric`
- `https://your-site.com/fabric/any-product-slug`

---

## 📂 File Location

### **Implementation File**:
```
src/app/fabric/[slug]/page.jsx
```

**Line 232-236**:
```jsx
<CollectionItemListJsonLd 
  products={collectionProducts} 
  currentProduct={product}
  collectionData={product?.collection}
/>
```

### **Utility File**:
```
src/utils/collectionItemListStructuredData.js
```

---

## 🔍 Detailed Breakdown

### **1. Page Structure**

```
src/app/fabric/[slug]/page.jsx
│
├─ Server-Side Functions
│  ├─ getProductBySlug(slug)          ← Fetches current product
│  ├─ getWebsiteFaqs()                ← Fetches FAQs
│  └─ getCollectionProducts(collectionId) ← Fetches collection products
│
└─ Page Component (Line 207-256)
   │
   ├─ Structured Data (Rendered in <head>)
   │  ├─ <ProductStructuredDataHead />     ← Product JSON-LD
   │  ├─ <BreadcrumbJsonLd />              ← Breadcrumb JSON-LD
   │  ├─ <FaqJsonLd />                     ← FAQ JSON-LD
   │  └─ <CollectionItemListJsonLd />      ← 🎯 COLLECTION JSON-LD (Line 232)
   │
   └─ Page Content
      └─ <ProductClient />
         └─ Shows Mix & Match UI
```

---

## 🌐 Where It Appears

### **Pages That HAVE Collection JSON-LD**:

✅ **Fabric Detail Pages**
- `/fabric/nokia-red-fabric`
- `/fabric/majestica-blue-fabric`
- `/fabric/[any-product-slug]`

**Condition**: Only if the product has a `collectionId` AND the collection has products.

### **Pages That DON'T HAVE Collection JSON-LD**:

❌ **Home Page** (`/`)
❌ **Shop/Fabric Listing** (`/fabric`)
❌ **About Page** (`/about`)
❌ **Contact Page** (`/contact`)
❌ **Blog Pages** (`/blog`, `/blog-details/[id]`)
❌ **Cart/Checkout** (`/cart`, `/checkout`)
❌ **Other Pages**

---

## 🔄 How It Works

### **Step-by-Step Flow**:

```
1. User visits: /fabric/nokia-red-fabric
           ↓
2. Server fetches current product
           ↓
3. Extracts collectionId from product
           ↓
4. Fetches all products with same collectionId
           ↓
5. Generates Collection JSON-LD
           ↓
6. Renders in <head> section
           ↓
7. Search engines see the structured data
```

### **Code Flow**:

```javascript
// src/app/fabric/[slug]/page.jsx (Line 207-236)

export default async function Page({ params }) {
  const { slug } = params;

  try {
    // 1. Fetch current product
    const product = await getProductBySlug(slug);
    
    // 2. Get collection ID
    const collectionId = product?.collectionId || 
                        product?.collection?.id || 
                        product?.collection?._id || 
                        product?.collection || 
                        null;
    
    // 3. Fetch collection products
    const collectionProducts = collectionId 
      ? await getCollectionProducts(collectionId) 
      : [];
    
    // 4. Render JSON-LD
    return (
      <>
        <CollectionItemListJsonLd 
          products={collectionProducts}        ← Products from same collection
          currentProduct={product}             ← Current product being viewed
          collectionData={product?.collection} ← Collection metadata
        />
        
        <Wrapper>
          <ProductClient slug={slug} />
        </Wrapper>
      </>
    );
  } catch (error) {
    // Error handling...
  }
}
```

---

## 🧪 How to Verify

### **Method 1: View Page Source**

1. Visit any fabric page: `https://your-site.com/fabric/[product-slug]`
2. Right-click → "View Page Source"
3. Search for: `"@type": "CollectionPage"`
4. You'll find it in a `<script type="application/ld+json">` tag

### **Method 2: Browser DevTools**

```javascript
// Open Console on fabric page
const scripts = document.querySelectorAll('script[type="application/ld+json"]');
scripts.forEach((script, i) => {
  const data = JSON.parse(script.textContent);
  if (data['@type'] === 'CollectionPage') {
    console.log('Found Collection JSON-LD:', data);
  }
});
```

### **Method 3: Check Network Tab**

1. Open DevTools → Network tab
2. Visit a fabric page
3. Look at the HTML response
4. Search for `CollectionPage` in the HTML

---

## 📊 When It Appears vs When It Doesn't

### **Appears When**:

✅ Page is a fabric detail page (`/fabric/[slug]`)
✅ Product has a `collectionId`
✅ Collection has at least 1 product
✅ Products have valid `productTitle` and `productslug`

### **Doesn't Appear When**:

❌ Page is NOT a fabric detail page
❌ Product has NO `collectionId`
❌ Collection has 0 products
❌ API fetch fails
❌ Products missing required fields

---

## 🗺️ Site Map

```
Your Website
│
├─ Home (/)                              ← NO Collection JSON-LD
├─ About (/about)                        ← NO Collection JSON-LD
├─ Contact (/contact)                    ← NO Collection JSON-LD
│
├─ Fabric Listing (/fabric)              ← NO Collection JSON-LD
│
└─ Fabric Details (/fabric/[slug])       ← ✅ HAS Collection JSON-LD
   ├─ /fabric/nokia-red-fabric           ← ✅ YES
   ├─ /fabric/majestica-blue-fabric      ← ✅ YES
   └─ /fabric/any-product-slug           ← ✅ YES (if has collection)
```

---

## 📝 Summary

**Your Collection ItemList JSON-LD is located ONLY on**:

🎯 **Fabric Detail Pages** (`/fabric/[product-slug]`)

**File**: `src/app/fabric/[slug]/page.jsx` (Line 232-236)

**Condition**: Product must have a collection with products

**Purpose**: Shows related products (Mix & Match) for SEO

**Visibility**: Search engines only (in `<head>` section)

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `src/app/fabric/[slug]/page.jsx` | Main page that renders JSON-LD |
| `src/utils/collectionItemListStructuredData.js` | Generates the JSON-LD |
| `src/components/product-details/related-products.jsx` | UI display (Mix & Match section) |
| `src/redux/features/newProductApi.js` | API queries for products |

---

## ✨ Quick Test

Want to see it right now?

1. Visit: `https://your-site.com/fabric/[any-product-slug]`
2. Press `Ctrl+U` (or `Cmd+U` on Mac) to view source
3. Press `Ctrl+F` (or `Cmd+F`) and search: `CollectionPage`
4. You'll see the JSON-LD! 🎉

---

**That's it!** Your Collection JSON-LD lives exclusively on fabric detail pages. 🚀
