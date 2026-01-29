#!/usr/bin/env node

/**
 * Security Headers Testing Script
 * Tests if security headers are properly configured
 * Usage: node scripts/test-security-headers.js
 */

const https = require('https');
const http = require('http');

function testSecurityHeaders() {
  // Load environment variables
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
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
    let score = 0;
    let totalTests = Object.keys(expectedHeaders).length;
    
    // Check each expected header
    Object.entries(expectedHeaders).forEach(([headerName, expectedValue]) => {
      const actualValue = res.headers[headerName.toLowerCase()];
      
      if (actualValue) {
        if (expectedValue === true) {
          // Just check if header exists
          score++;
        } else if (actualValue === expectedValue) {
          score++;
        } else {
          }
      } else {
        }
    });
    
    // Additional security checks
    // Check if X-Powered-By is hidden
    const poweredBy = res.headers['x-powered-by'];
    if (!poweredBy) {
      score++;
      totalTests++;
    } else {
      totalTests++;
    }
    
    // Check Server header
    const server = res.headers['server'];
    if (server) {
      } else {
      }
    
    // Calculate security score
    const securityScore = Math.round((score / totalTests) * 100);
    if (securityScore >= 90) {
      } else if (securityScore >= 75) {
      } else if (securityScore >= 50) {
      } else {
      }
  });
  
  req.on('error', (error) => {
    if (error.code === 'ECONNREFUSED') {
      } else if (error.code === 'ENOTFOUND') {
      } else {
      }
  });
  
  req.on('timeout', () => {
    req.destroy();
  });
  
  req.end();
}

// Security recommendations
function showRecommendations() {
  }

// Run tests
testSecurityHeaders();

setTimeout(() => {
  showRecommendations();
}, 2000);