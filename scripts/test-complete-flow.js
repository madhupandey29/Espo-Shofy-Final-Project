// Test the complete flow from API to shop page
async function testCompleteFlow() {
  console.log('🔍 Testing complete shop page flow...\n');
  
  // Simulate the exact same setup as shop page
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

  // Simulate fetchAllProducts function from shop page
  async function fetchAllProducts() {
    const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/landing";
    const API_BASE2 = trimEndSlash(RAW_BASE);
    const MERCH_TAG_FILTER = process.env.NEXT_PUBLIC_MERCH_TAG_FILTER;

    console.log('🔧 Configuration:');
    console.log('API Base:', API_BASE2);
    console.log('MerchTag Filter:', MERCH_TAG_FILTER);

    const candidates = [
      `${API_BASE2}/product`, // Simple endpoint - no parameters
    ];

    for (const url of candidates) {
      try {
        console.log('📡 Trying URL:', url);
        
        const headers = buildApiHeaders();
        console.log('📋 Headers:', headers);
        
        const res = await fetch(url, { headers });
        
        console.log('📊 Response status:', res.status);
        
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
        
        // Handle the API response structure
        if (payload?.success && payload?.data && Array.isArray(payload.data)) {
          products = payload.data;
          totalProducts = payload.total || payload.data.length;
        } else {
          console.log('❌ Unexpected API response structure');
          continue;
        }

        console.log(`📦 Got ${products.length} products from API`);

        // Apply merchTag filtering if MERCH_TAG_FILTER is set
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
            console.log('📋 Sample filtered products for shop page:');
            filteredProducts.slice(0, 5).forEach((product, i) => {
              console.log(`  ${i + 1}. ${product.name}`);
              console.log(`     ID: ${product.id || product._id || 'No ID'}`);
              console.log(`     Has Image: ${!!(product.image1CloudUrl || product.image1)}`);
              console.log('');
            });
          }
          
          return {
            products: filteredProducts,
            total: filteredProducts.length,
            filtered: true,
            filterTag: MERCH_TAG_FILTER
          };
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
  const productData = await fetchAllProducts();

  console.log('\n🏪 Shop Page Data:', {
    productsCount: productData.products.length,
    total: productData.total,
    filtered: productData.filtered
  });

  // Simulate what ShopArea would receive
  console.log('\n🏗️ ShopArea would receive:');
  console.log({
    initialProducts: productData.products.length,
    totalProducts: productData.total,
    firstProductName: productData.products[0]?.name || 'No products',
    firstProductId: productData.products[0]?.id || productData.products[0]?._id || 'No ID'
  });

  return productData;
}

// Run the test
testCompleteFlow()
  .then(result => {
    console.log('\n🏁 FINAL RESULT:', {
      success: result.products.length > 0,
      productsForShop: result.products.length,
      totalAvailable: result.total,
      readyToDisplay: result.products.length > 0
    });
    
    if (result.products.length > 0) {
      console.log('\n✅ SUCCESS! Shop page should show products now!');
    } else {
      console.log('\n❌ FAILED! No products available for shop page');
    }
  })
  .catch(console.error);