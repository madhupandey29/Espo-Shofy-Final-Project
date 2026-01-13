import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ContactBreadcrumb from "@/components/breadcrumb/contact-breadcrumb";
import ContactArea from "@/components/contact/contact-area";
import ContactMap from "@/components/contact/contact-map";
import Footer from "@/layout/footers/footer";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

/* -----------------------------
  Metadata (Static SEO)
----------------------------- */
export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Contact eCatalogue | Premium Fabric Supplier - Get in Touch",
    description: "Contact eCatalogue by Amrita Global Enterprises for premium cotton fabrics, mercerized textiles, and custom fabric solutions. Expert textile consultation and support.",
    keywords: "contact eCatalogue, fabric supplier contact, textile consultation, Amrita Global Enterprises, premium fabrics, cotton textiles, fabric inquiry",
    path: "/contact",
    ogImage: "/assets/img/logo/logo.svg",
    robots: "index, follow"
  });
}

export default function ContactPage() {
  return (
    <Wrapper>
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
