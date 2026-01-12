import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ContactBreadcrumb from "@/components/breadcrumb/contact-breadcrumb";
import ContactArea from "@/components/contact/contact-area";
import ContactMap from "@/components/contact/contact-map";
import Footer from "@/layout/footers/footer";

/* -----------------------------
  helpers
----------------------------- */
const stripTrailingSlash = (s = "") => String(s || "").replace(/\/+$/, "");

const SITE_URL = stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || "");

// ✅ build URL from env
const pageUrl = (path = "/") => {
  if (!SITE_URL) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* -----------------------------
  Metadata (Static SEO)
----------------------------- */
export async function generateMetadata() {
  // ✅ canonical always from env
  const canonical = pageUrl("/contact");

  // Static SEO metadata for contact page
  return {
    title: "Shofy - Contact Page",
    description: "Get in touch with Shofy. Contact us for inquiries about our premium fabrics and textiles.",
    keywords: "contact, get in touch, shofy, fabrics, textiles, inquiries, support",
    alternates: { canonical },
    openGraph: {
      title: "Shofy - Contact Page",
      description: "Get in touch with Shofy. Contact us for inquiries about our premium fabrics and textiles.",
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary",
      title: "Shofy - Contact Page",
      description: "Get in touch with Shofy. Contact us for inquiries about our premium fabrics and textiles.",
    },
  };
}

export default function ContactPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
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
        Contact Us - Get in Touch
      </h1>
      <ContactBreadcrumb />
      <ContactArea />
      <ContactMap />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
