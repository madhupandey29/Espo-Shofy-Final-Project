// app/(isr)/fabric/page.jsx - ISR Implementation
import { Suspense } from 'react';
import { generateMetadata as generateSEOMetadata, getOptimizedLogoUrl } from "@/utils/seo";
import { BreadcrumbJsonLd } from "@/utils/breadcrumbStructuredData";
import { FabricCollectionJsonLd } from "@/utils/fabricCollectionStructuredData";
import { getPageSeoMetadata, PAGE_NAMES } from "@/utils/topicPageSeoIntegration";
import FabricPageClient from "./FabricPageClient";

// ✅ ISR: Revalidate every 60 seconds
export const revalidate = 60;

/* ---------------------------------------------
   Metadata (Dynamic SEO from Topic Page API)
---------------------------------------------- */
export async function generateMetadata() {
  const logoUrl = getOptimizedLogoUrl();
  
  // Fetch SEO data from topic page API
  const topicMetadata = await getPageSeoMetadata(PAGE_NAMES.FABRIC, {
    title: null,
    description: null,
    keywords: null,
  });

  // Extract canonical URL from the metadata object
  const canonicalFromApi = topicMetadata.alternates?.canonical || null;
  
  return generateSEOMetadata({
    title: topicMetadata.title,
    description: topicMetadata.description,
    keywords: topicMetadata.keywords,
    path: "/fabric",
    canonicalOverride: canonicalFromApi,
    ogImage: "/assets/img/logo/logo.svg",
    ogLogo: logoUrl,
    robots: "index, follow"
  });
}

/**
 * ✅ Fetch ALL products on the server with ISR caching
 */
async function fetchAllProducts() {
  const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/landing";
  const stripTrailingSlash = (s = "") => String(s || "").replace(/\/+$/, "");
  const API_BASE2 = stripTrailingSlash(RAW_BASE);
  const MERCH_TAG_FILTER = process.env.NEXT_PUBLIC_MERCH_TAG_FILTER;

  try {
    const url = `${API_BASE2}/product?limit=150`;
    const res = await fetch(url, {
      next: { revalidate: 60 } // ✅ ISR: Cache for 60 seconds
    });
    
    if (!res.ok) {
      return await fetchFromCollections(API_BASE2, MERCH_TAG_FILTER);
    }

    const payload = await res.json();
    let products = [];
    let totalProducts = 0;
    
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
      return await fetchFromCollections(API_BASE2, MERCH_TAG_FILTER);
    }

    // ✅ Remove duplicate products based on _id
    const seenIds = new Set();
    const uniqueProducts = [];
    let duplicateCount = 0;
    
    for (const product of products) {
      const id = product._id || product.id;
      if (id && seenIds.has(id)) {
        duplicateCount++;
        continue; // Skip duplicate
      }
      if (id) seenIds.add(id);
      uniqueProducts.push(product);
    }
    
    if (duplicateCount > 0) {
      console.warn(`⚠️ Removed ${duplicateCount} duplicate products from API response`);
    }
    
    products = uniqueProducts;
    totalProducts = uniqueProducts.length;

    // Apply merchTag filtering if set
    if (MERCH_TAG_FILTER && products.length > 0) {
      const filteredProducts = products.filter((product) => {
        if (!product.merchTags || !Array.isArray(product.merchTags)) return false;
        if (product.merchTags.length === 0) return false;
        return product.merchTags.includes(MERCH_TAG_FILTER);
      });

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
    return await fetchFromCollections(API_BASE2, MERCH_TAG_FILTER);
  }
}

/**
 * Fallback: Fetch from collections if main endpoint fails
 */
async function fetchFromCollections(API_BASE2, MERCH_TAG_FILTER) {
  const collectionIds = [
    '690a0e676132664ee',
    '695f9b0b956eb958b'
  ];

  let allProducts = [];
  let totalProducts = 0;

  for (const collectionId of collectionIds) {
    try {
      const url = `${API_BASE2}/product/fieldname/collectionId/${collectionId}?limit=100`;
      const res = await fetch(url, {
        next: { revalidate: 60 } // ✅ ISR: Cache for 60 seconds
      });
      
      if (res.ok) {
        const payload = await res.json();
        if (payload?.success && payload?.data && Array.isArray(payload.data)) {
          allProducts = [...allProducts, ...payload.data];
          totalProducts += payload.total || payload.data.length;
        }
      }
    } catch (error) {
      // Continue with other collections
    }
  }

  // ✅ Remove duplicates from collection-based fetch
  const seenIds = new Set();
  const uniqueProducts = [];
  
  for (const product of allProducts) {
    const id = product._id || product.id;
    if (id && seenIds.has(id)) continue;
    if (id) seenIds.add(id);
    uniqueProducts.push(product);
  }
  
  allProducts = uniqueProducts;
  totalProducts = uniqueProducts.length;

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

/**
 * Fetch office information for floating buttons
 */
async function fetchOfficeInfo() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${API_BASE}/companyinformation`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        const companyFilter = process.env.NEXT_PUBLIC_COMPANY_FILTER;
        const targetCompany = companyFilter 
          ? data.data.find(company => company.name === companyFilter) || data.data[0]
          : data.data[0];
        return targetCompany;
      }
    }
  } catch (error) {
    console.error('Error fetching office info:', error);
  }
  return null;
}

/* ---------------------------------------------
   Page (Server Component with ISR)
---------------------------------------------- */
export default async function FabricPage() {
  // ✅ Fetch data on server with ISR caching
  const productData = await fetchAllProducts();
  const office = await fetchOfficeInfo();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fabrics' }
  ];

  const breadcrumbStructuredData = [
    { name: 'Home', url: '/' },
    { name: 'Fabrics', url: '/fabric' }
  ];

  return (
    <>
      {/* ✅ Render JSON-LD on server for ISR */}
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      <FabricCollectionJsonLd 
        products={productData.products} 
        options={{
          filtered: productData.filtered,
          filterTag: productData.filterTag
        }}
      />
      
      {/* ✅ Pass pre-fetched data to client component */}
      <FabricPageClient 
        productData={productData}
        office={office}
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
}
