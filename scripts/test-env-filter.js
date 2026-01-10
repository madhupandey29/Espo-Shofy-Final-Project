const API_BASE_URL = 'https://espobackend.vercel.app/api';

async function testEnvFilter() {
  console.log('🔍 Testing Environment Filter Issue...\n');

  try {
    // Test 1: Get all products without filter
    console.log('📋 Step 1: Fetching ALL products (no filter)...');
    const allResponse = await fetch(`${API_BASE_URL}/product?limit=150`);
    const allData = await allResponse.json();
    
    if (allData.success) {
      console.log(`✅ Total products available: ${allData.total}`);
      console.log(`✅ Products returned: ${allData.data.length}`);
      
      // Check merchTags distribution
      const merchTagStats = {};
      allData.data.forEach(product => {
        if (product.merchTags && Array.isArray(product.merchTags)) {
          product.merchTags.forEach(tag => {
            merchTagStats[tag] = (merchTagStats[tag] || 0) + 1;
          });
        }
      });
      
      console.log('\n📊 MerchTag Distribution:');
      Object.entries(merchTagStats)
        .sort(([,a], [,b]) => b - a)
        .forEach(([tag, count]) => {
          console.log(`  ${tag}: ${count} products`);
        });
      
      // Test 2: Check if there's a filter being applied
      console.log('\n🔍 Step 2: Checking for potential filters...');
      
      // Check if products have ecatalogue tag
      const ecatalogueProducts = allData.data.filter(product => 
        product.merchTags && product.merchTags.includes('ecatalogue')
      );
      
      console.log(`📦 Products with 'ecatalogue' tag: ${ecatalogueProducts.length}`);
      
      if (ecatalogueProducts.length === 33) {
        console.log('🎯 FOUND THE ISSUE! Your frontend is filtering by "ecatalogue" tag');
        console.log('   This explains why you see 33 products instead of 123');
      }
      
      // Test 3: Check collections
      console.log('\n📦 Step 3: Checking collection distribution...');
      const collectionStats = {};
      allData.data.forEach(product => {
        const collectionName = product.collectionName || 'No Collection';
        collectionStats[collectionName] = (collectionStats[collectionName] || 0) + 1;
      });
      
      console.log('Collection Distribution:');
      Object.entries(collectionStats).forEach(([collection, count]) => {
        console.log(`  ${collection}: ${count} products`);
      });
      
    } else {
      console.log('❌ Failed to fetch products');
    }

    // Test 4: Check environment variable simulation
    console.log('\n🔧 Step 4: Simulating environment variable filter...');
    
    const testFilters = ['ecatalogue', 'PopularFabrics', 'TopRatedFabrics'];
    
    for (const filter of testFilters) {
      const filtered = allData.data.filter(product => 
        product.merchTags && product.merchTags.includes(filter)
      );
      console.log(`  Filter "${filter}": ${filtered.length} products`);
      
      if (filtered.length === 33) {
        console.log(`  🎯 This filter gives exactly 33 products!`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testEnvFilter();