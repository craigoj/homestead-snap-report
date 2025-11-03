import { Metadata } from 'next'

/**
 * Dynamic Metadata Utilities for SnapAsset AI
 *
 * Helper functions for generating Next.js Metadata objects with consistent
 * branding, Open Graph, and Twitter Card support across all pages.
 */

/**
 * Default metadata values used across the site
 */
const DEFAULT_METADATA = {
  siteName: 'SnapAsset AI',
  brandName: 'HomeGuard',
  description:
    'Never lose money on insurance claims. HomeGuard uses AI to scan, document, and value your belongings. Get instant valuations and insurance-ready reports.',
  keywords: [
    'home inventory',
    'insurance claims',
    'AI valuation',
    'asset management',
    'HomeGuard',
    'property inventory',
    'insurance documentation',
    'eBay valuation',
  ],
  authors: [{ name: 'SnapAsset AI' }],
  creator: 'SnapAsset AI',
  publisher: 'SnapAsset AI',
  locale: 'en_US',
  baseUrl: 'https://snapassetai.com',
}

/**
 * Get the base URL based on environment
 * Falls back to production URL if not set
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_METADATA.baseUrl
}

/**
 * Create metadata object for a page with custom values
 *
 * Merges provided metadata with defaults for consistent SEO across the site.
 * Automatically handles Open Graph and Twitter Card generation.
 *
 * @param options - Custom metadata options to override defaults
 * @param options.title - Page title (will be templated with "| SnapAsset AI")
 * @param options.description - Page description for meta tags and social sharing
 * @param options.path - Relative path from root (e.g., '/how-to')
 * @param options.keywords - Additional keywords beyond defaults
 * @param options.images - Custom Open Graph/Twitter images
 * @param options.noIndex - Whether to prevent search engine indexing
 * @param options.type - Open Graph type (defaults to 'website')
 *
 * @example
 * export const metadata = createMetadata({
 *   title: 'How It Works',
 *   description: 'Learn how SnapAsset AI helps you manage your home inventory',
 *   path: '/how-to',
 * })
 */
export function createMetadata(options: {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
  images?: Array<{
    url: string
    width?: number
    height?: number
    alt?: string
  }>
  noIndex?: boolean
  type?: 'website' | 'article'
}): Metadata {
  const {
    title,
    description = DEFAULT_METADATA.description,
    path = '/',
    keywords = [],
    images,
    noIndex = false,
    type = 'website',
  } = options

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${path}`

  // Combine default and custom keywords
  const allKeywords = [...DEFAULT_METADATA.keywords, ...keywords]

  // Default Open Graph image
  const defaultImages = [
    {
      url: `${baseUrl}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: `${DEFAULT_METADATA.siteName} - ${DEFAULT_METADATA.brandName}`,
    },
  ]

  // Use custom images if provided, otherwise use defaults
  const ogImages = images || defaultImages

  return {
    title: title
      ? {
          absolute: `${title} | ${DEFAULT_METADATA.siteName}`,
        }
      : undefined,
    description,
    keywords: allKeywords,
    authors: DEFAULT_METADATA.authors,
    creator: DEFAULT_METADATA.creator,
    publisher: DEFAULT_METADATA.publisher,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: DEFAULT_METADATA.locale,
      url,
      siteName: DEFAULT_METADATA.brandName,
      title: title || DEFAULT_METADATA.siteName,
      description,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: title || DEFAULT_METADATA.siteName,
      description,
      images: ogImages.map((img) => img.url),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}

/**
 * Create metadata for authenticated/private pages
 * These pages should not be indexed by search engines
 *
 * @param options - Page metadata options
 */
export function createPrivateMetadata(options: {
  title: string
  description?: string
}): Metadata {
  return createMetadata({
    ...options,
    noIndex: true,
  })
}

/**
 * Generate Open Graph image URL with dynamic text
 * Useful for creating custom OG images for different pages
 *
 * @param params - Parameters for the dynamic OG image
 * @param params.title - Title text to display on the image
 * @param params.description - Optional description text
 *
 * @example
 * const ogImageUrl = generateOGImageUrl({
 *   title: 'Welcome to SnapAsset AI',
 *   description: 'Manage your home inventory'
 * })
 */
export function generateOGImageUrl(params: {
  title: string
  description?: string
}): string {
  const baseUrl = getBaseUrl()
  const searchParams = new URLSearchParams({
    title: params.title,
    ...(params.description && { description: params.description }),
  })

  return `${baseUrl}/api/og?${searchParams.toString()}`
}

/**
 * Common metadata presets for different page types
 */
export const metadataPresets = {
  /**
   * Homepage metadata
   */
  home: createMetadata({
    title: DEFAULT_METADATA.brandName,
    description: DEFAULT_METADATA.description,
    path: '/',
  }),

  /**
   * Authentication pages (login, signup)
   */
  auth: createMetadata({
    title: 'Sign In',
    description: 'Sign in to your HomeGuard account to manage your home inventory',
    path: '/auth',
  }),

  /**
   * Dashboard and authenticated pages (no index)
   */
  dashboard: createPrivateMetadata({
    title: 'Dashboard',
    description: 'Manage your home inventory and assets',
  }),

  /**
   * How-to/guide pages
   */
  howTo: createMetadata({
    title: 'How It Works',
    description:
      'Learn how SnapAsset AI helps you create a comprehensive home inventory with AI-powered valuations and insurance-ready reports',
    path: '/how-to',
    keywords: ['how to use', 'tutorial', 'guide'],
  }),

  /**
   * Assessment quiz
   */
  assessment: createMetadata({
    title: 'Home Inventory Assessment',
    description:
      'Take our quick assessment to discover how SnapAsset AI can help protect your belongings and maximize insurance claims',
    path: '/assessment',
  }),

  /**
   * Waitlist signup
   */
  waitlist: createMetadata({
    title: 'Join the Waitlist',
    description: 'Be among the first to experience HomeGuard\'s AI-powered home inventory management',
    path: '/waitlist',
  }),

  /**
   * Legal pages
   */
  privacy: createMetadata({
    title: 'Privacy Policy',
    description: 'SnapAsset AI privacy policy and data protection information',
    path: '/privacy-policy',
  }),

  terms: createMetadata({
    title: 'Terms of Service',
    description: 'SnapAsset AI terms of service and user agreement',
    path: '/terms-of-service',
  }),
}
