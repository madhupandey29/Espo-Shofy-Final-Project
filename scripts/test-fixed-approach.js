const API_BASE_URL = 'https://espobackend.vercel.app/api';

async function testFixedApproach() {
  console.log('🔍 Testing Fixed Collection-Based Approach...\n');

  const collectionIds = [
    '690a0e676132664ee', // Nokia collection
    '695f9b0b956eb958b'  // Majestica collection
  ];

  let allProducts = [];
  let totalProducts = 0;

  // Fetch products from each collection
  for (const collectionId of collectionIds) {
    try {
      const url = `${API_BASE_URL}/product/fieldname/collectionId/${collectionId}?limit=100`;
      console.log('📡 Fetching from collection:', url);
      
      const res = await fetch(url);
      console.log('📊 Collection response status:', res.status);
      
      if (!res.ok) {
        console.log('❌ Collection failed:', res.status, res.statusText);
        continue;
      }

      const payload = await res.json();
      
      if (payload?.success && payload?.data && Array.isArray(payload.data)) {
        console.log(`✅ Got ${payload.data.length} products from collection ${collectionId}`);
        console.log(`   Collection: ${payload.data[0]?.collectionName || 'Unknown'}`);
        allProducts = [...allProducts, ...payload.data];
        totalProducts += payload.total || payload.data.length;
      }
    } catch (error) {
      console.error('❌ Collection API Error:', error.message);
    }
  }

  console.log(`\n📦 TOTAL PRODUCTS FROM ALL COLLECTIONS: ${allProducts.length}`);
  console.log(`📊 TOTAL COUNT: ${totalProducts}`);

  // Test filtering by ecatalogue tag
  const MERCH_TAG_FILTER = 'ecatalogue';
  
  if (MERCH_TAG_FILTER && allProducts.length > 0) {
    console.log(`\n🔍 Filtering by merchTag: "${MERCH_TAG_FILTER}"`);
    
    const filteredProducts = allProducts.filter((product) => {
      if (!product.merchTags || !Array.isArray(product.merchTags)) {
        return false;
      }
      
      if (product.merchTags.length === 0) {
        return false;
      }
      
      return product.merchTags.includes(MERCH_TAG_FILTER);
    });

    console.log(`✅ Filtered to ${filteredProducts.length} products`);
    
    // Check collection distribution in filtered results
    const collectionStats = {};
    filteredProducts.forEach(product => {
      const collectionName = product.collectionName || 'No Collection';
      collectionStats[collectionName] = (collectionStats[collectionName] || 0) + 1;
    });
    
    console.log('\n📦 Collection distribution in filtered results:');
    Object.entries(collectionStats).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${count} products`);
    });
    
    return {
      products: filteredProducts,
      total: filteredProducts.length,
      filtered: true,
      filterTag: MERCH_TAG_FILTER
    };
  }

  return {
    products: allProducts,
    total: totalProducts,
    filtered: false
  };
}

testFixedApproach();