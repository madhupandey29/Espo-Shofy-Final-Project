// app/page.jsx
import HomePageTwoClient from "./HomePageTwoClient";

const stripTrailingSlash = (s = "") => String(s || "").replace(/\/+$/, "");

const SITE_URL = stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || "");

// ✅ build URL from env
const pageUrl = (path = "/") => {
  if (!SITE_URL) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export async function generateMetadata() {
  // ✅ canonical always from env
  const canonical = pageUrl("/");

  // Static SEO metadata for home page
  return {
    title: "Shofy - Home Page",
    description: "Welcome to Shofy - Your premier destination for quality fabrics and textiles.",
    keywords: "fabrics, textiles, home, shofy, quality materials",
    alternates: { canonical },
    openGraph: { 
      title: "Shofy - Home Page",
      description: "Welcome to Shofy - Your premier destination for quality fabrics and textiles.",
      url: canonical, 
      type: "website" 
    },
    twitter: {
      card: "summary",
      title: "Shofy - Home Page",
      description: "Welcome to Shofy - Your premier destination for quality fabrics and textiles.",
    },
  };
}

export default function Page() {
  return <HomePageTwoClient />;
}
