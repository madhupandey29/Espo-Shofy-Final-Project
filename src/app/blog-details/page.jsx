import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";
import blogData from "@/data/blog-data";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

// Get specific blog post data
const blogPost = blogData[4]; // This corresponds to the blog post being displayed

export async function generateMetadata() {
  // Use the specific blog post's image
  // blogData[4] is the fashion blog post with blog_5 image
  const blogImage = "/assets/img/blog/2/blog-2.jpg"; // Corresponds to blog_5
  
  return generateSEOMetadata({
    title: `${blogPost.title} - Shofy Blog`,
    description: blogPost.sm_desc || "Read our detailed blog post about fabrics, textiles, and fashion trends.",
    keywords: blogPost.tags ? blogPost.tags.join(', ') : "blog, fabrics, textiles, fashion",
    path: "/blog-details",
    ogImage: blogImage,
    robots: "index, follow"
  });
}

export default function BlogDetailsPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      
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
        {blogPost.title}
      </h1>
      
      <BlogDetailsArea blog={blogPost} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
