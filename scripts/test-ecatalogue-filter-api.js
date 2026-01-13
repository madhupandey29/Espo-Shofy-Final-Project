#!/usr/bin/env node

/**
 * Test eCatalogue Filter API Endpoint
 * Tests if the API supports filtering field values by eCatalogue products
 */

const https = require('https');
const http = require('http');

// Load environment variables from .env.local manually
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  } catch (error) {
    console.log('Note: Could not load .env.local file');
  }
}

loadEnvFile();

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/landing';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

console.log('🧪 TESTING ECATALOGUE FILTER API ENDPOINT');
console.log('=' .repeat(50));
console.log('API Base:', API_BASE);
console.log('API Key:', API_KEY ? 'Present' : 'Not set');

async function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;
    
    const options = {
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'x-api-key': API_KEY }),
        ...headers
      }
    };

    const req = client.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers, parseError: e.message });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testECatalogueFilterEndpoint() {
  console.log('\n🔍 Testing eCatalogue Filter Endpoint...');
  console.log('-'.repeat(40));

  const testFields = ['color', 'category', 'content', 'design'];
  
  for (const field of testFields) {
    try {
      const url = `${API_BASE}/product/fieldname/${field}/filter/ecatalogue`;
      console.log(`\n📡 Testing: ${field}`);
      console.log(`URL: ${url}`);
      
      const response = await makeRequest(url);
      
      console.log(`Status: ${response.status}`);
      
      if (response.status === 200) {
        console.log('✅ Endpoint exists and working');
        console.log('Response structure:', {
          success: response.data?.success,
          dataType: Array.isArray(response.data?.data) ? 'array' : typeof response.data?.data,
          dataLength: response.data?.data?.length || 0,
          hasValues: !!response.data?.values,
          valuesLength: response.data?.values?.length || 0
        });
        
        if (response.data?.data?.length > 0) {
          console.log('Sample values:', response.data.data.slice(0, 3));
        } else if (response.data?.values?.length > 0) {
          console.log('Sample values:', response.data.values.slice(0, 3));
        }
      } else if (response.status === 404) {
        console.log('❌ Endpoint not found (404)');
      } else {
        console.log('⚠️ Unexpected status:', response.status);
        console.log('Response:', response.data);
      }
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

async function testRegularFieldEndpoint() {
  console.log('\n🔍 Testing Regular Field Endpoint (for comparison)...');
  console.log('-'.repeat(50));

  try {
    const url = `${API_BASE}/product/fieldname/color`;
    console.log(`📡 URL: ${url}`);
    
    const response = await makeRequest(url);
    
    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Regular endpoint working');
      console.log('Response structure:', {
        success: response.data?.success,
        dataType: Array.isArray(response.data?.data) ? 'array' : typeof response.data?.data,
        dataLength: response.data?.data?.length || 0,
        hasValues: !!response.data?.values,
        valuesLength: response.data?.values?.length || 0
      });
      
      if (response.data?.data?.length > 0) {
        console.log('Sample values:', response.data.data.slice(0, 5));
      } else if (response.data?.values?.length > 0) {
        console.log('Sample values:', response.data.values.slice(0, 5));
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function testProductsWithECatalogue() {
  console.log('\n🔍 Testing Products with eCatalogue...');
  console.log('-'.repeat(40));

  try {
    const url = `${API_BASE}/product?limit=50`;
    console.log(`📡 URL: ${url}`);
    
    const response = await makeRequest(url);
    
    if (response.status === 200 && response.data?.data) {
      const products = response.data.data;
      console.log(`Total products fetched: ${products.length}`);
      
      // Find products with eCatalogue in various fields
      const eCatalogueProducts = products.filter(product => {
        const searchFields = [
          product.name,
          product.title,
          product.description,
          product.category,
          product.brand,
          product.tags?.join(' '),
          product.merchTags?.join(' '),
          JSON.stringify(product)
        ].filter(Boolean);
        
        return searchFields.some(field => 
          String(field).toLowerCase().includes('ecatalogue')
        );
      });
      
      console.log(`Products with eCatalogue: ${eCatalogueProducts.length}`);
      
      if (eCatalogueProducts.length > 0) {
        console.log('\n📋 eCatalogue Products Sample:');
        eCatalogueProducts.slice(0, 3).forEach((product, index) => {
          console.log(`${index + 1}. ${product.name || product.title || 'Unnamed'}`);
          console.log(`   Category: ${product.category || 'N/A'}`);
          console.log(`   Color: ${product.color || 'N/A'}`);
          console.log(`   Brand: ${product.brand || 'N/A'}`);
        });
        
        // Extract unique colors from eCatalogue products
        const eCatalogueColors = [...new Set(
          eCatalogueProducts
            .map(p => p.color)
            .filter(Boolean)
        )];
        
        console.log(`\n🎨 Unique colors in eCatalogue products: ${eCatalogueColors.length}`);
        console.log('Colors:', eCatalogueColors.slice(0, 10));
        
        // Extract unique categories from eCatalogue products
        const eCatalogueCategories = [...new Set(
          eCatalogueProducts
            .map(p => p.category)
            .filter(Boolean)
        )];
        
        console.log(`\n📂 Unique categories in eCatalogue products: ${eCatalogueCategories.length}`);
        console.log('Categories:', eCatalogueCategories);
        
      } else {
        console.log('❌ No products found with eCatalogue in their data');
        
        // Show sample product structure
        if (products.length > 0) {
          console.log('\n📋 Sample product structure:');
          const sample = products[0];
          console.log('Fields:', Object.keys(sample));
          console.log('Sample product:', {
            name: sample.name,
            title: sample.title,
            category: sample.category,
            color: sample.color,
            brand: sample.brand,
            tags: sample.tags,
            merchTags: sample.merchTags
          });
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function main() {
  await testRegularFieldEndpoint();
  await testECatalogueFilterEndpoint();
  await testProductsWithECatalogue();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log('1. If eCatalogue filter endpoint exists (200 status), we can use it directly');
  console.log('2. If not (404 status), we\'ll implement client-side filtering');
  console.log('3. Client-side approach: fetch all products, filter by eCatalogue, extract field values');
  console.log('\n🚀 Next steps will be determined based on these results');
}

main().catch(console.error);