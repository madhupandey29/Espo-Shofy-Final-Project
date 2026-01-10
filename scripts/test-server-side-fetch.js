// Test server-side fetch like the shop page does
async function testServerSideFetch() {
  console.log('🔍 Testing Server-Side Fetch (like shop page)...\n');
  
  // Simulate environment variables
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://espobackend.vercel.app/api';
  process.env.NEXT_PUBLIC_API_KEY = 'rajeshsir';
  process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'vivekkalal4690@gmail.com';
  process.env.NEXT_PUBLIC_MERCH_TAG_FILTER = 'ecatalogue';
  
  function buildApiHeaders() {
    const headers = { "Content-Type": "application/json" };
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
    if (apiKey) headers["x-api-key"] = apiKey;
    if (adminEmail) headers["x-admin-email"] = adminEmail;
    return headers;
  }

  function trimEndSlash(s = "") {
    return String(s || "").replace(/\/+$/, "");
  }

  const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/landing";
  const API_BASE2 = trimEndSlash(RAW_BASE);
  const MERCH_TAG_FILTER = process.env.NEXT_PUBLIC_MERCH_TAG_FILTER;

  console.log('API Base:', API_BASE2);
  console.log('MerchTag Filter:', MERCH_TAG_FILTER);
  console.log('Headers:', buildApiHeaders());

  const candidates = [
    `${API_BASE2}/product?limit=500`,
    `${API_BASE2}/product/?limit=500`,
    `${API_BASE2}/products?limit=500`,
    `${API_BASE2}/catalog/products?limit=500`,
  ];

  for (const url of candidates) {
    try {
      console.log(`\n📡 Trying URL: ${url}`);
      
      const res = await fetch(url, {
        headers: buildApiHeaders(),
        // Simulate Next.js revalidate
        next: { revalidate: 120 },
      });
      
      if (!res.ok) {
        console.log('❌ Failed:', res.status, res.statusText);
        continue;
      }

      const payload = await res.json();
      
      console.log('✅ API Response:', {
        success: payload.success,
        dataLength: payload.data?.length,
        total: payload.total,
        hasData: !!payload.data,
        isArray: Array.isArray(payload.data)
      });
      
      let products = [];
      let totalProducts = 0;
      
      // Handle the API response structure (same as shop page)
      if (payload?.success && payload?.data && Array.isArray(payload.data)) {
        products = payload.data;
        totalProducts = payload.total || payload.data.length;
      } else if (payload?.products && Array.isArray(payload.products)) {
        products = payload.products;
        totalProducts = payload.total || payload.products.length;
      } else if (Array.isArray(payload)) {
        products = payload;
        totalProducts = payload.length;
      } else {
        console.log('❌ Unexpected API response structure');
        continue;
      }

      console.log(`📦 Got ${products.length} products from API`);

      // Apply merchTag filtering if MERCH_TAG_FILTER is set (same as shop page)
      if (MERCH_TAG_FILTER && products.length > 0) {
        console.log(`🔍 Filtering by merchTag: "${MERCH_TAG_FILTER}"`);
        
        const filteredProducts = products.filter((product) => {
          if (!product.merchTags || !Array.isArray(product.merchTags)) {
            return false;
          }
          
          if (product.merchTags.length === 0) {
            return false;
          }
          
          return product.merchTags.includes(MERCH_TAG_FILTER);
        });

        console.log(`✅ Filtered to ${filteredProducts.length} products`);
        
        if (filteredProducts.length > 0) {
          console.log('📋 Sample filtered products:');
          filteredProducts.slice(0, 3).forEach((product, i) => {
            console.log(`  ${i + 1}. ${product.name} (ID: ${product._id})`);
            console.log(`     MerchTags: ${product.merchTags?.join(', ')}`);
          });
        }
        
        return {
          products: filteredProducts,
          total: filteredProducts.length,
          filtered: true,
          filterTag: MERCH_TAG_FILTER
        };
      }

      // Return ALL products if no filter is set
      console.log(`✅ Returning all ${products.length} products`);
      if (products.length > 0) {
        console.log('📋 Sample products:');
        products.slice(0, 3).forEach((product, i) => {
          console.log(`  ${i + 1}. ${product.name} (ID: ${product._id})`);
          console.log(`     MerchTags: ${product.merchTags?.join(', ')}`);
        });
      }
      
      return {
        products: products,
        total: totalProducts,
        filtered: false
      };
    } catch (error) {
      console.error('❌ API Error:', error.message);
    }
  }

  console.log('❌ No API endpoint worked, returning empty');
  return { products: [], total: 0, filtered: false };
}

// Run the test
testServerSideFetch()
  .then(result => {
    console.log('\n🏁 Final Result:', {
      productsCount: result.products.length,
      total: result.total,
      filtered: result.filtered
    });
  })
  .catch(console.error);