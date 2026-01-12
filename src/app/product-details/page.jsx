import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ProductDetailsClient from "./ProductDetailsClient";
import Footer from "@/layout/footers/footer";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

// Server-side function to fetch product data for metadata
async function getProductData(productId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${productId}`,
      { next: { revalidate: 600 } } // Cache for 10 minutes
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ searchParams }) {
  // Get product ID from search params or use default
  const productId = searchParams?.id || "6431364df5a812bd37e765ac";
  
  // Fetch product data for metadata
  const product = await getProductData(productId);
  
  // Extract first image URL and remove trailing hash
  const firstImage = (product?.image1CloudUrl && typeof product.image1CloudUrl === 'string' ? product.image1CloudUrl.replace(/#$/, '') : product?.image1CloudUrl) || 
                    product?.img || 
                    product?.image || 
                    product?.image1 || 
                    null;
  
  const productTitle = product?.name || product?.productTitle || product?.title || "Product Details";
  const productDescription = product?.shortProductDescription || 
                           product?.description || 
                           product?.productdescription || 
                           "View detailed information about our premium fabric products.";
  
  // Extract keywords from product data
  const productKeywords = product?.keywords || [];
  const keywordsString = Array.isArray(productKeywords) 
    ? productKeywords.join(', ') 
    : productKeywords || "product details, fabric, textile, premium quality, materials";
  
  // Dynamic robots tag - index if product exists, noindex if not found
  const robotsTag = product ? "index, follow" : "noindex, nofollow";
  
  return generateSEOMetadata({
    title: `${productTitle} - Shofy`,
    description: productDescription,
    keywords: keywordsString,
    path: `/product-details?id=${productId}`,
    ogImage: firstImage,
    robots: robotsTag
  });
}

export default function ProductDetailsPage({ searchParams }) {
  const productId = searchParams?.id || "6431364df5a812bd37e765ac";
  
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ProductDetailsClient productId={productId} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
