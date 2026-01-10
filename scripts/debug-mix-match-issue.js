// Debug why Mix & Match shows only 33 products instead of 67
async function debugMixMatchIssue() {
  console.log('🔍 Debugging Mix & Match Issue...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const API_KEY = 'rajeshsir';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-admin-email': ADMIN_EMAIL
  };
  
  // Get the Majestica collection ID
  const MAJESTICA_COLLECTION_ID = '695f9b0b956eb958b';
  
  console.log('🔧 Testing Collection ID:', MAJESTICA_COLLECTION_ID);
  
  // Test different API endpoints to see which one is used by RelatedProducts
  const endpoints = [
    `${API_BASE}/product/fieldname/collectionId/${MAJESTICA_COLLECTION_ID}`,
    `${API_BASE}/product/fieldname/collectionId/${MAJESTICA_COLLECTION_ID}?limit=1000`,
    `${API_BASE}/product/fieldname/collectionId/${MAJESTICA_COLLECTION_ID}?limit=100`,
    `${API_BASE}/product/fieldname/collectionId/${MAJESTICA_COLLECTION_ID}?limit=50`,
  ];
  
  for (const url of endpoints) {
    try {
      console.log(`\n📡 Testing: ${url}`);
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`❌ Failed:`, response.status, response.statusText);
        continue;
      }
      
      const data = await response.json();
      
      console.log(`✅ Response:`, {
        success: data.success,
        total: data.total,
        dataLength: data.data?.length || 0,
        entity: data.entity
      });
      
      if (data.success && data.data) {
        console.log(`📊 Analysis:`);
        console.log(`  - API says total: ${data.total}`);
        console.log(`  - Actually returned: ${data.data.length}`);
        console.log(`  - Missing: ${data.total - data.data.length} products`);
        
        // Check if products have images
        let productsWithImages = 0;
        let productsWithoutImages = 0;
        
        data.data.forEach(product => {
          const hasImage = !!(
            product.image1CloudUrl || 
            product.image2CloudUrl || 
            product.image3CloudUrl || 
            product.image1 || 
            product.image2 || 
            product.image3
          );
          
          if (hasImage) {
            productsWithImages++;
          } else {
            productsWithoutImages++;
          }
        });
        
        console.log(`📸 Image Analysis:`);
        console.log(`  - Products with images: ${productsWithImages}`);
        console.log(`  - Products without images: ${productsWithoutImages}`);
        
        // Show sample products
        console.log(`\n📋 Sample products:`);
        data.data.slice(0, 5).forEach((product, i) => {
          const hasImage = !!(
            product.image1CloudUrl || 
            product.image2CloudUrl || 
            product.image3CloudUrl || 
            product.image1 || 
            product.image2 || 
            product.image3
          );
          
          console.log(`  ${i + 1}. ${product.name} (${hasImage ? '✅ Has Image' : '❌ No Image'})`);
          console.log(`     ID: ${product.id}`);
          console.log(`     Color: ${product.color?.join(', ') || 'N/A'}`);
          console.log('');
        });
        
        // If this is the endpoint without limit, test with higher limit
        if (!url.includes('limit=')) {
          console.log(`\n🔍 This endpoint returned ${data.data.length} products without limit parameter`);
          console.log(`Expected: ${data.total} products`);
          console.log(`Issue: API is paginating by default!`);
        }
        
        return {
          url,
          total: data.total,
          returned: data.data.length,
          withImages: productsWithImages,
          withoutImages: productsWithoutImages
        };
      }
      
    } catch (error) {
      console.error(`❌ Error:`, error.message);
    }
  }
  
  return null;
}

// Run the debug
debugMixMatchIssue()
  .then(result => {
    if (result) {
      console.log('\n🏁 DEBUG SUMMARY:');
      console.log(`Best endpoint: ${result.url}`);
      console.log(`Expected products: ${result.total}`);
      console.log(`Actually returned: ${result.returned}`);
      console.log(`Products with images: ${result.withImages}`);
      console.log(`Products without images: ${result.withoutImages}`);
      
      if (result.returned < result.total) {
        console.log('\n❌ ISSUE FOUND: API is not returning all products!');
        console.log('SOLUTION: Use limit parameter to get all products');
      }
      
      if (result.withImages < result.returned) {
        console.log('\n⚠️ ADDITIONAL ISSUE: Some products have no images');
        console.log('This might cause empty spaces in Mix & Match grid');
      }
    }
  })
  .catch(console.error);