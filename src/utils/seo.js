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
 * Fetch default SEO settings from API
 */
async function getDefaultSeoSettings() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sitesettings/fieldname/name/eCatalogue`,
      { 
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );
    
    if (!res.ok) return null;
    const json = await res.json();
    
    if (!json?.success || !json.data || json.data.length === 0) return null;
    
    return json.data[0];
  } catch (error) {
    console.error('Error fetching default SEO settings:', error);
    return null;
  }
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
 * Generate metadata object with canonical URL and default SEO settings
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
export const generateMetadata = async ({
  title,
  description,
  path = "/",
  keywords,
  ogImage,
  robots = "index, follow",
  openGraph = {},
  twitter = {}
}) => {
  // Fetch default SEO settings
  const defaultSeoSettings = await getDefaultSeoSettings();
  
  const canonical = getCanonicalUrl(path);
  const absoluteOgImage = ogImage ? getAbsoluteImageUrl(ogImage) : null;
  
  // Site name from default SEO settings or environment
  const siteName = defaultSeoSettings?.name || process.env.NEXT_PUBLIC_SITE_NAME || 'eCatalogue';
  
  const ogData = {
    title,
    description,
    url: canonical,
    type: "website",
    siteName,
    locale: 'en_US',
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

  // Build verification object from default SEO settings - CRITICAL FOR SEO
  const verification = {};
  if (defaultSeoSettings?.googleVerification) {
    verification.google = defaultSeoSettings.googleVerification;
  }
  if (defaultSeoSettings?.bingVerification) {
    verification.other = {
      'msvalidate.01': defaultSeoSettings.bingVerification,
    };
  }

  // Build Twitter handle from default SEO settings
  const twitterHandle = defaultSeoSettings?.twitterHandle;
  if (twitterHandle) {
    twitterData.site = twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`;
  }

  // Use robots policy from default SEO settings if not provided
  const finalRobots = robots || defaultSeoSettings?.robotsPolicy || "index, follow";
  
  const metadata = {
    title,
    description,
    keywords,
    robots: finalRobots,
    alternates: { canonical },
    openGraph: ogData,
    twitter: twitterData,
    
    // Apple Web App configuration from default SEO settings
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: siteName,
    },

    // Format detection settings
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },

    // Additional meta tags from default SEO settings
    other: {
      ...(defaultSeoSettings?.siteStatus && {
        'site-status': defaultSeoSettings.siteStatus,
      }),
      ...(defaultSeoSettings?.siteKey && {
        'site-key': defaultSeoSettings.siteKey,
      }),
      ...(defaultSeoSettings?.name && {
        'site-name': defaultSeoSettings.name,
      }),
      ...(defaultSeoSettings?.websiteFaqId && {
        'website-faq-id': defaultSeoSettings.websiteFaqId,
      }),
      ...(defaultSeoSettings?.websiteFaqName && {
        'website-faq-name': defaultSeoSettings.websiteFaqName,
      }),
      // Add Bing verification directly in other meta tags as fallback
      ...(defaultSeoSettings?.bingVerification && {
        'msvalidate.01': defaultSeoSettings.bingVerification,
      }),
    }
  };

  // Add verification if we have any - CRITICAL FOR SEARCH CONSOLE
  if (Object.keys(verification).length > 0) {
    metadata.verification = verification;
  }

  // Debug log to see what metadata is being generated
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 SEO Utils - Generated Metadata:', {
      title,
      hasVerification: !!metadata.verification,
      googleVerification: defaultSeoSettings?.googleVerification,
      bingVerification: defaultSeoSettings?.bingVerification,
      verificationObject: metadata.verification,
      robots: finalRobots,
      siteName,
      hasOtherMeta: Object.keys(metadata.other || {}).length > 0
    });
  }

  return metadata;
};