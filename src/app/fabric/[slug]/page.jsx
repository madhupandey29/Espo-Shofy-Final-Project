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
    
    // ✅ Updated to use the new API endpoint structure
    const res = await fetch(`${API_BASE}/product/fieldname/productslug/${cleanSlug}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;

    const j = await res.json();
    // Handle the response structure from the new API - it returns data array
    if (j?.success && j?.data && Array.isArray(j.data) && j.data.length > 0) {
      return j.data[0]; // Return the first product
    }
    if (j?.products && Array.isArray(j.products) && j.products.length > 0) {
      return j.products[0]; // Fallback for products array
    }
    return null;
  } catch {
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
