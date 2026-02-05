'use client';
import { useEffect, useState } from 'react';
import { useGetOfficeInformationQuery } from '@/redux/features/officeInformationApi';

const StructuredDataScripts = ({ 
  blogStructuredData, 
  breadcrumbStructuredData, 
  productStructuredData, 
  corporationStructuredData,
  homePageStructuredData
}) => {
  const [clientHomePageData, setClientHomePageData] = useState(null);
  
  // Fetch office information on client side as fallback
  const { data: officeRes, isLoading } = useGetOfficeInformationQuery();
  
  // Select the AGE company specifically (same logic as server-side)
  const office = officeRes?.data ? 
    officeRes.data.find(company => company.name === 'AGE') || 
    officeRes.data.find(company => company.legalName === 'Amrita Global Enterprises') ||
    officeRes.data[0] 
    : null;

  // Generate simple client-side structured data if server-side failed
  useEffect(() => {
    const generateClientSideData = async () => {
      if (!homePageStructuredData && office && !isLoading) {
        console.log('🔄 Server-side data not available, generating client-side...');
        console.log('🏢 Client-side office data (AGE company):', {
          id: office.id,
          name: office.name,
          legalName: office.legalName,
          description: office.description,
          languages: office.languages
        });
        
        try {
          // Generate simple home page structured data without API calls
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amrita-fashions.com';
          const cleanSiteUrl = String(siteUrl || '').replace(/\/+$/, '');

          let pageName = office.legalName || office.name || 'Amrita Global Enterprises';
          if (office.description && typeof office.description === 'string') {
            pageName = `${pageName} | ${office.description}`;
          }

          const clientData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${cleanSiteUrl}/#home`,
            "url": `${cleanSiteUrl}/`,
            "name": pageName,
            "isPartOf": { 
              "@id": `${cleanSiteUrl}/#website`
            },
            "about": { 
              "@id": `${cleanSiteUrl}/#org`
            },
            "inLanguage": Array.isArray(office.languages) && office.languages.length > 0 
              ? office.languages 
              : ["en"]
          };

          setClientHomePageData(clientData);
          console.log('✅ Client-side structured data generated:', clientData);
        } catch (error) {
          console.error('❌ Client-side generation failed:', error);
        }
      }
    };

    generateClientSideData();
  }, [homePageStructuredData, office, isLoading]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Use server-side data if available, otherwise use client-side data
    const finalHomePageData = homePageStructuredData || clientHomePageData;

    console.log('🔧 StructuredDataScripts useEffect triggered');
    console.log('📊 Data received:', {
      homePageStructuredData: homePageStructuredData ? 'Available (server-side)' : 'Not available',
      clientHomePageData: clientHomePageData ? 'Available (client-side)' : 'Not available',
      finalHomePageData: finalHomePageData ? 'Available' : 'Not available',
      blogStructuredData: blogStructuredData ? 'Available' : 'Not available',
      productStructuredData: productStructuredData ? 'Available' : 'Not available',
      corporationStructuredData: corporationStructuredData ? 'Available' : 'Not available'
    });

    // Remove any existing structured data scripts
    const existingScripts = document.querySelectorAll('script[data-structured-data="true"]');
    console.log(`🗑️ Removing ${existingScripts.length} existing structured data scripts`);
    existingScripts.forEach(script => script.remove());

    // Add corporation structured data script to head (for all pages)
    if (corporationStructuredData) {
      const corporationScript = document.createElement('script');
      corporationScript.type = 'application/ld+json';
      corporationScript.setAttribute('data-structured-data', 'true');
      corporationScript.setAttribute('data-type', 'corporation');
      corporationScript.textContent = JSON.stringify(corporationStructuredData, null, 2);
      document.head.appendChild(corporationScript);
      console.log('✅ Added corporation structured data to head');
    }

    // Add home page structured data script to head
    if (finalHomePageData) {
      const homePageScript = document.createElement('script');
      homePageScript.type = 'application/ld+json';
      homePageScript.setAttribute('data-structured-data', 'true');
      homePageScript.setAttribute('data-type', 'homepage');
      homePageScript.textContent = JSON.stringify(finalHomePageData, null, 2);
      document.head.appendChild(homePageScript);
      console.log('✅ Added home page structured data to head');
      console.log('📄 Home page JSON-LD:', JSON.stringify(finalHomePageData, null, 2));
    }

    // Add blog structured data script to head
    if (blogStructuredData) {
      const blogScript = document.createElement('script');
      blogScript.type = 'application/ld+json';
      blogScript.setAttribute('data-structured-data', 'true');
      blogScript.setAttribute('data-type', 'blog');
      blogScript.textContent = JSON.stringify(blogStructuredData, null, 2);
      document.head.appendChild(blogScript);
      console.log('✅ Added blog structured data to head');
    }

    // Add breadcrumb structured data script to head
    if (breadcrumbStructuredData) {
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.setAttribute('data-structured-data', 'true');
      breadcrumbScript.setAttribute('data-type', 'breadcrumb');
      breadcrumbScript.textContent = JSON.stringify(breadcrumbStructuredData, null, 2);
      document.head.appendChild(breadcrumbScript);
      console.log('✅ Added breadcrumb structured data to head');
    }

    // Add product structured data script to head
    if (productStructuredData) {
      const productScript = document.createElement('script');
      productScript.type = 'application/ld+json';
      productScript.setAttribute('data-structured-data', 'true');
      productScript.setAttribute('data-type', 'product');
      productScript.textContent = JSON.stringify(productStructuredData, null, 2);
      document.head.appendChild(productScript);
      console.log('✅ Added product structured data to head');
    }

    // Cleanup function
    return () => {
      if (typeof document !== 'undefined') {
        const scriptsToRemove = document.querySelectorAll('script[data-structured-data="true"]');
        console.log(`🧹 Cleanup: Removing ${scriptsToRemove.length} structured data scripts`);
        scriptsToRemove.forEach(script => script.remove());
      }
    };
  }, [blogStructuredData, breadcrumbStructuredData, productStructuredData, corporationStructuredData, homePageStructuredData, clientHomePageData]);

  return null;
};

export default StructuredDataScripts;