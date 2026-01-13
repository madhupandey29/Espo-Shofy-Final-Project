#!/usr/bin/env node

/**
 * Simple sitemap test script
 * Usage: node scripts/test-sitemap-simple.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.log('No .env.local file found, using default values');
  }
}

async function testSitemapGeneration() {
  try {
    console.log('🚀 Testing sitemap generation...');
    
    // Load environment variables
    loadEnvFile();
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://espo-shofy-final-project.vercel.app';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api';
    
    console.log('Base URL:', baseUrl);
    console.log('API URL:', apiBaseUrl);
    
    // Test API connectivity
    console.log('\n🔍 Testing API connectivity...');
    
    try {
      const response = await fetch(`${apiBaseUrl}/product/?limit=10`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Products API: ${data.data ? data.data.length : 0} products found`);
        
        // Show sample product data
        if (data.data && data.data.length > 0) {
          const sample = data.data[0];
          console.log('📋 Sample product:', {
            name: sample.name,
            slug: sample.productslug || sample.slug,
            hasSlug: !!(sample.productslug || sample.slug)
          });
        }
      } else {
        console.log(`❌ Products API: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Products API: ${error.message}`);
    }
    
    // Generate basic sitemap structure
    const staticPages = [
      { url: baseUrl, priority: 1.0 },
      { url: `${baseUrl}/shop`, priority: 0.9 },
      { url: `${baseUrl}/blog`, priority: 0.8 },
      { url: `${baseUrl}/contact`, priority: 0.7 },
      { url: `${baseUrl}/cart`, priority: 0.6 },
      { url: `${baseUrl}/wishlist`, priority: 0.6 },
      { url: `${baseUrl}/login`, priority: 0.5 },
      { url: `${baseUrl}/register`, priority: 0.5 },
    ];
    
    console.log('\n📊 Basic Sitemap Structure:');
    console.log(`Static pages: ${staticPages.length}`);
    
    // Generate XML
    const xmlContent = generateSitemapXML(staticPages);
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'public', 'sitemap-test.xml');
    fs.writeFileSync(outputPath, xmlContent, 'utf8');
    
    console.log(`\n✅ Test sitemap generated!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`🌐 Test URL: ${baseUrl}/sitemap-test.xml`);
    
    // Show URLs
    console.log('\n📋 Generated URLs:');
    staticPages.forEach((item, index) => {
      console.log(`${index + 1}. ${item.url} (Priority: ${item.priority})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

function generateSitemapXML(sitemapData) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  const xmlFooter = `</urlset>`;
  
  const xmlUrls = sitemapData.map(item => {
    const lastmod = new Date().toISOString().split('T')[0];
    
    return `  <url>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${item.priority || 0.5}</priority>
  </url>`;
  }).join('\n');
  
  return `${xmlHeader}\n${xmlUrls}\n${xmlFooter}`;
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Run the script
testSitemapGeneration();