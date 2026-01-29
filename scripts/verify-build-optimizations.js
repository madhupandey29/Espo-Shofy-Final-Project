#!/usr/bin/env node

/**
 * Verification script for production build optimizations
 * Run after: npm run build
 */

const fs = require('fs');
const path = require('path');

// Check if build exists
const buildDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(buildDir)) {
  process.exit(1);
}

// 1. Check if minification is working
const staticDir = path.join(buildDir, 'static', 'chunks');
if (fs.existsSync(staticDir)) {
  const files = fs.readdirSync(staticDir).filter(f => f.endsWith('.js'));
  if (files.length > 0) {
    const sampleFile = path.join(staticDir, files[0]);
    const content = fs.readFileSync(sampleFile, 'utf8');
    const isMinified = !content.includes('\n\n') && content.length > 1000;
    }
}

// 2. Check CSS optimization
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
    if (totalSize < 100000) {
      } else {
      }
  }
} else {
  }

// 3. Check code splitting
const chunksDir = path.join(buildDir, 'static', 'chunks');
if (fs.existsSync(chunksDir)) {
  const chunks = fs.readdirSync(chunksDir).filter(f => f.endsWith('.js'));
  // Check for vendor chunk
  const hasVendorChunk = chunks.some(f => f.includes('vendor') || f.includes('framework'));
  }

// 4. Check build manifest
const manifestPath = path.join(buildDir, 'build-manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const pages = Object.keys(manifest.pages || {});
  // Check for shared chunks
  const sharedChunks = manifest.pages['/']?.filter(chunk => 
    chunk.includes('shared') || chunk.includes('common')
  ) || [];
  if (sharedChunks.length > 0) {
    }
}

// 5. Check next.config.js settings
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
    });
}

// 6. Check PostCSS config
const postcssPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssPath)) {
  const postcssContent = fs.readFileSync(postcssPath, 'utf8');
  const hasPurgecss = postcssContent.includes('purgecss');
  const hasCssnano = postcssContent.includes('cssnano');
  
  }

// Summary
