import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import BlogBreadcrumb from "@/components/breadcrumb/blog-breadcrumb";
import BlogPostboxArea from "@/components/blog/blog-postox/blog-postbox-area";
import Footer from "@/layout/footers/footer";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";
import blogData from "@/data/blog-data";

// Get first blog image for OG image
const getFirstBlogImage = () => {
  // Use the first blog post image path directly
  // This corresponds to blog_post_1 which is '@assets/img/blog/blog-big-3.jpg'
  return "/assets/img/blog/blog-big-3.jpg";
};

export async function generateMetadata() {
  const firstBlogImage = getFirstBlogImage();
  
  return generateSEOMetadata({
    title: "Shofy - Blog Page",
    description: "Read our latest blog posts about fabrics, textiles, and fashion trends. Stay updated with industry insights and tips.",
    keywords: "blog, fabrics, textiles, fashion, trends, industry insights, tips",
    path: "/blog",
    ogImage: firstBlogImage,
    robots: "index, follow"
  });
}

export default function BlogPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <BlogBreadcrumb />

      {/* Hidden H1 for SEO */}
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
        Blog - Latest Articles and Insights
      </h1>

      <BlogPostboxArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
