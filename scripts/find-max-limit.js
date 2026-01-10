// Find the maximum limit that works
async function findMaxLimit() {
  console.log('🔍 Finding maximum limit that works...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const API_KEY = 'rajeshsir';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-admin-email': ADMIN_EMAIL
  };
  
  // Test different limits to find what works
  const limits = [20, 50, 100, 120, 123, 125, 130];
  
  for (const limit of limits) {
    try {
      const url = `${API_BASE}/product?limit=${limit}`;
      console.log(`\n📡 Testing limit=${limit}: ${url}`);
      
      const response = await fetch(url, { headers });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        console.error(`❌ Failed with limit=${limit}: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      
      console.log(`✅ Success with limit=${limit}:`, {
        success: data.success,
        dataLength: data.data?.length || 0,
        total: data.total
      });
      
      if (data.success && data.data) {
        // Test filtering
        const MERCH_TAG_FILTER = 'ecatalogue';
        const filteredProducts = data.data.filter(product => {
          if (!product.merchTags || !Array.isArray(product.merchTags)) {
            return false;
          }
          return product.merchTags.includes(MERCH_TAG_FILTER);
        });
        
        console.log(`🔍 Filtered by "${MERCH_TAG_FILTER}": ${filteredProducts.length} products`);
        
        // If this is the highest working limit, use it
        if (limit >= 100) {
          console.log(`\n🎯 Found good limit: ${limit} gives us ${filteredProducts.length} products`);
          return { limit, products: filteredProducts.length, success: true };
        }
      }
      
    } catch (error) {
      console.error(`❌ Network Error with limit=${limit}:`, error.message);
    }
  }
  
  return { success: false };
}

// Run the test
findMaxLimit()
  .then(result => {
    console.log('\n🏁 Best Result:', result);
  })
  .catch(console.error);