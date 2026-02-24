import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import BlogContentWrapper from "@/components/blog/blog-grid/blog-content-wrapper";
import Footer from "@/layout/footers/footer";
import CompactUniversalBreadcrumb from "@/components/breadcrumb/compact-universal-breadcrumb";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";
import { BreadcrumbJsonLd } from "@/utils/breadcrumbStructuredData";

// Revalidate every 60 seconds
export const revalidate = 60;

// Generate metadata for tag pages
export async function generateMetadata({ params }) {
  const tagname = params.tagname;
  const decodedTag = decodeURIComponent(tagname);
  
  return generateSEOMetadata({
    title: `${decodedTag} - Blog Articles`,
    description: `Browse all blog articles tagged with ${decodedTag}. Discover insights and knowledge about ${decodedTag}.`,
    keywords: `${decodedTag}, blog, articles`,
    path: `/blog/tag/${tagname}`,
    robots: "index, follow"
  });
}

export default function BlogTagPage({ params }) {
  const tagname = params.tagname;
  const decodedTag = decodeURIComponent(tagname);
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: decodedTag }
  ];

  // Breadcrumb structured data
  const breadcrumbStructuredData = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: decodedTag, url: `/blog/tag/${tagname}` }
  ];

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      
      <Wrapper>
        <HeaderTwo style_2={true} />
        <CompactUniversalBreadcrumb items={breadcrumbItems} />
        <BlogContentWrapper tagname={decodedTag} />
        <Footer primary_style={true} />
      </Wrapper>
    </>
  );
}
