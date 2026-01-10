// Test script to fetch ALL products at once
async function testAllProducts() {
  console.log('🔍 Testing ALL Products Fetch...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  const MERCH_TAG_FILTER = 'ecatalogue';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-email': ADMIN_EMAIL,
    'x-api-key': 'rajeshsir'  // Add the API key
  };
  
  console.log('API Base:', API_BASE);
  console.log('MerchTag Filter:', MERCH_TAG_FILTER);
  
  // Test fetching ALL products
  const candidates = [
    `${API_BASE}/product?limit=500`, // Get ALL products
    `${API_BASE}/product/?limit=500`,
    `${API_BASE}/products?limit=500`,
    `${API_BASE}/catalog/products?limit=500`,
  ];
  
  for (const url of candidates) {
    try {
      console.log(`\n📄 Testing endpoint: ${url}`);
      
      const response = await fetch(url, { headers });
      
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
        isArray: Array.isArray(data.data),
        firstProductName: data.data?.[0]?.name || 'No name',
        firstProductId: data.data?.[0]?._id || 'No ID'
      });
      
      // If this endpoint works, test filtering
      if (data.success && data.data && data.data.length > 0) {
        console.log(`\n🔍 Testing merchTag filtering...`);
        
        const products = data.data;
        console.log(`📊 Total products: ${products.length}`);
        
        // Apply filtering
        const filteredProducts = products.filter(product => {
          if (!product.merchTags || !Array.isArray(product.merchTags)) {
            return false;
          }
          
          if (product.merchTags.length === 0) {
            return false;
          }
          
          return product.merchTags.includes(MERCH_TAG_FILTER);
        });
        
        console.log(`✅ Filtered products: ${filteredProducts.length}`);
        
        if (filteredProducts.length > 0) {
          console.log(`📦 Sample filtered product:`, {
            name: filteredProducts[0].name,
            id: filteredProducts[0]._id,
            merchTags: filteredProducts[0].merchTags
          });
        }
        
        return; // Found working endpoint, stop testing others
      }
      
    } catch (error) {
      console.error(`❌ Error:`, error.message);
    }
  }
  
  console.log('\n❌ No working endpoint found');
}

// Run the test
testAllProducts().catch(console.error);