const API_BASE_URL = 'https://espobackend.vercel.app/api';

async function testWithoutHeaders() {
  console.log('🔍 Testing API without headers...\n');

  try {
    // Test without any headers
    console.log('📡 Testing without headers...');
    const res = await fetch(`${API_BASE_URL}/product?limit=123`);
    
    console.log('📊 Response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Success without headers!');
      console.log(`📦 Products: ${data.data?.length || 0}`);
      console.log(`📊 Total: ${data.total || 0}`);
      
      // Test with just Content-Type
      console.log('\n📡 Testing with just Content-Type header...');
      const res2 = await fetch(`${API_BASE_URL}/product?limit=123`, {
        headers: { "Content-Type": "application/json" }
      });
      
      if (res2.ok) {
        const data2 = await res2.json();
        console.log('✅ Success with Content-Type header!');
        console.log(`📦 Products: ${data2.data?.length || 0}`);
      } else {
        console.log('❌ Failed with Content-Type header');
      }
      
      // Test with API key only
      console.log('\n📡 Testing with API key only...');
      const res3 = await fetch(`${API_BASE_URL}/product?limit=123`, {
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": "rajeshsir"
        }
      });
      
      if (res3.ok) {
        const data3 = await res3.json();
        console.log('✅ Success with API key only!');
        console.log(`📦 Products: ${data3.data?.length || 0}`);
      } else {
        console.log('❌ Failed with API key only');
        console.log('Status:', res3.status);
      }
      
      // Test with admin email only
      console.log('\n📡 Testing with admin email only...');
      const res4 = await fetch(`${API_BASE_URL}/product?limit=123`, {
        headers: { 
          "Content-Type": "application/json",
          "x-admin-email": "vivekkalal4690@gmail.com"
        }
      });
      
      if (res4.ok) {
        const data4 = await res4.json();
        console.log('✅ Success with admin email only!');
        console.log(`📦 Products: ${data4.data?.length || 0}`);
      } else {
        console.log('❌ Failed with admin email only');
        console.log('Status:', res4.status);
      }
      
    } else {
      console.log('❌ Failed even without headers');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithoutHeaders();