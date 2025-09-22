import React from 'react';
import { HomeGuardLanding } from '@/components/landing/HomeGuardLanding';
import { HomePageSEO } from '@/components/SEOHead';
import { WebApplicationStructuredData, OrganizationStructuredData, FAQStructuredData } from '@/components/StructuredData';

const Index = () => {
  return (
    <>
      <HomePageSEO />
      <WebApplicationStructuredData />
      <OrganizationStructuredData />
      <FAQStructuredData />
      <HomeGuardLanding />
    </>
  );
};

export default Index;