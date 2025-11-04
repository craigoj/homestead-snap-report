import React from 'react';
import { HomeGuardLanding } from '@/components/landing/HomeGuardLanding';
import { EnhancedSEO } from '@/components/EnhancedSEO';

const Index = () => {
  return (
    <>
      <EnhancedSEO
        title="AI-Powered Home Inventory for Insurance Claims"
        description="Never lose money on insurance claims. HomeGuard uses AI to scan, document, and value your belongings. Get instant valuations and insurance-ready reports. 30-day free trial."
        url="/"
        image="/og-image.jpg"
      />
      <HomeGuardLanding />
    </>
  );
};

export default Index;