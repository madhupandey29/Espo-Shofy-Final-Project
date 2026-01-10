const API_BASE_URL = 'https://espobackend.vercel.app/api';

async function testDefaultParams() {
  console.log('🔍 Testing API with different parameters...\n');

  const testCases = [
    { url: `${API_BASE_URL}/product`, desc: 'No parameters' },
    { url: `${API_BASE_URL}/product?limit=20`, desc: 'Default limit 20' },
    { url: `${API_BASE_URL}/product?limit=50`, desc: 'Limit 50' },
    { url: `${API_BASE_URL}/product?limit=100`, desc: 'Limit 100' },
    { url: `${API_BASE_URL}/product?page=1&limit=20`, desc: 'Page 1, Limit 20' },
    { url: `${API_BASE_URL}/product?page=1&limit=50`, desc: 'Page 1, Limit 50' },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`📡 Testing: ${testCase.desc}`);
      console.log(`   URL: ${testCase.url}`);
      
      const res = await fetch(testCase.url);
      console.log(`   Status: ${res.status}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log(`   ✅ Success!`);
        console.log(`   📦 Products returned: ${data.data?.length || 0}`);
        console.log(`   📊 Total available: ${data.total || 0}`);
        console.log(`   📄 Pagination: ${JSON.stringify(data.pagination || {})}`);
        
        if (data.data?.length === 33) {
          console.log(`   🎯 FOUND: This returns exactly 33 products!`);
        }
      } else {
        const errorText = await res.text();
        console.log(`   ❌ Failed: ${errorText.substring(0, 100)}`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }
}

testDefaultParams();