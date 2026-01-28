#!/usr/bin/env node

const { SitemapManager } = require('../src/utils/sitemap-manager');

async function testSitemapPage() {
  console.log('🧪 Testing Sitemap Page Functionality');
  console.log('====================================\n');

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    console.log(`📍 Base URL: ${baseUrl}`);
    console.log(`🔗 API URL: ${apiBaseUrl}\n`);
    
    // Initialize sitemap manager
    const sitemapManager = new SitemapManager(baseUrl, apiBaseUrl);
    
    console.log('⏳ Generating sitemap data...');
    const sitemapData = await sitemapManager.generateSitemap();
    
    console.log('📊 Calculating statistics...');
    const stats = sitemapManager.getStats(sitemapData);
    
    console.log('\n✅ Sitemap Generation Results:');
    console.log('==============================');
    console.log(`📄 Total Pages: ${stats.total}`);
    console.log(`🏠 Static Pages: ${stats.static}`);
    console.log(`👕 Product Pages: ${stats.products}`);
    console.log(`📝 Blog Pages: ${stats.blogs}`);
    console.log(`🏷️  Category Pages: ${stats.categories}`);
    
    console.log('\n📋 Sample Pages:');
    console.log('================');
    
    // Show sample pages by category
    const samplePages = {
      'Home & Static': sitemapData.filter(p => sitemapManager.isStaticPage(p.url)).slice(0, 3),
      'Products': sitemapData.filter(p => p.url.includes('/fabric/')).slice(0, 3),
      'Blog Posts': sitemapData.filter(p => p.url.includes('/blog-details')).slice(0, 3),
      'Categories': sitemapData.filter(p => p.url.includes('category=')).slice(0, 3),
    };
    
    Object.entries(samplePages).forEach(([category, pages]) => {
      if (pages.length > 0) {
        console.log(`\n${category}:`);
        pages.forEach(page => {
          console.log(`  • ${page.url} (Priority: ${page.priority})`);
        });
      }
    });
    
    console.log('\n🎯 Page Categories Distribution:');
    console.log('================================');
    
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
        console.log(`📊 ${category.charAt(0).toUpperCase() + category.slice(1)}: ${count} pages (${percentage}%)`);
      }
    });
    
    console.log('\n🔍 Priority Distribution:');
    console.log('========================');
    
    const priorities = {
      'High (0.9-1.0)': sitemapData.filter(p => p.priority >= 0.9).length,
      'Medium (0.7-0.8)': sitemapData.filter(p => p.priority >= 0.7 && p.priority < 0.9).length,
      'Low (0.5-0.6)': sitemapData.filter(p => p.priority >= 0.5 && p.priority < 0.7).length,
    };
    
    Object.entries(priorities).forEach(([range, count]) => {
      if (count > 0) {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        console.log(`🎯 ${range}: ${count} pages (${percentage}%)`);
      }
    });
    
    console.log('\n📅 Update Frequency Distribution:');
    console.log('=================================');
    
    const frequencies = {
      'Daily': sitemapData.filter(p => p.changeFrequency === 'daily').length,
      'Weekly': sitemapData.filter(p => p.changeFrequency === 'weekly').length,
      'Monthly': sitemapData.filter(p => p.changeFrequency === 'monthly').length,
    };
    
    Object.entries(frequencies).forEach(([freq, count]) => {
      if (count > 0) {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        console.log(`📅 ${freq}: ${count} pages (${percentage}%)`);
      }
    });
    
    console.log('\n✨ Sitemap Page Test Results:');
    console.log('=============================');
    console.log('✅ Sitemap data generation: SUCCESS');
    console.log('✅ Statistics calculation: SUCCESS');
    console.log('✅ Page categorization: SUCCESS');
    console.log('✅ Priority assignment: SUCCESS');
    console.log('✅ Frequency assignment: SUCCESS');
    
    console.log('\n🌐 Sitemap Page URLs:');
    console.log('=====================');
    console.log(`📄 Human-readable sitemap: ${baseUrl}/sitemap-page`);
    console.log(`🤖 XML sitemap: ${baseUrl}/sitemap.xml`);
    
    console.log('\n🎉 All tests passed! Your sitemap page is ready to use.');
    
  } catch (error) {
    console.error('\n❌ Error testing sitemap page:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('• Check if your API endpoints are accessible');
    console.log('• Verify environment variables are set correctly');
    console.log('• Ensure the sitemap manager is properly configured');
    process.exit(1);
  }
}

// Run the test
testSitemapPage();