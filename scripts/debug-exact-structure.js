const API_BASE = 'https://espobackend.vercel.app/api';

async function debugExactStructure() {
  console.log('🔍 Debugging Exact Product Structure...\n');

  try {
    // Get a few products to see their exact structure
    const url = `${API_BASE}/product?limit=10`;
    console.log('📡 Fetching sample products:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.log('❌ Failed to get products:', data);
      return;
    }
    
    const products = data.data;
    console.log(`✅ Got ${products.length} sample products\n`);
    
    // Find one Nokia and one Majestica product
    const nokiaProduct = products.find(p => 
      p.name && p.name.toLowerCase().includes('nokia')
    );
    
    const majesticaProduct = products.find(p => 
      p.name && p.name.toLowerCase().includes('majestica')
    );
    
    if (nokiaProduct) {
      console.log('📋 Nokia Product Structure:');
      console.log('  Name:', nokiaProduct.name);
      console.log('  collectionId:', nokiaProduct.collectionId);
      console.log('  collection:', nokiaProduct.collection);
      console.log('  collection_id:', nokiaProduct.collection_id);
      console.log('  collectionName:', nokiaProduct.collectionName);
      
      // Show the collection object structure if it exists
      if (nokiaProduct.collection && typeof nokiaProduct.collection === 'object') {
        console.log('  collection object:', JSON.stringify(nokiaProduct.collection, null, 2));
      }
      
      // Test extraction logic
      const extractedId = nokiaProduct?.collectionId || nokiaProduct?.collection?.id || nokiaProduct?.collection?._id || nokiaProduct?.collection || null;
      console.log('  Extracted ID:', extractedId);
      console.log('  Matches Nokia ID:', extractedId === '690a0e676132664ee');
      console.log('');
    }
    
    if (majesticaProduct) {
      console.log('📋 Majestica Product Structure:');
      console.log('  Name:', majesticaProduct.name);
      console.log('  collectionId:', majesticaProduct.collectionId);
      console.log('  collection:', majesticaProduct.collection);
      console.log('  collection_id:', majesticaProduct.collection_id);
      console.log('  collectionName:', majesticaProduct.collectionName);
      
      // Show the collection object structure if it exists
      if (majesticaProduct.collection && typeof majesticaProduct.collection === 'object') {
        console.log('  collection object:', JSON.stringify(majesticaProduct.collection, null, 2));
      }
      
      // Test extraction logic
      const extractedId = majesticaProduct?.collectionId || majesticaProduct?.collection?.id || majesticaProduct?.collection?._id || majesticaProduct?.collection || null;
      console.log('  Extracted ID:', extractedId);
      console.log('  Matches Majestica ID:', extractedId === '695f9b0b956eb958b');
      console.log('');
    }
    
    // Test the filtering logic with actual data
    console.log('🧪 Testing Filtering Logic:');
    
    const nokiaId = '690a0e676132664ee';
    const majesticaId = '695f9b0b956eb958b';
    
    const nokiaFiltered = products.filter(product => {
      return product.collectionId === nokiaId || 
             product.collection === nokiaId ||
             product.collection_id === nokiaId;
    });
    
    const majesticaFiltered = products.filter(product => {
      return product.collectionId === majesticaId || 
             product.collection === majesticaId ||
             product.collection_id === majesticaId;
    });
    
    console.log(`Nokia filtered (from ${products.length} products): ${nokiaFiltered.length}`);
    console.log(`Majestica filtered (from ${products.length} products): ${majesticaFiltered.length}`);
    
    if (nokiaFiltered.length > 0) {
      console.log('Nokia products found:', nokiaFiltered.map(p => p.name));
    }
    if (majesticaFiltered.length > 0) {
      console.log('Majestica products found:', majesticaFiltered.map(p => p.name));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugExactStructure();