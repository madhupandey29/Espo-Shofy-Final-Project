import React from 'react';
import Wrapper from '@/layout/wrapper';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import CompactUniversalBreadcrumb from '@/components/breadcrumb/compact-universal-breadcrumb';
import { BreadcrumbJsonLd } from '@/utils/breadcrumbStructuredData';
import CapabilitiesClient from './CapabilitiesClient';
import { getPageSeoMetadata, PAGE_NAMES } from '@/utils/topicPageSeoIntegration';

/* -----------------------------
  Metadata (Dynamic SEO from Topic Page API)
----------------------------- */
export async function generateMetadata() {
  return await getPageSeoMetadata(PAGE_NAMES.CAPABILITIES, {
    title: null,
    description: null,
    keywords: null,
  });
}

const CapabilitiesPage = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Capabilities' }
  ];

  // Breadcrumb structured data
  const breadcrumbStructuredData = [
    { name: 'Home', url: '/' },
    { name: 'Capabilities', url: '/capabilities' }
  ];

  return (
    <Wrapper>
      {/* SEO component removed - using generateMetadata instead */}
      <BreadcrumbJsonLd breadcrumbItems={breadcrumbStructuredData} />
      
      <HeaderTwo style_2={true} />
      <CompactUniversalBreadcrumb items={breadcrumbItems} />
      <CapabilitiesClient />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default CapabilitiesPage;