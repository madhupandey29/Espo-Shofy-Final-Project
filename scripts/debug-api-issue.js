async function debugAPIIssue() {
  console.log('🔍 Debugging API Issue...\n');
  
  try {
    // Test the exact endpoint our app is using
    console.log('1. Testing main product endpoint...');
    const response = await fetch('https://espobackend.vercel.app/api/product?limit=200');
    
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    console.log('   Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.log('❌ Response not OK');
      const text = await response.text();
      console.log('   Response Text:', text);
      return;
    }
    
    const data = await response.json();
    console.log('   Success:', data.success);
    console.log('   Data Type:', typeof data.data);
    console.log('   Data Length:', data.data?.length || 0);
    
    if (data.success && data.data && data.data.length > 0) {
      console.log('\n2. Analyzing product structure...');
      const sample = data.data[0];
      console.log('   Sample Product ID:', sample.id);
      console.log('   Sample Product Name:', sample.name);
      console.log('   MerchTags:', sample.merchTags);
      console.log('   MerchTags Type:', typeof sample.merchTags);
      console.log('   MerchTags Array?:', Array.isArray(sample.merchTags));
      
      console.log('\n3. Checking filtering requirements...');
      const popularProducts = data.data.filter(p => 
        Array.isArray(p.merchTags) && 
        p.merchTags.includes('PopularFabrics') && 
        p.merchTags.includes('ecatalogue')
      );
      
      const topRatedProducts = data.data.filter(p => 
        Array.isArray(p.merchTags) && 
        p.merchTags.includes('TopRatedFabrics') && 
        p.merchTags.includes('ecatalogue')
      );
      
      console.log('   Total Products:', data.data.length);
      console.log('   Popular Products (PopularFabrics + ecatalogue):', popularProducts.length);
      console.log('   Top Rated Products (TopRatedFabrics + ecatalogue):', topRatedProducts.length);
      
      if (popularProducts.length > 0) {
        console.log('   ✅ Popular Products found:', popularProducts.map(p => p.name).slice(0, 3));
      }
      
      if (topRatedProducts.length > 0) {
        console.log('   ✅ Top Rated Products found:', topRatedProducts.map(p => p.name).slice(0, 3));
      }
      
      console.log('\n4. Sample merchTags from first 5 products:');
      data.data.slice(0, 5).forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name}: ${JSON.stringify(p.merchTags)}`);
      });
      
    } else {
      console.log('❌ No valid data in response');
      console.log('   Full response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.error('   Stack:', error.stack);
  }
}

debugAPIIssue();