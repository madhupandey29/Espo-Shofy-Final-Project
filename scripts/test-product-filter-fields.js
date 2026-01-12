const https = require('https');

const API_BASE = 'https://espobackend.vercel.app/api';

async function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ ok: res.statusCode === 200, json, status: res.statusCode });
        } catch (e) {
          resolve({ ok: false, json: null, status: res.statusCode });
        }
      });
    }).on('error', (e) => {
      resolve({ ok: false, json: null, error: e.message });
    });
  });
}

async function testProductFilterFields() {
  console.log('=== Testing Product Filter Fields ===\n');
  
  // 1. Test products endpoint
  console.log('1. Fetching products...');
  const productsRes = await fetchJson(`${API_BASE}/product?limit=5`);
  
  if (!productsRes.ok || !productsRes.json?.data) {
    console.log('❌ Failed to fetch products');
    console.log('Status:', productsRes.status);
    console.log('Error:', productsRes.error);
    return;
  }
  
  const products = productsRes.json.data;
  console.log(`✅ Found ${products.length} products\n`);
  
  // 2. Check filter fields in products
  console.log('2. Checking filter fields in products:');
  
  const filterFields = ['design', 'structure', 'finish', 'motif'];
  const fieldVariations = {
    design: ['design', 'designName'],
    structure: ['structure', 'structureName', 'substructure'],
    finish: ['finish', 'finishName', 'subfinish'],
    motif: ['motif', 'motifName']
  };
  
  products.forEach((product, index) => {
    console.log(`\nProduct ${index + 1}: ${product.productTitle || product.name || 'Unnamed'}`);
    console.log(`ID: ${product.id || product._id}`);
    
    filterFields.forEach(field => {
      const variations = fieldVariations[field];
      let found = false;
      let value = null;
      
      for (const variation of variations) {
        if (product[variation] !== undefined && product[variation] !== null && product[variation] !== '') {
          value = product[variation];
          found = true;
          console.log(`  ${field}: ✅ ${variation} = "${value}"`);
          break;
        }
      }
      
      if (!found) {
        console.log(`  ${field}: ❌ Not found (checked: ${variations.join(', ')})`);
      }
    });
  });
  
  // 3. Test field values API endpoints
  console.log('\n\n3. Testing field values API endpoints:');
  
  for (const field of filterFields) {
    console.log(`\nTesting /api/field-values/${field}:`);
    const fieldRes = await fetchJson(`${API_BASE}/field-values/${field}`);
    
    if (fieldRes.ok && fieldRes.json?.values) {
      console.log(`✅ ${field} endpoint working`);
      console.log(`   Found ${fieldRes.json.values.length} values`);
      if (fieldRes.json.values.length > 0) {
        console.log(`   Sample values: ${fieldRes.json.values.slice(0, 3).map(v => typeof v === 'string' ? v : v.value || v.name).join(', ')}`);
      }
    } else {
      console.log(`❌ ${field} endpoint failed`);
      console.log(`   Status: ${fieldRes.status}`);
      console.log(`   Error: ${fieldRes.error || 'Unknown'}`);
    }
  }
  
  console.log('\n=== Test Complete ===');
}

testProductFilterFields().catch(console.error);