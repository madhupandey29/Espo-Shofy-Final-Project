import './globals.scss';
import '../styles/carousel-mobile-fix.css';
import '../styles/security-protection.css';
import '../styles/safe-responsive-fixes.css';
import Providers from '@/components/provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
import Script from 'next/script';
import { Inter, Poppins } from 'next/font/google';
import dynamic from 'next/dynamic';

// Dynamic imports for non-critical components
const LazyFloatingButtons = dynamic(() => import('@/components/common/FloatingButtons'), {
  ssr: false,
  loading: () => null
});

const LazyFloatingChatbot = dynamic(() => import('@/components/chatbot/FloatingChatbot'), {
  ssr: false,
  loading: () => null
});

// Optimize Google Fonts with next/font (self-hosted, no render blocking)
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

// Default metadata for the application
export const metadata = {
  title: 'Shofy - Next.js E-commerce',
  description: 'Modern e-commerce platform built with Next.js',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export default async function RootLayout({ children }) {
  // You can add any server-side data fetching here if needed
  const defaultSeoSettings = {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || null,
  };

  const companyInfo = null; // Add your company info logic here
  const localBusinessJsonLd = null; // Add your JSON-LD logic here

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        {/* Microsoft Clarity */}
        <MicrosoftClarity />

        {/* Google Tag Manager */}
        {defaultSeoSettings?.gtmId && (
          <>
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
        {/* Simplified Chunk Load Error Handler Script */}
        <Script
          id="chunk-error-handler"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Simplified Chunk Load Error Handler
              (function() {
                let retryCount = 0;
                const MAX_RETRIES = 1;
                
                function handleChunkError(error) {
                  // Only handle actual chunk loading errors, not CSS/JS confusion
                  const isChunkError = error?.name === 'ChunkLoadError' || 
                                      (error?.message?.includes('Loading chunk') && 
                                       !error?.message?.includes('.css'));
                  
                  if (!isChunkError || retryCount >= MAX_RETRIES) return false;
                  
                  retryCount++;
                  console.warn('Chunk load error detected, reloading page...');
                  
                  setTimeout(function() {
                    window.location.reload();
                  }, 500);
                  
                  return true;
                }
                
                // Only handle unhandled promise rejections for chunk errors
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
              // Set environment attribute on html only to avoid hydration mismatch
              (function() {
                const isProduction = '${process.env.NODE_ENV}' === 'production';
                document.documentElement.setAttribute('data-env', isProduction ? 'production' : 'development');
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
          <Providers>
            {children}
            {/* Move chatbot inside Providers so it has access to Redux */}
            <LazyFloatingChatbot />
          </Providers>
        </ErrorBoundary>

        {/* Non-critical components loaded after main content */}
        <LazyFloatingButtons />
      </body>
    </html>
  );
}
