# 🎯 Mobile Performance 80+ Action Plan

## Current Status: 45-60/100

## Critical Issues Identified:

### 1. ❌ Full Bootstrap CSS (176 KB)
**Impact:** -15-20 points
**Status:** Currently importing entire Bootstrap
**Fix:** Import only needed modules

### 2. ❌ Unused Dependency: react-modal-video
**Impact:** -5-10 points  
**Status:** Not used anywhere in codebase
**Fix:** Remove from package.json

### 3. ⚠️ Images using `<img>` tags
**Impact:** -10-15 points
**Status:** Found in multiple components
**Fix:** Replace with Next.js `<Image>` component

### 4. ⚠️ react-modal-video CSS imported but not used
**Impact:** -3-5 points
**Status:** Imported in globals.scss but package not used
**Fix:** Remove import

---

## 🚀 Implementation Plan (Priority Order)

### Phase 1: Quick Wins (30 minutes) - Expected +25-30 points

#### 1.1 Remove react-modal-video CSS import
**File:** `src/app/globals.scss`
**Change:** Remove line: `@import 'node_modules/react-modal-video/scss/modal-video.scss';`
**Impact:** +3-5 points

#### 1.2 Optimize Bootstrap imports
**File:** `src/app/globals.scss`
**Change:** Replace full Bootstrap with selective imports
**Impact:** +15-20 points

#### 1.3 Document dependency removal
**File:** `package.json`
**Note:** User needs to run: `npm uninstall react-modal-video`
**Impact:** +5-10 points (after user removes)

### Phase 2: Image Optimization (1 hour) - Expected +10-15 points

#### 2.1 Optimize header logo
**File:** `src/layout/headers/header-2.jsx`
**Priority:** HIGH (above-the-fold)

#### 2.2 Optimize profile images
**File:** `src/components/profile/UserProfile.jsx`
**Priority:** MEDIUM

#### 2.3 Optimize product detail images
**File:** `src/components/product-details/details-thumb-wrapper.jsx`
**Priority:** HIGH (critical for product pages)

---

## 📊 Expected Score Progression

| Phase | Changes | Expected Score | Time |
|-------|---------|---------------|------|
| Current | - | 45-60 | - |
| Phase 1.1 | Remove unused CSS | 50-65 | 5 min |
| Phase 1.2 | Optimize Bootstrap | 65-80 | 15 min |
| Phase 2 | Optimize images | 75-85 | 1 hour |

---

## ✅ Immediate Actions (Starting Now)

1. Remove react-modal-video CSS import
2. Optimize Bootstrap CSS imports
3. Create optimized image components
4. Test build and Lighthouse score

---

## 📝 User Actions Required

After I make the code changes, you need to:

```bash
# 1. Remove unused dependency
npm uninstall react-modal-video

# 2. Rebuild
npm run build

# 3. Test
npm start

# 4. Run Mobile Lighthouse
# - Open Chrome DevTools (F12)
# - Click "Lighthouse" tab
# - Select "Mobile"
# - Select "Performance" only
# - Click "Analyze page load"
```

---

## 🎯 Target Metrics

| Metric | Current | Target | Strategy |
|--------|---------|--------|----------|
| Performance Score | 45-60 | 80+ | Reduce CSS/JS, optimize images |
| Speed Index | 7.7s | <3.4s | Lazy loading, smaller bundles |
| Total Blocking Time | 580ms | <300ms | Remove unused code |
| First Contentful Paint | 3.5s | <1.8s | Critical CSS, async loading |
| Largest Contentful Paint | 5.5s | <2.5s | Image optimization |

---

## 🚀 Starting Implementation Now...
