#!/usr/bin/env node

/**
 * Full sitemap test with actual API data
 * Usage: node scripts/test-full-sitemap.js
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

async function testFullSitemap() {
  try {
    console.log('🚀 Testing full sitemap generation with real data...');
    
    // Load environment variables
    loadEnvFile();
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    console.log('Base URL:', baseUrl);
    console.log('API URL:', apiBaseUrl);
    
    // Static pages
    const staticPages = [
      { url: baseUrl, priority: 1.0, changeFreq: 'daily' },
      { url: `${baseUrl}/shop`, priority: 0.9, changeFreq: 'daily' },
      { url: `${baseUrl}/shop-category`, priority: 0.8, changeFreq: 'daily' },
      { url: `${baseUrl}/shop-right-sidebar`, priority: 0.7, changeFreq: 'daily' },
      { url: `${baseUrl}/shop-hidden-sidebar`, priority: 0.7, changeFreq: 'daily' },
      { url: `${baseUrl}/blog`, priority: 0.8, changeFreq: 'weekly' },
      { url: `${baseUrl}/blog-grid`, priority: 0.7, changeFreq: 'weekly' },
      { url: `${baseUrl}/blog-list`, priority: 0.7, changeFreq: 'weekly' },
      { url: `${baseUrl}/cart`, priority: 0.6, changeFreq: 'daily' },
      { url: `${baseUrl}/wishlist`, priority: 0.6, changeFreq: 'daily' },
      { url: `${baseUrl}/compare`, priority: 0.6, changeFreq: 'daily' },
      { url: `${baseUrl}/checkout`, priority: 0.6, changeFreq: 'daily' },
      { url: `${baseUrl}/contact`, priority: 0.7, changeFreq: 'monthly' },
      { url: `${baseUrl}/search`, priority: 0.6, changeFreq: 'daily' },
      { url: `${baseUrl}/login`, priority: 0.5, changeFreq: 'monthly' },
      { url: `${baseUrl}/register`, priority: 0.5, changeFreq: 'monthly' },
      { url: `${baseUrl}/forgot`, priority: 0.4, changeFreq: 'monthly' },
      { url: `${baseUrl}/profile`, priority: 0.5, changeFreq: 'weekly' },
      { url: `${baseUrl}/coupon`, priority: 0.5, changeFreq: 'weekly' },
    ];
    
    // Fetch products
    console.log('\n🔍 Fetching products from API...');
    let productPages = [];
    
    try {
      const response = await fetch(`${apiBaseUrl}/product/?limit=200`);
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data)) {
          console.log(`✅ Found ${data.data.length} products`);
          
          productPages = data.data
            .filter(product => product.productslug || product.slug)
            .map(product => ({
              url: `${baseUrl}/fabric/${product.productslug || product.slug}`,
              priority: 0.8,
              changeFreq: 'weekly',
              lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            }));
          
          console.log(`✅ Generated ${productPages.length} product URLs`);
          
          // Show sample product URLs
          console.log('\n📋 Sample product URLs:');
          productPages.slice(0, 5).forEach((item, index) => {
            console.log(`${index + 1}. ${item.url}`);
          });
        }
      } else {
        console.log(`❌ Products API: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Products API Error: ${error.message}`);
    }
    
    // Mock blog pages (since we don't have the blog data file accessible here)
    const blogPages = [
      { url: `${baseUrl}/blog-details/1`, priority: 0.6, changeFreq: 'monthly' },
      { url: `${baseUrl}/blog-details/2`, priority: 0.6, changeFreq: 'monthly' },
      { url: `${baseUrl}/blog-details-2/1`, priority: 0.6, changeFreq: 'monthly' },
      { url: `${baseUrl}/blog-details-2/2`, priority: 0.6, changeFreq: 'monthly' },
    ];
    
    // Combine all pages
    const allPages = [
      ...staticPages,
      ...productPages,
      ...blogPages,
    ];
    
    // Sort by priority
    allPages.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.lastModified || new Date()) - new Date(a.lastModified || new Date());
    });
    
    console.log('\n📊 Full Sitemap Statistics:');
    console.log(`Total URLs: ${allPages.length}`);
    console.log(`Static pages: ${staticPages.length}`);
    console.log(`Product pages: ${productPages.length}`);
    console.log(`Blog pages: ${blogPages.length}`);
    
    // Generate XML
    const xmlContent = generateSitemapXML(allPages);
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'public', 'sitemap-full.xml');
    fs.writeFileSync(outputPath, xmlContent, 'utf8');
    
    console.log(`\n✅ Full sitemap generated successfully!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`🌐 Preview URL: ${baseUrl}/sitemap-full.xml`);
    
    // Show top URLs by priority
    console.log('\n🏆 Top 10 URLs by priority:');
    allPages.slice(0, 10).forEach((item, index) => {
      console.log(`${index + 1}. ${item.url} (Priority: ${item.priority})`);
    });
    
    console.log(`\n🎯 Your live sitemap will be available at: ${baseUrl}/sitemap.xml`);
    
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
    const lastmod = item.lastModified ? 
      new Date(item.lastModified).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0];
    
    return `  <url>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${item.changeFreq || 'weekly'}</changefreq>
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
testFullSitemap();