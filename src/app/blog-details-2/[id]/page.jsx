import React from "react";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import blogData from "@/data/blog-data";
import BlogDetailsAreaTwo from "@/components/blog-details/blog-details-area-2";
import Footer from "@/layout/footers/footer";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const blogItem = blogData.find((b) => Number(b.id) === Number(params.id));
  
  const title = blogItem?.title || "Blog Details";
  const description = blogItem?.sm_desc || blogItem?.desc || "Read our detailed blog post about fabrics, textiles, and fashion trends.";
  const keywords = blogItem?.tags ? blogItem.tags.join(', ') : "blog, fabrics, textiles, fashion";
  
  // Get blog image path
  let blogImage = null;
  if (blogItem?.img) {
    // Convert imported image to string path - this is tricky with static imports
    // For now, we'll use a fallback approach
    blogImage = "/assets/img/blog/blog-big-2.jpg"; // Default blog image
  }
  
  return generateSEOMetadata({
    title: `${title} - Shofy Blog`,
    description,
    keywords,
    path: `/blog-details-2/${params.id}`,
    ogImage: blogImage,
    robots: "index, follow"
  });
}

export default function BlogDetailsPageTwo({ params }) {
  const blogItem = blogData.find((b) => Number(b.id) === Number(params.id));
  
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
        {blogItem?.title || "Blog Details - Latest Article"}
      </h1>
      
      <BlogDetailsAreaTwo blog={blogItem} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
