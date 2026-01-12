const https = require('https');

async function testSearchAPI() {
  console.log('=== Testing Search API ===\n');
  
  const searchTerms = ['lemon', 'cotton', 'red', 'nokia'];
  
  for (const term of searchTerms) {
    console.log(`Testing search for: "${term}"`);
    
    const url = `https://espobackend.vercel.app/api/product/search/${encodeURIComponent(term)}`;
    console.log(`URL: ${url}`);
    
    try {
      const response = await new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve({ ok: res.statusCode === 200, json, status: res.statusCode });
            } catch (e) {
              resolve({ ok: false, json: null, status: res.statusCode, error: e.message });
            }
          });
        }).on('error', (e) => {
          reject(e);
        });
      });
      
      console.log(`Status: ${response.status}`);
      if (response.ok && response.json) {
        console.log(`Success: ${response.json.success}`);
        console.log(`Results: ${response.json.data?.length || 0} products`);
        if (response.json.data?.length > 0) {
          console.log(`First result: ${response.json.data[0].productTitle || response.json.data[0].name || 'Unnamed'}`);
        }
      } else {
        console.log(`Error: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`Request failed: ${error.message}`);
    }
    
    console.log('---\n');
  }
}

testSearchAPI().catch(console.error);