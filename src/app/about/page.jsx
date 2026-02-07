import React from 'react';
import SEO from '@/components/seo';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import CompactUniversalBreadcrumb from '@/components/breadcrumb/compact-universal-breadcrumb';
import { BreadcrumbJsonLd } from '@/utils/breadcrumbStructuredData';
import AboutClient from './AboutClient';
import { getPageSeoMetadata, PAGE_NAMES } from '@/utils/topicPageSeoIntegration';

/* -----------------------------
  Metadata (Dynamic SEO from Topic Page API)
----------------------------- */
export async function generateMetadata() {
  return await getPageSeoMetadata(PAGE_NAMES.ABOUT, {
    title: null,
    description: null,
    keywords: null,
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