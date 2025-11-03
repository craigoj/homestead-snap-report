# SEO Infrastructure Documentation

This directory contains the complete SEO infrastructure for SnapAsset AI's Next.js application.

## Files Overview

### Core Files

1. **`/app/sitemap.ts`** - Dynamic XML sitemap generation
2. **`/app/robots.ts`** - Robots.txt configuration
3. **`lib/seo/metadata.ts`** - Dynamic metadata utilities
4. **`lib/seo/structured-data.ts`** - Schema.org JSON-LD helpers
5. **`lib/seo/index.ts`** - Central export point

## Usage Examples

### Using Metadata Presets

For common pages, use the pre-built metadata presets:

```typescript
// app/how-to/page.tsx
import { metadataPresets } from '@/lib/seo'

export const metadata = metadataPresets.howTo

export default function HowToPage() {
  // Page content
}
```

### Creating Custom Metadata

For pages with custom content:

```typescript
// app/some-page/page.tsx
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Custom Page Title',
  description: 'Custom description for this specific page',
  path: '/some-page',
  keywords: ['custom', 'keywords'],
})

export default function SomePage() {
  // Page content
}
```

### Adding Structured Data

Add JSON-LD structured data to any page:

```typescript
// app/how-to/page.tsx
import { generateHowToSchema } from '@/lib/seo'

export default function HowToPage() {
  const schema = generateHowToSchema({
    name: 'How to Create a Home Inventory',
    description: 'Step-by-step guide to cataloging your belongings',
    steps: [
      {
        name: 'Step 1: Sign Up',
        text: 'Create your free SnapAsset AI account',
      },
      {
        name: 'Step 2: Take Photos',
        text: 'Capture photos of your belongings with our mobile app',
      },
      // ... more steps
    ],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Page content */}
    </>
  )
}
```

### FAQ Pages with Structured Data

```typescript
// app/faq/page.tsx
import { createMetadata, generateFAQSchema } from '@/lib/seo'

const faqs = [
  {
    question: 'How does SnapAsset AI work?',
    answer: 'SnapAsset AI uses computer vision and AI to automatically identify, catalog, and value your belongings...',
  },
  {
    question: 'How accurate are the valuations?',
    answer: 'Our AI-powered valuations use real-time eBay data and are typically within 10-15% of actual market value...',
  },
  // ... more FAQs
]

export const metadata = createMetadata({
  title: 'Frequently Asked Questions',
  description: 'Common questions about SnapAsset AI home inventory management',
  path: '/faq',
})

export default function FAQPage() {
  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* FAQ content */}
    </>
  )
}
```

### Breadcrumbs

```typescript
// app/dashboard/assets/[id]/page.tsx
import { generateBreadcrumbSchema } from '@/lib/seo'

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://snapassetai.com' },
    { name: 'Dashboard', url: 'https://snapassetai.com/dashboard' },
    { name: 'Assets', url: 'https://snapassetai.com/dashboard/assets' },
    { name: 'Asset Details', url: `https://snapassetai.com/dashboard/assets/${params.id}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Asset details */}
    </>
  )
}
```

## Available Metadata Presets

The following presets are available in `metadataPresets`:

- `home` - Homepage metadata
- `auth` - Authentication pages (login, signup)
- `dashboard` - Dashboard and authenticated pages (no-index)
- `howTo` - How-to/guide pages
- `assessment` - Assessment quiz
- `waitlist` - Waitlist signup
- `privacy` - Privacy policy
- `terms` - Terms of service

## Available Schema Generators

### 1. `generateWebsiteSchema(url?)`
Organization and website schema for the brand.

### 2. `generateSoftwareApplicationSchema(url?)`
Software application schema for SnapAsset AI.

### 3. `generateFAQSchema(questions)`
FAQ structured data for search result rich snippets.

### 4. `generateBreadcrumbSchema(items)`
Breadcrumb navigation for hierarchical pages.

### 5. `generateArticleSchema(article)`
Article/blog post structured data.

### 6. `generateHowToSchema(howTo)`
How-to guide with step-by-step instructions.

### 7. `generateLocalBusinessSchema(business)`
Local business schema (for future use).

## Sitemap

The sitemap is automatically generated at `/sitemap.xml` and includes:

- All public routes with appropriate priorities
- Change frequencies for crawler optimization
- Environment-aware URLs (dev vs production)

Routes included:
- `/` (priority: 1.0)
- `/auth` (priority: 0.8)
- `/how-to` (priority: 0.7)
- `/assessment` (priority: 0.6)
- `/waitlist` (priority: 0.7)
- `/privacy-policy` (priority: 0.3)
- `/terms-of-service` (priority: 0.3)
- `/unsubscribe` (priority: 0.1)

## Robots.txt

The robots.txt configuration:

**Allowed routes:**
- All public pages (homepage, auth, how-to, etc.)

**Disallowed routes:**
- `/admin/*` - Admin dashboard
- `/api/*` - API endpoints
- `/dashboard` - User dashboards
- `/add-asset` - Asset creation
- `/jumpstart/*` - Jumpstart flows
- `/property/*` - Property pages
- `/assets/*` - Asset detail pages
- `/reports/*` - Generated reports

## Environment Variables

Set `NEXT_PUBLIC_APP_URL` in your environment:

```bash
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production
NEXT_PUBLIC_APP_URL=https://snapassetai.com
```

If not set, defaults to `https://snapassetai.com`.

## Best Practices

1. **Use metadata presets** when available for consistency
2. **Always add structured data** to content-rich pages
3. **Use breadcrumbs** for deep hierarchical pages
4. **Test with Google's Rich Results Test**: https://search.google.com/test/rich-results
5. **Validate sitemap**: https://www.xml-sitemaps.com/validate-xml-sitemap.html
6. **Check robots.txt**: Use Google Search Console to test

## Testing

### Local Testing

```bash
# Start dev server
npm run dev:next

# Check sitemap
curl http://localhost:3000/sitemap.xml

# Check robots.txt
curl http://localhost:3000/robots.txt
```

### Production Testing

```bash
# After deployment
curl https://snapassetai.com/sitemap.xml
curl https://snapassetai.com/robots.txt
```

### Structured Data Testing

Use Google's Rich Results Test:
https://search.google.com/test/rich-results

Paste your page URL or JSON-LD code to validate.

## Future Enhancements

- [ ] Dynamic sitemap from CMS/database content
- [ ] Video schema for tutorial content
- [ ] Product schema for pricing pages
- [ ] Review/rating schema for testimonials
- [ ] Event schema for webinars/launches
- [ ] Auto-generate OG images via API route
- [ ] Multi-language support (hreflang)

## Related Documentation

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me/)
