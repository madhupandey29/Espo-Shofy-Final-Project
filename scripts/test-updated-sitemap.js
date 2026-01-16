/**
 * Test Updated Dynamic Sitemap
 * Verifies sitemap only includes active routes
 */

const { SitemapManager } = require('../src/utils/sitemap-manager.js');

async function testSitemap() {
  console.log('🗺️  Testing Updated Dynamic Sitemap\n');
  console.log('='.repeat(60));

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://espo-shofy-final-project.vercel.app';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api';

  const manager = new SitemapManager(baseUrl, apiBaseUrl);

  try {
    // Test 1: Static Routes
    console.log('\n📄 Test 1: Static Routes');
    console.log('-'.repeat(60));
    const staticRoutes = manager.getStaticRoutes();
    console.log(`✅ Found ${staticRoutes.length} static routes:`);
    staticRoutes.forEach(route => {
      const path = route.url.replace(baseUrl, '');
      console.log(`   ${path} (priority: ${route.priority})`);
    });

    // Verify removed routes are NOT included
    const removedRoutes = ['/blog', '/blog-list', '/coupon'];
    const hasRemovedRoutes = staticRoutes.some(route => {
      const path = route.url.replace(baseUrl, '');
      // Exact match only (not /blog-grid or /blog-details)
      return path === '/blog' || path === '/blog-list' || path === '/coupon';
    });
    
    if (hasRemovedRoutes) {
      console.log('❌ ERROR: Sitemap still contains removed routes!');
    } else {
      console.log('✅ Removed routes are NOT in sitemap');
    }

    // Test 2: Product Pages
    console.log('\n🏷️  Test 2: Product Pages (from API)');
    console.log('-'.repeat(60));
    const productPages = await manager.getProductPages();
    console.log(`✅ Found ${productPages.length} product pages`);
    if (productPages.length > 0) {
      console.log(`   First 3 products:`);
      productPages.slice(0, 3).forEach(page => {
        const slug = page.url.split('/fabric/')[1];
        console.log(`   - /fabric/${slug}`);
      });
    }

    // Test 3: Blog Pages
    console.log('\n📝 Test 3: Blog Pages (from API)');
    console.log('-'.repeat(60));
    const blogPages = await manager.getBlogPages();
    console.log(`✅ Found ${blogPages.length} blog pages`);
    if (blogPages.length > 0) {
      console.log(`   First 3 blogs:`);
      blogPages.slice(0, 3).forEach(page => {
        const slug = page.url.split('/blog-details/')[1];
        console.log(`   - /blog-details/${slug}`);
      });
    }

    // Verify blog-details-2 is NOT included
    const hasBlogDetails2 = blogPages.some(page => page.url.includes('/blog-details-2/'));
    if (hasBlogDetails2) {
      console.log('❌ ERROR: Sitemap still contains /blog-details-2/ routes!');
    } else {
      console.log('✅ /blog-details-2/ routes are NOT in sitemap');
    }

    // Test 4: Complete Sitemap
    console.log('\n🗺️  Test 4: Complete Sitemap');
    console.log('-'.repeat(60));
    const allPages = await manager.generateSitemap();
    const stats = manager.getStats(allPages);
    
    console.log(`✅ Total URLs: ${stats.total}`);
    console.log(`   - Static pages: ${stats.static}`);
    console.log(`   - Product pages: ${stats.products}`);
    console.log(`   - Blog pages: ${stats.blogs}`);
    console.log(`   - Category pages: ${stats.categories}`);

    // Test 5: Verify No Duplicates
    console.log('\n🔍 Test 5: Duplicate Check');
    console.log('-'.repeat(60));
    const urls = allPages.map(p => p.url);
    const uniqueUrls = new Set(urls);
    if (urls.length === uniqueUrls.size) {
      console.log('✅ No duplicate URLs found');
    } else {
      console.log(`❌ Found ${urls.length - uniqueUrls.size} duplicate URLs`);
    }

    // Test 6: Verify Removed Routes
    console.log('\n🚫 Test 6: Verify Removed Routes');
    console.log('-'.repeat(60));
    const removedPaths = ['/blog', '/blog-list', '/blog-details-2', '/coupon'];
    const foundRemoved = [];
    
    allPages.forEach(page => {
      const path = page.url.replace(baseUrl, '');
      removedPaths.forEach(removed => {
        // Exact match for /blog and /blog-list (not /blog-grid or /blog-details)
        if (removed === '/blog' && path === '/blog') {
          foundRemoved.push(page.url);
        } else if (removed === '/blog-list' && path === '/blog-list') {
          foundRemoved.push(page.url);
        } else if (removed === '/blog-details-2' && path.includes('/blog-details-2/')) {
          foundRemoved.push(page.url);
        } else if (removed === '/coupon' && path === '/coupon') {
          foundRemoved.push(page.url);
        }
      });
    });

    if (foundRemoved.length > 0) {
      console.log('❌ ERROR: Found removed routes in sitemap:');
      foundRemoved.forEach(url => console.log(`   - ${url}`));
    } else {
      console.log('✅ No removed routes found in sitemap');
    }

    // Test 7: Sample URLs
    console.log('\n📋 Test 7: Sample Sitemap URLs');
    console.log('-'.repeat(60));
    console.log('First 10 URLs in sitemap:');
    allPages.slice(0, 10).forEach((page, index) => {
      const path = page.url.replace(baseUrl, '');
      console.log(`${index + 1}. ${path || '/'} (priority: ${page.priority})`);
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total URLs: ${stats.total}`);
    console.log(`✅ Dynamic from API: ${stats.products + stats.blogs}`);
    console.log(`✅ Static routes: ${stats.static}`);
    console.log(`✅ No removed routes: ${foundRemoved.length === 0 ? 'YES' : 'NO'}`);
    console.log(`✅ No duplicates: ${urls.length === uniqueUrls.size ? 'YES' : 'NO'}`);
    
    if (foundRemoved.length === 0 && urls.length === uniqueUrls.size) {
      console.log('\n🎉 Sitemap is fully dynamic and clean!');
    } else {
      console.log('\n⚠️  Sitemap needs fixes');
    }

  } catch (error) {
    console.error('\n❌ Error testing sitemap:', error);
    console.error(error.stack);
  }
}

// Run test
testSitemap();
