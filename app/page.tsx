import type { Metadata } from 'next'
import { HomeGuardLanding } from '@/components/landing/HomeGuardLanding'

export const metadata: Metadata = {
  title: 'AI-Powered Home Inventory for Insurance Claims',
  description:
    'Never lose money on insurance claims. HomeGuard uses AI to scan, document, and value your belongings. Get instant valuations and insurance-ready reports. 30-day free trial.',
  openGraph: {
    title: 'AI-Powered Home Inventory for Insurance Claims',
    description:
      'Never lose money on insurance claims. HomeGuard uses AI to scan, document, and value your belongings. Get instant valuations and insurance-ready reports.',
    url: '/',
    siteName: 'HomeGuard',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HomeGuard - AI-Powered Home Inventory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Home Inventory for Insurance Claims',
    description:
      'Never lose money on insurance claims. HomeGuard uses AI to scan, document, and value your belongings.',
    images: ['/og-image.jpg'],
  },
}

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'HomeGuard',
            applicationCategory: 'HomeApplication',
            description:
              'Never lose money on insurance claims. HomeGuard uses AI to scan, document, and value your belongings. Get instant valuations and insurance-ready reports.',
            url: 'https://snapassetai.com',
            image: 'https://snapassetai.com/og-image.jpg',
            offers: {
              '@type': 'Offer',
              price: '9.00',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1247',
              bestRating: '5',
              worstRating: '1',
            },
            operatingSystem: 'Web Browser, iOS, Android',
            publisher: {
              '@type': 'Organization',
              name: 'HomeGuard',
              logo: {
                '@type': 'ImageObject',
                url: 'https://snapassetai.com/logo.png',
              },
            },
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How does AI home inventory work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'HomeGuard uses advanced AI to scan photos of your belongings, automatically identifying items, brands, models, and estimating their current market value.',
                },
              },
              {
                '@type': 'Question',
                name: 'Will insurance companies accept AI-generated inventory reports?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our reports include all documentation required by major insurance providers including photos, purchase dates, serial numbers, and estimated replacement values.',
                },
              },
              {
                '@type': 'Question',
                name: 'How accurate is the AI valuation?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our AI valuation system provides estimates with 85-95% accuracy by analyzing real-time market data, depreciation rates, and condition assessments.',
                },
              },
            ],
          }),
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://snapassetai.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'AI-Powered Home Inventory for Insurance Claims',
                item: 'https://snapassetai.com',
              },
            ],
          }),
        }}
      />

      <HomeGuardLanding />
    </>
  )
}
