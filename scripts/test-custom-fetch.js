// Test the custom fetch approach
async function testCustomFetch() {
  console.log('🔍 Testing Custom Fetch Approach...\n');
  
  try {
    const response = await fetch('https://espobackend.vercel.app/api/product/?limit=5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // No x-api-key header
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Success!');
    console.log('Data success:', data.success);
    console.log('Data length:', data.data?.length);
    
    if (data.success && data.data && data.data.length > 0) {
      console.log('✅ Products received successfully');
      console.log('Sample product:', data.data[0].name);
      console.log('Sample merchTags:', data.data[0].merchTags);
      
      // Test filtering
      const products = data.data;
      const popularProducts = products.filter(product => {
        if (!product.merchTags || !Array.isArray(product.merchTags)) {
          return false;
        }
        const hasPopularTag = product.merchTags.includes('PopularFabrics');
        const hasCatalogueTag = product.merchTags.includes('ecatalogue');
        return hasPopularTag && hasCatalogueTag;
      });
      
      console.log('Popular products found:', popularProducts.length);
      console.log('✅ Custom fetch approach should work!');
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
  }
}

testCustomFetch();