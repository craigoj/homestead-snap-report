'use client'

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export const EnhancedSEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'website'
}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://snapassetai.com';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/og-image.jpg`;
  const siteName = 'HomeGuard';
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": siteName,
          "applicationCategory": "HomeApplication",
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          "offers": {
            "@type": "Offer",
            "price": "9.00",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1247",
            "bestRating": "5",
            "worstRating": "1"
          },
          "operatingSystem": "Web Browser, iOS, Android",
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          }
        })}
      </script>
      
      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How does AI home inventory work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "HomeGuard uses advanced AI to scan photos of your belongings, automatically identifying items, brands, models, and estimating their current market value."
              }
            },
            {
              "@type": "Question",
              "name": "Will insurance companies accept AI-generated inventory reports?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our reports include all documentation required by major insurance providers including photos, purchase dates, serial numbers, and estimated replacement values."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate is the AI valuation?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our AI valuation system provides estimates with 85-95% accuracy by analyzing real-time market data, depreciation rates, and condition assessments."
              }
            }
          ]
        })}
      </script>
      
      {/* BreadcrumbList Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": fullUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": title,
              "item": fullUrl
            }
          ]
        })}
      </script>
    </Helmet>
  );
};
