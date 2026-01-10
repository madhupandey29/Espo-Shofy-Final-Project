// Test the simple endpoint without any parameters
async function testSimpleEndpoint() {
  console.log('🔍 Testing simple endpoint without parameters...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const API_KEY = 'rajeshsir';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-admin-email': ADMIN_EMAIL
  };
  
  console.log('API Base:', API_BASE);
  
  // Test the simple endpoint
  const url = `${API_BASE}/product`;
  
  try {
    console.log(`\n📡 Testing: ${url}`);
    
    const response = await fetch(url, { headers });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error(`❌ Failed:`, response.status, response.statusText);
      return;
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
      console.log('\n📋 Product analysis:');
      console.log(`Products received: ${data.data.length}`);
      console.log(`Total available: ${data.total}`);
      
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
        filteredProducts.slice(0, 3).forEach((product, i) => {
          console.log(`  ${i + 1}. ${product.name} (ID: ${product.id})`);
        });
        
        console.log(`\n✅ READY FOR SHOP PAGE! ${filteredProducts.length} products available`);
        
        return { 
          success: true, 
          products: filteredProducts,
          count: filteredProducts.length
        };
      }
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
  
  return { success: false };
}

// Run the test
testSimpleEndpoint()
  .then(result => {
    console.log('\n🏁 Final Result:', {
      success: result.success,
      productsForShop: result.count || 0,
      readyToShow: result.success && result.count > 0
    });
  })
  .catch(console.error);