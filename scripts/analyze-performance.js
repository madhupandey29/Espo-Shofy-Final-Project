#!/usr/bin/env node

/**
 * Performance Analysis Script
 * Helps identify render-blocking resources and optimization opportunities
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing Performance Opportunities...\n');

// Check for render-blocking CSS imports
console.log('📊 Checking for render-blocking CSS imports...');
const componentsDir = path.join(process.cwd(), 'src');

function findCSSImports(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findCSSImports(filePath, results);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const cssImports = content.match(/import\s+['"].*\.(css|scss)['"]/g);
      
      if (cssImports && cssImports.length > 0) {
        results.push({
          file: filePath.replace(process.cwd(), ''),
          imports: cssImports
        });
      }
    }
  });
  
  return results;
}

const cssImports = findCSSImports(componentsDir);

if (cssImports.length > 0) {
  console.log(`\n⚠️  Found ${cssImports.length} files with CSS imports:\n`);
  cssImports.forEach(({ file, imports }) => {
    console.log(`  ${file}`);
    imports.forEach(imp => console.log(`    - ${imp}`));
  });
} else {
  console.log('✅ No direct CSS imports found');
}

// Check for heavy dependencies
console.log('\n📦 Checking for heavy dependencies...');
const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const heavyDeps = [
  'bootstrap',
  'swiper',
  'framer-motion',
  '@react-pdf/renderer',
  'jspdf'
];

const foundHeavyDeps = heavyDeps.filter(dep => 
  packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
);

if (foundHeavyDeps.length > 0) {
  console.log('\n⚠️  Heavy dependencies found (consider lazy loading):');
  foundHeavyDeps.forEach(dep => {
    const version = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    console.log(`  - ${dep}@${version}`);
  });
}

// Recommendations
console.log('\n💡 Performance Optimization Recommendations:\n');
console.log('1. ✅ Lazy load heavy components (carousels, modals, chatbot)');
console.log('2. ✅ Defer non-critical scripts (analytics, tracking)');
console.log('3. ✅ Split CSS into critical and non-critical');
console.log('4. ⏳ Use next/dynamic for code splitting');
console.log('5. ⏳ Optimize images with Next.js Image component');
console.log('6. ⏳ Enable compression (Brotli/Gzip)');
console.log('7. ⏳ Use CDN for static assets');
console.log('8. ⏳ Implement resource hints (preconnect, dns-prefetch)');

console.log('\n📈 Next Steps:\n');
console.log('1. Run: npm run build');
console.log('2. Run: npm run build:analyze');
console.log('3. Test with Lighthouse');
console.log('4. Deploy and monitor Core Web Vitals\n');
