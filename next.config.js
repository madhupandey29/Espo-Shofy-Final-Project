/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Security headers for fabric e-commerce site
const getSecurityHeaders = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiDomain = new URL(apiBaseUrl).origin;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteDomain = siteUrl ? new URL(siteUrl).origin : '';
  
  return [
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN',
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    },
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'on',
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains; preload',
    },
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://accounts.google.com https://vercel.live https://*.vercel.app https://vercel.com https://maps.googleapis.com https://maps.gstatic.com" + (siteDomain ? ` ${siteDomain}` : ''),
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com https://maps.gstatic.com data:",
        "img-src 'self' data: blob: https://res.cloudinary.com https://i.ibb.co https://lh3.googleusercontent.com https://img.youtube.com https://amritafashions.com https://test.amrita-fashions.com https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com",
        "media-src 'self' data: blob:",
        `connect-src 'self' ${apiDomain} https://www.google-analytics.com https://vitals.vercel-insights.com https://www.clarity.ms https://scripts.clarity.ms https://accounts.google.com https://www.youtube-nocookie.com https://maps.googleapis.com https://espo.egport.com` + (siteDomain ? ` ${siteDomain}` : ''),
        "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://accounts.google.com https://www.google.com https://maps.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://espo.egport.com",
        "frame-ancestors 'self'",
        "upgrade-insecure-requests",
        "report-uri /api/csp-report"
      ].join('; '),
    },
  ];
};

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/**' },
      { protocol: 'https', hostname: 'test.amrita-fashions.com', pathname: '/**' },
      { protocol: 'https', hostname: 'amritafashions.com', pathname: '/**' },
      { protocol: 'http',  hostname: 'localhost', port: '3000', pathname: '/**' },
      { protocol: 'http',  hostname: 'localhost', port: '7000', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // ✅ PERFORMANCE OPTIMIZATION: Image quality is set per-component (quality={75})
  },

  // ✅ Security headers for all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: getSecurityHeaders(),
      },
      // Fix MIME type issues for static assets
      {
        source: '/assets/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/js/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'font/ttf',
          },
        ],
      },
    ];
  },

  // ✅ allow production builds to succeed even if ESLint errors exist
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ allow production builds to succeed even if type errors exist
  // (has effect only if you have a tsconfig or .ts/.tsx files present)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ ignore React build errors (including Client Component prop errors)
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverComponentsExternalPackages: [],
  },

  // ✅ suppress React warnings during build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // ✅ Additional build optimizations to prevent chunk errors
  swcMinify: true,
  poweredByHeader: false,
  
  // ✅ Production optimizations (tree-shaking, minification)
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller builds
  compress: true, // Enable gzip compression
  
  // ✅ Performance optimizations
  experimental: {
    optimizePackageImports: [
      'react-icons/fa',
      'react-icons/fi', 
      'react-icons/fa6',
      'react-icons/ai',
      'react-icons/bs',
      'react-icons/cg',
      'react-icons/tb',
      'framer-motion',
      'react-toastify'
    ],
    // Disable aggressive optimizations that can cause chunk issues
    missingSuspenseWithCSRBailout: false,
    serverComponentsExternalPackages: [],
    // Enable CSS optimization (supported in Next.js 14)
    optimizeCss: true,
  },
  
  // ✅ Ignore build errors in production
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // ✅ Optimize CSS and fonts
  optimizeFonts: true,
  
  // ✅ Modularize imports for tree-shaking
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
    'react-icons/fa': {
      transform: 'react-icons/fa/{{member}}',
    },
    'react-icons/fi': {
      transform: 'react-icons/fi/{{member}}',
    },
    'react-icons/fa6': {
      transform: 'react-icons/fa6/{{member}}',
    },
    'react-icons/ai': {
      transform: 'react-icons/ai/{{member}}',
    },
    'react-icons/bs': {
      transform: 'react-icons/bs/{{member}}',
    },
    'react-icons/cg': {
      transform: 'react-icons/cg/{{member}}',
    },
    'react-icons/tb': {
      transform: 'react-icons/tb/{{member}}',
    },
  },

  // ✅ webpack configuration to ignore specific errors and handle chunk loading
  webpack: (config, { dev, isServer }) => {
    // Ignore specific React warnings during build
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-runtime': 'react/jsx-runtime',
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime',
      };
      
      // Suppress specific warnings
      config.ignoreWarnings = [
        /Event handlers cannot be passed to Client Component props/,
        /Functions cannot be passed directly to Client Components/,
        /Attempted import error/,
        { module: /node_modules/ },
      ];
      
      // ✅ CHUNK LOADING FIX: More conservative code splitting to prevent ChunkLoadError
      config.optimization = {
        ...config.optimization,
        usedExports: true, // Tree-shaking: remove unused exports
        minimize: true, // Minification enabled
        sideEffects: false, // Enable more aggressive tree shaking
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 5, // Further reduced
          maxAsyncRequests: 5,   
          minSize: 60000,        // Increased minimum chunk size
          maxSize: 120000,       // Smaller maximum chunk size for better distribution
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk (React, Next.js) - keep this stable
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 50,
              enforce: true,
              chunks: 'all',
              maxSize: 100000, // Limit framework chunk size
            },
            // PDF libraries - separate chunk for better caching
            pdf: {
              name: 'pdf-libs',
              test: /[\\/]node_modules[\\/](jspdf|html2canvas|@react-pdf|pdfkit)[\\/]/,
              priority: 45,
              enforce: true,
              chunks: 'all',
            },
            // Large libraries that should be separate
            swiper: {
              name: 'swiper',
              test: /[\\/]node_modules[\\/](swiper)[\\/]/,
              priority: 40,
              enforce: true,
              chunks: 'all',
            },
            // Redux chunk
            redux: {
              name: 'redux',
              test: /[\\/]node_modules[\\/](@reduxjs|react-redux|redux)[\\/]/,
              priority: 35,
              enforce: true,
              chunks: 'all',
            },
            // Form libraries
            forms: {
              name: 'forms',
              test: /[\\/]node_modules[\\/](react-hook-form|yup|@hookform)[\\/]/,
              priority: 30,
              enforce: true,
              chunks: 'all',
            },
            // UI libraries chunk - split further
            icons: {
              name: 'icons',
              test: /[\\/]node_modules[\\/](react-icons)[\\/]/,
              priority: 28,
              enforce: true,
              chunks: 'all',
            },
            // Animation libraries
            animations: {
              name: 'animations',
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              priority: 26,
              enforce: true,
              chunks: 'all',
            },
            // Vendor chunk for remaining node_modules - much smaller now
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 2,
              chunks: 'all',
              maxSize: 80000, // Limit vendor chunk size
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 3,
              priority: 10,
              reuseExistingChunk: true,
              chunks: 'all',
              maxSize: 60000,
            },
          },
        },
      };
    }
    
    // Add fallbacks for Node.js modules - more restrictive
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    
    return config;
  },

  async redirects() {
    return [
      // Add any necessary redirects here
      // Example: { source: '/old-path', destination: '/new-path', permanent: true },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
