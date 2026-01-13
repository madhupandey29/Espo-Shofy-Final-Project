import './globals.scss';
import '../styles/carousel-mobile-fix.css';
import Providers from '@/components/provider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
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
/* Metadata Generation - Using Default SEO API        */
/* -------------------------------------------------- */
export async function generateMetadata() {
  const defaultSeoSettings = await getDefaultSeoSettings();

  // Site name from environment
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'eCatalogue';

  // Build metadata object using default SEO settings
  const metadata = {
    // Apple Web App configuration
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: defaultSeoSettings?.name || siteName,
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
      siteName: defaultSeoSettings?.name || siteName,
      locale: 'en_US',
    },
  };

  // Add verification tokens from default SEO settings
  if (defaultSeoSettings?.googleVerification || defaultSeoSettings?.bingVerification) {
    metadata.verification = {};
    
    if (defaultSeoSettings.googleVerification) {
      metadata.verification.google = defaultSeoSettings.googleVerification;
    }
    
    if (defaultSeoSettings.bingVerification) {
      metadata.verification.other = {
        'msvalidate.01': defaultSeoSettings.bingVerification,
      };
    }
  }

  // Add Twitter configuration from default SEO settings
  if (defaultSeoSettings?.twitterHandle) {
    metadata.twitter = {
      card: 'summary_large_image',
      site: defaultSeoSettings.twitterHandle.startsWith('@') 
        ? defaultSeoSettings.twitterHandle 
        : `@${defaultSeoSettings.twitterHandle}`,
      title: defaultSeoSettings?.name || siteName,
    };
  }

  // Add robots policy from default SEO settings
  if (defaultSeoSettings?.robotsPolicy) {
    metadata.robots = defaultSeoSettings.robotsPolicy;
  }

  return metadata;
}

/* -------------------------------------------------- */
/* Root Layout Component - Using Default SEO API      */
/* -------------------------------------------------- */
export default async function RootLayout({ children }) {
  // Fetch only default SEO settings and company info
  const defaultSeoSettings = await getDefaultSeoSettings();
  const companyInfo = await getCompanyInformation();

  console.log('🔍 Default SEO Settings:', defaultSeoSettings);

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
        {/* All SEO Meta Tags from Default SEO API */}
        {defaultSeoSettings?.siteStatus && (
          <meta name="site-status" content={defaultSeoSettings.siteStatus} />
        )}

        {defaultSeoSettings?.siteKey && (
          <meta name="site-key" content={defaultSeoSettings.siteKey} />
        )}

        {defaultSeoSettings?.name && (
          <meta name="site-name" content={defaultSeoSettings.name} />
        )}

        {defaultSeoSettings?.description && (
          <meta name="description" content={defaultSeoSettings.description} />
        )}

        {defaultSeoSettings?.websiteFaqId && (
          <meta name="website-faq-id" content={defaultSeoSettings.websiteFaqId} />
        )}

        {defaultSeoSettings?.websiteFaqName && (
          <meta name="website-faq-name" content={defaultSeoSettings.websiteFaqName} />
        )}

        {/* Base URL from default SEO settings */}
        {defaultSeoSettings?.baseUrl && (
          <link rel="canonical" href={defaultSeoSettings.baseUrl} />
        )}

        {/* Google Analytics from default SEO settings */}
        {defaultSeoSettings?.gaMeasurementId && (
          <GoogleAnalytics gaId={defaultSeoSettings.gaMeasurementId} />
        )}
        
        {/* Microsoft Clarity from default SEO settings */}
        {defaultSeoSettings?.clarityId && (
          <MicrosoftClarity clarityId={defaultSeoSettings.clarityId} />
        )}

        {/* Google Tag Manager from default SEO settings */}
        {defaultSeoSettings?.gtmId && (
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
