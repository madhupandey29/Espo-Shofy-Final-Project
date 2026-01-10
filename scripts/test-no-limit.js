// Test API without any limit parameter
async function testNoLimit() {
  console.log('🔍 Testing API WITHOUT limit parameter...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const API_KEY = 'rajeshsir';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-admin-email': ADMIN_EMAIL
  };
  
  console.log('API Base:', API_BASE);
  console.log('Headers:', headers);
  
  // Test with high limit to get ALL products
  const candidates = [
    `${API_BASE}/product/?limit=1000`,
    `${API_BASE}/product?limit=1000`,
  ];
  
  for (const url of candidates) {
    try {
      console.log(`\n📡 Testing: ${url}`);
      
      const response = await fetch(url, { headers });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error(`❌ Failed:`, response.status, response.statusText);
        continue;
      }
      
      const data = await response.json();
      
      console.log(`✅ Success:`, {
        success: data.success,
        dataLength: data.data?.length || 0,
        total: data.total,
        hasData: !!data.data,
        isArray: Array.isArray(data.data)
      });
      
      if (data.success && data.data && data.data.length > 0) {
        console.log('\n📋 Sample products:');
        data.data.slice(0, 3).forEach((product, i) => {
          console.log(`  ${i + 1}. ${product.name} (ID: ${product.id})`);
          console.log(`     MerchTags: ${product.merchTags?.join(', ') || 'None'}`);
        });
        
        // Test filtering
        const MERCH_TAG_FILTER = 'ecatalogue';
        const filteredProducts = data.data.filter(product => {
          if (!product.merchTags || !Array.isArray(product.merchTags)) {
            return false;
          }
          return product.merchTags.includes(MERCH_TAG_FILTER);
        });
        
        console.log(`\n🔍 Filtered by "${MERCH_TAG_FILTER}": ${filteredProducts.length} products`);
        
        return { success: true, total: filteredProducts.length };
      }
      
    } catch (error) {
      console.error('❌ Network Error:', error.message);
    }
  }
  
  return { success: false, total: 0 };
}

// Run the test
testNoLimit()
  .then(result => {
    console.log('\n🏁 Result:', result);
  })
  .catch(console.error);