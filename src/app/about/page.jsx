import React from 'react';
import SEO from '@/components/seo';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import CompactUniversalBreadcrumb from '@/components/breadcrumb/compact-universal-breadcrumb';
import { BreadcrumbJsonLd } from '@/utils/breadcrumbStructuredData';
import AboutClient from './AboutClient';
import { getPageSeoMetadata, PAGE_NAMES } from '@/utils/topicPageSeoIntegration';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';

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

const AboutPage = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About' }
  ];

  // Breadcrumb structured data
  const breadcrumbStructuredData = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ];

  return (
    <Wrapper>
      {/* SEO component removed - using generateMetadata instead */}
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      
      <HeaderTwo style_2={true} />
      <CompactUniversalBreadcrumb items={breadcrumbItems} />
      <AboutClient />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default AboutPage;