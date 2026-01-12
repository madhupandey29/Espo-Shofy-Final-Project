const https = require('https');

async function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ ok: res.statusCode === 200, json });
        } catch (e) {
          resolve({ ok: false, json: null });
        }
      });
    }).on('error', () => resolve({ ok: false, json: null }));
  });
}

async function testProductFiltering() {
  console.log('=== Testing Product Filtering ===\n');
  
  // 1. Get all products
  const allProductsUrl = 'https://espobackend.vercel.app/api/product?limit=10';
  console.log('1. Fetching all products...');
  
  const allRes = await fetchJson(allProductsUrl);
  
  if (!allRes.ok || !allRes.json?.data) {
    console.log('❌ Failed to fetch products');
    return;
  }
  
  const products = allRes.json.data;
  console.log(`✅ Found ${products.length} products\n`);
  
  // 2. Check filter values in products
  console.log('2. Analyzing filter field values:');
  
  const fieldCounts = {
    design: {},
    structure: {},
    finish: {},
    motif: {}
  };
  
  products.forEach(product => {
    ['design', 'structure', 'finish', 'motif'].forEach(field => {
      const value = product[field];
      if (value && value !== 'N/A') {
        fieldCounts[field][value] = (fieldCounts[field][value] || 0) + 1;
      }
    });
  });
  
  Object.entries(fieldCounts).forEach(([field, counts]) => {
    console.log(`\n${field.toUpperCase()}:`);
    Object.entries(counts).forEach(([value, count]) => {
      console.log(`  - ${value} (${count} products)`);
    });
  });
  
  // 3. Test filtering by specific values
  console.log('\n\n3. Testing filter functionality:');
  
  // Test design filter
  const designValue = 'Solid Dyed';
  const designFiltered = products.filter(p => p.design === designValue);
  console.log(`Design filter "${designValue}": ${designFiltered.length} products match`);
  
  // Test structure filter
  const structureValue = 'Plain / Poplin';
  const structureFiltered = products.filter(p => p.structure === structureValue);
  console.log(`Structure filter "${structureValue}": ${structureFiltered.length} products match`);
  
  // Test finish filter (partial match since it contains multiple values)
  const finishValue = 'Chemical - Mercerized';
  const finishFiltered = products.filter(p => p.finish && p.finish.includes(finishValue));
  console.log(`Finish filter "${finishValue}": ${finishFiltered.length} products match`);
  
  // Test motif filter
  const motifValue = 'Medium';
  const motifFiltered = products.filter(p => p.motif === motifValue);
  console.log(`Motif filter "${motifValue}": ${motifFiltered.length} products match`);
  
  // 4. Check if products have these values in their details
  console.log('\n\n4. Checking if filter values appear in product details:');
  
  products.slice(0, 3).forEach((product, index) => {
    console.log(`\nProduct ${index + 1}: ${product.productTitle || product.name}`);
    console.log(`  design: ${product.design}`);
    console.log(`  structure: ${product.structure}`);
    console.log(`  finish: ${product.finish}`);
    console.log(`  motif: ${product.motif}`);
  });
}

testProductFiltering().catch(console.error);