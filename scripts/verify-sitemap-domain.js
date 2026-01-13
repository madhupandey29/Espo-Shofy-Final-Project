#!/usr/bin/env node

/**
 * Verify Sitemap Domain Update
 * Tests that the sitemap is generating with the correct domain
 */

const { SitemapManager } = require('../src/utils/sitemap-manager.js');

async function verifySitemapDomain() {
  console.log('🔍 Verifying sitemap domain configuration...\n');
  
  const expectedDomain = 'https://amrita-fashions.com';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || expectedDomain;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api';
  
  console.log(`Expected Domain: ${expectedDomain}`);
  console.log(`Current Base URL: ${baseUrl}`);
  console.log(`API Base URL: ${apiBaseUrl}\n`);
  
  // Check if domain is correct
  if (baseUrl !== expectedDomain) {
    console.log('❌ DOMAIN MISMATCH!');
    console.log(`Expected: ${expectedDomain}`);
    console.log(`Found: ${baseUrl}`);
    console.log('Please update NEXT_PUBLIC_SITE_URL in .env.local\n');
    return false;
  }
  
  console.log('✅ Domain configuration is correct!\n');
  
  // Test sitemap generation
  try {
    const sitemapManager = new SitemapManager(baseUrl, apiBaseUrl);
    const pages = await sitemapManager.generateSitemap();
    
    console.log(`📊 Generated ${pages.length} sitemap entries\n`);
    
    // Check first few URLs
    console.log('🔗 Sample URLs:');
    pages.slice(0, 5).forEach((page, index) => {
      console.log(`${index + 1}. ${page.url}`);
      
      // Verify domain
      if (!page.url.startsWith(expectedDomain)) {
        console.log(`   ❌ Wrong domain! Expected ${expectedDomain}`);
      }
    });
    
    // Check for excluded pages
    const excludedPages = ['/cart', '/wishlist', '/login', '/checkout', '/profile'];
    const foundExcluded = pages.filter(page => 
      excludedPages.some(excluded => page.url.includes(excluded))
    );
    
    if (foundExcluded.length > 0) {
      console.log('\n⚠️  Found excluded pages in sitemap:');
      foundExcluded.forEach(page => console.log(`   - ${page.url}`));
    } else {
      console.log('\n✅ No excluded pages found in sitemap');
    }
    
    // Summary
    console.log('\n📋 Summary:');
    console.log(`✅ Domain: ${expectedDomain}`);
    console.log(`✅ Total URLs: ${pages.length}`);
    console.log(`✅ Static pages: ${pages.filter(p => sitemapManager.isStaticPage(p.url)).length}`);
    console.log(`✅ Product pages: ${pages.filter(p => p.url.includes('/fabric/')).length}`);
    console.log(`✅ Blog pages: ${pages.filter(p => p.url.includes('/blog-details')).length}`);
    
    console.log('\n🎯 Your sitemap will be available at:');
    console.log(`   ${expectedDomain}/sitemap.xml`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return false;
  }
}

// Run verification
verifySitemapDomain()
  .then(success => {
    if (success) {
      console.log('\n🎉 Sitemap domain verification completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. Deploy your changes to production');
      console.log('2. Visit https://amrita-fashions.com/sitemap.xml to verify');
      console.log('3. Submit the new sitemap URL to Google Search Console');
    } else {
      console.log('\n❌ Sitemap domain verification failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
  });