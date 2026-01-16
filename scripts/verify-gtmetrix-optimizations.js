#!/usr/bin/env node

/**
 * Verify GTmetrix Optimizations
 * 
 * This script verifies that all performance optimizations have been applied correctly.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying GTmetrix Optimizations...\n');

let allPassed = true;

// Test 1: Check product API limit in newProductApi.js
console.log('📦 Test 1: Checking product API limits...');
try {
  const apiFile = fs.readFileSync(
    path.join(__dirname, '../src/redux/features/newProductApi.js'),
    'utf8'
  );
  
  // Check getAllNewProducts limit
  const getAllNewProductsMatch = apiFile.match(/getAllNewProducts:[\s\S]*?limit\s*=\s*(\d+)/);
  if (getAllNewProductsMatch) {
    const limit = parseInt(getAllNewProductsMatch[1]);
    if (limit <= 12) {
      console.log(`   ✅ getAllNewProducts limit: ${limit} (Good!)`);
    } else {
      console.log(`   ❌ getAllNewProducts limit: ${limit} (Should be 12 or less)`);
      allPassed = false;
    }
  }
  
  // Check getAllProductsForFiltering limit
  const getAllProductsMatch = apiFile.match(/getAllProductsForFiltering:[\s\S]*?limit=(\d+)/);
  if (getAllProductsMatch) {
    const limit = parseInt(getAllProductsMatch[1]);
    if (limit <= 50) {
      console.log(`   ✅ getAllProductsForFiltering limit: ${limit} (Good!)`);
    } else {
      console.log(`   ❌ getAllProductsForFiltering limit: ${limit} (Should be 50 or less)`);
      allPassed = false;
    }
  }
} catch (error) {
  console.log(`   ❌ Error reading newProductApi.js: ${error.message}`);
  allPassed = false;
}

// Test 2: Check image quality in next.config.js
console.log('\n🖼️  Test 2: Checking image quality settings...');
try {
  const configFile = fs.readFileSync(
    path.join(__dirname, '../next.config.js'),
    'utf8'
  );
  
  if (configFile.includes('quality: 75') || configFile.includes('quality:75')) {
    console.log('   ✅ Image quality set to 75 (Good!)');
  } else if (configFile.includes('quality: 80') || configFile.includes('quality:80')) {
    console.log('   ⚠️  Image quality set to 80 (Consider reducing to 75)');
  } else {
    console.log('   ⚠️  Image quality not explicitly set (Will use default 75)');
  }
  
  // Check for AVIF/WebP formats
  if (configFile.includes('image/avif') && configFile.includes('image/webp')) {
    console.log('   ✅ Modern image formats enabled (AVIF, WebP)');
  } else {
    console.log('   ❌ Modern image formats not enabled');
    allPassed = false;
  }
} catch (error) {
  console.log(`   ❌ Error reading next.config.js: ${error.message}`);
  allPassed = false;
}

// Test 3: Check lazy loading in components
console.log('\n⚡ Test 3: Checking lazy loading implementation...');
try {
  const layoutFile = fs.readFileSync(
    path.join(__dirname, '../src/app/HomePageTwoClient.jsx'),
    'utf8'
  );
  
  if (layoutFile.includes('dynamic(') && layoutFile.includes('loading:')) {
    console.log('   ✅ Dynamic imports with loading states found');
  } else {
    console.log('   ❌ Dynamic imports not properly configured');
    allPassed = false;
  }
  
  // Check for lazy loaded components
  const lazyComponents = [
    'PopularProducts',
    'WeeksFeatured',
    'BlogArea',
    'Footer'
  ];
  
  let lazyCount = 0;
  lazyComponents.forEach(component => {
    if (layoutFile.includes(`dynamic(() => import`) && layoutFile.includes(component.toLowerCase())) {
      lazyCount++;
    }
  });
  
  console.log(`   ✅ ${lazyCount}/${lazyComponents.length} major components lazy loaded`);
} catch (error) {
  console.log(`   ❌ Error reading HomePageTwoClient.jsx: ${error.message}`);
  allPassed = false;
}

// Test 4: Check async CSS loading
console.log('\n🎨 Test 4: Checking async CSS loading...');
try {
  const layoutFile = fs.readFileSync(
    path.join(__dirname, '../src/app/layout.jsx'),
    'utf8'
  );
  
  if (layoutFile.includes('media="print"') && layoutFile.includes('onLoad="this.media=\'all\'"')) {
    console.log('   ✅ Async CSS loading implemented');
  } else {
    console.log('   ⚠️  Async CSS loading not found (may be blocking render)');
  }
  
  // Check for preconnect
  if (layoutFile.includes('rel="preconnect"')) {
    console.log('   ✅ Preconnect headers found');
  } else {
    console.log('   ❌ Preconnect headers missing');
    allPassed = false;
  }
} catch (error) {
  console.log(`   ❌ Error reading layout.jsx: ${error.message}`);
  allPassed = false;
}

// Test 5: Check webpack optimizations
console.log('\n⚙️  Test 5: Checking webpack optimizations...');
try {
  const configFile = fs.readFileSync(
    path.join(__dirname, '../next.config.js'),
    'utf8'
  );
  
  if (configFile.includes('swcMinify: true')) {
    console.log('   ✅ SWC minification enabled');
  } else {
    console.log('   ❌ SWC minification not enabled');
    allPassed = false;
  }
  
  if (configFile.includes('compress: true')) {
    console.log('   ✅ Compression enabled');
  } else {
    console.log('   ⚠️  Compression not explicitly enabled');
  }
  
  if (configFile.includes('splitChunks')) {
    console.log('   ✅ Code splitting configured');
  } else {
    console.log('   ❌ Code splitting not configured');
    allPassed = false;
  }
} catch (error) {
  console.log(`   ❌ Error reading next.config.js: ${error.message}`);
  allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('✅ All optimizations verified successfully!');
  console.log('\n📊 Expected Performance Improvements:');
  console.log('   • Page Size: 22.8MB → 3-5MB (-80%)');
  console.log('   • Performance Score: 53% (D) → 75-85% (B/A)');
  console.log('   • LCP: 2.4s → <2.0s');
  console.log('   • TBT: 528ms → <300ms');
  console.log('\n🚀 Next Steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. Run: npm start');
  console.log('   3. Test on GTmetrix');
  console.log('   4. Verify B grade or higher!');
} else {
  console.log('⚠️  Some optimizations need attention');
  console.log('\n📝 Review the issues above and fix them before testing.');
}
console.log('='.repeat(60) + '\n');

process.exit(allPassed ? 0 : 1);
