# Topic Page API - Deployment Troubleshooting Guide

## 🚨 Issue: Pages Work Locally But Not in Production

### Problem
- ✅ Local: All 6 pages show API data correctly
- ❌ Production: Only Home and Contact show data, other 4 pages don't

---

## 🔍 Root Causes & Solutions

### 1. **Build-Time vs Runtime Fetching**

**Problem**: Next.js generates static pages at build time. If the API isn't accessible during build, or if there's a network issue, the metadata will be empty.

**Solution**: Ensure API is accessible during build and use proper revalidation.

#### Check Your Build Logs
When you deploy, check the build logs for these messages:
```
[Topic Page API] Fetching data for page: home
[Topic Page API] Response status: 200
[Topic Page API] ✅ Found page data for: home
```

If you see errors like:
```
[Topic Page API] Failed to fetch topic pages: 500
[Topic Page API] ❌ Page not found: about
```

This means the API wasn't accessible during build.

---

### 2. **Vercel/Netlify Build Environment**

**Problem**: Build servers might have network restrictions or timeouts.

**Solutions**:

#### A. Add Environment Variables
Make sure these are set in your deployment platform:

```env
NEXT_PUBLIC_API_BASE_URL=https://espobackend.vercel.app/landing
NEXT_PUBLIC_SITE_URL=https://www.amrita-fashions.com
```

#### B. Increase Build Timeout
In `next.config.js`:
```javascript
module.exports = {
  // ... other config
  staticPageGenerationTimeout: 120, // 120 seconds
}
```

#### C. Use ISR (Incremental Static Regeneration)
Already implemented in fabric page. Add to other pages:

```javascript
// Add this to each page
export const revalidate = 60; // Revalidate every 60 seconds
```

---

### 3. **API Response Time**

**Problem**: API might be slow during build, causing timeouts.

**Solution**: Check API response time:

```bash
# Test API speed
curl -w "@curl-format.txt" -o /dev/null -s "https://espobackend.vercel.app/api/topicpage"
```

Create `curl-format.txt`:
```
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

If `time_total` > 5 seconds, your API is too slow.

---

### 4. **Caching Issues**

**Problem**: Old cached data is being served.

**Solutions**:

#### A. Clear Deployment Cache
**Vercel**:
```bash
vercel --force
```

**Netlify**:
- Go to Site Settings → Build & Deploy → Clear cache and deploy site

#### B. Force Revalidation
Add this to your pages:
```javascript
export const revalidate = 0; // Disable cache temporarily for testing
```

After confirming it works, change back to:
```javascript
export const revalidate = 60; // Revalidate every 60 seconds
```

---

### 5. **CORS Issues**

**Problem**: API might block requests from build server.

**Check**: Look for CORS errors in build logs:
```
Access to fetch at 'https://espobackend.vercel.app/api/topicpage' 
from origin 'https://vercel.com' has been blocked by CORS policy
```

**Solution**: Ensure your API allows requests from build servers.

---

## ✅ Recommended Deployment Steps

### Step 1: Add ISR to All Pages

Add this export to each page file:

**src/app/page.jsx** (Home):
```javascript
export const revalidate = 60;
```

**src/app/about/page.jsx**:
```javascript
export const revalidate = 60;
```

**src/app/capabilities/page.jsx**:
```javascript
export const revalidate = 60;
```

**src/app/blog/page.jsx**:
```javascript
export const revalidate = 60;
```

**src/app/contact/page.jsx**:
```javascript
export const revalidate = 60;
```

**src/app/fabric/page.jsx** (Already has it):
```javascript
export const revalidate = 120; // Already set
```

---

### Step 2: Update next.config.js

Add these settings:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  
  // Increase timeout for API calls during build
  staticPageGenerationTimeout: 120,
  
  // Ensure external API is accessible
  experimental: {
    // Allow external API calls during build
  },
}

module.exports = nextConfig;
```

---

### Step 3: Test Build Locally

Before deploying, test the production build locally:

```bash
# Clean everything
rm -rf .next
rm -rf node_modules/.cache

# Install fresh
npm install

# Build for production
npm run build

# Check build output for errors
# Look for: [Topic Page API] messages

# Test production build
npm start

# Visit each page and check meta tags
```

---

### Step 4: Deploy with Verbose Logging

