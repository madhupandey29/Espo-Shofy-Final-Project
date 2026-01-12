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

// Simulate the filtering logic from shop-area.jsx
const PROPERTY_MAP = Object.freeze({
  category: 'category',
  color: 'color',
  content: 'content',
  design: 'design',
  structure: 'structure',
  finish: 'finish',
  motif: 'motif',
  collectionId: 'collectionId',
  vendor: 'vendor',
  suitablefor: 'subsuitable',
  motifsize: 'motif',
  substructure: 'substructure',
  subfinish: 'subfinish',
  subsuitable: 'subsuitable',
});

function applyFilters(products, selectedFilters) {
  const active = Object.entries(selectedFilters).filter(([, arr]) => arr.length);
  if (!active.length) return products;
  
  return products.filter(pr =>
    active.every(([key, vals]) => {
      const prop = PROPERTY_MAP[key];
      if (!prop || !pr[prop]) return false;
      const field = pr[prop];
      
      // Handle array fields
      if (Array.isArray(field)) {
        return field.some(x => vals.includes(x._id ?? x));
      }
      
      // Handle comma-separated string fields (like finish)
      if (typeof field === 'string' && field.includes(',')) {
        const fieldValues = field.split(',').map(v => v.trim());
        return vals.some(val => fieldValues.includes(val));
      }
      
      // Handle regular fields
      return vals.includes(field._id ?? field);
    })
  );
}

async function testFilterFix() {
  console.log('=== Testing Filter Fix ===\n');
  
  // 1. Get products
  const productsRes = await fetchJson('https://espobackend.vercel.app/api/product?limit=10');
  
  if (!productsRes.ok || !productsRes.json?.data) {
    console.log('❌ Failed to fetch products');
    return;
  }
  
  const products = productsRes.json.data;
  console.log(`✅ Found ${products.length} products\n`);
  
  // 2. Test design filter
  console.log('2. Testing design filter:');
  const designFilter = { design: ['Solid Dyed'] };
  const designFiltered = applyFilters(products, designFilter);
  console.log(`   Filter: design = "Solid Dyed"`);
  console.log(`   Result: ${designFiltered.length} products match`);
  console.log(`   Expected: ${products.filter(p => p.design === 'Solid Dyed').length} products\n`);
  
  // 3. Test structure filter
  console.log('3. Testing structure filter:');
  const structureFilter = { structure: ['Plain / Poplin'] };
  const structureFiltered = applyFilters(products, structureFilter);
  console.log(`   Filter: structure = "Plain / Poplin"`);
  console.log(`   Result: ${structureFiltered.length} products match`);
  console.log(`   Expected: ${products.filter(p => p.structure === 'Plain / Poplin').length} products\n`);
  
  // 4. Test finish filter (comma-separated)
  console.log('4. Testing finish filter:');
  const finishFilter = { finish: ['Chemical - Mercerized'] };
  const finishFiltered = applyFilters(products, finishFilter);
  console.log(`   Filter: finish = "Chemical - Mercerized"`);
  console.log(`   Result: ${finishFiltered.length} products match`);
  console.log(`   Expected: ${products.filter(p => p.finish && p.finish.includes('Chemical - Mercerized')).length} products\n`);
  
  // 5. Test motif filter
  console.log('5. Testing motif filter:');
  const motifFilter = { motif: ['Medium'] };
  const motifFiltered = applyFilters(products, motifFilter);
  console.log(`   Filter: motif = "Medium"`);
  console.log(`   Result: ${motifFiltered.length} products match`);
  console.log(`   Expected: ${products.filter(p => p.motif === 'Medium').length} products\n`);
  
  // 6. Test combined filters
  console.log('6. Testing combined filters:');
  const combinedFilter = { 
    design: ['Solid Dyed'], 
    finish: ['Chemical - Mercerized'] 
  };
  const combinedFiltered = applyFilters(products, combinedFilter);
  console.log(`   Filter: design = "Solid Dyed" AND finish = "Chemical - Mercerized"`);
  console.log(`   Result: ${combinedFiltered.length} products match\n`);
  
  // 7. Show sample product data
  console.log('7. Sample product data:');
  if (products.length > 0) {
    const sample = products[0];
    console.log(`   Product: ${sample.productTitle || sample.name}`);
    console.log(`   design: "${sample.design}"`);
    console.log(`   structure: "${sample.structure}"`);
    console.log(`   finish: "${sample.finish}"`);
    console.log(`   motif: "${sample.motif}"`);
  }
  
  console.log('\n=== Test Complete ===');
}

testFilterFix().catch(console.error);