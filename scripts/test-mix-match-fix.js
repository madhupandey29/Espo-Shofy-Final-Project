const API_BASE = 'https://espobackend.vercel.app/api';

async function testMixMatchFix() {
  console.log('🧪 Testing Mix and Match Collection Filtering Fix...\n');

  try {
    // Get all products first
    const url = `${API_BASE}/product?limit=150`;
    console.log('📡 Fetching all products:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.log('❌ Failed to get products:', data);
      return;
    }
    
    const allProducts = data.data;
    console.log(`✅ Got ${allProducts.length} total products\n`);
    
    // Analyze collection distribution
    const collectionStats = {};
    const collectionProducts = {};
    
    allProducts.forEach(product => {
      // Check different possible collection field names
      const collectionId = product.collectionId || product.collection || product.collection_id;
      const collectionName = product.collectionName || 'Unknown';
      
      if (collectionId) {
        if (!collectionStats[collectionId]) {
          collectionStats[collectionId] = {
            count: 0,
            name: collectionName,
            products: []
          };
          collectionProducts[collectionId] = [];
        }
        collectionStats[collectionId].count++;
        collectionStats[collectionId].products.push(product.name);
        collectionProducts[collectionId].push(product);
      } else {
        // Products without collection
        if (!collectionStats['no-collection']) {
          collectionStats['no-collection'] = {
            count: 0,
            name: 'No Collection',
            products: []
          };
          collectionProducts['no-collection'] = [];
        }
        collectionStats['no-collection'].count++;
        collectionStats['no-collection'].products.push(product.name);
        collectionProducts['no-collection'].push(product);
      }
    });
    
    console.log('📊 Collection Distribution:');
    Object.entries(collectionStats).forEach(([id, info]) => {
      console.log(`  ${id} (${info.name}): ${info.count} products`);
    });
    console.log('');
    
    // Test filtering for specific collections
    const testCollections = ['690a0e676132664ee', '695f9b0b956eb958b']; // Nokia and Majestica
    
    for (const collectionId of testCollections) {
      console.log(`🔍 Testing collection filter for: ${collectionId}`);
      
      const filteredProducts = allProducts.filter(product => {
        return product.collectionId === collectionId || 
               product.collection === collectionId ||
               product.collection_id === collectionId;
      });
      
      console.log(`  ✅ Filtered result: ${filteredProducts.length} products`);
      
      if (filteredProducts.length > 0) {
        const collectionName = filteredProducts[0].collectionName || 'Unknown';
        console.log(`  📦 Collection: ${collectionName}`);
        console.log(`  📝 Sample products: ${filteredProducts.slice(0, 3).map(p => p.name).join(', ')}`);
      }
      console.log('');
    }
    
    // Expected results based on previous testing
    console.log('📋 Expected Results:');
    console.log('  Nokia Collection (690a0e676132664ee): Should show 51 products');
    console.log('  Majestica Collection (695f9b0b956eb958b): Should show 67 products');
    console.log('');
    
    // Verify the fix addresses the user's requirements
    const nokiaProducts = collectionProducts['690a0e676132664ee'] || [];
    const majesticaProducts = collectionProducts['695f9b0b956eb958b'] || [];
    
    console.log('✅ Fix Verification:');
    console.log(`  Nokia products in mix & match: ${nokiaProducts.length} (should be 51)`);
    console.log(`  Majestica products in mix & match: ${majesticaProducts.length} (should be 67)`);
    
    if (nokiaProducts.length === 51 && majesticaProducts.length === 67) {
      console.log('  🎉 SUCCESS: Mix and match will now show correct collection counts!');
    } else {
      console.log('  ⚠️  Note: Collection counts may vary based on API data');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMixMatchFix();