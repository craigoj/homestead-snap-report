import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateSEOTags, SEOProps } from '@/lib/seo';

interface SEOHeadProps extends SEOProps {
  children?: React.ReactNode;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ children, ...seoProps }) => {
  const seoTags = generateSEOTags(seoProps);
  
  return (
    <Helmet>
      <title>{seoTags.title}</title>
      
      {seoTags.meta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      
      {seoTags.link.map((link, index) => (
        <link key={index} {...link} />
      ))}
      
      {seoTags.structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seoTags.structuredData }} />
      )}
      
      {children}
    </Helmet>
  );
};

// Prebuilt SEO components for common pages
export const HomePageSEO = () => (
  <SEOHead
    title="SnapAssetAI - Smart Home Inventory Management & Insurance Claims"
    description="Protect your assets with AI-powered home inventory management. Scan, document, and value your belongings for faster insurance claims and complete peace of mind."
    keywords={['home inventory', 'insurance claims', 'asset management', 'AI scanning', 'property protection', 'inventory app']}
    canonicalUrl="/"
    ogType="website"
  />
);

export const DashboardSEO = () => (
  <SEOHead
    title="Dashboard - SnapAssetAI Inventory Management"
    description="Access your complete home inventory dashboard with real-time asset tracking, valuation updates, and insurance documentation."
    keywords={['inventory dashboard', 'asset tracking', 'home management']}
    canonicalUrl="/dashboard"
    noIndex={true} // Private page
  />
);

export const PropertiesSEO = () => (
  <SEOHead
    title="Properties - Manage Multiple Locations | SnapAssetAI"
    description="Organize and manage inventory across multiple properties with SnapAssetAI's comprehensive property management system."
    keywords={['property management', 'multiple properties', 'real estate inventory']}
    canonicalUrl="/properties"
    noIndex={true} // Private page
  />
);