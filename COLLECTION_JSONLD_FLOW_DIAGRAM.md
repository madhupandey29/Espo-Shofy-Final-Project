# Collection ItemList JSON-LD - Flow Diagram

## 🔄 Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER VISITS FABRIC PAGE                       │
│              /fabric/nokia-red-fabric                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS SERVER-SIDE RENDERING                       │
│         (src/app/fabric/[slug]/page.jsx)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FETCH CURRENT PRODUCT                           │
│         API: /product?limit=150                                  │
│         Find product by slug: "nokia-red-fabric"                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              EXTRACT COLLECTION ID                               │
│         product.collectionId = "690a0e676132664ee"              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           FETCH COLLECTION PRODUCTS                              │
│         API: /product?limit=150                                  │
│         Filter by: collectionId === "690a0e676132664ee"         │
│         Result: 12 products found                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         GENERATE COLLECTION ITEMLIST JSON-LD                     │
│    (src/utils/collectionItemListStructuredData.js)             │
│                                                                  │
│    Input:                                                        │
│    - products: [12 products]                                     │
│    - currentProduct: Nokia Red Fabric                            │
│    - collectionData: Nokia Collection                            │
│                                                                  │
│    Process:                                                      │
│    1. Validate products array                                    │
│    2. Build itemListElement array                                │
│    3. Clean slugs (remove #)                                     │
│    4. Strip HTML from titles                                     │
│    5. Generate URLs with base URL                                │
│    6. Create CollectionPage structure                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              RENDER JSON-LD IN <HEAD>                            │
│    <script type="application/ld+json">                          │
│    {                                                             │
│      "@context": "https://schema.org",                          │
│      "@type": "CollectionPage",                                 │
│      "name": "Nokia Red Fabric - Related Fabrics",              │
│      "description": "Explore our curated collection...",        │
│      "url": "https://www.amrita-fashions.com/fabric/...",      │
│      "mainEntity": {                                             │
│        "@type": "ItemList",                                     │
│        "numberOfItems": 12,                                      │
│        "itemListElement": [...]                                  │
│      }                                                            │
│    }                                                             │
│    </script>                                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PAGE SENT TO BROWSER                            │
│         HTML includes JSON-LD in <head>                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              SEARCH ENGINE CRAWLERS                              │
│         Google, Bing, etc. read JSON-LD                         │
│         Understand product relationships                         │
│         May show rich results in search                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Decision Points

```
┌─────────────────────────────────────────────────────────────────┐
│                    DECISION TREE                                 │
└─────────────────────────────────────────────────────────────────┘

Product has collectionId?
    │
    ├─ YES ──► Fetch collection products
    │           │
    │           ├─ Products found? (> 0)
    │           │   │
    │           │   ├─ YES ──► Generate JSON-LD ✅
    │           │   │
    │           │   └─ NO ──► Return null (no JSON-LD)
    │           │
    │           └─ API Error ──► Return null (no JSON-LD)
    │
    └─ NO ──► Return null (no JSON-LD)
```

---

## 📊 Data Mapping

```
┌─────────────────────────────────────────────────────────────────┐
│              API RESPONSE → JSON-LD MAPPING                      │
└─────────────────────────────────────────────────────────────────┘

API Product Object:
{
  "id": "123",
  "productTitle": "Nokia Red Fabric",
  "productslug": "nokia-red-fabric",
  "collectionId": "690a0e676132664ee",
  "collection": {
    "name": "Nokia Collection",
    "description": "Premium Nokia fabrics..."
  }
}
                    ↓
                    ↓ TRANSFORM
                    ↓
JSON-LD Output:
{
  "@type": "CollectionPage",
  "name": "Nokia Collection",              ← collection.name
  "description": "Premium Nokia fabrics...", ← collection.description
  "url": "https://...fabric/nokia-red-fabric", ← NEXT_PUBLIC_BASE_URL + productslug
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,                      ← Array index + 1
        "url": "https://...fabric/...",    ← NEXT_PUBLIC_BASE_URL + productslug
        "name": "Product Title"             ← productTitle or name
      }
    ]
  }
}
```

---

## 🔧 Environment Variables Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              ENVIRONMENT VARIABLE RESOLUTION                     │
└─────────────────────────────────────────────────────────────────┘

getBaseUrl() function checks in order:

1. NEXT_PUBLIC_BASE_URL
   ├─ Set? ──► Use it ✅
   └─ Not set? ──► Check next
                    ↓
2. NEXT_PUBLIC_SITE_URL
   ├─ Set? ──► Remove trailing slash, use it ✅
   └─ Not set? ──► Use default
                    ↓
3. Default: "https://www.amrita-fashions.com" ✅

Result used for all URLs in JSON-LD:
- CollectionPage.url
- ItemList.itemListElement[].url
- isPartOf.@id
```

---

## 🎨 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                  COMPONENT STRUCTURE                             │
└─────────────────────────────────────────────────────────────────┘

Page Component (src/app/fabric/[slug]/page.jsx)
│
├─ Server-Side Functions
│  ├─ getProductBySlug(slug)
│  ├─ getWebsiteFaqs()
│  └─ getCollectionProducts(collectionId) ◄── NEW
│
├─ Structured Data Components
│  ├─ <ProductStructuredDataHead />
│  ├─ <BreadcrumbJsonLd />
│  ├─ <FaqJsonLd />
│  └─ <CollectionItemListJsonLd /> ◄── NEW
│      │
│      └─ Uses: generateCollectionItemListStructuredData()
│         from src/utils/collectionItemListStructuredData.js
│
└─ Page Content
   └─ <ProductClient />
      └─ <ProductDetailsArea />
         └─ <ProductDetailsContent />
            └─ <RelatedProducts /> ◄── UI Display (Mix & Match)
```

---

## 🔄 Client vs Server Rendering

```
┌─────────────────────────────────────────────────────────────────┐
│              RENDERING STRATEGY                                  │
└─────────────────────────────────────────────────────────────────┘

SERVER-SIDE (SEO-friendly):
├─ Fetch product data
├─ Fetch collection products
├─ Generate JSON-LD
└─ Render in <head> ✅ Crawlers see it immediately

CLIENT-SIDE (User experience):
├─ Fetch collection products (Redux)
├─ Display Mix & Match UI
└─ Interactive product cards

Both use the SAME data source (Product API)
But serve different purposes:
- Server: SEO (JSON-LD)
- Client: UX (Visual display)
```

---

## ✅ Validation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              VALIDATION CHECKPOINTS                              │
└─────────────────────────────────────────────────────────────────┘

1. Data Validation
   ├─ Products array not empty? ✓
   ├─ Each product has title? ✓
   ├─ Each product has slug? ✓
   └─ Valid URLs generated? ✓

2. Structure Validation
   ├─ @context = "https://schema.org"? ✓
   ├─ @type = "CollectionPage"? ✓
   ├─ mainEntity.@type = "ItemList"? ✓
   └─ itemListElement is array? ✓

3. Content Validation
   ├─ HTML stripped from text? ✓
   ├─ Slugs cleaned (no #)? ✓
   ├─ URLs properly formatted? ✓
   └─ numberOfItems matches count? ✓

4. SEO Validation
   ├─ Google Rich Results Test ✓
   ├─ Schema.org Validator ✓
   └─ Search Console monitoring ✓
```

---

## 🎉 Success Indicators

```
✅ JSON-LD appears in page source
✅ Google Rich Results Test passes
✅ Schema.org Validator shows no errors
✅ URLs are correct and accessible
✅ Product titles are clean (no HTML)
✅ Collection name is descriptive
✅ numberOfItems matches actual count
✅ All products have valid URLs
```

---

## 📝 Summary

This implementation:
- ✅ Fetches data server-side for SEO
- ✅ Uses Product API as single source of truth
- ✅ Generates valid Schema.org JSON-LD
- ✅ Handles missing data gracefully
- ✅ Uses environment variables for URLs
- ✅ Validates all data before rendering
- ✅ Follows Next.js best practices
- ✅ Ready for production use

**Result**: Better SEO, enhanced search results, improved product discovery! 🚀
