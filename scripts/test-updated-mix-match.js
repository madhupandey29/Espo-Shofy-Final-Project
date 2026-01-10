// Test the updated Mix & Match functionality
async function testUpdatedMixMatch() {
  console.log('🔍 Testing Updated Mix & Match Functionality...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const API_KEY = 'rajeshsir';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-admin-email': ADMIN_EMAIL
  };
  
  // Test the collection endpoint that RelatedProducts uses
  const MAJESTICA_COLLECTION_ID = '695f9b0b956eb958b';
  const url = `${API_BASE}/product/fieldname/collectionId/${MAJESTICA_COLLECTION_ID}?limit=1000`;
  
  console.log('📡 Testing Mix & Match data source:', url);
  
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      console.error(`❌ Failed:`, response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    console.log(`✅ Mix & Match Data:`, {
      success: data.success,
      total: data.total,
      dataLength: data.data?.length || 0
    });
    
    if (data.success && data.data) {
      console.log(`\n📊 Mix & Match Analysis:`);
      console.log(`  - Collection: "Majestica - 100% Cotton Bio Finish Twill"`);
      console.log(`  - Total products: ${data.data.length}`);
      
      // Analyze products for Mix & Match display
      let productsWithHex = 0;
      let productsWithColor = 0;
      let productsWithImages = 0;
      
      const colorVariations = new Set();
      const hexColors = new Set();
      
      data.data.forEach(product => {
        // Check hex colors
        if (product.hex && product.hex.length > 0) {
          productsWithHex++;
          product.hex.forEach(hex => hexColors.add(hex));
        }
        
        // Check color names
        if (product.color && product.color.length > 0) {
          productsWithColor++;
          product.color.forEach(color => colorVariations.add(color));
        }
        
        // Check images
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
        }
      });
      
      console.log(`\n🎨 Color Analysis:`);
      console.log(`  - Products with hex colors: ${productsWithHex}`);
      console.log(`  - Products with color names: ${productsWithColor}`);
      console.log(`  - Unique color variations: ${colorVariations.size}`);
      console.log(`  - Unique hex colors: ${hexColors.size}`);
      
      console.log(`\n📸 Image Analysis:`);
      console.log(`  - Products with images: ${productsWithImages}`);
      console.log(`  - Products without images: ${data.data.length - productsWithImages}`);
      
      console.log(`\n🎯 Mix & Match Display:`);
      console.log(`  - Will show: ${data.data.length} products`);
      console.log(`  - With color placeholders: ${productsWithHex} products`);
      console.log(`  - With fallback images: ${data.data.length - productsWithHex} products`);
      
      // Show sample color variations
      console.log(`\n🌈 Sample Color Variations:`);
      const sampleColors = Array.from(colorVariations).slice(0, 10);
      sampleColors.forEach((color, i) => {
        console.log(`  ${i + 1}. ${color}`);
      });
      
      if (colorVariations.size > 10) {
        console.log(`  ... and ${colorVariations.size - 10} more colors`);
      }
      
      return {
        success: true,
        totalProducts: data.data.length,
        colorVariations: colorVariations.size,
        withHex: productsWithHex,
        withImages: productsWithImages
      };
    }
    
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return { success: false };
  }
}

// Run the test
testUpdatedMixMatch()
  .then(result => {
    if (result && result.success) {
      console.log('\n🏁 UPDATED MIX & MATCH TEST RESULTS:');
      console.log(`✅ Total products in collection: ${result.totalProducts}`);
      console.log(`✅ Color variations available: ${result.colorVariations}`);
      console.log(`✅ Products with hex colors: ${result.withHex}`);
      console.log(`✅ Products with images: ${result.withImages}`);
      
      console.log('\n🎉 EXPECTED BEHAVIOR:');
      console.log(`- Badge will show: "${result.totalProducts} Items"`);
      console.log(`- Mix & Match will display: ${result.totalProducts} products`);
      console.log(`- ${result.withHex} products will show as colored squares`);
      console.log(`- ${result.totalProducts - result.withHex} products will show fallback images`);
      console.log(`- All ${result.colorVariations} color variations will be visible`);
    }
  })
  .catch(console.error);