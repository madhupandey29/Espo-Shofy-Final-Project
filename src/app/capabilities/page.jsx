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
    title: "Manufacturing Capabilities | Products, Machines & Warehouse",
    description: "Explore our manufacturing capabilities, product range, state-of-the-art machines, warehouse facilities, and quality certifications. Discover what makes us industry leaders.",
    keywords: "manufacturing capabilities, fabric products, textile machines, warehouse, quality control, certifications, production capacity",
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