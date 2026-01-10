const API_BASE_URL = 'https://espobackend.vercel.app/api';

// Simulate the server-side logic from your shop page
async function testServerSideLogic() {
  console.log('🔍 Testing Server-Side Logic (Shop Page)...\n');

  const MERCH_TAG_FILTER = 'ecatalogue'; // From your .env.local
  
  try {
    // Test the exact URLs your server is trying
    const candidates = [
      `${API_BASE_URL}/product?limit=123`,
      `${API_BASE_URL}/product?limit=150`,
    ];

    for (const url of candidates) {
      console.log(`📡 Testing URL: ${url}`);
      
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": "rajeshsir", // From your .env.local
        "x-admin-email": "vivekkalal4690@gmail.com" // From your .env.local
      };
      
      console.log('📋 Headers:', headers);
      
      const res = await fetch(url, { headers });
      
      console.log('📊 Response status:', res.status);
      
      if (!res.ok) {
        console.log('❌ Failed:', res.status, res.statusText);
        const errorText = await res.text();
        console.log('❌ Error response:', errorText.substring(0, 200));
        continue;
      }

      const payload = await res.json();
      
      console.log('✅ API Response:', {
        success: payload.success,
        dataLength: payload.data?.length,
        total: payload.total,
        hasData: !!payload.data,
        isArray: Array.isArray(payload.data)
      });
      
      let products = [];
      let totalProducts = 0;
      
      // Handle the API response structure (same as your server code)
      if (payload?.success && payload?.data && Array.isArray(payload.data)) {
        products = payload.data;
        totalProducts = payload.total || payload.data.length;
      } else if (payload?.products && Array.isArray(payload.products)) {
        products = payload.products;
        totalProducts = payload.total || payload.products.length;
      } else if (Array.isArray(payload)) {
        products = payload;
        totalProducts = payload.length;
      } else {
        console.log('❌ Unexpected API response structure');
        continue;
      }

      console.log(`📦 Got ${products.length} products from API`);

      // Apply merchTag filtering (same as your server code)
      if (MERCH_TAG_FILTER && products.length > 0) {
        console.log(`🔍 Filtering by merchTag: "${MERCH_TAG_FILTER}"`);
        
        const filteredProducts = products.filter((product) => {
          if (!product.merchTags || !Array.isArray(product.merchTags)) {
            return false;
          }
          
          if (product.merchTags.length === 0) {
            return false;
          }
          
          return product.merchTags.includes(MERCH_TAG_FILTER);
        });

        console.log(`✅ Filtered to ${filteredProducts.length} products`);
        
        if (filteredProducts.length > 0) {
          console.log('📋 Sample filtered products:');
          filteredProducts.slice(0, 5).forEach((product, i) => {
            console.log(`  ${i + 1}. ${product.name} (ID: ${product.id || product._id}) - Tags: ${product.merchTags?.join(', ')}`);
          });
        }
        
        // Check why we might be getting only 33 products
        if (filteredProducts.length === 33) {
          console.log('\n🎯 FOUND: Exactly 33 products after filtering!');
          console.log('This suggests the API is returning a limited set or there\'s pagination happening');
        }
        
        // Check collection distribution in filtered results
        const collectionStats = {};
        filteredProducts.forEach(product => {
          const collectionName = product.collectionName || 'No Collection';
          collectionStats[collectionName] = (collectionStats[collectionName] || 0) + 1;
        });
        
        console.log('\n📦 Collection distribution in filtered results:');
        Object.entries(collectionStats).forEach(([collection, count]) => {
          console.log(`  ${collection}: ${count} products`);
        });
        
        return {
          products: filteredProducts,
          total: filteredProducts.length,
          filtered: true,
          filterTag: MERCH_TAG_FILTER
        };
      }

      // Return ALL products if no filter is set
      console.log(`✅ Returning all ${products.length} products`);
      return {
        products: products,
        total: totalProducts,
        filtered: false
      };
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testServerSideLogic();