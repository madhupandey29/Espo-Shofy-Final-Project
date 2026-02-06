import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ContactBreadcrumb from "@/components/breadcrumb/contact-breadcrumb";
import ContactArea from "@/components/contact/contact-area";
import ContactMap from "@/components/contact/contact-map";
import Footer from "@/layout/footers/footer";
import { generateMetadata as generateSEOMetadata, getOptimizedLogoUrl } from "@/utils/seo";
import { BreadcrumbJsonLd } from "@/utils/breadcrumbStructuredData";
import { getPageSeoMetadata, PAGE_NAMES } from "@/utils/topicPageSeoIntegration";

/* -----------------------------
  Metadata (Dynamic SEO from Topic Page API)
----------------------------- */
export async function generateMetadata() {
  const logoUrl = getOptimizedLogoUrl();
  
  // Fetch SEO data from topic page API
  const topicMetadata = await getPageSeoMetadata(PAGE_NAMES.CONTACT, {
    title: "Contact eCatalogue | Premium Fabric Supplier - Get in Touch",
    description: "Contact eCatalogue by Amrita Global Enterprises for premium cotton fabrics, mercerized textiles, and custom fabric solutions. Expert textile consultation and support.",
    keywords: "contact eCatalogue, fabric supplier contact, textile consultation, Amrita Global Enterprises, premium fabrics, cotton textiles, fabric inquiry",
  });

  // Extract canonical URL from the metadata object
  const canonicalFromApi = topicMetadata.alternates?.canonical || null;

  // Merge with existing SEO metadata structure
  return generateSEOMetadata({
    title: topicMetadata.title,
    description: topicMetadata.description,
    keywords: topicMetadata.keywords,
    path: "/contact",
    canonicalOverride: canonicalFromApi, // Use canonical from API
    ogImage: "/assets/img/logo/logo.svg",
    ogLogo: logoUrl,
    robots: "index, follow"
  });
}

export default function ContactPage() {
  // Breadcrumb structured data
  const breadcrumbStructuredData = [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' }
  ];

  return (
    <Wrapper>
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      
      <HeaderTwo style_2={true} />
      {/* SEO-Optimized H1 for Contact Page */}
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
        Contact eCatalogue - Premium Fabric Supplier & Textile Experts
      </h1>
      <ContactBreadcrumb />
      <ContactArea />
      <ContactMap />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
