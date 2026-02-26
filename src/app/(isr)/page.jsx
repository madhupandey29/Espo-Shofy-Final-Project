// app/page.jsx
import HomePageTwoClient from "./HomePageTwoClient";
import { getPageSeoMetadata, PAGE_NAMES } from "@/utils/topicPageSeoIntegration";
import { generateMetadata as generateSEOMetadata, getOptimizedLogoUrl } from "@/utils/seo";

// Revalidate every 60 seconds
export const revalidate = 60;

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
  
  // Fetch office information
  let office = null;
  try {
    const officeRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/officeinformation`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    if (officeRes.ok) {
      const officeData = await officeRes.json();
      office = officeData?.data?.[0] || null;
    }
  } catch (error) {
    console.error('Error fetching office information:', error);
  }

  // Fetch all products for filtering
  let allProducts = [];
  try {
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`, {
      next: { revalidate: 120 } // Cache for 2 minutes
    });
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      allProducts = Array.isArray(productsData?.data) ? productsData.data : [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  // Filter products for PopularProducts (PopularFabrics + ecatalogue tags)
  const popularProducts = allProducts.filter(product => {
    if (!product.merchTags || !Array.isArray(product.merchTags)) {
      return false;
    }
    const hasPopularTag = product.merchTags.includes('PopularFabrics');
    const hasCatalogueTag = product.merchTags.includes('ecatalogue');
    return hasPopularTag && hasCatalogueTag;
  });

  // Filter products for WeeksFeatured (FeaturedFabrics + ecatalogue tags)
  const featuredProducts = allProducts.filter(product => {
    if (!product.merchTags || !Array.isArray(product.merchTags)) {
      return false;
    }
    const hasFeaturedTag = product.merchTags.includes('FeaturedFabrics');
    const hasCatalogueTag = product.merchTags.includes('ecatalogue');
    return hasFeaturedTag && hasCatalogueTag;
  });
  
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
      <HomePageTwoClient 
        office={office} 
        popularProducts={popularProducts}
        featuredProducts={featuredProducts}
      />
    </>
  );
}
