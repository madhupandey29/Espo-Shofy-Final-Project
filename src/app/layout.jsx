import './globals.scss';
import '../styles/carousel-mobile-fix.css';
import '../styles/security-protection.css';
import Providers from '@/components/provider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
import AntiInspection from '@/components/security/AntiInspection';
import AdvancedProtection from '@/components/security/AdvancedProtection';
import Script from 'next/script';

import '/public/assets/css/font-awesome-pro.css';

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
    email: companyInfo.primaryEmail,
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
    <html lang="en">
      <head>
        {/* ============================================ */}
        {/* PERFORMANCE OPTIMIZATIONS                   */}
        {/* ============================================ */}
        
        {/* Preconnect to backend API for faster API calls */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'https://espobackend.vercel.app'} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'https://espobackend.vercel.app'} />
        
        {/* Preconnect to Google services for analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preconnect to image CDNs */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://i.ibb.co" />
        
        {/* DNS prefetch for other external resources */}
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        {/* Preload critical API endpoints for homepage */}
        <link 
          rel="preload" 
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api'}/product/?limit=50&merchTag=${process.env.NEXT_PUBLIC_MERCH_TAG_FILTER || 'ecatalogue'}`}
          as="fetch" 
          crossOrigin="anonymous"
        />
        
        {/* Preload site settings API */}
        <link 
          rel="preload" 
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api'}/sitesettings/fieldname/name/${process.env.NEXT_PUBLIC_SITE_NAME || 'eCatalogue'}`}
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
                  email: companyInfo.primaryEmail,
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

        {/* Security Protection Components */}
        <AntiInspection />
        <AdvancedProtection />

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

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
