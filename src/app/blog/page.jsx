import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import SectionTitle from "@/components/blog/blog-grid/section-title";
import BlogGridArea from "@/components/blog/blog-grid/blog-grid-area";
import Footer from "@/layout/footers/footer";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

// Server-side function to fetch first blog for OG image
async function getFirstBlogImage() {
  try {
    const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/,'');
    const BLOG_PATH = process.env.NEXT_PUBLIC_API_BLOG_PATH || '/blog';
    
    const response = await fetch(`${API_BASE}${BLOG_PATH}`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    const data = await response.json();
    const blogs = Array.isArray(data?.data) ? data.data : [];
    
    if (blogs.length > 0) {
      const firstBlog = blogs[0];
      
      // Extract image URL from blog data
      const blogImage1 = firstBlog?.blogimage1;
      const blogImage2 = firstBlog?.blogimage2;
      
      // Handle different image formats
      let imageUrl = null;
      
      if (blogImage1) {
        if (typeof blogImage1 === 'string') {
          imageUrl = blogImage1;
        } else if (typeof blogImage1 === 'object') {
          imageUrl = blogImage1.url || blogImage1.secure_url || blogImage1.src || blogImage1.path;
        }
      }
      
      if (!imageUrl && blogImage2) {
        if (typeof blogImage2 === 'string') {
          imageUrl = blogImage2;
        } else if (typeof blogImage2 === 'object') {
          imageUrl = blogImage2.url || blogImage2.secure_url || blogImage2.src || blogImage2.path;
        }
      }
      
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching first blog image:', error);
    return null;
  }
}

/* -----------------------------
  Metadata (Dynamic SEO)
----------------------------- */
export async function generateMetadata() {
  // Fetch first blog image dynamically
  const firstBlogImage = await getFirstBlogImage();
  
  return generateSEOMetadata({
    title: "Shofy - Blog",
    description: "Explore our latest blog posts about fabrics, textiles, and industry insights. Stay updated with Shofy's textile expertise.",
    keywords: "blog, fabrics, textiles, industry insights, textile expertise, latest updates",
    path: "/blog",
    ogImage: firstBlogImage, // Use dynamic first blog image
    robots: "index, follow"
  });
}

export default function BlogPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <SectionTitle />
      <BlogGridArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}