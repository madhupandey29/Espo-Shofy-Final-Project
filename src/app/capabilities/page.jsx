import React from 'react';
import Wrapper from '@/layout/wrapper';
import SEO from '@/components/seo';
import CapabilitiesClient from './CapabilitiesClient';

const CapabilitiesPage = () => {
  return (
    <Wrapper>
      <SEO 
        pageTitle="Manufacturing Capabilities | Products, Machines & Warehouse"
        description="Explore our manufacturing capabilities, product range, state-of-the-art machines, warehouse facilities, and quality certifications. Discover what makes us industry leaders."
        keywords="manufacturing capabilities, fabric products, textile machines, warehouse, quality control, certifications, production capacity"
      />
      <CapabilitiesClient />
    </Wrapper>
  );
};

export default CapabilitiesPage;