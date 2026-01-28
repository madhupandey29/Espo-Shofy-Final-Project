// app/blog-details/[id]/page.jsx
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

const stripTrailingSlash = (s = "") => String(s || "").replace(/\/+$/, "");

const API_BASE = stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000");
const BLOG_PATH = process.env.NEXT_PUBLIC_API_BLOG_PATH || "/blog";

async function getBlog(slugOrId) {
  // First try to fetch by ID directly
  try {
    const idRes = await fetch(`${API_BASE}${BLOG_PATH}/${slugOrId}`, { cache: "no-store" });
    if (idRes.ok) {
      const idJson = await idRes.json();
      if (idJson?.data) return idJson.data;
    }
  } catch (error) {
    // Ignore ID fetch errors, try slug search next
  }

  // If ID fetch fails, try to find by slug from the list
  try {
    const listRes = await fetch(`${API_BASE}${BLOG_PATH}`, { cache: "no-store" });
    if (listRes.ok) {
      const listJson = await listRes.json();
      if (listJson?.data && Array.isArray(listJson.data)) {
        // Find blog by extracted slug (match the end of the URL)
        const blogBySlug = listJson.data.find(blog => {
          if (!blog.slug) return false;
          
          // If slug is a full URL, extract the last part
          if (blog.slug.includes('http')) {
            const urlParts = blog.slug.split('/');
            const extractedSlug = urlParts[urlParts.length - 1];
            return extractedSlug === slugOrId;
          }
          
          // Direct slug match
          return blog.slug === slugOrId;
        });
        
        if (blogBySlug) return blogBySlug;
      }
    }
  } catch (error) {
    // Ignore list fetch errors
  }

  return null;
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.id);

  const title = blog?.title ? `${blog.title} | Blog` : "Blog Details";
  const description = blog?.paragraph1 || blog?.excerpt || "Read our detailed blog post about fabrics, textiles, and fashion trends.";

  // Extract blog image
  const blogImage = blog?.blogimage1 || blog?.blogimage2 || null;
  
  // Handle different image formats
  let ogImageUrl = null;
  if (blogImage) {
    if (typeof blogImage === 'string') {
      ogImageUrl = blogImage;
    } else if (typeof blogImage === 'object') {
      ogImageUrl = blogImage.url || blogImage.secure_url || blogImage.src || blogImage.path;
    }
  }

  return generateSEOMetadata({
    title,
    description,
    keywords: "blog, fabrics, textiles, fashion, article, insights",
    path: `/blog-details/${params.id}`,
    ogImage: ogImageUrl,
    robots: "index, follow"
  });
}

export default async function BlogDetails({ params }) {
  const blog = await getBlog(params.id);

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      
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
        {blog?.title || "Blog Details - Latest Article"}
      </h1>
      
      <BlogDetailsArea blog={blog} />
      <Footer primary_style />
    </Wrapper>
  );
}
