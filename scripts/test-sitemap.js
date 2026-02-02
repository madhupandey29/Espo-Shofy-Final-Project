#!/usr/bin/env node

// Test sitemap generation
process.env.NEXT_PUBLIC_SITE_URL = 'https://amrita-fashions.com';
process.env.NEXT_PUBLIC_API_BASE_URL = 'https://espobackend.vercel.app/api';

const { SitemapManager } = require('../src/utils/sitemap-manager.js');

async function testSitemap() {
  console.log('🔍 Testing sitemap generation...');
  console.log('Environment variables:');
  console.log('- NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
  console.log('- NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log('');

  try {
    const manager = new SitemapManager();
    const sitemap = await manager.generateSitemap();
    
    console.log('✅ Sitemap generated successfully!');
    console.log(`📊 Total pages: ${sitemap.length}`);
    console.log('');
    
    console.log('🏠 Static pages:');
    const staticPages = sitemap.filter(page => {
      const url = page.url;
      return url.endsWith('/') || 
             url.endsWith('/fabric') || 
             url.endsWith('/capabilities') || 
             url.endsWith('/blog') || 
             url.endsWith('/contact') || 
             url.endsWith('/about');
    });
    
    staticPages.forEach(page => {
      console.log(`  - ${page.url} (priority: ${page.priority})`);
    });
    
    console.log('');
    console.log('📦 Product pages:', sitemap.filter(p => p.url.includes('/fabric/')).length);
    console.log('📝 Blog pages:', sitemap.filter(p => p.url.includes('/blog-details')).length);
    
    // Check if capabilities page is included
    const capabilitiesPage = sitemap.find(p => p.url.endsWith('/capabilities'));
    if (capabilitiesPage) {
      console.log('✅ Capabilities page found in sitemap!');
    } else {
      console.log('❌ Capabilities page missing from sitemap!');
    }
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
  }
}

testSitemap();