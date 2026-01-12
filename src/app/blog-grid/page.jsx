import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import SectionTitle from "@/components/blog/blog-grid/section-title";
import BlogGridArea from "@/components/blog/blog-grid/blog-grid-area";
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
  const canonical = pageUrl("/blog-grid");

  // Static SEO metadata for blog grid page
  return {
    title: "Shofy - Blog Grid Page",
    description: "Explore our latest blog posts about fabrics, textiles, and industry insights. Stay updated with Shofy's textile expertise.",
    keywords: "blog, fabrics, textiles, industry insights, textile expertise, latest updates",
    alternates: { canonical },
    openGraph: {
      title: "Shofy - Blog Grid Page",
      description: "Explore our latest blog posts about fabrics, textiles, and industry insights. Stay updated with Shofy's textile expertise.",
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary",
      title: "Shofy - Blog Grid Page",
      description: "Explore our latest blog posts about fabrics, textiles, and industry insights. Stay updated with Shofy's textile expertise.",
    },
  };
}

export default function BlogGridPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />

      {/* ✅ Hidden H1 for SEO */}
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
        Blog - Latest Textile & Fabric Updates
      </h1>

      <SectionTitle />
      <BlogGridArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
