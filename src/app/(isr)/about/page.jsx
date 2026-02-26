import React from 'react';
import WrapperISR from '@/layout/wrapper-isr';
import HeaderTwoISR from '@/layout/headers/header-2-isr';
import Footer from '@/layout/footers/footer-isr';
import CompactUniversalBreadcrumb from '@/components/breadcrumb/compact-universal-breadcrumb';
import { BreadcrumbJsonLd } from '@/utils/breadcrumbStructuredData';
import AboutClient from './AboutClient';
import { getPageSeoMetadata, PAGE_NAMES, fetchTopicPageByName } from '@/utils/topicPageSeoIntegration';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import { generateAboutPageStructuredData } from '@/utils/aboutPageStructuredData';

// Revalidate every 60 seconds
export const revalidate = 60;

/* -----------------------------
  Metadata (Dynamic SEO from Topic Page API)
----------------------------- */
export async function generateMetadata() {
  // Fetch SEO data from topic page API
  const topicMetadata = await getPageSeoMetadata(PAGE_NAMES.ABOUT, {
    title: null,
    description: null,
    keywords: null,
  });

  // Extract canonical URL from the metadata object
  const canonicalFromApi = topicMetadata.alternates?.canonical || null;

  // Merge with existing SEO metadata structure
  return generateSEOMetadata({
    title: topicMetadata.title,
    description: topicMetadata.description,
    keywords: topicMetadata.keywords,
    path: "/about",
    canonicalOverride: canonicalFromApi, // Use canonical from API
    ogImage: "/assets/img/logo/logo.svg",
    robots: "index, follow"
  });
}

const AboutPage = async () => {
  // Fetch topic page data for structured data
  const topicPageData = await fetchTopicPageByName(PAGE_NAMES.ABOUT);

  // Fetch authors data
  let authors = [];
  try {
    const authorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/author`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    if (authorsRes.ok) {
      const authorsData = await authorsRes.json();
      authors = Array.isArray(authorsData) ? authorsData : (authorsData?.data || []);
    }
  } catch (error) {
    console.error('Error fetching authors:', error);
  }

  // Fetch office information
  let office = null;
  try {
    const officeRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/officeinformation`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    if (officeRes.ok) {
      const officeData = await officeRes.json();
      office = officeData?.data?.[0] || null;
    }
  } catch (error) {
    console.error('Error fetching office information:', error);
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About' }
  ];

  // Breadcrumb structured data
  const breadcrumbStructuredData = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ];

  // Generate AboutPage JSON-LD
  const aboutPageJsonLd = generateAboutPageStructuredData(topicPageData);

  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      
      {/* AboutPage JSON-LD - Server-side rendered */}
      {aboutPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
        />
      )}
      
      <WrapperISR>
        <HeaderTwoISR style_2={true} />
        <CompactUniversalBreadcrumb items={breadcrumbItems} />
        <AboutClient authors={authors} office={office} />
        <Footer primary_style={true} />
      </WrapperISR>
    </>
  );
};

export default AboutPage;