// app/fabric/page.jsx
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopArea from "@/components/shop/shop-area";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

/* ---------------------------------------------
   Incremental Static Regeneration (ISR)
---------------------------------------------- */
export const revalidate = 120;

/* ---------------------------------------------
   Metadata (Static SEO)
---------------------------------------------- */
export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Premium Fabrics Collection | Cotton, Mercerized & Designer Textiles - eCatalogue",
    description: "Browse our complete collection of premium cotton fabrics, mercerized textiles, and designer materials. Nokia & Majestica collections with GSM specifications for fashion and industrial use.",
    keywords: "fabric collection, cotton fabrics, mercerized textiles, premium materials, Nokia collection, Majestica collection, GSM fabrics, textile collection, fabric store",
    path: "/fabric",
    ogImage: "/assets/img/logo/logo.svg",
    robots: "index, follow"
  });
}

/**
 * Fetch ALL products on the server (SSR) - Get all 123 products
 */
async function fetchAllProducts() {
  const RAW_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/landing";
  
  // Helper function to strip trailing slash
  const stripTrailingSlash = (s = "") => String(s || "").replace(/\/+$/, "");
  const API_BASE2 = stripTrailingSlash(RAW_BASE);

  // Get merchTag filter from environment variable
  const MERCH_TAG_FILTER = process.env.NEXT_PUBLIC_MERCH_TAG_FILTER;

  // Fetching ALL 123 products...

  try {
    // ✅ FIX: Use the general product endpoint with limit=150 to get all 123 products
    const url = `${API_BASE2}/product?limit=150`;
    console.log('📡 Fetching all products:', url);
    
    const res = await fetch(url, {
      next: { revalidate },
    });
    
    console.log('📊 Response status:', res.status);
    
    if (!res.ok) {
      console.log('❌ Failed:', res.status, res.statusText);
      // Fallback to collection-based approach
      return await fetchFromCollections(API_BASE2, MERCH_TAG_FILTER);
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
    } else if (payload?.products && Array.isArray(payload.products)) {
      products = payload.products;
      totalProducts = payload.total || payload.products.length;
    } else if (Array.isArray(payload)) {
      products = payload;
      totalProducts = payload.length;
    } else {
      console.log('❌ Unexpected API response structure');
      // Fallback to collection-based approach
      return await fetchFromCollections(API_BASE2, MERCH_TAG_FILTER);
    }

    console.log(`📦 Got ${products.length} products from API`);

    // Check collection distribution
    const collectionStats = {};
    products.forEach(product => {
      const collectionName = product.collectionName || 'No Collection';
      collectionStats[collectionName] = (collectionStats[collectionName] || 0) + 1;
    });
    
    console.log('📦 Collection distribution:');
    Object.entries(collectionStats).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${count} products`);
    });

    // Apply merchTag filtering if MERCH_TAG_FILTER is set
    if (MERCH_TAG_FILTER && products.length > 0) {
      // Filtering by merchTag
      
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
      
      return {
        products: filteredProducts,
        total: filteredProducts.length,
        filtered: true,
        filterTag: MERCH_TAG_FILTER
      };
    }

    // Return ALL products if no filter is set
    console.log(`✅ Returning all ${products.length} products`);
    
    return {
      products: products,
      total: totalProducts,
      filtered: false
    };
  } catch (error) {
    console.error('❌ API Error:', error.message);
    // Fallback to collection-based approach
    return await fetchFromCollections(API_BASE2, MERCH_TAG_FILTER);
  }
}

/**
 * Fallback: Fetch from collections if main endpoint fails
 */
async function fetchFromCollections(API_BASE2, MERCH_TAG_FILTER) {
  console.log('🔄 Falling back to collection-based fetch...');
  
  const collectionIds = [
    '690a0e676132664ee', // Nokia collection
    '695f9b0b956eb958b'  // Majestica collection
  ];

  let allProducts = [];
  let totalProducts = 0;

  // Fetch products from each collection
  for (const collectionId of collectionIds) {
    try {
      const url = `${API_BASE2}/product/fieldname/collectionId/${collectionId}?limit=100`;
      console.log('📡 Fetching from collection:', url);
      
      const res = await fetch(url, {
        next: { revalidate: 120 },
      });
      
      if (res.ok) {
        const payload = await res.json();
        
        if (payload?.success && payload?.data && Array.isArray(payload.data)) {
          console.log(`✅ Got ${payload.data.length} products from collection ${collectionId}`);
          allProducts = [...allProducts, ...payload.data];
          totalProducts += payload.total || payload.data.length;
        }
      }
    } catch (error) {
      console.error('❌ Collection API Error:', error.message);
    }
  }

  console.log(`📦 Total products from collections: ${allProducts.length}`);

  // Apply filtering if needed
  if (MERCH_TAG_FILTER && allProducts.length > 0) {
    const filteredProducts = allProducts.filter((product) => {
      return product.merchTags && product.merchTags.includes(MERCH_TAG_FILTER);
    });

    return {
      products: filteredProducts,
      total: filteredProducts.length,
      filtered: true,
      filterTag: MERCH_TAG_FILTER
    };
  }

  return {
    products: allProducts,
    total: totalProducts,
    filtered: false
  };
}

/* ---------------------------------------------
   Page (Server Component)
---------------------------------------------- */
export default async function FabricPage() {
  const productData = await fetchAllProducts();

  console.log('🧵 Fabric Page Data:', {
    productsCount: productData.products.length,
    total: productData.total,
    filtered: productData.filtered
  });

  return (
    <Wrapper>
      <HeaderTwo style_2 />

      {/* ✅ SEO-Optimized H1 for Fabric Page */}
      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        Premium Fabric Collection - Cotton, Mercerized & Designer Textiles
        {productData.filtered && ` - ${productData.filterTag} Collection`}
      </h1>

      <div className="shop-page-spacing">
        <ShopArea 
          initialProducts={productData.products} 
          totalProducts={productData.total}
        />
      </div>

      <Footer primary_style />
    </Wrapper>
  );
}