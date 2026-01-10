// Test the exact Redux query endpoint
async function testReduxCollectionQuery() {
  console.log('🔍 Testing Redux Collection Query...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const API_KEY = 'rajeshsir';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-admin-email': ADMIN_EMAIL
  };
  
  // Test the exact endpoint that Redux uses
  const MAJESTICA_COLLECTION_ID = '695f9b0b956eb958b';
  const url = `${API_BASE}/product/fieldname/collectionId/${MAJESTICA_COLLECTION_ID}?limit=1000`;
  
  console.log('📡 Testing Redux endpoint:', url);
  
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      console.error(`❌ Failed:`, response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    console.log(`✅ Redux Query Response:`, {
      success: data.success,
      total: data.total,
      dataLength: data.data?.length || 0,
      entity: data.entity
    });
    
    if (data.success && data.data) {
      console.log(`\n📊 Detailed Analysis:`);
      console.log(`  - Expected: 67 products`);
      console.log(`  - API says total: ${data.total}`);
      console.log(`  - Actually returned: ${data.data.length}`);
      
      if (data.data.length < data.total) {
        console.log(`  - Missing: ${data.total - data.data.length} products`);
        console.log(`  - ❌ API is not respecting limit=1000 parameter!`);
      } else {
        console.log(`  - ✅ All products returned successfully`);
      }
      
      // Check image availability
      let withImages = 0;
      let withoutImages = 0;
      
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
          withImages++;
        } else {
          withoutImages++;
        }
      });
      
      console.log(`\n📸 Image Analysis:`);
      console.log(`  - Products with images: ${withImages}`);
      console.log(`  - Products without images: ${withoutImages}`);
      console.log(`  - Image availability: ${((withImages / data.data.length) * 100).toFixed(1)}%`);
      
      // Show first few products with their image status
      console.log(`\n📋 Sample products (first 10):`);
      data.data.slice(0, 10).forEach((product, i) => {
        const hasImage = !!(
          product.image1CloudUrl || 
          product.image2CloudUrl || 
          product.image3CloudUrl || 
          product.image1 || 
          product.image2 || 
          product.image3
        );
        
        console.log(`  ${i + 1}. ${product.name} - ${product.color?.join(', ')} (${hasImage ? '✅' : '❌'})`);
      });
      
      return {
        success: true,
        total: data.total,
        returned: data.data.length,
        withImages: withImages,
        withoutImages: withoutImages
      };
    }
    
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return { success: false };
  }
}

// Run the test
testReduxCollectionQuery()
  .then(result => {
    if (result && result.success) {
      console.log('\n🏁 REDUX COLLECTION QUERY ANALYSIS:');
      console.log(`Expected: 67 products`);
      console.log(`Returned: ${result.returned} products`);
      console.log(`With Images: ${result.withImages} products`);
      console.log(`Without Images: ${result.withoutImages} products`);
      
      if (result.returned < 67) {
        console.log('\n❌ ISSUE 1: API pagination problem - not all products returned');
        console.log('SOLUTION: Need to fix API or use different approach');
      }
      
      if (result.withImages === 0) {
        console.log('\n❌ ISSUE 2: No products have images');
        console.log('SOLUTION: Products need image URLs or fallback images');
      }
      
      console.log(`\n📊 Mix & Match will show: ${result.withImages} products (only those with images)`);
    }
  })
  .catch(console.error);