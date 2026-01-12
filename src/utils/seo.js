/**
 * SEO utilities for consistent canonical URL generation
 */

const stripTrailingSlash = (s = "") => String(s || "").replace(/\/+$/, "");

// Ensure we always use the production URL, with fallback
const SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || 
  "https://espo-shofy-final-project.vercel.app"
);

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('SEO Utils - SITE_URL:', SITE_URL);
  console.log('SEO Utils - NODE_ENV:', process.env.NODE_ENV);
}

/**
 * Generate canonical URL from environment variable and path
 * @param {string} path - The path to append to the site URL (default: "/")
 * @returns {string} - Complete canonical URL
 */
export const getCanonicalUrl = (path = "/") => {
  if (!SITE_URL) {
    console.warn('NEXT_PUBLIC_SITE_URL is not set, using path only:', path);
    return path;
  }
  
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  const canonicalUrl = `${SITE_URL}${cleanPath}`;
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Generated canonical URL:', canonicalUrl);
  }
  
  return canonicalUrl;
};

/**
 * Generate absolute URL for images
 * @param {string} imagePath - The image path (e.g., "/assets/img/logo/logo.svg")
 * @returns {string} - Complete image URL
 */
export const getAbsoluteImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath; // Already absolute
  
  return SITE_URL ? `${SITE_URL}${imagePath}` : imagePath;
};

/**
 * Generate metadata object with canonical URL
 * @param {Object} options - Metadata options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.path - Page path for canonical URL
 * @param {string} options.keywords - SEO keywords
 * @param {string} options.ogImage - OpenGraph image path (will be made absolute)
 * @param {string} options.robots - Robots meta tag value (default: "index, follow")
 * @param {Object} options.openGraph - OpenGraph overrides
 * @param {Object} options.twitter - Twitter card overrides
 * @returns {Object} - Next.js metadata object
 */
export const generateMetadata = ({
  title,
  description,
  path = "/",
  keywords,
  ogImage,
  robots = "index, follow",
  openGraph = {},
  twitter = {}
}) => {
  const canonical = getCanonicalUrl(path);
  const absoluteOgImage = ogImage ? getAbsoluteImageUrl(ogImage) : null;
  
  const ogData = {
    title,
    description,
    url: canonical,
    type: "website",
    ...openGraph
  };

  // Add image if provided
  if (absoluteOgImage) {
    ogData.images = [
      {
        url: absoluteOgImage,
        width: 1200,
        height: 630,
        alt: title
      }
    ];
  }

  const twitterData = {
    card: "summary_large_image",
    title,
    description,
    ...twitter
  };

  // Add image for Twitter if provided
  if (absoluteOgImage) {
    twitterData.images = [absoluteOgImage];
  }
  
  return {
    title,
    description,
    keywords,
    robots,
    alternates: { canonical },
    openGraph: ogData,
    twitter: twitterData
  };
};