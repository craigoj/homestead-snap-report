/**
 * SEO Utilities - Central export for all SEO-related helpers
 *
 * This module provides a convenient single import point for all SEO
 * functionality including metadata generation, structured data, and more.
 */

// Metadata utilities for Next.js pages
export {
  createMetadata,
  createPrivateMetadata,
  generateOGImageUrl,
  getBaseUrl,
  metadataPresets,
} from './metadata'

// Schema.org structured data helpers
export {
  generateWebsiteSchema,
  generateSoftwareApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateHowToSchema,
  generateLocalBusinessSchema,
} from './structured-data'
