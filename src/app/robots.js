export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/shop',
          '/shop-category',
          '/shop-right-sidebar',
          '/shop-hidden-sidebar',
          '/blog',
          '/blog-grid',
          '/contact',
          '/about',
          '/fabric/*',
          '/blog-details/*',
          '/_next/static/*',  // ✅ CRITICAL: Allow Next.js static assets (CSS, JS, chunks)
          '/_next/image',     // ✅ Allow Next.js image optimization
        ],
        disallow: [
          '/api/*',           // Block API routes
          '/admin/*',         // Block admin
          '/checkout',        // Block checkout (user-specific)
          '/cart',            // Block cart (user-specific)
          '/wishlist',        // Block wishlist (user-specific)
          '/login',           // Block login
          '/register',        // Block register
          '/forgot',          // Block forgot password
          '/profile',         // Block profile (user-specific)
          '/compare',         // Block compare (user-specific)
          '/order/*',         // Block orders (user-specific)
          '/email-verify/*',  // Block email verification
          '/forget-password/*', // Block password reset
          '/test-*',          // Block test pages
          '/debug-*',         // Block debug pages
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 