// Test getting all 123 products
async function testAll123Products() {
  console.log('🔍 Testing to get ALL 123 products...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const API_KEY = 'rajeshsir';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-admin-email': ADMIN_EMAIL
  };
  
  console.log('API Base:', API_BASE);
  
  // Test with exact limit to get all products
  const candidates = [
    `${API_BASE}/product?limit=123`, // Exact total
    `${API_BASE}/product?limit=150`, // Higher limit
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
        console.log('\n📋 Product count analysis:');
        console.log(`Total products received: ${data.data.length}`);
        console.log(`API says total available: ${data.total}`);
        
        // Test filtering
        const MERCH_TAG_FILTER = 'ecatalogue';
        const filteredProducts = data.data.filter(product => {
          if (!product.merchTags || !Array.isArray(product.merchTags)) {
            return false;
          }
          return product.merchTags.includes(MERCH_TAG_FILTER);
        });
        
        console.log(`\n🔍 Filtered by "${MERCH_TAG_FILTER}": ${filteredProducts.length} products`);
        
        if (filteredProducts.length > 0) {
          console.log('📋 Sample filtered products:');
          filteredProducts.slice(0, 5).forEach((product, i) => {
            console.log(`  ${i + 1}. ${product.name} (ID: ${product.id})`);
          });
          
          console.log(`\n✅ SUCCESS! Got ${filteredProducts.length} products for shop page`);
          
          return { 
            success: true, 
            total: data.data.length,
            filtered: filteredProducts.length,
            products: filteredProducts
          };
        }
      }
      
    } catch (error) {
      console.error('❌ Network Error:', error.message);
    }
  }
  
  return { success: false, total: 0 };
}

// Run the test
testAll123Products()
  .then(result => {
    console.log('\n🏁 Final Result:', {
      success: result.success,
      totalProducts: result.total,
      filteredProducts: result.filtered,
      readyForShopPage: result.success && result.filtered > 0
    });
  })
  .catch(console.error);