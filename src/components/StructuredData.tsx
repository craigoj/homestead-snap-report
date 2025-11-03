'use client'

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { homeGuardStructuredData } from '@/lib/seo';

interface StructuredDataProps {
  data: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => (
  <Helmet>
    <script type="application/ld+json">{data}</script>
  </Helmet>
);

// Prebuilt structured data components
export const WebApplicationStructuredData = () => (
  <StructuredData data={homeGuardStructuredData.webApplication} />
);

export const OrganizationStructuredData = () => (
  <StructuredData data={homeGuardStructuredData.organization} />
);

export const FAQStructuredData = () => (
  <StructuredData data={homeGuardStructuredData.faq} />
);

// Product structured data for individual assets
export const ProductStructuredData: React.FC<{
  name: string;
  description: string;
  image: string;
  brand?: string;
  model?: string;
  price?: number;
  condition?: string;
}> = ({ name, description, image, brand, model, price, condition }) => {
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    model,
    offers: price ? {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'USD',
      itemCondition: `https://schema.org/${condition || 'Used'}Condition`
    } : undefined
  };

  return <StructuredData data={JSON.stringify(productData)} />;
};

// Review structured data for testimonials
export const ReviewStructuredData: React.FC<{
  itemName: string;
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}> = ({ itemName, author, rating, reviewBody, datePublished }) => {
  const reviewData = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: itemName
    },
    author: {
      '@type': 'Person',
      name: author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: 5
    },
    reviewBody,
    datePublished
  };

  return <StructuredData data={JSON.stringify(reviewData)} />;
};

// HowTo structured data for guides
export const HowToStructuredData: React.FC<{
  name: string;
  description: string;
  totalTime?: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
}> = ({ name, description, totalTime, steps }) => {
  const howToData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
      url: step.url
    }))
  };

  return <StructuredData data={JSON.stringify(howToData)} />;
};