# 🗑️ Unused Code Removal Plan

## Analysis Results

### ✅ KEEP (Used):
- `/blog-grid` - Main blog listing page
- `/blog-details/[id]` - Blog detail page (linked from blog-grid)
- Blog components: `blog-grid/`, `blog-postox/` (sidebar)

### ❌ REMOVE (Unused):

#### 1. Unused Blog Pages:
- `/blog` - Not used (only link is in electronic blog component which isn't used)
- `/blog-details-2/[id]` - Not used (blog-grid links to blog-details, not blog-details-2)
- `/blog-list` - Not used (no links found)

#### 2. Unused Feature Pages:
- `/coupon` - Not used (no links found)

#### 3. Compare Feature:
- `/compare` - **KEEP** (linked from header)
- Note: Compare is linked in header, so we'll keep it

#### 4. Unused Blog Components:
- `src/components/blog/electronic/` - Not used in your build
- `src/components/blog/fashion/` - Not used (you use blog-grid)

---

## 📊 Expected Impact

### Bundle Size Reduction:
- Remove ~5-8 unused page routes
- Remove ~10-15 unused components
- **Expected savings:** 50-100 KB JavaScript

### Performance Impact:
- **+5-10 Lighthouse points**
- Faster build times
- Smaller vendor bundle
- Less code to parse/compile

---

## 🚀 Files to Delete

### App Routes (Pages):
```
src/app/blog/page.jsx
src/app/blog-details-2/
src/app/blog-details-2/[id]/
src/app/blog-list/
src/app/coupon/
```

### Blog Components:
```
src/components/blog/electronic/
src/components/blog/fashion/
```

### Coupon Components:
```
src/components/coupon/
```

---

## ⚠️ Important Notes

### DO NOT DELETE:
- `src/app/blog-grid/` - ✅ Used
- `src/app/blog-details/` - ✅ Used
- `src/components/blog/blog-grid/` - ✅ Used
- `src/components/blog/blog-postox/` - ✅ Used (sidebar)
- `src/app/compare/` - ✅ Used (linked in header)
- `src/components/compare/` - ✅ Used

---

## 🔧 Cleanup Steps

### Step 1: Delete Unused App Routes
### Step 2: Delete Unused Components
### Step 3: Update any imports (if needed)
### Step 4: Test build
### Step 5: Verify no broken links

---

Starting cleanup now...
