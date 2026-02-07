/**
 * Verification Script for Collection ItemList JSON-LD
 * 
 * This script helps verify that the Collection ItemList structured data
 * is properly implemented and working on your fabric pages.
 * 
 * Usage:
 *   node scripts/verify-collection-jsonld.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
                 process.env.NEXT_PUBLIC_SITE_URL || 
                 'http://localhost:3000';

// Test product slugs (update these with actual slugs from your site)
const TEST_SLUGS = [
  'nokia-red-fabric',
  'majestica-blue-fabric',
  // Add more test slugs here
];

/**
 * Fetch HTML content from URL
 */
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Extract JSON-LD scripts from HTML
 */
function extractJsonLd(html) {
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  const matches = [];
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    try {
      const jsonLd = JSON.parse(match[1]);
      matches.push(jsonLd);
    } catch (e) {
      console.error('Failed to parse JSON-LD:', e.message);
    }
  }
  
  return matches;
}

/**
 * Verify Collection ItemList JSON-LD
 */
function verifyCollectionJsonLd(jsonLdArray) {
  const collectionPage = jsonLdArray.find(item => item['@type'] === 'CollectionPage');
  
  if (!collectionPage) {
    return {
      found: false,
      message: '❌ CollectionPage JSON-LD not found'
    };
  }
  
  const issues = [];
  const warnings = [];
  
  // Check required fields
  if (!collectionPage.name) {
    issues.push('Missing "name" field');
  }
  
  if (!collectionPage.description) {
    warnings.push('Missing "description" field (optional but recommended)');
  }
  
  if (!collectionPage.url) {
    issues.push('Missing "url" field');
  }
  
  if (!collectionPage.mainEntity) {
    issues.push('Missing "mainEntity" field');
  } else {
    const itemList = collectionPage.mainEntity;
    
    if (itemList['@type'] !== 'ItemList') {
      issues.push('mainEntity should be of type "ItemList"');
    }
    
    if (!itemList.itemListElement || !Array.isArray(itemList.itemListElement)) {
      issues.push('Missing or invalid "itemListElement" array');
    } else {
      const items = itemList.itemListElement;
      
      if (items.length === 0) {
        warnings.push('ItemList is empty (no products in collection)');
      }
      
      // Verify each item
      items.forEach((item, index) => {
        if (item['@type'] !== 'ListItem') {
          issues.push(`Item ${index + 1}: Wrong type (should be "ListItem")`);
        }
        
        if (!item.position) {
          issues.push(`Item ${index + 1}: Missing "position" field`);
        }
        
        if (!item.url) {
          issues.push(`Item ${index + 1}: Missing "url" field`);
        }
        
        if (!item.name) {
          issues.push(`Item ${index + 1}: Missing "name" field`);
        }
      });
      
      // Check if numberOfItems matches actual count
      if (itemList.numberOfItems !== items.length) {
        warnings.push(`numberOfItems (${itemList.numberOfItems}) doesn't match actual count (${items.length})`);
      }
    }
  }
  
  return {
    found: true,
    valid: issues.length === 0,
    data: collectionPage,
    issues,
    warnings,
    itemCount: collectionPage.mainEntity?.itemListElement?.length || 0
  };
}

/**
 * Main verification function
 */
async function verifyPages() {
  console.log('🔍 Collection ItemList JSON-LD Verification\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  console.log('=' .repeat(60));
  
  for (const slug of TEST_SLUGS) {
    const url = `${BASE_URL}/fabric/${slug}`;
    console.log(`\n📄 Testing: ${url}`);
    
    try {
      const html = await fetchPage(url);
      const jsonLdArray = extractJsonLd(html);
      
      console.log(`   Found ${jsonLdArray.length} JSON-LD script(s)`);
      
      const result = verifyCollectionJsonLd(jsonLdArray);
      
      if (!result.found) {
        console.log(`   ${result.message}`);
        console.log('   ⚠️  This might be normal if the product has no collection');
        continue;
      }
      
      if (result.valid) {
        console.log(`   ✅ Valid CollectionPage JSON-LD found!`);
        console.log(`   📦 Collection: "${result.data.name}"`);
        console.log(`   🔢 Items: ${result.itemCount}`);
      } else {
        console.log(`   ❌ CollectionPage JSON-LD has issues:`);
        result.issues.forEach(issue => {
          console.log(`      - ${issue}`);
        });
      }
      
      if (result.warnings.length > 0) {
        console.log(`   ⚠️  Warnings:`);
        result.warnings.forEach(warning => {
          console.log(`      - ${warning}`);
        });
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Verification complete!\n');
  console.log('Next steps:');
  console.log('1. Test with Google Rich Results: https://search.google.com/test/rich-results');
  console.log('2. Validate with Schema.org: https://validator.schema.org/');
  console.log('3. Check Search Console for rich result status\n');
}

// Run verification
if (require.main === module) {
  verifyPages().catch(console.error);
}

module.exports = { verifyCollectionJsonLd, extractJsonLd };
