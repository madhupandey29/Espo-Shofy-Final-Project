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
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

// Separate viewport export (required for Next.js 14+)
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
};

export default async function RootLayout({ children }) {
  // Server-side data fetching for structured data
  let companyInfo = null;
  let siteSettings = null;

  try {
    // Fetch company information
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const companyFilter = process.env.NEXT_PUBLIC_COMPANY_FILTER;
    
    if (apiBaseUrl && companyFilter) {
      const response = await fetch(`${apiBaseUrl}/companyinformation`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const targetCompany = data.data.find(company => company.name === companyFilter);
          if (targetCompany) {
            companyInfo = targetCompany;
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch company info for structured data:', error);
  }

  // Generate structured data
  let corporationJsonLd = null;
  let websiteJsonLd = null;

  if (companyInfo) {
    try {
      const { generateCorporationStructuredData } = await import('@/utils/corporationStructuredData');
      const { generateWebsiteStructuredData } = await import('@/utils/websiteStructuredData');
      
      corporationJsonLd = generateCorporationStructuredData(companyInfo, siteSettings);
      websiteJsonLd = generateWebsiteStructuredData(companyInfo, siteSettings);
    } catch (error) {
      console.error('Failed to generate structured data:', error);
    }
  }

  const defaultSeoSettings = {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  };

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} data-env={process.env.NODE_ENV === 'production' ? 'production' : 'development'}>
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

        {/* Corporation JSON-LD - Global for all pages */}
        {corporationJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(corporationJsonLd) }}
          />
        )}

        {/* WebSite JSON-LD with SearchAction - Global for all pages */}
        {websiteJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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

        {/* Environment Detection Script - No longer needed since data-env is set on html tag */}

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
