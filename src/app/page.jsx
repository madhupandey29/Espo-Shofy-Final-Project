// app/page.jsx
import HomePageTwoClient from "./HomePageTwoClient";
import { generateMetadata as generateSEOMetadata, getOptimizedLogoUrl } from "@/utils/seo";
import { generateHomePageStructuredDataWithApi } from "@/utils/homePageStructuredData";

import dynamic from 'next/dynamic';

// Dynamically import the structured data component to avoid hydration issues
const StructuredDataScripts = dynamic(
  () => import('@/components/seo/StructuredDataScripts'),
  { ssr: false }
);

export async function generateMetadata() {
  const logoUrl = getOptimizedLogoUrl();
  
  return generateSEOMetadata({
    title: "Premium Quality Fabrics by eCatalogue | Cotton, Mercerized & Designer Textiles",
    description: "Discover premium cotton fabrics, mercerized finishes, and textile excellence at eCatalogue by Amrita Global Enterprises. Nokia & Majestica collections for fashion, home, and industrial use.",
    keywords: "premium fabrics, cotton fabrics, mercerized fabrics, textile manufacturer, Nokia collection, Majestica collection, eCatalogue, Amrita Global Enterprises, GSM fabrics, fashion textiles",
    path: "/",
    ogImage: "/assets/img/logo/logo.svg",
    ogLogo: logoUrl,
    robots: "index, follow"
  });
}

// Server-side function to fetch office information for structured data
async function getOfficeInformation() {
  try {
    console.log('🔍 Fetching office information from API...');
    
    // Use hardcoded values to ensure they work in server context
    const apiBaseUrl = 'https://espobackend.vercel.app/api';
    const companyFilter = 'AGE';
    
    console.log('🌐 API Base URL:', apiBaseUrl);
    console.log('🏢 Company Filter:', companyFilter);
    
    const apiUrl = `${apiBaseUrl}/companyinformation`;
    console.log('🔗 Full API URL:', apiUrl);
    
    const response = await fetch(apiUrl, { 
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`Failed to fetch office information: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('📊 Raw API Response Structure:', {
      success: data.success,
      dataLength: data.data ? data.data.length : 0,
      entity: data.entity,
      hasData: !!data.data
    });
    
    // Apply the same filtering logic as in officeInformationApi.js
    if (!data?.success || !data.data) {
      console.error('❌ API response invalid or no data');
      return null;
    }

    // Find exact match only - NO FALLBACK (same as Redux API)
    const targetCompany = data.data.find(company => company.name === companyFilter);
    
    if (!targetCompany) {
      console.error('❌ Target company not found:', companyFilter);
      console.log('🏢 Available companies:', data.data.map(c => ({ name: c.name, legalName: c.legalName })));
      return null;
    }
    
    console.log('🏢 Selected Office Info:', 'Found');
    console.log('🏢 Final Office Info Details:', {
      name: targetCompany.name,
      legalName: targetCompany.legalName,
      description: targetCompany.description,
      languages: targetCompany.languages,
      primaryEmail: targetCompany.primaryEmail,
      id: targetCompany.id
    });
    
    // Verify the exact values we'll use
    console.log('🔍 Values that will be used in JSON-LD:');
    console.log('  - legalName:', targetCompany.legalName);
    console.log('  - description:', targetCompany.description);
    console.log('  - languages[0]:', targetCompany.languages?.[0]);
    console.log('  - typeof legalName:', typeof targetCompany.legalName);
    console.log('  - typeof description:', typeof targetCompany.description);
    console.log('  - Array.isArray(languages):', Array.isArray(targetCompany.languages));
    
    return targetCompany;
  } catch (error) {
    console.error('❌ Error fetching office information:', error);
    console.error('❌ Error details:', error.message);
    return null;
  }
}

export default async function Page() {
  console.log('🏠 Home Page: Starting server-side rendering...');
  
  // Fetch office information for structured data
  let officeInfo = null;
  
  try {
    officeInfo = await getOfficeInformation();
    console.log('🏢 Server-side fetch result:', officeInfo ? 'Success' : 'Failed');
  } catch (error) {
    console.error('🏢 Server-side fetch error:', error);
  }
  
  // Generate home page structured data
  let homePageStructuredData = null;
  
  try {
    homePageStructuredData = await generateHomePageStructuredDataWithApi(officeInfo, {});
    console.log('📄 Server-side structured data generation:', homePageStructuredData ? 'Success' : 'Failed');
  } catch (error) {
    console.error('📄 Server-side structured data error:', error);
  }
  
  // If server-side failed, pass null and let client-side handle it
  if (!homePageStructuredData) {
    console.log('⚠️ Server-side generation failed, will use client-side fallback');
  }
  
  return (
    <>
      <StructuredDataScripts 
        homePageStructuredData={homePageStructuredData}
      />
      
      <HomePageTwoClient />
    </>
  );
}
