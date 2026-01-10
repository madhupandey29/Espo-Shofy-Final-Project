// Test the same endpoint that Redux is using
async function testReduxEndpoint() {
  console.log('🔍 Testing Redux API Endpoint...\n');
  
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
  
  // Test the exact endpoint that Redux uses for getAllProductsForFiltering
  const url = `${API_BASE}/product/?limit=200`;
  
  try {
    console.log(`\n📡 Testing Redux endpoint: ${url}`);
    
    const response = await fetch(url, { headers });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error(`❌ Failed:`, response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    
    console.log(`✅ Success:`, {
      success: data.success,
      dataLength: data.data?.length || 0,
      total: data.total,
      hasData: !!data.data,
      isArray: Array.isArray(data.data),
      firstProductName: data.data?.[0]?.name || 'No name',
      firstProductId: data.data?.[0]?._id || data.data?.[0]?.id || 'No ID',
      firstProductKeys: data.data?.[0] ? Object.keys(data.data[0]).slice(0, 10) : []
    });
    
    if (data.success && data.data && data.data.length > 0) {
      console.log('\n📋 Sample products:');
      data.data.slice(0, 3).forEach((product, i) => {
        console.log(`  ${i + 1}. ${product.name} (ID: ${product._id || product.id || 'No ID'})`);
        console.log(`     MerchTags: ${product.merchTags?.join(', ') || 'None'}`);
        console.log(`     Keys: ${Object.keys(product).slice(0, 8).join(', ')}`);
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
      
      if (filteredProducts.length > 0) {
        console.log('📋 Sample filtered products:');
        filteredProducts.slice(0, 3).forEach((product, i) => {
          console.log(`  ${i + 1}. ${product.name} (ID: ${product._id})`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

// Run the test
testReduxEndpoint().catch(console.error);