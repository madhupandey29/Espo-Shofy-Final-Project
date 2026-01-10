// Test what data the shop page is actually receiving
async function testShopPageData() {
  console.log('🔍 Testing Shop Page Data Flow...\n');
  
  // Simulate the exact same fetch as shop page
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

  console.log('🔧 Configuration:');
  console.log('API Base:', API_BASE2);
  console.log('MerchTag Filter:', MERCH_TAG_FILTER);
  console.log('Headers:', buildApiHeaders());

  // Test the working endpoint
  const url = `${API_BASE2}/product/?limit=500`;
  
  try {
    console.log(`\n📡 Fetching: ${url}`);
    
    const res = await fetch(url, {
      headers: buildApiHeaders(),
    });
    
    if (!res.ok) {
      console.error('❌ Failed:', res.status, res.statusText);
      return;
    }

    const payload = await res.json();
    
    console.log('✅ API Response:', {
      success: payload.success,
      dataLength: payload.data?.length,
      total: payload.total
    });
    
    let products = [];
    let totalProducts = 0;
    
    // Handle the API response structure (same as shop page)
    if (payload?.success && payload?.data && Array.isArray(payload.data)) {
      products = payload.data;
      totalProducts = payload.total || payload.data.length;
    } else {
      console.log('❌ Unexpected API response structure');
      return;
    }

    console.log(`📦 Got ${products.length} products from API`);

    // Apply merchTag filtering (same as shop page)
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
        console.log('\n📋 Sample filtered products for shop page:');
        filteredProducts.slice(0, 5).forEach((product, i) => {
          console.log(`  ${i + 1}. ${product.name}`);
          console.log(`     ID: ${product.id || product._id || 'No ID'}`);
          console.log(`     MerchTags: ${product.merchTags?.join(', ')}`);
          console.log(`     Has Image: ${!!(product.image1CloudUrl || product.image1)}`);
          console.log(`     ProductSlug: ${product.productslug || 'No slug'}`);
          console.log('');
        });
        
        // Test what ShopArea would receive
        console.log('🏪 Data that ShopArea component would receive:');
        console.log({
          initialProducts: filteredProducts.length,
          totalProducts: filteredProducts.length,
          firstProductName: filteredProducts[0]?.name,
          firstProductId: filteredProducts[0]?.id || filteredProducts[0]?._id
        });
        
        return {
          products: filteredProducts,
          total: filteredProducts.length,
          filtered: true,
          filterTag: MERCH_TAG_FILTER
        };
      } else {
        console.log('❌ No products match the filter!');
        return { products: [], total: 0, filtered: true };
      }
    }

    console.log('❌ No filter applied - this should not happen');
    return { products: [], total: 0, filtered: false };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { products: [], total: 0, filtered: false };
  }
}

// Run the test
testShopPageData()
  .then(result => {
    console.log('\n🏁 Final Result for Shop Page:', {
      productsCount: result.products.length,
      total: result.total,
      filtered: result.filtered,
      success: result.products.length > 0
    });
  })
  .catch(console.error);