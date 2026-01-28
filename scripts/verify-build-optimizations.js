#!/usr/bin/env node

/**
 * Verification script for production build optimizations
 * Run after: npm run build
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Production Build Optimizations...\n');

// Check if build exists
const buildDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

// 1. Check if minification is working
console.log('1️⃣ Checking Minification...');
const staticDir = path.join(buildDir, 'static', 'chunks');
if (fs.existsSync(staticDir)) {
  const files = fs.readdirSync(staticDir).filter(f => f.endsWith('.js'));
  if (files.length > 0) {
    const sampleFile = path.join(staticDir, files[0]);
    const content = fs.readFileSync(sampleFile, 'utf8');
    const isMinified = !content.includes('\n\n') && content.length > 1000;
    console.log(isMinified ? '   ✅ JavaScript is minified' : '   ⚠️  JavaScript may not be minified');
  }
}

// 2. Check CSS optimization
console.log('\n2️⃣ Checking CSS Optimization...');
const cssDir = path.join(buildDir, 'static', 'css');
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    let totalSize = 0;
    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    });
    const sizeInKB = (totalSize / 1024).toFixed(2);
    console.log(`   ✅ Total CSS size: ${sizeInKB} KB`);
    if (totalSize < 100000) {
      console.log('   ✅ CSS is well optimized (< 100 KB)');
    } else {
      console.log('   ⚠️  CSS size is large. Consider more aggressive purging.');
    }
  }
} else {
  console.log('   ℹ️  No CSS files found (may be inlined)');
}

// 3. Check code splitting
console.log('\n3️⃣ Checking Code Splitting...');
const chunksDir = path.join(buildDir, 'static', 'chunks');
if (fs.existsSync(chunksDir)) {
  const chunks = fs.readdirSync(chunksDir).filter(f => f.endsWith('.js'));
  console.log(`   ✅ Found ${chunks.length} JavaScript chunks`);
  
  // Check for vendor chunk
  const hasVendorChunk = chunks.some(f => f.includes('vendor') || f.includes('framework'));
  console.log(hasVendorChunk ? '   ✅ Vendor chunk detected' : '   ℹ️  No explicit vendor chunk');
}

// 4. Check build manifest
console.log('\n4️⃣ Checking Build Manifest...');
const manifestPath = path.join(buildDir, 'build-manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const pages = Object.keys(manifest.pages || {});
  console.log(`   ✅ Built ${pages.length} pages`);
  
  // Check for shared chunks
  const sharedChunks = manifest.pages['/']?.filter(chunk => 
    chunk.includes('shared') || chunk.includes('common')
  ) || [];
  if (sharedChunks.length > 0) {
    console.log(`   ✅ Found ${sharedChunks.length} shared chunks (good for caching)`);
  }
}

// 5. Check next.config.js settings
console.log('\n5️⃣ Checking Configuration...');
const configPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  const checks = [
    { name: 'SWC Minification', pattern: /swcMinify:\s*true/, enabled: false },
    { name: 'Remove Console', pattern: /removeConsole/, enabled: false },
    { name: 'Modular Imports', pattern: /modularizeImports/, enabled: false },
    { name: 'Image Optimization', pattern: /formats:\s*\[/, enabled: false },
  ];
  
  checks.forEach(check => {
    check.enabled = check.pattern.test(configContent);
    console.log(check.enabled ? `   ✅ ${check.name} enabled` : `   ⚠️  ${check.name} not found`);
  });
}

// 6. Check PostCSS config
console.log('\n6️⃣ Checking PostCSS Configuration...');
const postcssPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssPath)) {
  const postcssContent = fs.readFileSync(postcssPath, 'utf8');
  const hasPurgecss = postcssContent.includes('purgecss');
  const hasCssnano = postcssContent.includes('cssnano');
  
  console.log(hasPurgecss ? '   ✅ PurgeCSS configured' : '   ⚠️  PurgeCSS not found');
  console.log(hasCssnano ? '   ✅ cssnano configured' : '   ⚠️  cssnano not found');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Optimization Summary');
console.log('='.repeat(50));
console.log('✅ = Configured correctly');
console.log('⚠️  = Needs attention');
console.log('ℹ️  = Informational');
console.log('\n💡 Tip: Run "npm run build:analyze" to see detailed bundle analysis');
console.log('📚 Build optimizations applied automatically\n');
