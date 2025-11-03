/**
 * Schema.org Structured Data Helpers for SnapAsset AI
 *
 * These functions generate JSON-LD structured data for various schema types,
 * improving SEO and enabling rich snippets in search results.
 *
 * All functions return objects that can be embedded in Next.js pages via:
 * <script type="application/ld+json">{JSON.stringify(schema)}</script>
 */

/**
 * Organization and Website Schema
 *
 * Provides information about SnapAsset AI as an organization and website.
 * This helps search engines understand the brand and structure.
 *
 * @param url - Base URL of the website (defaults to production)
 */
export function generateWebsiteSchema(url: string = 'https://snapassetai.com') {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name: 'SnapAsset AI',
        alternateName: 'HomeGuard',
        url: url,
        logo: {
          '@type': 'ImageObject',
          url: `${url}/logo.png`,
        },
        sameAs: [
          // Add social media profiles here when available
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url: url,
        name: 'SnapAsset AI',
        publisher: {
          '@id': `${url}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
}

/**
 * Software Application Schema
 *
 * Describes SnapAsset AI as a software application for home inventory management.
 * Useful for app-related search results and features.
 *
 * @param url - Base URL of the website (defaults to production)
 */
export function generateSoftwareApplicationSchema(url: string = 'https://snapassetai.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SnapAsset AI',
    alternateName: 'HomeGuard',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    description:
      'AI-powered home inventory management system. Scan, document, and value your belongings with instant valuations and insurance-ready reports.',
    screenshot: `${url}/app-screenshot.jpg`,
    featureList: [
      'AI-powered asset valuation',
      'Barcode and QR code scanning',
      'Photo capture with EXIF data',
      'eBay integration for market pricing',
      'Insurance claim report generation',
      'Property and room organization',
    ],
  }
}

/**
 * FAQ Schema
 *
 * Generates structured data for FAQ pages to enable rich snippets in search results.
 *
 * @param questions - Array of FAQ items with question and answer text
 *
 * @example
 * const faqSchema = generateFAQSchema([
 *   {
 *     question: 'How does SnapAsset AI work?',
 *     answer: 'SnapAsset AI uses computer vision and AI...'
 *   }
 * ])
 */
export function generateFAQSchema(
  questions: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/**
 * Breadcrumb Schema
 *
 * Generates breadcrumb navigation structured data for hierarchical page relationships.
 * Helps search engines understand site structure and enables breadcrumb display in results.
 *
 * @param items - Array of breadcrumb items with name and URL
 *
 * @example
 * const breadcrumbSchema = generateBreadcrumbSchema([
 *   { name: 'Home', url: 'https://snapassetai.com' },
 *   { name: 'Dashboard', url: 'https://snapassetai.com/dashboard' },
 *   { name: 'Assets', url: 'https://snapassetai.com/dashboard/assets' }
 * ])
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Article Schema
 *
 * Generates structured data for blog posts and articles.
 *
 * @param article - Article metadata including title, description, author, dates, and images
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image: article.image,
    url: article.url,
    publisher: {
      '@type': 'Organization',
      name: 'SnapAsset AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://snapassetai.com/logo.png',
      },
    },
  }
}

/**
 * How-To Schema
 *
 * Generates structured data for step-by-step guides and tutorials.
 * Enables rich snippets with step-by-step display in search results.
 *
 * @param howTo - How-to guide metadata including name, description, and steps
 */
export function generateHowToSchema(howTo: {
  name: string
  description: string
  totalTime?: string
  steps: Array<{
    name: string
    text: string
    image?: string
  }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    totalTime: howTo.totalTime,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  }
}

/**
 * Local Business Schema
 *
 * If SnapAsset AI has a physical location in the future, this schema
 * helps with local SEO and Google Business Profile integration.
 *
 * @param business - Business location and contact information
 */
export function generateLocalBusinessSchema(business: {
  name: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  phone?: string
  email?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    telephone: business.phone,
    email: business.email,
    url: business.url,
  }
}
