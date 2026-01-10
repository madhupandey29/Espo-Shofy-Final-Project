// Test collection functionality for Mix and Match
async function testCollectionFunctionality() {
  console.log('🔍 Testing Collection Functionality...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const API_KEY = 'rajeshsir';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-admin-email': ADMIN_EMAIL
  };
  
  console.log('🔧 Configuration:');
  console.log('API Base:', API_BASE);
  
  // Step 1: Get all collection names
  try {
    console.log('\n📡 Step 1: Getting all collection names...');
    const collectionsUrl = `${API_BASE}/product/fieldname/collectionName`;
    
    const collectionsResponse = await fetch(collectionsUrl, { headers });
    
    if (!collectionsResponse.ok) {
      console.error('❌ Failed to get collections:', collectionsResponse.status);
      return;
    }
    
    const collectionsData = await collectionsResponse.json();
    console.log('✅ Collections Response:', {
      success: collectionsData.success,
      total: collectionsData.total,
      collections: collectionsData.values
    });
    
    if (!collectionsData.success || !collectionsData.values) {
      console.error('❌ Invalid collections response');
      return;
    }
    
    // Step 2: Test getting products by collection ID
    console.log('\n📡 Step 2: Getting products by collection ID...');
    
    // First get a product to find its collection ID
    const productsUrl = `${API_BASE}/product?limit=1`;
    const productsResponse = await fetch(productsUrl, { headers });
    
    if (!productsResponse.ok) {
      console.error('❌ Failed to get products:', productsResponse.status);
      return;
    }
    
    const productsData = await productsResponse.json();
    
    if (!productsData.success || !productsData.data || productsData.data.length === 0) {
      console.error('❌ No products found');
      return;
    }
    
    const sampleProduct = productsData.data[0];
    const collectionId = sampleProduct.collectionId;
    const collectionName = sampleProduct.collectionName;
    
    console.log('📋 Sample Product:', {
      name: sampleProduct.name,
      id: sampleProduct.id,
      collectionId: collectionId,
      collectionName: collectionName
    });
    
    if (!collectionId) {
      console.error('❌ Sample product has no collection ID');
      return;
    }
    
    // Step 3: Get all products in the same collection
    console.log('\n📡 Step 3: Getting products in collection...');
    const collectionProductsUrl = `${API_BASE}/product/fieldname/collectionId/${collectionId}?limit=1000`;
    
    const collectionProductsResponse = await fetch(collectionProductsUrl, { headers });
    
    if (!collectionProductsResponse.ok) {
      console.error('❌ Failed to get collection products:', collectionProductsResponse.status);
      return;
    }
    
    const collectionProductsData = await collectionProductsResponse.json();
    
    console.log('✅ Collection Products Response:', {
      success: collectionProductsData.success,
      total: collectionProductsData.total,
      dataLength: collectionProductsData.data?.length || 0
    });
    
    if (collectionProductsData.success && collectionProductsData.data) {
      console.log('\n📋 Products in collection "' + collectionName + '":');
      collectionProductsData.data.slice(0, 5).forEach((product, i) => {
        console.log(`  ${i + 1}. ${product.name} (ID: ${product.id})`);
        console.log(`     Color: ${product.color?.join(', ') || 'N/A'}`);
        console.log(`     Collection: ${product.collectionName}`);
        console.log('');
      });
      
      console.log(`\n🎯 COLLECTION SUMMARY:`);
      console.log(`Collection: "${collectionName}"`);
      console.log(`Collection ID: ${collectionId}`);
      console.log(`Total Products: ${collectionProductsData.total || collectionProductsData.data.length}`);
      console.log(`✅ Mix & Match will show ${collectionProductsData.data.length} related products`);
      
      return {
        success: true,
        collectionName: collectionName,
        collectionId: collectionId,
        totalProducts: collectionProductsData.total || collectionProductsData.data.length,
        products: collectionProductsData.data
      };
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false };
  }
}

// Run the test
testCollectionFunctionality()
  .then(result => {
    if (result && result.success) {
      console.log('\n🏁 COLLECTION FUNCTIONALITY TEST: ✅ SUCCESS');
      console.log(`Ready for Mix & Match with ${result.totalProducts} products in "${result.collectionName}" collection`);
    } else {
      console.log('\n🏁 COLLECTION FUNCTIONALITY TEST: ❌ FAILED');
    }
  })
  .catch(console.error);