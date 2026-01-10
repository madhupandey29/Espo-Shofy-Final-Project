const API_BASE_URL = 'https://espobackend.vercel.app/api';

async function testAllCollectionsCount() {
  console.log('🔍 Testing All Collections Product Count...\n');

  try {
    // Test 1: Get all collection names
    console.log('📋 Step 1: Fetching all collection names...');
    const collectionsResponse = await fetch(`${API_BASE_URL}/product/fieldname/collectionName`);
    const collectionsData = await collectionsResponse.json();
    
    console.log('Collections found:', collectionsData.values);
    console.log('Total collections:', collectionsData.total);
    console.log('');

    // Test 2: Get products from each collection
    const collectionIds = [
      '690a0e676132664ee', // Nokia collection
      '695f9b0b956eb958b'  // Majestica collection
    ];

    let totalProductsAcrossCollections = 0;

    for (const collectionId of collectionIds) {
      console.log(`📦 Testing Collection ID: ${collectionId}`);
      
      // Get first page to see total
      const response = await fetch(`${API_BASE_URL}/product/fieldname/collectionId/${collectionId}?page=1&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        console.log(`  - Collection Name: ${data.data[0]?.collectionName || 'Unknown'}`);
        console.log(`  - Products in this collection: ${data.total}`);
        console.log(`  - Pages: ${data.pagination?.totalPages || 'N/A'}`);
        totalProductsAcrossCollections += data.total;
      } else {
        console.log(`  - Error fetching collection: ${data.message || 'Unknown error'}`);
      }
      console.log('');
    }

    console.log(`🎯 TOTAL PRODUCTS ACROSS ALL COLLECTIONS: ${totalProductsAcrossCollections}`);
    console.log('');

    // Test 3: Try to get all products without collection filter
    console.log('🌐 Step 3: Testing general product endpoint...');
    
    // Test different endpoints that might return all products
    const testEndpoints = [
      '/product',
      '/product?limit=100',
      '/product/all',
      '/products'
    ];

    for (const endpoint of testEndpoints) {
      try {
        console.log(`Testing: ${API_BASE_URL}${endpoint}`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log(`  ✅ Success - Found ${data.total || data.data?.length || 'unknown'} products`);
          if (data.pagination) {
            console.log(`  📄 Pagination: Page ${data.pagination.page}/${data.pagination.totalPages}`);
          }
        } else {
          console.log(`  ❌ Failed - Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
      console.log('');
    }

    // Test 4: Check if there's a way to get all products with high limit
    console.log('🔢 Step 4: Testing high limit to get all products...');
    
    try {
      // Try Nokia collection with high limit
      const nokiaResponse = await fetch(`${API_BASE_URL}/product/fieldname/collectionId/690a0e676132664ee?limit=50`);
      const nokiaData = await nokiaResponse.json();
      
      if (nokiaData.success) {
        console.log(`Nokia collection with limit 50: ${nokiaData.data.length} products returned`);
      }

      // Try Majestica collection with high limit  
      const majesticaResponse = await fetch(`${API_BASE_URL}/product/fieldname/collectionId/695f9b0b956eb958b?limit=100`);
      const majesticaData = await majesticaResponse.json();
      
      if (majesticaData.success) {
        console.log(`Majestica collection with limit 100: ${majesticaData.data.length} products returned`);
      }

    } catch (error) {
      console.log(`Error testing high limits: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log(`Total Collections: 2`);
    console.log(`Nokia Collection: 33 products`);
    console.log(`Majestica Collection: 67 products`);
    console.log(`Expected Total: 100 products`);
    console.log(`Your frontend should show: 100 products (not 33)`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAllCollectionsCount();