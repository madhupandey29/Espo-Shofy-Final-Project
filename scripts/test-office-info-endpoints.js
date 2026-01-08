// Test various endpoints to find office/company information
async function testEndpoints() {
  const baseUrl = 'https://espo.egport.com/api';
  const endpoints = [
    '/companyinformation',
    '/v1/companyinformation', 
    '/company',
    '/v1/company',
    '/office',
    '/v1/office',
    '/Account',
    '/v1/Account'
  ];

  console.log('Testing office information endpoints...\n');

  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}`;
    console.log(`Testing: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(`  Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.text();
        console.log(`  ✅ Success! Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
      } else {
        console.log(`  ❌ Failed: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    console.log('');
  }
}

testEndpoints();