Keep the enhanced logging in `topicPageSeoIntegration.js` for the first deployment to see what's happening:

```javascript
console.log('[Topic Page API] Fetching data for page:', pageName);
console.log('[Topic Page API] Response status:', response.status);
console.log('[Topic Page API] ✅ Found page data for:', pageName);
```

After confirming it works, you can remove or reduce logging.

---

### Step 5: Verify After Deployment

#### A. Check Build Logs
Look for these patterns in your deployment logs:

✅ **Success Pattern**:
```
[Topic Page API] Fetching data for page: home
[Topic Page API] Response status: 200
[Topic Page API] Active pages found: 6
[Topic Page API] ✅ Found page data for: home
```

❌ **Failure Pattern**:
```
[Topic Page API] Failed to fetch topic pages: 500
[Topic Page API] ❌ Page not found: about
```

#### B. Check Page Source
Visit each page and view source:

```bash
# Home
curl https://www.amrita-fashions.com/ | grep "home meta title"

# About
curl https://www.amrita-fashions.com/about | grep "about meta title"

# Capabilities
curl https://www.amrita-fashions.com/capabilities | grep "capabilities meta title"

# Blog
curl https://www.amrita-fashions.com/blog | grep "blog meta title"

# Fabric
curl https://www.amrita-fashions.com/fabric | grep "meta fabric title"

# Contact
curl https://www.amrita-fashions.com/contact | grep "contact us meta title"
```

---

## 🔧 Quick Fixes

### Fix 1: Force Rebuild All Pages

Add this to `next.config.js`:
```javascript
module.exports = {
  // Force all pages to be dynamic
  experimental: {
    isrMemoryCacheSize: 0, // Disable ISR cache
  },
}
```

### Fix 2: Use Dynamic Rendering

If static generation keeps failing, switch to dynamic rendering for problematic pages:

```javascript
// Add to top of page file
export const dynamic = 'force-dynamic';
```

### Fix 3: Add Fallback Data

Temporarily add fallback data while debugging:

```javascript
export async function generateMetadata() {
  const topicMetadata = await getPageSeoMetadata(PAGE_NAMES.ABOUT, {
    title: "About Us - Fallback Title", // Temporary fallback
    description: "About page description", // Temporary fallback
    keywords: "about, company", // Temporary fallback
  });
  
  // ... rest of code
}
```

If you see the fallback data in production, it means the API call is failing.

---

## 📊 Debugging Checklist

- [ ] API is accessible from build server
- [ ] Environment variables are set correctly
- [ ] Build logs show successful API calls
- [ ] No CORS errors in build logs
- [ ] API response time < 5 seconds
- [ ] ISR revalidate is set on all pages
- [ ] Build timeout is sufficient (120s)
- [ ] Cache is cleared before deployment
- [ ] Page source shows correct meta tags
- [ ] All 6 pages return 200 status code

---

## 🚀 Recommended Configuration

### Final Configuration for All Pages:

```javascript
// Add to each page file
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata() {
  const topicMetadata = await getPageSeoMetadata(PAGE_NAMES.XXX, {
    title: null,
    description: null,
    keywords: null,
  });

  const canonicalFromApi = topicMetadata.alternates?.canonical || null;

  return generateSEOMetadata({
    title: topicMetadata.title,
    description: topicMetadata.description,
    keywords: topicMetadata.keywords,
    path: "/xxx",
    canonicalOverride: canonicalFromApi,
    ogImage: "/assets/img/logo/logo.svg",
    robots: "index, follow"
  });
}
```

---

## 📞 Still Not Working?

If pages still don't show data after trying all solutions:

1. **Check API directly during build**:
   - Add a test endpoint that logs all API calls
   - Verify the API is actually being called

2. **Use static data temporarily**:
   - Create a local JSON file with topic page data
   - Import and use it as fallback during build

3. **Contact your hosting provider**:
   - Ask if there are network restrictions
   - Check if external API calls are blocked

4. **Enable verbose logging**:
   - Keep all console.log statements
   - Check deployment logs for patterns

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Build logs show successful API calls for all 6 pages
2. ✅ Page source shows correct meta titles from API
3. ✅ OpenGraph tags show excerpt field
4. ✅ Canonical URLs match API data
5. ✅ Keywords are populated from API
6. ✅ No fallback data is being used
