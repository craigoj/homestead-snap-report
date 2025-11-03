import { MetadataRoute } from 'next'

/**
 * Robots.txt configuration for SnapAsset AI
 *
 * Controls search engine crawler access to various routes:
 * - Allows all public routes for optimal SEO
 * - Disallows admin, API, and authenticated user areas
 * - References sitemap for efficient crawling
 */
export default function robots(): MetadataRoute.Robots {
  // Use environment variable or fallback to production domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://snapassetai.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/auth',
          '/how-to',
          '/assessment',
          '/waitlist',
          '/privacy-policy',
          '/terms-of-service',
          '/unsubscribe',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard',
          '/dashboard/*',
          '/add-asset',
          '/add-property',
          '/jumpstart',
          '/jumpstart/*',
          '/property/*',
          '/assets/*',
          '/reports/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
