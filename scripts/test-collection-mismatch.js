const API_BASE_URL = 'https://espobackend.vercel.app/api';

async function testCollectionMismatch() {
  console.log('🔍 Testing Collection Mismatch Issue...\n');

  try {
    // Test 1: Get all products and see collection distribution
    console.log('📋 Step 1: Getting all products from general endpoint...');
    const allResponse = await fetch(`${API_BASE_URL}/product?limit=150`);
    
    if (allResponse.ok) {
      const allData = await allResponse.json();
      console.log(`✅ Total products: ${allData.total}`);
      console.log(`✅ Products returned: ${allData.data.length}`);
      
      // Check collection distribution
      const collectionStats = {};
      allData.data.forEach(product => {
        const collectionName = product.collectionName || 'No Collection';
        collectionStats[collectionName] = (collectionStats[collectionName] || 0) + 1;
      });
      
      console.log('\n📦 Collection distribution in general endpoint:');
      Object.entries(collectionStats).forEach(([collection, count]) => {
        console.log(`  ${collection}: ${count} products`);
      });
      
      // Test 2: Test individual collection endpoints
      console.log('\n📋 Step 2: Testing individual collection endpoints...');
      
      const collections = [
        { id: '690a0e676132664ee', name: 'Nokia - 100% Cotton Brushed Super Soft Poplin' },
        { id: '695f9b0b956eb958b', name: 'Majestica - 100% Cotton Bio Finish Twill' }
      ];
      
      for (const collection of collections) {
        console.log(`\n📡 Testing collection: ${collection.name}`);
        
        // Test with different limits
        const limits = [20, 50, 100, 150];
        
        for (const limit of limits) {
          const collectionUrl = `${API_BASE_URL}/product/fieldname/collectionId/${collection.id}?limit=${limit}`;
          const collectionResponse = await fetch(collectionUrl);
          
          if (collectionResponse.ok) {
            const collectionData = await collectionResponse.json();
            console.log(`  Limit ${limit}: ${collectionData.data.length} products returned, Total: ${collectionData.total}`);
            
            // Compare with general endpoint count
            const generalCount = collectionStats[collection.name] || 0;
            if (collectionData.total !== generalCount) {
              console.log(`  🚨 MISMATCH: Collection endpoint says ${collectionData.total}, but general endpoint has ${generalCount}`);
            }
          } else {
            console.log(`  ❌ Failed with limit ${limit}: ${collectionResponse.status}`);
          }
        }
      }
      
      // Test 3: Check if there are products with same collection name but different collection ID
      console.log('\n📋 Step 3: Checking for collection ID mismatches...');
      
      const nokiaProducts = allData.data.filter(p => 
        p.collectionName === 'Nokia - 100% Cotton Brushed Super Soft Poplin'
      );
      
      const majesticaProducts = allData.data.filter(p => 
        p.collectionName === 'Majestica - 100% Cotton Bio Finish Twill'
      );
      
      console.log(`\nNokia products in general endpoint: ${nokiaProducts.length}`);
      if (nokiaProducts.length > 0) {
        const nokiaCollectionIds = [...new Set(nokiaProducts.map(p => p.collectionId))];
        console.log(`Nokia collection IDs found: ${nokiaCollectionIds.join(', ')}`);
        
        if (nokiaCollectionIds.length > 1) {
          console.log('🚨 ISSUE: Nokia products have multiple collection IDs!');
          nokiaCollectionIds.forEach(id => {
            const count = nokiaProducts.filter(p => p.collectionId === id).length;
            console.log(`  Collection ID ${id}: ${count} products`);
          });
        }
      }
      
      console.log(`\nMajestica products in general endpoint: ${majesticaProducts.length}`);
      if (majesticaProducts.length > 0) {
        const majesticaCollectionIds = [...new Set(majesticaProducts.map(p => p.collectionId))];
        console.log(`Majestica collection IDs found: ${majesticaCollectionIds.join(', ')}`);
        
        if (majesticaCollectionIds.length > 1) {
          console.log('🚨 ISSUE: Majestica products have multiple collection IDs!');
          majesticaCollectionIds.forEach(id => {
            const count = majesticaProducts.filter(p => p.collectionId === id).length;
            console.log(`  Collection ID ${id}: ${count} products`);
          });
        }
      }
      
    } else {
      console.log('❌ Failed to fetch all products');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCollectionMismatch();