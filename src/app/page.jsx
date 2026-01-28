// app/page.jsx
import HomePageTwoClient from "./HomePageTwoClient";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Premium Quality Fabrics by eCatalogue | Cotton, Mercerized & Designer Textiles",
    description: "Discover premium cotton fabrics, mercerized finishes, and textile excellence at eCatalogue by Amrita Global Enterprises. Nokia & Majestica collections for fashion, home, and industrial use.",
    keywords: "premium fabrics, cotton fabrics, mercerized fabrics, textile manufacturer, Nokia collection, Majestica collection, eCatalogue, Amrita Global Enterprises, GSM fabrics, fashion textiles",
    path: "/",
    ogImage: "/assets/img/logo/logo.svg",
    robots: "index, follow"
  });
}

export default function Page() {
  return <HomePageTwoClient />;
}
