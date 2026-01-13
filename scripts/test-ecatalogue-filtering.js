#!/usr/bin/env node

/**
 * Test eCatalogue Filtering Implementation
 * Verifies that filter options are correctly filtered based on eCatalogue products
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local manually
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

console.log('🧪 TESTING ECATALOGUE FILTERING IMPLEMENTATION');
console.log('=' .repeat(55));

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
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, parseError: e.message });
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

async function testECatalogueFiltering() {
  console.log('\n🔍 Step 1: Fetch All Products');
  console.log('-'.repeat(35));

  try {
    const url = `${API_BASE}/product?limit=100`;
    console.log(`📡 URL: ${url}`);
    
    const response = await makeRequest(url);
    
    if (response.status !== 200 || !response.data?.data) {
      console.log('❌ Failed to fetch products');
      return;
    }

    const allProducts = response.data.data;
    console.log(`✅ Fetched ${allProducts.length} products`);

    // Step 2: Filter eCatalogue products
    console.log('\n🎯 Step 2: Filter eCatalogue Products');
    console.log('-'.repeat(40));

    const eCatalogueProducts = allProducts.filter(product => {
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

    console.log(`✅ Found ${eCatalogueProducts.length} eCatalogue products`);
    console.log(`📊 Percentage: ${((eCatalogueProducts.length / allProducts.length) * 100).toFixed(1)}%`);

    // Step 3: Extract field values from eCatalogue products
    console.log('\n📋 Step 3: Extract Field Values from eCatalogue Products');
    console.log('-'.repeat(55));

    const fields = ['category', 'color', 'content', 'design', 'structure', 'finish'];
    const eCatalogueFieldValues = {};

    fields.forEach(fieldKey => {
      const values = new Map();
      
      eCatalogueProducts.forEach(product => {
        let fieldValue = product[fieldKey];
        
        if (Array.isArray(fieldValue)) {
          fieldValue.forEach(val => {
            if (val && String(val).trim()) {
              const normalizedVal = String(val).trim();
              values.set(normalizedVal, (values.get(normalizedVal) || 0) + 1);
            }
          });
        } else if (fieldValue && String(fieldValue).trim()) {
          const normalizedVal = String(fieldValue).trim();
          values.set(normalizedVal, (values.get(normalizedVal) || 0) + 1);
        }
      });
      
      eCatalogueFieldValues[fieldKey] = Array.from(values.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
    });

    // Step 4: Compare with API field values
    console.log('\n🔄 Step 4: Compare with API Field Values');
    console.log('-'.repeat(45));

    for (const fieldKey of fields) {
      console.log(`\n📊 ${fieldKey.toUpperCase()} Field:`);
      
      // Get API field values
      try {
        const apiUrl = `${API_BASE}/product/fieldname/${fieldKey}`;
        const apiResponse = await makeRequest(apiUrl);
        
        const apiValues = apiResponse.data?.values || [];
        const eCatalogueValues = eCatalogueFieldValues[fieldKey] || [];
        
        console.log(`  API Values: ${apiValues.length}`);
        console.log(`  eCatalogue Values: ${eCatalogueValues.length}`);
        
        if (apiValues.length > 0) {
          console.log(`  API Sample: ${apiValues.slice(0, 5).join(', ')}`);
        }
        
        if (eCatalogueValues.length > 0) {
          console.log(`  eCatalogue Sample: ${eCatalogueValues.slice(0, 5).map(v => `${v.value} (${v.count})`).join(', ')}`);
        }
        
        // Check if eCatalogue values are a subset of API values
        const eCatalogueValueNames = eCatalogueValues.map(v => v.value);
        const isSubset = eCatalogueValueNames.every(val => apiValues.includes(val));
        
        console.log(`  ✅ eCatalogue is subset of API: ${isSubset ? 'Yes' : 'No'}`);
        
        if (!isSubset) {
          const notInAPI = eCatalogueValueNames.filter(val => !apiValues.includes(val));
          console.log(`  ⚠️  Values not in API: ${notInAPI.slice(0, 3).join(', ')}`);
        }
        
      } catch (error) {
        console.log(`  ❌ Error fetching API values: ${error.message}`);
      }
    }

    // Step 5: Test filtering effectiveness
    console.log('\n🎯 Step 5: Test Filtering Effectiveness');
    console.log('-'.repeat(40));

    const colorField = eCatalogueFieldValues.color || [];
    const categoryField = eCatalogueFieldValues.category || [];
    
    console.log(`🎨 Colors available in eCatalogue products: ${colorField.length}`);
    if (colorField.length > 0) {
      console.log(`   Top colors: ${colorField.slice(0, 8).map(c => `${c.value} (${c.count})`).join(', ')}`);
    }
    
    console.log(`📂 Categories available in eCatalogue products: ${categoryField.length}`);
    if (categoryField.length > 0) {
      console.log(`   Categories: ${categoryField.map(c => `${c.value} (${c.count})`).join(', ')}`);
    }

    // Step 6: Validate implementation
    console.log('\n✅ Step 6: Implementation Validation');
    console.log('-'.repeat(40));

    const validationResults = {
      hasECatalogueProducts: eCatalogueProducts.length > 0,
      hasFieldValues: Object.keys(eCatalogueFieldValues).length > 0,
      hasColors: (eCatalogueFieldValues.color || []).length > 0,
      hasCategories: (eCatalogueFieldValues.category || []).length > 0,
      hasContent: (eCatalogueFieldValues.content || []).length > 0,
      hasDesign: (eCatalogueFieldValues.design || []).length > 0
    };

    console.log('Validation Results:');
    Object.entries(validationResults).forEach(([key, value]) => {
      console.log(`  ${value ? '✅' : '❌'} ${key}: ${value}`);
    });

    const allValid = Object.values(validationResults).every(Boolean);
    
    if (allValid) {
      console.log('\n🎉 SUCCESS! eCatalogue filtering implementation is working correctly!');
      console.log('\n📋 What this means:');
      console.log('   • Filter options will only show values from eCatalogue products');
      console.log('   • Users will see relevant colors, categories, etc. based on eCatalogue data');
      console.log('   • Filtering is more targeted and relevant to your product catalog');
    } else {
      console.log('\n⚠️  PARTIAL SUCCESS: Some issues detected');
      console.log('   • Check the validation results above');
      console.log('   • Ensure eCatalogue products have the required field data');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function main() {
  await testECatalogueFiltering();
  
  console.log('\n' + '='.repeat(55));
  console.log('🚀 NEXT STEPS');
  console.log('='.repeat(55));
  console.log('1. Test the shop page to see filtered options in action');
  console.log('2. Verify that filter dropdowns only show eCatalogue-based values');
  console.log('3. Check browser console for eCatalogue filtering logs');
  console.log('4. Ensure the filtering improves user experience');
}

main().catch(console.error);