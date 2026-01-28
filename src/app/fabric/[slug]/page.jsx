import Wrapper       from '@/layout/wrapper';
import HeaderTwo     from '@/layout/headers/header-2';
import Footer        from '@/layout/footers/footer';
import ProductClient from './ProductDetailsClient';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';

export const revalidate = 600;

/* -----------------------------
  helpers
----------------------------- */
const pick = (...v) => v.find(x => x !== undefined && x !== null && String(x).trim() !== '');

const stripTrailingSlash = (s = '') => String(s || '').replace(/\/+$/, '');

const stripHtml = (html = '') =>
  String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// ✅ API base from env
const API_BASE = stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || '');

/* -----------------------------
  Product fetcher (YOUR API)
----------------------------- */
async function getProductBySlug(slug) {
  try {
    // Clean the slug by removing trailing hash character
    const cleanSlug = slug ? slug.replace(/#$/, '') : slug;
    console.log('getProductBySlug - original slug:', slug);
    console.log('getProductBySlug - cleaned slug:', cleanSlug);
    
    // ✅ FIX: Since the slug endpoint is broken, get all products and search client-side
    const res = await fetch(`${API_BASE}/product?limit=150`, {
      next: { revalidate },
    });
    
    if (!res.ok) return null;

    const j = await res.json();
    
    // Handle the response structure and find product by slug
    let products = [];
    if (j?.success && j?.data && Array.isArray(j.data)) {
      products = j.data;
    } else if (j?.products && Array.isArray(j.products)) {
      products = j.products;
    } else if (Array.isArray(j)) {
      products = j;
    }
    
    if (products.length === 0) {
      return null;
    }
    
    // Search for product by slug in multiple fields
    const foundProduct = products.find(product => {
      const productSlug = product?.productslug;
      const aiTempSlug = product?.aiTempOutput;
      const fabricCode = product?.fabricCode;
      const productId = product?.id;
      
      return (
        productSlug === cleanSlug ||
        aiTempSlug === cleanSlug ||
        fabricCode === cleanSlug ||
        productId === cleanSlug
      );
    });
    
    console.log('getProductBySlug - found product:', !!foundProduct, foundProduct?.name);
    return foundProduct || null;
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return null;
  }
}

/* -----------------------------
  Metadata
----------------------------- */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const product = await getProductBySlug(slug);

  const fallbackTitle = String(slug || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const title = pick(product?.productTitle, product?.name, fallbackTitle);

  const description = stripHtml(
    pick(product?.shortProductDescription, product?.description, '')
  ) || "View detailed information about our premium fabric products.";

  // Extract keywords from product data
  const productKeywords = product?.keywords || [];
  const keywordsString = Array.isArray(productKeywords) 
    ? productKeywords.join(', ') 
    : productKeywords || "fabric, textile, premium quality, materials";

  // ✅ OG image should be "image1CloudUrl" field (your requirement)
  const ogImageUrl = pick(product?.image1CloudUrl, product?.image1, product?.img, product?.image, '');

  // Dynamic robots tag - index if product exists, noindex if not found
  const robotsTag = product ? "index, follow" : "noindex, nofollow";

  return generateSEOMetadata({
    title: `${title} - Shofy`,
    description,
    keywords: keywordsString,
    path: `/fabric/${slug}`,
    ogImage: ogImageUrl,
    robots: robotsTag
  });
}

/* -----------------------------
  Page component
----------------------------- */
export default async function Page({ params }) {
  const { slug } = params;

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <ProductClient slug={slug} />
      <Footer primary_style />
    </Wrapper>
  );
}
