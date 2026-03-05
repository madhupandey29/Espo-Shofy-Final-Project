// app/page.jsx
import HomePageTwoClient from "./HomePageTwoClient";
import { getPageSeoMetadata, PAGE_NAMES } from "@/utils/topicPageSeoIntegration";
import { generateMetadata as generateSEOMetadata, getOptimizedLogoUrl } from "@/utils/seo";

// Revalidate every 60 seconds
export const revalidate = 60;

// Force dynamic rendering for pages with useSearchParams
export const dynamic = 'force-dynamic';


/* ---------------------------------------------
   Server fetch helpers for ISR Home
---------------------------------------------- */
const stripTrailingSlash = (s = '') => String(s || '').replace(/\/+$/, '');

const API_BASE = stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || '');

// Fetch company information and apply same filter as Redux transformResponse
async function fetchOfficeInfo() {
  try {
    if (!API_BASE) return null;

    const res = await fetch(`${API_BASE}/companyinformation`, {
      next: { revalidate },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];

    const companyFilter = process.env.NEXT_PUBLIC_COMPANY_FILTER;
    if (!companyFilter) return null;

    return list.find((x) => x?.name === companyFilter) || null;
  } catch {
    return null;
  }
}

async function fetchHomeProducts() {
  try {
    if (!API_BASE) return [];
    const res = await fetch(`${API_BASE}/product/?limit=50`, { next: { revalidate } });
    if (!res.ok) return [];

    const json = await res.json();
    if (json?.success && Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.products)) return json.products;
    if (Array.isArray(json)) return json;
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

async function fetchHomeBlogs() {
  try {
    const base = stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000');
    const path = process.env.NEXT_PUBLIC_API_BLOG_PATH || '/blog';
    const res = await fetch(`${base}${path}`, { next: { revalidate } });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata() {
  const logoUrl = getOptimizedLogoUrl();
  
  // Fetch SEO data from topic page API
  const topicMetadata = await getPageSeoMetadata(PAGE_NAMES.HOME, {
    title: null,
    description: null,
    keywords: null,
  });

  // Extract canonical URL from the metadata object
  const canonicalFromApi = topicMetadata.alternates?.canonical || null;

  // Merge with existing SEO metadata structure
  return generateSEOMetadata({
    title: topicMetadata.title,
    description: topicMetadata.description,
    keywords: topicMetadata.keywords,
    path: "/",
    canonicalOverride: canonicalFromApi, // Use canonical from API
    ogImage: "/assets/img/logo/logo.svg",
    ogLogo: logoUrl,
    robots: "index, follow"
  });
}

export default async function Page() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.amrita-fashions.com").replace(/\/+$/, "");


// ✅ ISR data fetched on the server (no Redux)
const [office, homeProducts, homeBlogs] = await Promise.all([
  fetchOfficeInfo(),
  fetchHomeProducts(),
  fetchHomeBlogs(),
]);
  
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#home`,
    "url": `${siteUrl}/`,
    "name": "Home",
    "isPartOf": { "@id": `${siteUrl}/#website` },
    "about": { "@id": `${siteUrl}/#org` },
    "inLanguage": "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HomePageTwoClient office={office} homeProducts={homeProducts} homeBlogs={homeBlogs} />
    </>
  );
}
