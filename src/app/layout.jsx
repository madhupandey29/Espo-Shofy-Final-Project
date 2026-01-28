import './globals.scss';
import '../styles/carousel-mobile-fix.css';
import '../styles/security-protection.css';
import Providers from '@/components/provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
// ⚠️ SECURITY COMPONENTS TEMPORARILY DISABLED FOR TESTING
// import AntiInspection from '@/components/security/AntiInspection';
// import AdvancedProtection from '@/components/security/AdvancedProtection';
import Script from 'next/script';
import { Inter, Poppins } from 'next/font/google';

// ⚠️ REMOVED: Font Awesome CSS is 513 KB and render-blocking
// import '/public/assets/css/font-awesome-pro.css';
// We'll load it asynchronously below

// ✅ Optimize Google Fonts with next/font (self-hosted, no render blocking)
// Reduced font weights for better performance (only keep commonly used weights)
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Removed: 300, 500, 800
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Removed: 500, 800
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
});

/* -------------------------------------------------- */
/* API Data Fetcher - Only Default SEO Settings       */
/* -------------------------------------------------- */
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

async function getCompanyInformation() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/companyinformation`,
      { 
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );
    
    if (!res.ok) return null;
    const json = await res.json();
    
    if (!json?.success || !json.data) return null;
    
    // Get filter value from environment variable - REQUIRED
    const companyFilter = process.env.NEXT_PUBLIC_COMPANY_FILTER;
    
    if (!companyFilter) {
      console.error('NEXT_PUBLIC_COMPANY_FILTER is required but not set');
      return null;
    }
    
    // Find exact match only - NO FALLBACK
    const targetCompany = json.data.find(company => company.name === companyFilter);
    
    if (!targetCompany) {
      console.error(`No company found with name: ${companyFilter}`);
      return null;
    }
    
    return targetCompany;
  } catch (error) {
    console.error('Error fetching company information:', error);
    return null;
  }
}

/* -------------------------------------------------- */
/* Root Layout Component - Using Default SEO API      */
/* -------------------------------------------------- */
export default async function RootLayout({ children }) {
  // Fetch only default SEO settings and company info
  const defaultSeoSettings = await getDefaultSeoSettings();
  const companyInfo = await getCompanyInformation();

  // Debug: Log the SEO settings to see if they're being fetched
  if (defaultSeoSettings) {
    console.log('🔍 Layout - Default SEO Settings loaded:', {
      name: defaultSeoSettings.name,
      siteKey: defaultSeoSettings.siteKey,
      siteStatus: defaultSeoSettings.siteStatus,
      description: defaultSeoSettings.description,
      gaMeasurementId: defaultSeoSettings.gaMeasurementId,
      gtmId: defaultSeoSettings.gtmId,
      clarityId: defaultSeoSettings.clarityId,
      googleVerification: defaultSeoSettings.googleVerification,
      bingVerification: defaultSeoSettings.bingVerification,
      twitterHandle: defaultSeoSettings.twitterHandle,
      robotsPolicy: defaultSeoSettings.robotsPolicy,
      baseUrl: defaultSeoSettings.baseUrl,
      websiteFaqId: defaultSeoSettings.websiteFaqId,
      websiteFaqName: defaultSeoSettings.websiteFaqName
    });

    // Log which analytics will be rendered
    console.log('📊 Analytics Status:', {
      willRenderGA: !!defaultSeoSettings.gaMeasurementId,
      willRenderGTM: !!defaultSeoSettings.gtmId,
      willRenderClarity: !!defaultSeoSettings.clarityId,
      gaId: defaultSeoSettings.gaMeasurementId,
      gtmId: defaultSeoSettings.gtmId,
      clarityId: defaultSeoSettings.clarityId
    });
  } else {
    console.log('❌ Layout - No default SEO settings found');
  }

  // Generate Local Business JSON-LD ONLY if company info exists
  const localBusinessJsonLd = companyInfo && {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyInfo.name || companyInfo.legalName,
    legalName: companyInfo.legalName,
    telephone: companyInfo.phone1,
    email: companyInfo.salesEmail || companyInfo.supportEmail || companyInfo.primaryEmail,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    
    // Address from company information
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.addressStreet,
      addressLocality: companyInfo.addressCity,
      addressRegion: companyInfo.addressState,
      postalCode: companyInfo.addressPostalCode,
      addressCountry: companyInfo.addressCountry,
    },

    // Geo coordinates (only if both exist)
    ...(companyInfo.latitude && companyInfo.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: companyInfo.latitude,
        longitude: companyInfo.longitude,
      },
    }),

    // Area served (if available)
    ...(companyInfo.areaServed && companyInfo.areaServed.length > 0 && {
      areaServed: companyInfo.areaServed,
    }),

    // GSTIN (Tax ID for India)
    ...(companyInfo.gstin && {
      taxID: companyInfo.gstin,
    }),

    // Social media profiles (filter out null/empty values)
    sameAs: [
      companyInfo.facebookUrl,
      companyInfo.instagramUrl,
      companyInfo.youtubeUrl,
      companyInfo.linkedinUrl,
      companyInfo.xUrl,
      companyInfo.pinterestUrl,
    ].filter(Boolean),

    // Additional business information
    foundingDate: companyInfo.foundingYear?.toString(),
    ...(companyInfo.recognitions?.length > 0 && {
      award: companyInfo.recognitions,
    }),

    // Logo/Image
    ...(companyInfo.faviconUrl && {
      logo: companyInfo.faviconUrl,
    }),

    // Default OG Image
    ...(companyInfo.defaultOgImage && {
      image: companyInfo.defaultOgImage,
    }),
  };

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* ============================================ */}
        {/* PERFORMANCE OPTIMIZATIONS                   */}
        {/* ============================================ */}
        
        {/* Preconnect to backend API for faster API calls */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')} />
        
        {/* Preconnect to domain for faster chunk loading */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SITE_URL} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SITE_URL} />
        
        {/* ✅ Google Fonts now loaded via next/font (self-hosted, no blocking) */}
        
        {/* Prefetch critical resources for faster navigation */}
        <link rel="prefetch" href="/fabric" />
        <link rel="prefetch" href="/contact" />
        
        {/* Load Font Awesome CSS asynchronously (513 KB - don't block render) */}
        <link 
          rel="preload" 
          as="style"
          href="/assets/css/font-awesome-pro.css"
        />
        <link 
          rel="stylesheet" 
          href="/assets/css/font-awesome-pro.css"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link rel="stylesheet" href="/assets/css/font-awesome-pro.css" />
        </noscript>
        
        {/* Load Animate CSS asynchronously (67 KB - don't block render) */}
        <link 
          rel="preload" 
          as="style"
          href="/assets/css/animate.css"
        />
        <link 
          rel="stylesheet" 
          href="/assets/css/animate.css"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link rel="stylesheet" href="/assets/css/animate.css" />
        </noscript>
        
        {/* Critical inline CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{__html: `
          /* Critical CSS for initial render */
          body { 
            margin: 0; 
            font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
          }
          * { box-sizing: border-box; }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
          img { max-width: 100%; height: auto; }
          
          /* Prevent layout shift */
          .tp-header-area { min-height: 80px; }
          .tp-slider-area { min-height: 400px; }
          
          /* Mobile-specific optimizations */
          @media (max-width: 768px) {
            .tp-slider-area { min-height: 300px; }
            body { font-size: 14px; }
            h1 { font-size: 24px; }
            h2 { font-size: 20px; }
            h3 { font-size: 18px; }
          }
          
          /* Prevent FOUC */
          .tp-product-item { min-height: 350px; }
          .tp-blog-item { min-height: 400px; }
        `}} />
        
        {/* Preconnect to analytics (lazy loaded) */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* Preconnect to image CDNs */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://i.ibb.co" />
        
        {/* DNS prefetch for other external resources */}
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        {/* Preload critical API endpoints for homepage */}
        <link 
          rel="preload" 
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/?limit=50&merchTag=${process.env.NEXT_PUBLIC_MERCH_TAG_FILTER || 'ecatalogue'}`}
          as="fetch" 
          crossOrigin="anonymous"
        />
        
        {/* Preload site settings API */}
        <link 
          rel="preload" 
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/sitesettings/fieldname/name/${process.env.NEXT_PUBLIC_SITE_NAME || 'eCatalogue'}`}
          as="fetch" 
          crossOrigin="anonymous"
        />

        {/* ============================================ */}
        {/* ANALYTICS SCRIPTS FROM DEFAULT SEO API      */}
        {/* ============================================ */}

        {/* Google Analytics from eCatalogue API */}
        {defaultSeoSettings?.gaMeasurementId && (
          <>
            {/* GA Debug Comment */}
            {/* GA ID: {defaultSeoSettings.gaMeasurementId} */}
            <GoogleAnalytics gaId={defaultSeoSettings.gaMeasurementId} />
          </>
        )}
        
        {/* Microsoft Clarity from eCatalogue API */}
        {defaultSeoSettings?.clarityId && (
          <>
            {/* Clarity Debug Comment */}
            {/* Clarity ID: {defaultSeoSettings.clarityId} */}
            <MicrosoftClarity clarityId={defaultSeoSettings.clarityId} />
          </>
        )}

        {/* Google Tag Manager from eCatalogue API */}
        {defaultSeoSettings?.gtmId && (
          <>
            {/* GTM Debug Comment */}
            {/* GTM ID: {defaultSeoSettings.gtmId} */}
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${defaultSeoSettings.gtmId}');
                `,
              }}
            />
          </>
        )}

        {/* ============================================ */}
        {/* JSON-LD STRUCTURED DATA                     */}
        {/* ============================================ */}

        {/* Local Business JSON-LD - ONLY if company info exists */}
        {localBusinessJsonLd && (
          <Script
            id="local-business-jsonld"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(localBusinessJsonLd, null, 2),
            }}
          />
        )}

        {/* Organization JSON-LD - ONLY if company info exists */}
        {companyInfo && (
          <Script
            id="organization-jsonld"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: companyInfo.legalName || companyInfo.name,
                legalName: companyInfo.legalName,
                url: process.env.NEXT_PUBLIC_SITE_URL,
                logo: companyInfo.faviconUrl,
                image: companyInfo.defaultOgImage,
                foundingDate: companyInfo.foundingYear?.toString(),
                ...(companyInfo.gstin && {
                  taxID: companyInfo.gstin,
                }),
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: companyInfo.phone1,
                  contactType: 'customer service',
                  email: companyInfo.salesEmail || companyInfo.supportEmail || companyInfo.primaryEmail,
                },
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: companyInfo.addressStreet,
                  addressLocality: companyInfo.addressCity,
                  addressRegion: companyInfo.addressState,
                  postalCode: companyInfo.addressPostalCode,
                  addressCountry: companyInfo.addressCountry,
                },
                ...(companyInfo.latitude && companyInfo.longitude && {
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: companyInfo.latitude,
                    longitude: companyInfo.longitude,
                  },
                }),
                ...(companyInfo.areaServed && companyInfo.areaServed.length > 0 && {
                  areaServed: companyInfo.areaServed,
                }),
                sameAs: [
                  companyInfo.facebookUrl,
                  companyInfo.instagramUrl,
                  companyInfo.youtubeUrl,
                  companyInfo.linkedinUrl,
                  companyInfo.xUrl,
                  companyInfo.pinterestUrl,
                ].filter(Boolean),
                ...(companyInfo.recognitions?.length > 0 && {
                  award: companyInfo.recognitions,
                }),
              }, null, 2),
            }}
          />
        )}
      </head>

      <body>
        {/* Chunk Load Error Handler Script */}
        <Script
          id="chunk-error-handler"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Chunk Load Error Handler - Inline for immediate availability
              (function() {
                let retryCount = 0;
                const MAX_RETRIES = 2;
                
                function handleChunkError(error) {
                  console.error('ChunkLoadError detected:', error);
                  
                  const isChunkError = error?.name === 'ChunkLoadError' || 
                                      error?.message?.includes('Loading chunk') ||
                                      error?.message?.includes('Loading CSS chunk');
                  
                  if (!isChunkError) return false;
                  
                  retryCount++;
                  
                  if (retryCount <= MAX_RETRIES) {
                    console.log('🔄 Recovering from ChunkLoadError, attempt ' + retryCount);
                    
                    // Clear caches and reload
                    try {
                      if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(function(registrations) {
                          registrations.forEach(function(reg) { reg.unregister(); });
                        });
                      }
                      
                      // Clear localStorage
                      Object.keys(localStorage).forEach(function(key) {
                        if (key.startsWith('__next') || key.startsWith('_next')) {
                          localStorage.removeItem(key);
                        }
                      });
                    } catch (e) {
                      console.warn('Cache clear failed:', e);
                    }
                    
                    setTimeout(function() {
                      window.location.reload();
                    }, 1000);
                    
                    return true;
                  } else {
                    console.log('❌ Max retries exceeded, forcing reload');
                    window.location.reload();
                    return true;
                  }
                }
                
                // Global error handlers
                window.addEventListener('error', function(event) {
                  if (handleChunkError(event.error)) {
                    event.preventDefault();
                  }
                });
                
                window.addEventListener('unhandledrejection', function(event) {
                  if (handleChunkError(event.reason)) {
                    event.preventDefault();
                  }
                });
                
                // Reset retry count on navigation
                window.addEventListener('beforeunload', function() {
                  retryCount = 0;
                });
              })();
            `,
          }}
        />

        {/* Environment Detection Script - Sets data-env attribute for CSS rules */}
        <Script
          id="environment-detection"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Set environment attribute on body for CSS targeting
              (function() {
                const isProduction = '${process.env.NODE_ENV}' === 'production';
                document.documentElement.setAttribute('data-env', isProduction ? 'production' : 'development');
                document.body.setAttribute('data-env', isProduction ? 'production' : 'development');
                
                // Console log for debugging
                console.log('🌍 Environment Detection:', {
                  nodeEnv: '${process.env.NODE_ENV}',
                  isProduction: isProduction,
                  dataEnvSet: isProduction ? 'production' : 'development'
                });
              })();
            `,
          }}
        />

        {/* ⚠️ SECURITY COMPONENTS TEMPORARILY DISABLED FOR TESTING */}
        {/* <AntiInspection /> */}
        {/* <AdvancedProtection /> */}

        {/* Google Tag Manager (noscript) from default SEO settings */}
        {defaultSeoSettings?.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${defaultSeoSettings.gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
