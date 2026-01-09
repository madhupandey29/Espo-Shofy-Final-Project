async function testRealAPI() {
  console.log('🚀 Testing Real API Data Structure...');
  
  try {
    const response = await fetch('https://espobackend.vercel.app/api/product?limit=5');
    const data = await response.json();
    
    console.log('📊 API Response Status:', response.status);
    console.log('📊 API Response Success:', data.success);
    console.log('📊 Total Products:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\n🔍 Sample Product Structure:');
      const sampleProduct = data.data[0];
      console.log('Product Keys:', Object.keys(sampleProduct));
      console.log('Product Name:', sampleProduct.name);
      console.log('Product ID:', sampleProduct.id);
      console.log('MerchTags:', sampleProduct.merchTags);
      console.log('ProductTag:', sampleProduct.productTag);
      
      console.log('\n📋 All Products MerchTags:');
      data.data.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}: merchTags = ${JSON.stringify(product.merchTags)}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testRealAPI();