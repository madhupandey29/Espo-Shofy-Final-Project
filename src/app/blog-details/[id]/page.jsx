// app/blog-details/[id]/page.jsx
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";
import BlogDetailsBreadcrumb from "@/components/breadcrumb/blog-details-breadcrumb";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";
import { BlogPostingJsonLd } from "@/utils/blogStructuredData";
import { BreadcrumbJsonLd } from "@/utils/breadcrumbStructuredData";

const stripTrailingSlash = (s = "") => String(s || "").replace(/\/+$/, "");

const API_BASE = stripTrailingSlash(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
);
const BLOG_PATH = process.env.NEXT_PUBLIC_API_BLOG_PATH || "/blog";

async function getBlog(slugOrId) {
  // First try to fetch by ID directly
  try {
    const idRes = await fetch(`${API_BASE}${BLOG_PATH}/${slugOrId}`, {
      cache: "no-store",
    });
    if (idRes.ok) {
      const idJson = await idRes.json();
      if (idJson?.data) return idJson.data;
    }
  } catch (error) {
    // Ignore ID fetch errors, try slug search next
  }

  // If ID fetch fails, try to find by slug from the list
  try {
    const listRes = await fetch(`${API_BASE}${BLOG_PATH}`, {
      cache: "no-store",
    });
    if (listRes.ok) {
      const listJson = await listRes.json();
      if (listJson?.data && Array.isArray(listJson.data)) {
        // Find blog by extracted slug (match the end of the URL)
        const blogBySlug = listJson.data.find((blog) => {
          if (!blog.slug) return false;

          // If slug is a full URL, extract the last part
          if (blog.slug.includes("http")) {
            const urlParts = blog.slug.split("/");
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

// CLEAN AUTHOR FUNCTION - Always fetch from /author API
async function getAuthor() {
  try {
    const response = await fetch(`${API_BASE}/author`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Handle different response formats
    let author = null;

    if (data && data.name) {
      author = data;
    } else if (data.data && data.data.name) {
      author = data.data;
    } else if (Array.isArray(data) && data.length > 0 && data[0].name) {
      author = data[0];
    } else if (
      data.data &&
      Array.isArray(data.data) &&
      data.data.length > 0 &&
      data.data[0].name
    ) {
      author = data.data[0];
    }

    if (author && author.name) {
      return author;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Tags -> keywords ONLY (no fallback words)
 * - If tags exist: "tag1, tag2"
 * - If tags missing/empty: undefined (so no keywords is emitted)
 */
function tagsToKeywords(blog) {
  const tags = Array.isArray(blog?.tags) ? blog.tags : [];
  const clean = tags
    .map((t) => String(t || "").trim())
    .filter(Boolean);

  if (clean.length === 0) return undefined;

  // de-dupe case-insensitively while keeping original casing
  const seen = new Set();
  const unique = [];
  for (const t of clean) {
    const key = t.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(t);
    }
  }

  return unique.join(", ");
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.id);

  const title = blog?.title ? `${blog.title} | Blog` : "Blog Details";
  const description =
    blog?.excerpt ||
    "Read our detailed blog post about fabrics, textiles, and fashion trends.";

  // Extract blog image
  const blogImage = blog?.blogimage1 || blog?.blogimage2 || null;

  // Handle different image formats
  let ogImageUrl = null;
  if (blogImage) {
    if (typeof blogImage === "string") {
      ogImageUrl = blogImage;
    } else if (typeof blogImage === "object") {
      ogImageUrl =
        blogImage.url ||
        blogImage.secure_url ||
        blogImage.src ||
        blogImage.path;
    }
  }

  const keywordsFromTags = tagsToKeywords(blog);

  return generateSEOMetadata({
    title,
    description,
    // ONLY tags, no fallback:
    keywords: keywordsFromTags,
    path: `/blog-details/${params.id}`,
    ogImage: ogImageUrl,
    robots: "index, follow",
  });
}

export default async function BlogDetails({ params }) {
  const blog = await getBlog(params.id);
  const author = await getAuthor();

  // Generate structured data
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.amrita-fashions.com";

  // Blog title for breadcrumb
  const blogTitle = blog?.title || "Article";

  // Breadcrumb structured data for JSON-LD (server-side only)
  const breadcrumbJsonLdData = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: blogTitle, url: `/blog-details/${params.id}` },
  ];

  return (
    <>
      {/* Server-side BlogPosting JSON-LD - Google can see this immediately */}
      <BlogPostingJsonLd blog={blog} author={author} baseUrl={baseUrl} />

      {/* Single breadcrumb JSON-LD - server-side rendered */}
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbJsonLdData} />

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

        <BlogDetailsBreadcrumb blogTitle={blog?.title} />
        <BlogDetailsArea blog={blog} />
        <Footer primary_style />
      </Wrapper>
    </>
  );
}
