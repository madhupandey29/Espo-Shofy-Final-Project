import './globals.scss';
import '../styles/carousel-mobile-fix.css';
import Providers from '@/components/provider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
import Script from 'next/script';

import '/public/assets/css/font-awesome-pro.css';

/* -------------------------------------------------- */
/* API Data Fetchers                                   */
/* -------------------------------------------------- */
async function getSiteSettings() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sitesettings`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) return null;
    const json = await res.json();
    
    if (!json?.success || !json.data) return null;
    
    // Get filter value from environment variable - REQUIRED
    const siteFilter = process.env.NEXT_PUBLIC_SITE_FILTER;
    
    if (!siteFilter) {
      console.error('NEXT_PUBLIC_SITE_FILTER is required but not set');
      return null;
    }
    
    // Find exact match only - NO FALLBACK
    const targetSite = json.data.find(site => site.siteKey === siteFilter);
    
    if (!targetSite) {
      console.error(`No site found with siteKey: ${siteFilter}`);
      return null;
    }
    
    return targetSite;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

async function getCompanyInformation() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/companyinformation`,
      { cache: 'no-store' }
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
/* Metadata Generation (META TAGS)                    */
/* -------------------------------------------------- */
export async function generateMetadata() {
  const siteSettings = await getSiteSettings();
  const companyInfo = await getCompanyInformation();

  // Site name from environment - REQUIRED
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  
  if (!siteName) {
    console.error('NEXT_PUBLIC_SITE_NAME is required but not set');
  }

  // Build metadata object with only available data
  const metadata = {
    // Apple Web App configuration
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: siteName || 'Default Site',
    },

    // Format detection settings
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },

    // OpenGraph configuration
    openGraph: {
      type: 'website',
      siteName: siteName || 'Default Site',
      locale: 'en_US',
    },
  };

  // Add verification tokens ONLY if site settings exist and have values
  if (siteSettings) {
    if (siteSettings.googleVerification || siteSettings.bingVerification) {
      metadata.verification = {};
      
      if (siteSettings.googleVerification) {
        metadata.verification.google = siteSettings.googleVerification;
      }
      
      if (siteSettings.bingVerification) {
        metadata.verification.other = {
          'msvalidate.01': siteSettings.bingVerification,
        };
      }
    }

    // Add Twitter configuration ONLY if available
    if (siteSettings.twitterHandle) {
      metadata.twitter = {
        card: 'summary_large_image',
        site: siteSettings.twitterHandle.startsWith('@') 
          ? siteSettings.twitterHandle 
          : `@${siteSettings.twitterHandle}`,
        title: siteName || 'eCatalogue',
      };
    }

    // Add robots policy ONLY if available
    if (siteSettings.robotsPolicy) {
      metadata.robots = siteSettings.robotsPolicy;
    }
  }

  return metadata;
}

/* -------------------------------------------------- */
/* Root Layout Component                               */
/* -------------------------------------------------- */
export default async function RootLayout({ children }) {
  // Fetch API data with strict filtering - NO FALLBACKS
  const siteSettings = await getSiteSettings();
  const companyInfo = await getCompanyInformation();

  // Site name from environment - REQUIRED
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

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
        {/* Site Status Meta Tag - ONLY if site settings exist */}
        {siteSettings?.siteStatus && (
          <meta name="site-status" content={siteSettings.siteStatus} />
        )}

        {/* Base URL - ONLY if site settings exist */}
        {siteSettings?.baseUrl && (
          <link rel="canonical" href={siteSettings.baseUrl} />
        )}

        {/* Google Analytics - ONLY if site settings exist and have GA ID */}
        {siteSettings?.gaMeasurementId && (
          <GoogleAnalytics gaId={siteSettings.gaMeasurementId} />
        )}
        
        {/* Microsoft Clarity - ONLY if site settings exist and have Clarity ID */}
        {siteSettings?.clarityId && (
          <MicrosoftClarity clarityId={siteSettings.clarityId} />
        )}

        {/* Google Tag Manager - ONLY if site settings exist and have GTM ID */}
        {siteSettings?.gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${siteSettings.gtmId}');
              `,
            }}
          />
        )}

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
        {/* Google Tag Manager (noscript) - ONLY if site settings exist and have GTM ID */}
        {siteSettings?.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${siteSettings.gtmId}`}
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
