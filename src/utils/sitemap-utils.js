
export async function pingSearchEngines(sitemapUrl) {
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];
  await Promise.allSettled(
    searchEngines.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'GET' });
        return { url, status: response.status, success: response.ok };
      } catch (error) {
        return { url, status: 'error', success: false, error: error.message };
      }
    })
  );
 
}

export function getSitemapUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return `${baseUrl}/sitemap.xml`;
}


export function logSitemapStats(sitemapData) {
  const stats = {
    total: sitemapData.length,
    static: sitemapData.filter(item => {
      const path = item.url.split('/').pop() || '/';
      return ['/', 'shop', 'blog', 'cart', 'wishlist', 'login', 'contact', 'register', 'checkout', 'compare', 'search', 'profile', 'coupon', 'forgot'].includes(path) ||
             item.url.includes('/shop-') ||
             item.url.includes('/blog-grid') ||
             item.url.includes('/blog-details') ||
             item.url.includes('/blog-list');
    }).length,
    products: sitemapData.filter(item => item.url.includes('/fabric/')).length,
    blogs: sitemapData.filter(item => item.url.includes('/blog-details')).length,
    categories: sitemapData.filter(item => item.url.includes('category=')).length,
  };
  
  console.log('Sitemap Statistics:', stats);
  return stats;
}


export function validateSitemapData(sitemapData) {
  if (!Array.isArray(sitemapData)) {
    console.error('Sitemap data is not an array');
    return false;
  }
  
  const requiredFields = ['url'];
  const invalidEntries = sitemapData.filter(entry => 
    !requiredFields.every(field => Object.prototype.hasOwnProperty.call(entry, field))
  );
  
  if (invalidEntries.length > 0) {
    console.error('Invalid sitemap entries found:', invalidEntries.length);
    return false;
  }
  
  // Check for duplicate URLs
  const urls = sitemapData.map(entry => entry.url);
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
  
  if (duplicates.length > 0) {
    console.warn('Duplicate URLs found in sitemap:', [...new Set(duplicates)]);
  }
  
  // Validate URL format
  const invalidUrls = sitemapData.filter(entry => {
    try {
      new URL(entry.url);
      return false;
    } catch {
      return true;
    }
  });
  
  if (invalidUrls.length > 0) {
    console.error('Invalid URL format found:', invalidUrls.map(entry => entry.url));
    return false;
  }
  
  console.log('Sitemap validation passed');
  return true;
} 