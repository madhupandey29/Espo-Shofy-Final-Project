#!/usr/bin/env node

/**
 * Robots.txt Testing Script
 * Tests robots.txt configuration and validates Next.js asset access
 * Usage: node scripts/test-robots-txt.js
 */

const fs = require('fs');
const path = require('path');

function testRobotsTxt() {
  console.log('🤖 Testing robots.txt configuration...\n');
  
  // Read robots.txt file
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  
  if (!fs.existsSync(robotsPath)) {
    console.log('❌ robots.txt file not found at public/robots.txt');
    return;
  }
  
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  console.log('✅ robots.txt file found and readable\n');
  
  // Test URLs that should be allowed/disallowed
  const testUrls = [
    // Next.js assets (should be ALLOWED)
    { url: '/_next/static/css/app.css', expected: 'allowed', category: 'Next.js CSS' },
    { url: '/_next/static/js/app.js', expected: 'allowed', category: 'Next.js JavaScript' },
    { url: '/_next/image?url=/fabric-image.jpg', expected: 'allowed', category: 'Next.js Image Optimization' },
    { url: '/_next/static/chunks/webpack.js', expected: 'allowed', category: 'Next.js Webpack Chunks' },
    { url: '/_next/static/media/font.woff2', expected: 'allowed', category: 'Next.js Fonts' },
    
    // Public pages (should be ALLOWED)
    { url: '/', expected: 'allowed', category: 'Homepage' },
    { url: '/shop', expected: 'allowed', category: 'Shop Page' },
    { url: '/fabric/nokia-602', expected: 'allowed', category: 'Product Page' },
    { url: '/blog', expected: 'allowed', category: 'Blog Page' },
    { url: '/contact', expected: 'allowed', category: 'Contact Page' },
    
    // Sensitive areas (should be DISALLOWED)
    { url: '/api/products', expected: 'disallowed', category: 'API Endpoint' },
    { url: '/admin/dashboard', expected: 'disallowed', category: 'Admin Area' },
    { url: '/checkout', expected: 'disallowed', category: 'Checkout Page' },
    { url: '/test-page', expected: 'disallowed', category: 'Test Page' },
    { url: '/debug-api', expected: 'disallowed', category: 'Debug Page' },
    { url: '/scripts/test.js', expected: 'disallowed', category: 'Script Files' },
  ];
  
  console.log('🔍 Testing URL access rules:\n');
  console.log('─'.repeat(80));
  
  let passedTests = 0;
  let totalTests = testUrls.length;
  
  testUrls.forEach(test => {
    const isAllowed = checkUrlAllowed(robotsContent, test.url);
    const expectedAllowed = test.expected === 'allowed';
    const passed = isAllowed === expectedAllowed;
    
    const status = passed ? '✅' : '❌';
    const access = isAllowed ? 'ALLOWED' : 'BLOCKED';
    const expected = expectedAllowed ? 'ALLOWED' : 'BLOCKED';
    
    console.log(`${status} ${test.url}`);
    console.log(`   Category: ${test.category}`);
    console.log(`   Status: ${access} (Expected: ${expected})`);
    
    if (!passed) {
      console.log(`   ⚠️ Issue: URL should be ${expected} but is ${access}`);
    }
    
    console.log('');
    
    if (passed) passedTests++;
  });
  
  console.log('─'.repeat(80));
  
  // Check for specific Next.js patterns
  console.log('\n🔧 Next.js Asset Analysis:');
  
  const nextJsPatterns = [
    '/_next/static/',
    '/_next/image',
    '/_next/*'
  ];
  
  nextJsPatterns.forEach(pattern => {
    const hasAllow = robotsContent.includes(`Allow: ${pattern}`);
    const hasDisallow = robotsContent.includes(`Disallow: ${pattern}`);
    
    if (hasAllow && !hasDisallow) {
      console.log(`✅ ${pattern}: Properly allowed`);
    } else if (hasDisallow && !hasAllow) {
      console.log(`❌ ${pattern}: Blocked (will cause SEO issues)`);
    } else if (hasAllow && hasDisallow) {
      console.log(`⚠️ ${pattern}: Conflicting rules (check order)`);
    } else {
      console.log(`⚠️ ${pattern}: No specific rule (relies on default)`);
    }
  });
  
  // Check for sitemap
  console.log('\n🗺️ Sitemap Configuration:');
  const hasSitemap = robotsContent.includes('Sitemap:');
  const sitemapUrl = robotsContent.match(/Sitemap:\s*(.+)/);
  
  if (hasSitemap && sitemapUrl) {
    console.log(`✅ Sitemap declared: ${sitemapUrl[1].trim()}`);
  } else {
    console.log('❌ No sitemap declared in robots.txt');
  }
  
  // Overall score
  console.log('\n📊 Test Results:');
  const score = Math.round((passedTests / totalTests) * 100);
  console.log(`🎯 Score: ${score}% (${passedTests}/${totalTests} tests passed)`);
  
  if (score >= 90) {
    console.log('🏆 Excellent! Your robots.txt is properly configured.');
  } else if (score >= 75) {
    console.log('👍 Good! Minor improvements possible.');
  } else if (score >= 50) {
    console.log('⚠️ Fair. Several issues need attention.');
  } else {
    console.log('❌ Poor. Robots.txt needs significant fixes.');
  }
  
  // SEO recommendations
  console.log('\n💡 SEO Recommendations:');
  console.log('• Allow /_next/static/ for CSS and JavaScript files');
  console.log('• Allow /_next/image for optimized images');
  console.log('• Allow /_next/* for all Next.js assets');
  console.log('• Block sensitive areas like /api/* and /admin/*');
  console.log('• Include sitemap URL for better indexing');
  console.log('• Test with Google Search Console after changes');
  
  // Show current robots.txt content
  console.log('\n📄 Current robots.txt content:');
  console.log('─'.repeat(50));
  console.log(robotsContent);
  console.log('─'.repeat(50));
}

function checkUrlAllowed(robotsContent, url) {
  const lines = robotsContent.split('\n').map(line => line.trim());
  let currentUserAgent = '*';
  let allowed = true; // Default to allowed
  
  for (const line of lines) {
    if (line.startsWith('User-agent:')) {
      currentUserAgent = line.split(':')[1].trim();
      continue;
    }
    
    if (currentUserAgent === '*' || currentUserAgent === 'Googlebot') {
      if (line.startsWith('Allow:')) {
        const pattern = line.split(':')[1].trim();
        if (matchesPattern(url, pattern)) {
          allowed = true;
        }
      } else if (line.startsWith('Disallow:')) {
        const pattern = line.split(':')[1].trim();
        if (matchesPattern(url, pattern)) {
          allowed = false;
        }
      }
    }
  }
  
  return allowed;
}

function matchesPattern(url, pattern) {
  if (pattern === '/') return url === '/';
  if (pattern === '') return true; // Empty disallow means allow all
  
  // Convert robots.txt pattern to regex
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\?/g, '\\?')
    .replace(/\+/g, '\\+');
  
  const regex = new RegExp('^' + regexPattern);
  return regex.test(url);
}

// Run the test
testRobotsTxt();