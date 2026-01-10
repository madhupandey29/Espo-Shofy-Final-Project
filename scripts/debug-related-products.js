const API_BASE = 'https://espobackend.vercel.app/api';

async function debugRelatedProducts() {
  console.log('🔍 Debugging Related Products Issue...\n');

  try {
    // Test the exact query that the Redux API is making
    const nokiaCollectionId = '690a0e676132664ee';
    const majesticaCollectionId = '695f9b0b956eb958b';
    
    console.log('📡 Testing Redux API query (general endpoint):');
    const url = `${API_BASE}/product?limit=150`;
    console.log('URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.log('❌ Failed to get products:', data);
      return;
    }
    
    const allProducts = data.data;
    console.log(`✅ Got ${allProducts.length} total products\n`);
    
    // Test Nokia collection filtering
    console.log(`🔍 Testing Nokia collection filtering (${nokiaCollectionId}):`);
    const nokiaProducts = allProducts.filter(product => {
      return product.collectionId === nokiaCollectionId || 
             product.collection === nokiaCollectionId ||
             product.collection_id === nokiaCollectionId;
    });
    
    console.log(`  ✅ Nokia products found: ${nokiaProducts.length}`);
    console.log(`  📝 Sample Nokia products: ${nokiaProducts.slice(0, 3).map(p => p.name).join(', ')}`);
    
    // Test Majestica collection filtering
    console.log(`\n🔍 Testing Majestica collection filtering (${majesticaCollectionId}):`);
    const majesticaProducts = allProducts.filter(product => {
      return product.collectionId === majesticaCollectionId || 
             product.collection === majesticaCollectionId ||
             product.collection_id === majesticaCollectionId;
    });
    
    console.log(`  ✅ Majestica products found: ${majesticaProducts.length}`);
    console.log(`  📝 Sample Majestica products: ${majesticaProducts.slice(0, 3).map(p => p.name).join(', ')}`);
    
    // Check what field names are actually used for collection ID
    console.log('\n🔍 Analyzing collection field names in products:');
    const sampleProduct = allProducts[0];
    console.log('Sample product fields:', {
      collectionId: sampleProduct.collectionId,
      collection: sampleProduct.collection,
      collection_id: sampleProduct.collection_id,
      collectionName: sampleProduct.collectionName,
      allFields: Object.keys(sampleProduct).filter(key => key.toLowerCase().includes('collection'))
    });
    
    // Test the exact transformation that Redux would do
    console.log('\n🧪 Simulating Redux transformResponse for Nokia collection:');
    const mockReduxResponse = {
      success: true,
      data: allProducts,
      total: allProducts.length
    };
    
    // Simulate the transformResponse logic
    const collectionId = nokiaCollectionId;
    let products = mockReduxResponse.data;
    
    if (collectionId && collectionId.trim() !== '') {
      console.log(`🔍 Filtering products for collection: ${collectionId}`);
      console.log(`📊 Total products before filtering: ${products.length}`);
      
      products = products.filter(product => {
        return product.collectionId === collectionId || 
               product.collection === collectionId ||
               product.collection_id === collectionId;
      });
      
      console.log(`✅ Filtered to ${products.length} products for collection ${collectionId}`);
    }
    
    const transformedResult = {
      data: products,
      total: products.length,
      success: mockReduxResponse.success,
      collectionId: collectionId
    };
    
    console.log('\n📋 Final Redux result for Nokia collection:');
    console.log(`  Products count: ${transformedResult.data.length}`);
    console.log(`  Total: ${transformedResult.total}`);
    console.log(`  Collection ID: ${transformedResult.collectionId}`);
    
    if (transformedResult.data.length === 51) {
      console.log('  🎉 SUCCESS: Redux should return 51 Nokia products!');
    } else {
      console.log('  ❌ ISSUE: Redux is not filtering correctly');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugRelatedProducts();