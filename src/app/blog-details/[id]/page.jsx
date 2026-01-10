// app/blog-details/[id]/page.jsx
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";

const stripTrailingSlash = (s = "") => String(s || "").replace(/\/+$/, "");

const API_BASE = stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000");
const BLOG_PATH = process.env.NEXT_PUBLIC_API_BLOG_PATH || "/blog";

const SITE_URL = stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || "");

const pageUrl = (path = "/") => {
  if (!SITE_URL) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const toAbsUrl = (u = "") => {
  const s = String(u || "").trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  return pageUrl(s);
};

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
        // Find blog by slug
        const blogBySlug = listJson.data.find(blog => blog.slug === slugOrId);
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

  const canonical = pageUrl(`/blog-details/${params.id}`);
  const title = blog?.title ? `${blog.title} | Blog` : "Blog Details";
  const description = blog?.paragraph1 || blog?.excerpt || "";

  const ogImg = toAbsUrl(blog?.blogimage1 || blog?.blogimage2 || "");

  return {
    title,
    description,
    alternates: { canonical },

    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: ogImg ? [{ url: ogImg, alt: blog?.title || "Blog image" }] : undefined,
    },

    twitter: {
      card: ogImg ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
    },
  };
}

export default async function BlogDetails({ params }) {
  const blog = await getBlog(params.id);

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <BlogDetailsArea blog={blog} />
      <Footer primary_style />
    </Wrapper>
  );
}
