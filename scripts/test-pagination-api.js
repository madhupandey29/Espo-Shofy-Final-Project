// Test script to debug pagination API
async function testPaginationAPI() {
  console.log('🔍 Testing Pagination API...\n');
  
  const API_BASE = 'https://espobackend.vercel.app/api';
  const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-email': ADMIN_EMAIL
  };
  
  console.log('API Base:', API_BASE);
  console.log('Headers:', headers);
  
  // Test the endpoints that work in server-side
  const candidates = [
    `${API_BASE}/product?limit=50&page=1`,
    `${API_BASE}/product/?limit=50&page=1`,
    `${API_BASE}/products?limit=50`,
    `${API_BASE}/catalog/products?limit=50`,
  ];
  
  for (const url of candidates) {
    try {
      console.log(`\n📄 Testing endpoint: ${url}`);
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`❌ Failed:`, response.status, response.statusText);
        continue;
      }
      
      const data = await response.json();
      
      console.log(`✅ Success:`, {
        success: data.success,
        dataLength: data.data?.length || 0,
        productsLength: data.products?.length || 0,
        total: data.total,
        pagination: data.pagination,
        hasData: !!data.data,
        hasProducts: !!data.products,
        isArray: Array.isArray(data.data) || Array.isArray(data.products) || Array.isArray(data)
      });
      
      // If this endpoint works, test pagination
      if (data.success && (data.data || data.products)) {
        console.log(`\n🔄 Testing pagination for working endpoint...`);
        
        for (let page = 2; page <= 3; page++) {
          try {
            const pageUrl = url.includes('?') 
              ? url.replace(/page=\d+/, `page=${page}`) 
              : `${url}?page=${page}`;
            
            console.log(`📄 Page ${page}: ${pageUrl}`);
            
            const pageResponse = await fetch(pageUrl, { headers });
            
            if (pageResponse.ok) {
              const pageData = await pageResponse.json();
              console.log(`✅ Page ${page}:`, {
                dataLength: pageData.data?.length || pageData.products?.length || 0,
                total: pageData.total,
                firstProductId: (pageData.data || pageData.products)?.[0]?._id
              });
              
              if (!(pageData.data?.length || pageData.products?.length)) {
                console.log(`🛑 No more products on page ${page}`);
                break;
              }
            } else {
              console.log(`❌ Page ${page} failed:`, pageResponse.status);
            }
          } catch (error) {
            console.error(`❌ Page ${page} error:`, error.message);
          }
        }
        
        break; // Found working endpoint, stop testing others
      }
      
    } catch (error) {
      console.error(`❌ Error:`, error.message);
    }
  }
}

// Run the test
testPaginationAPI().catch(console.error);