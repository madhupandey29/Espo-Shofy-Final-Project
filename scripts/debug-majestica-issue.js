const API_BASE = 'https://espobackend.vercel.app/api';

async function debugMajesticaIssue() {
  console.log('🔍 Debugging Majestica Mix and Match Issue...\n');

  try {
    // Get all products to analyze the issue
    const url = `${API_BASE}/product?limit=150`;
    console.log('📡 Fetching all products:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.log('❌ Failed to get products:', data);
      return;
    }
    
    const allProducts = data.data;
    console.log(`✅ Got ${allProducts.length} total products\n`);
    
    // Analyze collection distribution
    const nokiaId = '690a0e676132664ee';
    const majesticaId = '695f9b0b956eb958b';
    
    const nokiaProducts = allProducts.filter(product => {
      return product.collectionId === nokiaId || 
             product.collection === nokiaId ||
             product.collection_id === nokiaId;
    });
    
    const majesticaProducts = allProducts.filter(product => {
      return product.collectionId === majesticaId || 
             product.collection === majesticaId ||
             product.collection_id === majesticaId;
    });
    
    console.log('📊 Current Collection Counts:');
    console.log(`  Nokia (${nokiaId}): ${nokiaProducts.length} products`);
    console.log(`  Majestica (${majesticaId}): ${majesticaProducts.length} products`);
    console.log('');
    
    // Check if there's any cross-contamination in collection IDs
    console.log('🔍 Analyzing Collection ID Fields:');
    
    // Sample Nokia product
    if (nokiaProducts.length > 0) {
      const nokiaSample = nokiaProducts[0];
      console.log('Nokia Sample Product:');
      console.log(`  Name: ${nokiaSample.name}`);
      console.log(`  collectionId: ${nokiaSample.collectionId}`);
      console.log(`  collection: ${nokiaSample.collection}`);
      console.log(`  collectionName: ${nokiaSample.collectionName}`);
      console.log('');
    }
    
    // Sample Majestica product
    if (majesticaProducts.length > 0) {
      const majesticaSample = majesticaProducts[0];
      console.log('Majestica Sample Product:');
      console.log(`  Name: ${majesticaSample.name}`);
      console.log(`  collectionId: ${majesticaSample.collectionId}`);
      console.log(`  collection: ${majesticaSample.collection}`);
      console.log(`  collectionName: ${majesticaSample.collectionName}`);
      console.log('');
    }
    
    // Test the collection ID extraction logic for both collections
    console.log('🧪 Testing Collection ID Extraction Logic:');
    
    function extractCollectionId(product) {
      return product?.collectionId || product?.collection?.id || product?.collection?._id || product?.collection || null;
    }
    
    if (nokiaProducts.length > 0) {
      const nokiaExtracted = extractCollectionId(nokiaProducts[0]);
      console.log(`Nokia extraction result: ${nokiaExtracted}`);
      console.log(`Nokia matches expected: ${nokiaExtracted === nokiaId}`);
    }
    
    if (majesticaProducts.length > 0) {
      const majesticaExtracted = extractCollectionId(majesticaProducts[0]);
      console.log(`Majestica extraction result: ${majesticaExtracted}`);
      console.log(`Majestica matches expected: ${majesticaExtracted === majesticaId}`);
    }
    console.log('');
    
    // Test what happens when we simulate the Redux query for each collection
    console.log('🔍 Simulating Redux Queries:');
    
    // Nokia query simulation
    console.log(`Nokia Query: /product?limit=150&collection=${nokiaId}`);
    const nokiaFiltered = allProducts.filter(product => {
      return product.collectionId === nokiaId || 
             product.collection === nokiaId ||
             product.collection_id === nokiaId;
    });
    console.log(`Nokia filtered result: ${nokiaFiltered.length} products`);
    
    // Majestica query simulation
    console.log(`Majestica Query: /product?limit=150&collection=${majesticaId}`);
    const majesticaFiltered = allProducts.filter(product => {
      return product.collectionId === majesticaId || 
             product.collection === majesticaId ||
             product.collection_id === majesticaId;
    });
    console.log(`Majestica filtered result: ${majesticaFiltered.length} products`);
    console.log('');
    
    // Check for potential cache key conflicts
    console.log('🔍 Cache Key Analysis:');
    const nokiaCacheKey = `getProductsByCollection-${nokiaId}`;
    const majesticaCacheKey = `getProductsByCollection-${majesticaId}`;
    
    console.log(`Nokia cache key: ${nokiaCacheKey}`);
    console.log(`Majestica cache key: ${majesticaCacheKey}`);
    console.log(`Cache keys are unique: ${nokiaCacheKey !== majesticaCacheKey}`);
    console.log('');
    
    // Final diagnosis
    console.log('🎯 Issue Diagnosis:');
    if (majesticaFiltered.length === 67) {
      console.log('✅ Majestica filtering works correctly (67 products)');
      console.log('❌ Issue might be in component state or cache invalidation');
      console.log('💡 Possible causes:');
      console.log('   - Redux cache not being invalidated between collections');
      console.log('   - Component receiving wrong collection ID');
      console.log('   - Race condition in API calls');
    } else {
      console.log('❌ Majestica filtering is not working correctly');
      console.log(`   Expected: 67 products, Got: ${majesticaFiltered.length} products`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugMajesticaIssue();