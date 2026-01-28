import React from 'react';
import SEO from '@/components/seo';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import AboutClient from './AboutClient';

const AboutPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="About Us" />
      <HeaderTwo style_2={true} />
      <AboutClient />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default AboutPage;