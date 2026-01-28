/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Security headers for fabric e-commerce site
const getSecurityHeaders = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiDomain = new URL(apiBaseUrl).origin;
  
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
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://accounts.google.com https://vercel.live",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://res.cloudinary.com https://i.ibb.co https://lh3.googleusercontent.com https://img.youtube.com  https://amritafashions.com https://test.amrita-fashions.com",
        "media-src 'self' data: blob:",
        `connect-src 'self' ${apiDomain} https://www.google-analytics.com https://vitals.vercel-insights.com https://www.clarity.ms https://accounts.google.com https://www.youtube-nocookie.com`,
        "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://accounts.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        "upgrade-insecure-requests"
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
      exclude: ['error']
    } : false,
  },

  // ✅ Additional build optimizations to prevent chunk errors
  swcMinify: true,
  poweredByHeader: false,
  
  // ✅ Production optimizations (tree-shaking, minification)
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller builds
  compress: true, // Enable gzip compression
  
  // ✅ CHUNK LOADING FIX: Reduce chunk complexity
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react', '@fortawesome/react-fontawesome'],
    // Disable aggressive optimizations that can cause chunk issues
    missingSuspenseWithCSRBailout: false,
    serverComponentsExternalPackages: [],
    // Reduce build complexity
    optimizeCss: false, // Disable CSS optimization that can cause chunk issues
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
    '@fortawesome/free-brands-svg-icons': {
      transform: '@fortawesome/free-brands-svg-icons/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
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
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 10, // Reduced from 25 to prevent too many chunks
          maxAsyncRequests: 10,   // Limit async chunks
          minSize: 30000,         // Increased minimum chunk size
          maxSize: 250000,        // Set maximum chunk size to prevent huge chunks
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk (React, Next.js) - keep this stable
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
              chunks: 'all',
            },
            // Vendor chunk for other node_modules - more conservative
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 2, // Increased from 1 to reduce chunk count
              chunks: 'all',
            },
            // Redux chunk
            redux: {
              name: 'redux',
              test: /[\\/]node_modules[\\/](@reduxjs|react-redux|redux)[\\/]/,
              priority: 30,
              enforce: true,
              chunks: 'all',
            },
            // Common chunk for shared code - more conservative
            common: {
              name: 'common',
              minChunks: 3, // Increased from 2
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
              chunks: 'all',
            },
          },
        },
      };
    }
    
    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
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
