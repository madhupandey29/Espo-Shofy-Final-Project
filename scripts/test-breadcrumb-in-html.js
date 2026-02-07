#!/usr/bin/env node

/**
 * Quick test to verify breadcrumb JSON-LD is in the HTML
 * Run after starting dev server: npm run dev
 */

const http = require('http');

const TEST_PAGES = [
  { path: '/fabric', name: 'Fabric Listing' },
  { path: '/contact', name: 'Contact' },
  { path: '/about', name: 'About' },
  { path: '/capabilities', name: 'Capabilities' },
  { path: '/blog', name: 'Blog' },
];

function testPage(path, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const hasBreadcrumb = data.includes('BreadcrumbList');
        const hasJsonLd = data.includes('application/ld+json');
        
        resolve({
          path,
          name,
          hasBreadcrumb,
          hasJsonLd,
          success: hasBreadcrumb && hasJsonLd
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        path,
        name,
        error: error.message,
        success: false
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🔍 Testing Breadcrumb JSON-LD in HTML\n');
  console.log('Make sure dev server is running: npm run dev\n');
  console.log('='.repeat(60));

  const results = [];

  for (const page of TEST_PAGES) {
    const result = await testPage(page.path, page.name);
    results.push(result);

    if (result.error) {
      console.log(`\n❌ ${result.name} (${result.path})`);
      console.log(`   Error: ${result.error}`);
    } else if (result.success) {
      console.log(`\n✅ ${result.name} (${result.path})`);
      console.log('   ✓ BreadcrumbList found');
      console.log('   ✓ JSON-LD script found');
    } else {
      console.log(`\n⚠️  ${result.name} (${result.path})`);
      console.log(`   BreadcrumbList: ${result.hasBreadcrumb ? '✓' : '✗'}`);
      console.log(`   JSON-LD script: ${result.hasJsonLd ? '✓' : '✗'}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total pages tested: ${results.length}`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (successful === results.length) {
    console.log('\n🎉 All pages have breadcrumb JSON-LD in HTML!');
    console.log('\nNext steps:');
    console.log('1. Deploy to production');
    console.log('2. Test with Google Rich Results Tool');
    console.log('3. Request indexing in Search Console');
  } else {
    console.log('\n⚠️  Some pages are missing breadcrumb JSON-LD');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure dev server is running');
    console.log('2. Check if pages are loading correctly');
    console.log('3. Review the fix in BREADCRUMB_JSONLD_FIX_SUMMARY.md');
  }
}

// Run tests
runTests().catch(console.error);
