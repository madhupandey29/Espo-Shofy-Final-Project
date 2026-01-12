// app/page.jsx
import HomePageTwoClient from "./HomePageTwoClient";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Shofy - Home Page",
    description: "Welcome to Shofy - Your premier destination for quality fabrics and textiles.",
    keywords: "fabrics, textiles, home, shofy, quality materials",
    path: "/",
    ogImage: "/assets/img/logo/logo.svg",
    robots: "index, follow"
  });
}

export default function Page() {
  return <HomePageTwoClient />;
}
