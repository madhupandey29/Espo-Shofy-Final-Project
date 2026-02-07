#!/usr/bin/env node

/**
 * Verify Breadcrumb JSON-LD Implementation
 * 
 * This script checks if breadcrumb structured data is properly implemented
 * and validates the JSON-LD format.
 */

const https = require('https');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amrita-fashions.com';

// Pages to test
const TEST_PAGES = [
  '/fabric',
  '/about',
  '/contact',
  '/blog',
  '/capabilities',
  // Add a product page if you know a valid slug
  // '/fabric/some-product-slug',
];

/**
 * Fetch page HTML and extract JSON-LD scripts
 */
function fetchPageJsonLd(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Extract all JSON-LD scripts
        const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
        const matches = [];
        let match;
        
        while ((match = jsonLdRegex.exec(data)) !== null) {
          try {
            const jsonData = JSON.parse(match[1]);
            matches.push(jsonData);
          } catch (e) {
            console.error(`Failed to parse JSON-LD on ${url}:`, e.message);
          }
        }
        
        resolve(matches);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Validate breadcrumb JSON-LD structure
 */
function validateBreadcrumb(jsonLd) {
  const errors = [];
  const warnings = [];
  
  // Check @context
  if (jsonLd['@context'] !== 'https://schema.org') {
    errors.push('Invalid @context - must be "https://schema.org"');
  }
  
  // Check @type
  if (jsonLd['@type'] !== 'BreadcrumbList') {
    errors.push('Invalid @type - must be "BreadcrumbList"');
  }
  
  // Check itemListElement
  if (!Array.isArray(jsonLd.itemListElement)) {
    errors.push('itemListElement must be an array');
    return { valid: false, errors, warnings };
  }
  
  if (jsonLd.itemListElement.length < 2) {
    warnings.push('Breadcrumb should have at least 2 items for Google to display');
  }
  
  // Validate each item
  jsonLd.itemListElement.forEach((item, index) => {
    if (item['@type'] !== 'ListItem') {
      errors.push(`Item ${index + 1}: Invalid @type - must be "ListItem"`);
    }
    
    if (typeof item.position !== 'number' || item.position !== index + 1) {
      errors.push(`Item ${index + 1}: Invalid position - should be ${index + 1}`);
    }
    
    if (!item.name || typeof item.name !== 'string') {
      errors.push(`Item ${index + 1}: Missing or invalid name`);
    }
    
    if (!item.item || typeof item.item !== 'string') {
      errors.push(`Item ${index + 1}: Missing or invalid item URL`);
    } else if (!item.item.startsWith('http')) {
      warnings.push(`Item ${index + 1}: URL should be absolute (starts with http/https)`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Main test function
 */
async function testBreadcrumbs() {
  console.log('🔍 Verifying Breadcrumb JSON-LD Implementation\n');
  console.log(`Site: ${SITE_URL}\n`);
  console.log('=' .repeat(60));
  
  let totalPages = 0;
  let pagesWithBreadcrumbs = 0;
  let validBreadcrumbs = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const path of TEST_PAGES) {
    const url = `${SITE_URL}${path}`;
    totalPages++;
    
    console.log(`\n📄 Testing: ${path}`);
    console.log('-'.repeat(60));
    
    try {
      const jsonLdScripts = await fetchPageJsonLd(url);
      
      if (jsonLdScripts.length === 0) {
        console.log('❌ No JSON-LD found on page');
        continue;
      }
      
      console.log(`✅ Found ${jsonLdScripts.length} JSON-LD script(s)`);
      
      // Find breadcrumb JSON-LD
      const breadcrumb = jsonLdScripts.find(script => script['@type'] === 'BreadcrumbList');
      
      if (!breadcrumb) {
        console.log('⚠️  No BreadcrumbList JSON-LD found');
        console.log('   Found types:', jsonLdScripts.map(s => s['@type']).join(', '));
        continue;
      }
      
      pagesWithBreadcrumbs++;
      console.log('✅ BreadcrumbList JSON-LD found');
      
      // Validate breadcrumb
      const validation = validateBreadcrumb(breadcrumb);
      
      if (validation.valid) {
        validBreadcrumbs++;
        console.log('✅ Breadcrumb structure is valid');
      } else {
        console.log('❌ Breadcrumb has errors');
      }
      
      // Show breadcrumb items
      console.log('\n   Breadcrumb items:');
      breadcrumb.itemListElement?.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} → ${item.item}`);
      });
      
      // Show errors
      if (validation.errors.length > 0) {
        console.log('\n   ❌ Errors:');
        validation.errors.forEach(error => {
          console.log(`      - ${error}`);
          totalErrors++;
        });
      }
      
      // Show warnings
      if (validation.warnings.length > 0) {
        console.log('\n   ⚠️  Warnings:');
        validation.warnings.forEach(warning => {
          console.log(`      - ${warning}`);
          totalWarnings++;
        });
      }
      
    } catch (error) {
      console.log(`❌ Error fetching page: ${error.message}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total pages tested: ${totalPages}`);
  console.log(`Pages with breadcrumbs: ${pagesWithBreadcrumbs}`);
  console.log(`Valid breadcrumbs: ${validBreadcrumbs}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
  
  if (validBreadcrumbs === totalPages) {
    console.log('\n✅ All pages have valid breadcrumb JSON-LD!');
  } else if (pagesWithBreadcrumbs === totalPages && totalErrors === 0) {
    console.log('\n⚠️  All pages have breadcrumbs but with warnings');
  } else {
    console.log('\n❌ Some pages are missing or have invalid breadcrumbs');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. Fix any errors shown above');
  console.log('2. Test with Google Rich Results Test:');
  console.log('   https://search.google.com/test/rich-results');
  console.log('3. Check Google Search Console → Enhancements → Breadcrumbs');
  console.log('4. Request indexing for updated pages');
  console.log('5. Wait 2-4 weeks for Google to process changes');
}

// Run tests
testBreadcrumbs().catch(console.error);
