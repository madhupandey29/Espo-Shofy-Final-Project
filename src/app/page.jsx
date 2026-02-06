// app/page.jsx
import HomePageTwoClient from "./HomePageTwoClient";
import { getPageSeoMetadata, PAGE_NAMES } from "@/utils/topicPageSeoIntegration";

export async function generateMetadata() {
  const fallback = {
    title: "Premium Quality Fabrics by eCatalogue | Cotton, Mercerized & Designer Textiles",
    description: "Discover premium cotton fabrics, mercerized finishes, and textile excellence at eCatalogue by Amrita Global Enterprises. Nokia & Majestica collections for fashion, home, and industrial use.",
  };

  return await getPageSeoMetadata(PAGE_NAMES.HOME, fallback);
}

export default function Page() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.amrita-fashions.com").replace(/\/+$/, "");
  
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
      <HomePageTwoClient />
    </>
  );
}
