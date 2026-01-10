const API_BASE = 'https://espobackend.vercel.app/api';

async function debugCollectionField() {
  console.log('🔍 Debugging Collection Field Structure...\n');

  try {
    // Get a few products to analyze their structure
    const url = `${API_BASE}/product?limit=10`;
    console.log('📡 Fetching sample products:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log('❌ HTTP Error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.log('❌ Failed to get products:', data);
      return;
    }
    
    const products = data.data;
    console.log(`✅ Got ${products.length} sample products\n`);
    
    // Analyze the first few products to understand collection field structure
    products.slice(0, 5).forEach((product, index) => {
      console.log(`📋 Product ${index + 1}: ${product.name}`);
      console.log('  Collection fields:');
      console.log('    collectionId:', product.collectionId);
      console.log('    collection:', product.collection);
      console.log('    collection_id:', product.collection_id);
      console.log('    collectionName:', product.collectionName);
      
      // Check if collection is an object
      if (product.collection && typeof product.collection === 'object') {
        console.log('    collection.id:', product.collection.id);
        console.log('    collection._id:', product.collection._id);
        console.log('    collection object:', product.collection);
      }
      
      // Show what the current extraction logic would return
      const extractedCollectionId = product?.collectionId || product?.collection?.id || null;
      console.log('    Current extraction result:', extractedCollectionId);
      console.log('');
    });
    
    // Show the expected collection IDs
    console.log('📋 Expected Collection IDs:');
    console.log('  Nokia: 690a0e676132664ee');
    console.log('  Majestica: 695f9b0b956eb958b');
    console.log('');
    
    // Test what happens when we try to extract collection ID correctly
    const nokiaProducts = products.filter(p => 
      p.collectionId === '690a0e676132664ee' || 
      p.collection === '690a0e676132664ee' ||
      (p.collection && p.collection.id === '690a0e676132664ee') ||
      (p.collection && p.collection._id === '690a0e676132664ee')
    );
    
    const majesticaProducts = products.filter(p => 
      p.collectionId === '695f9b0b956eb958b' || 
      p.collection === '695f9b0b956eb958b' ||
      (p.collection && p.collection.id === '695f9b0b956eb958b') ||
      (p.collection && p.collection._id === '695f9b0b956eb958b')
    );
    
    console.log('🔍 Collection matching results:');
    console.log(`  Nokia products in sample: ${nokiaProducts.length}`);
    console.log(`  Majestica products in sample: ${majesticaProducts.length}`);
    
    if (nokiaProducts.length > 0) {
      console.log('  Nokia product example:', nokiaProducts[0].name);
    }
    if (majesticaProducts.length > 0) {
      console.log('  Majestica product example:', majesticaProducts[0].name);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugCollectionField();