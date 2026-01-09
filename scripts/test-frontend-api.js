// Test script to verify the fix
async function testAPIFix() {
  console.log('🔍 Testing API Fix...\n');
  
  const baseUrl = 'https://espobackend.vercel.app/api';
  const endpoint = '/product/?limit=5';
  const fullUrl = baseUrl + endpoint;
  
  console.log('Testing URL:', fullUrl);
  
  // Test without x-api-key header (simulating the fix)
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // No x-api-key header
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API working without x-api-key header');
      console.log('Success:', data.success);
      console.log('Data length:', data.data?.length);
      
      if (data.success && data.data && data.data.length > 0) {
        console.log('✅ Products received successfully');
        console.log('Sample product:', data.data[0].name);
        console.log('Sample merchTags:', data.data[0].merchTags);
      }
    } else {
      const text = await response.text();
      console.log('❌ Still failing:', text);
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
  }
}

testAPIFix();

testAPIFix();