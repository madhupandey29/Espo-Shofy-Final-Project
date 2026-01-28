#!/usr/bin/env node

/**
 * Security Headers Testing Script
 * Tests if security headers are properly configured
 * Usage: node scripts/test-security-headers.js
 */

const https = require('https');
const http = require('http');

function testSecurityHeaders() {
  console.log('🔒 Testing security headers...\n');
  
  // Load environment variables
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://espo-shofy-final-project.vercel.app';
  
  console.log(`Testing: ${siteUrl}`);
  
  // Expected security headers
  const expectedHeaders = {
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-frame-options': 'SAMEORIGIN',
    'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    'x-dns-prefetch-control': 'on',
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
    'content-security-policy': true, // Just check if present
  };
  
  // Test local development server
  testUrl('http://localhost:3000', 'Local Development', expectedHeaders);
  
  // Test production site
  testUrl(siteUrl, 'Production Site', expectedHeaders);
}

function testUrl(url, label, expectedHeaders) {
  console.log(`\n🌐 Testing ${label}: ${url}`);
  console.log('─'.repeat(60));
  
  const urlObj = new URL(url);
  const isHttps = urlObj.protocol === 'https:';
  const client = isHttps ? https : http;
  
  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || (isHttps ? 443 : 80),
    path: urlObj.pathname,
    method: 'HEAD',
    timeout: 10000,
  };
  
  const req = client.request(options, (res) => {
    console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
    
    let score = 0;
    let totalTests = Object.keys(expectedHeaders).length;
    
    // Check each expected header
    Object.entries(expectedHeaders).forEach(([headerName, expectedValue]) => {
      const actualValue = res.headers[headerName.toLowerCase()];
      
      if (actualValue) {
        if (expectedValue === true) {
          // Just check if header exists
          console.log(`✅ ${headerName}: Present`);
          score++;
        } else if (actualValue === expectedValue) {
          console.log(`✅ ${headerName}: ${actualValue}`);
          score++;
        } else {
          console.log(`⚠️ ${headerName}: ${actualValue} (expected: ${expectedValue})`);
        }
      } else {
        console.log(`❌ ${headerName}: Missing`);
      }
    });
    
    // Additional security checks
    console.log('\n📊 Additional Security Checks:');
    
    // Check if X-Powered-By is hidden
    const poweredBy = res.headers['x-powered-by'];
    if (!poweredBy) {
      console.log('✅ X-Powered-By: Hidden (good for security)');
      score++;
      totalTests++;
    } else {
      console.log(`⚠️ X-Powered-By: ${poweredBy} (consider hiding)`);
      totalTests++;
    }
    
    // Check Server header
    const server = res.headers['server'];
    if (server) {
      console.log(`ℹ️ Server: ${server}`);
    } else {
      console.log('✅ Server: Hidden');
    }
    
    // Calculate security score
    const securityScore = Math.round((score / totalTests) * 100);
    console.log(`\n🎯 Security Score: ${securityScore}% (${score}/${totalTests})`);
    
    if (securityScore >= 90) {
      console.log('🏆 Excellent! Your security headers are well configured.');
    } else if (securityScore >= 75) {
      console.log('👍 Good! Minor security improvements possible.');
    } else if (securityScore >= 50) {
      console.log('⚠️ Fair. Several security headers need attention.');
    } else {
      console.log('❌ Poor. Security headers need significant improvement.');
    }
  });
  
  req.on('error', (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - server not running');
    } else if (error.code === 'ENOTFOUND') {
      console.log('❌ Domain not found');
    } else {
      console.log(`❌ Error: ${error.message}`);
    }
  });
  
  req.on('timeout', () => {
    console.log('❌ Request timeout');
    req.destroy();
  });
  
  req.end();
}

// Security recommendations
function showRecommendations() {
  console.log('\n💡 Security Header Recommendations for E-commerce:');
  console.log('');
  console.log('🔒 Essential Headers:');
  console.log('• X-Content-Type-Options: Prevents MIME type sniffing');
  console.log('• X-Frame-Options: Protects against clickjacking');
  console.log('• Referrer-Policy: Controls referrer information leakage');
  console.log('• Content-Security-Policy: Prevents XSS and injection attacks');
  console.log('');
  console.log('🛡️ Additional Protection:');
  console.log('• Strict-Transport-Security: Enforces HTTPS connections');
  console.log('• Permissions-Policy: Disables unnecessary browser features');
  console.log('• X-DNS-Prefetch-Control: Controls DNS prefetching');
  console.log('');
  console.log('🏪 E-commerce Specific:');
  console.log('• Protect customer data during checkout');
  console.log('• Prevent product image manipulation');
  console.log('• Secure payment form submissions');
  console.log('• Protect against cart hijacking');
}

// Run tests
console.log('🔒 Security Headers Test for eCatalogue Fabric Store');
console.log('═'.repeat(60));

testSecurityHeaders();

setTimeout(() => {
  showRecommendations();
}, 2000);