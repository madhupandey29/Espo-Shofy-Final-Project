const API_BASE_URL = 'https://espobackend.vercel.app/api';

async function testGeneralEndpointPagination() {
  console.log('🔍 Testing General Product Endpoint Pagination...\n');

  try {
    // Test different page sizes on general endpoint
    const testCases = [
      { page: 1, limit: 20 },
      { page: 1, limit: 50 },
      { page: 1, limit: 100 },
      { page: 1, limit: 150 },
      { page: 2, limit: 20 },
      { page: 3, limit: 20 },
      { page: 4, limit: 20 },
      { page: 5, limit: 20 },
      { page: 6, limit: 20 },
      { page: 7, limit: 20 },
    ];
    
    let allProducts = [];
    
    for (const testCase of testCases) {
      const url = `${API_BASE_URL}/product?page=${testCase.page}&limit=${testCase.limit}`;
      console.log(`\n📡 Testing: Page ${testCase.page}, Limit ${testCase.limit}`);
      
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log(`  ✅ Success: ${data.data?.length || 0} products returned`);
          console.log(`  📊 Total: ${data.total || 0} products`);
          console.log(`  📄 Pagination: ${JSON.stringify(data.pagination || {})}`);
          
          if (testCase.page === 1) {
            // Check collection distribution for first page
            const collectionStats = {};
            (data.data || []).forEach(product => {
              const collectionName = product.collectionName || 'No Collection';
              collectionStats[collectionName] = (collectionStats[collectionName] || 0) + 1;
            });
            
            console.log('  📦 Collection distribution:');
            Object.entries(collectionStats).forEach(([collection, count]) => {
              console.log(`    ${collection}: ${count} products`);
            });
          }
          
          // Collect all products for analysis
          if (data.data && Array.isArray(data.data)) {
            allProducts = [...allProducts, ...data.data];
          }
          
        } else {
          console.log(`  ❌ Failed: ${response.status}`);
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
    
    // Remove duplicates and analyze
    const uniqueProducts = allProducts.reduce((acc, product) => {
      const id = product.id || product._id;
      if (id && !acc.find(p => (p.id || p._id) === id)) {
        acc.push(product);
      }
      return acc;
    }, []);
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`Total unique products collected: ${uniqueProducts.length}`);
    
    // Final collection distribution
    const finalCollectionStats = {};
    uniqueProducts.forEach(product => {
      const collectionName = product.collectionName || 'No Collection';
      finalCollectionStats[collectionName] = (finalCollectionStats[collectionName] || 0) + 1;
    });
    
    console.log('\n📦 Final collection distribution:');
    Object.entries(finalCollectionStats).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${count} products`);
    });
    
    // Check if we got all 123 products
    if (uniqueProducts.length === 123) {
      console.log('\n🎯 SUCCESS: Got all 123 products!');
    } else {
      console.log(`\n⚠️  Missing products: Expected 123, got ${uniqueProducts.length}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGeneralEndpointPagination();