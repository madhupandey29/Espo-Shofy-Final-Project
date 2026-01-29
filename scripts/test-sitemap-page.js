#!/usr/bin/env node

const { SitemapManager } = require('../src/utils/sitemap-manager');

async function testSitemapPage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Initialize sitemap manager
    const sitemapManager = new SitemapManager(baseUrl, apiBaseUrl);
    
    const sitemapData = await sitemapManager.generateSitemap();
    
    const stats = sitemapManager.getStats(sitemapData);
    
    // Show sample pages by category
    const samplePages = {
      'Home & Static': sitemapData.filter(p => sitemapManager.isStaticPage(p.url)).slice(0, 3),
      'Products': sitemapData.filter(p => p.url.includes('/fabric/')).slice(0, 3),
      'Blog Posts': sitemapData.filter(p => p.url.includes('/blog-details')).slice(0, 3),
      'Categories': sitemapData.filter(p => p.url.includes('category=')).slice(0, 3),
    };
    
    Object.entries(samplePages).forEach(([category, pages]) => {
      if (pages.length > 0) {
        pages.forEach(page => {
          });
      }
    });
    
    const categories = {
      'home': sitemapData.filter(p => p.url.endsWith('/') || p.url.endsWith(baseUrl)).length,
      'shop': sitemapData.filter(p => p.url.includes('/shop')).length,
      'products': sitemapData.filter(p => p.url.includes('/fabric/')).length,
      'blog': sitemapData.filter(p => p.url.includes('/blog')).length,
      'categories': sitemapData.filter(p => p.url.includes('category=')).length,
      'other': sitemapData.filter(p => 
        !p.url.includes('/shop') && 
        !p.url.includes('/fabric/') && 
        !p.url.includes('/blog') && 
        !p.url.includes('category=') &&
        !p.url.endsWith('/') &&
        !p.url.endsWith(baseUrl)
      ).length
    };
    
    Object.entries(categories).forEach(([category, count]) => {
      if (count > 0) {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        }
    });
    
    const priorities = {
      'High (0.9-1.0)': sitemapData.filter(p => p.priority >= 0.9).length,
      'Medium (0.7-0.8)': sitemapData.filter(p => p.priority >= 0.7 && p.priority < 0.9).length,
      'Low (0.5-0.6)': sitemapData.filter(p => p.priority >= 0.5 && p.priority < 0.7).length,
    };
    
    Object.entries(priorities).forEach(([range, count]) => {
      if (count > 0) {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        }
    });
    
    const frequencies = {
      'Daily': sitemapData.filter(p => p.changeFrequency === 'daily').length,
      'Weekly': sitemapData.filter(p => p.changeFrequency === 'weekly').length,
      'Monthly': sitemapData.filter(p => p.changeFrequency === 'monthly').length,
    };
    
    Object.entries(frequencies).forEach(([freq, count]) => {
      if (count > 0) {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        }
    });
    
    } catch (error) {
    process.exit(1);
  }
}

// Run the test
testSitemapPage();