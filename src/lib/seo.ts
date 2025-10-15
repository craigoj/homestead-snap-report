import { Helmet } from 'react-helmet-async';
import React from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  structuredData?: string;
}

export const generateSEOTags = ({
  title = 'SnapAssetAI - Smart Home Inventory Management',
  description = 'Manage your home inventory with AI-powered scanning, automated valuations, and insurance claim assistance. Protect your assets with comprehensive documentation.',
  keywords = ['home inventory', 'insurance claims', 'asset management', 'property protection', 'AI scanning'],
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData
}: SEOProps = {}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://snapassetai.com';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: 'SnapAssetAI' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#3b82f6' },
      
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: fullCanonicalUrl },
      { property: 'og:image', content: fullOgImage },
      { property: 'og:image:alt', content: title },
      { property: 'og:site_name', content: 'SnapAssetAI' },
      
      // Twitter
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: fullOgImage },
      
      // Additional SEO
      { name: 'robots', content: noIndex ? 'noindex,nofollow' : 'index,follow' },
      { name: 'googlebot', content: 'index,follow' },
      { name: 'bingbot', content: 'index,follow' }
    ],
    link: [
      { rel: 'canonical', href: fullCanonicalUrl },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const }
    ],
    structuredData
  };
};

export const createStructuredData = (type: 'WebApplication' | 'Organization' | 'Product' | 'Article' | 'FAQPage', data: Record<string, any>) => {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  return JSON.stringify(baseStructure);
};

// Predefined structured data for SnapAssetAI
export const homeGuardStructuredData = {
  webApplication: createStructuredData('WebApplication', {
    name: 'SnapAssetAI',
    description: 'Smart home inventory management with AI-powered scanning and automated valuations',
    url: 'https://snapassetai.com',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free trial available'
    },
    author: {
      '@type': 'Organization',
      name: 'SnapAssetAI',
      url: 'https://snapassetai.com'
    },
    screenshot: 'https://snapassetai.com/og-image.jpg'
  }),
  
  organization: createStructuredData('Organization', {
    name: 'SnapAssetAI',
    url: 'https://snapassetai.com',
    logo: 'https://snapassetai.com/logo.png',
    description: 'Leading provider of smart home inventory management solutions',
    sameAs: [
      'https://twitter.com/snapassetai',
      'https://linkedin.com/company/snapassetai'
    ]
  }),

  faq: createStructuredData('FAQPage', {
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does SnapAssetAI help with insurance claims?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SnapAssetAI provides comprehensive documentation of your assets with photos, receipts, and valuations, making insurance claims faster and more accurate.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is my data secure with SnapAssetAI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we use enterprise-grade security with encrypted data storage and secure authentication to protect your personal information.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I access SnapAssetAI on mobile devices?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SnapAssetAI is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers.'
        }
      }
    ]
  })
};