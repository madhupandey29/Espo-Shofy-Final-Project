// app/page.jsx
import HomePageTwoClient from "./HomePageTwoClient";
import dynamic from 'next/dynamic';

// Dynamically import the structured data component with error boundary
const StructuredDataScripts = dynamic(
  () => import('@/components/seo/StructuredDataScripts'),
  { 
    ssr: false,
    loading: () => null
  }
);

const StructuredDataErrorBoundary = dynamic(
  () => import('@/components/seo/StructuredDataErrorBoundary'),
  { 
    ssr: false,
    loading: () => null
  }
);

export const metadata = {
  title: "Premium Quality Fabrics by eCatalogue | Cotton, Mercerized & Designer Textiles",
  description: "Discover premium cotton fabrics, mercerized finishes, and textile excellence at eCatalogue by Amrita Global Enterprises. Nokia & Majestica collections for fashion, home, and industrial use.",
};

export default function Page() {
  return (
    <>
      <StructuredDataErrorBoundary>
        <StructuredDataScripts />
      </StructuredDataErrorBoundary>
      <HomePageTwoClient />
    </>
  );
}
