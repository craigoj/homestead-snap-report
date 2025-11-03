# SEO Infrastructure - Usage Examples

## Quick Start

### Example 1: Simple Page with Metadata Preset

```typescript
// app/how-to/page.tsx
import { metadataPresets } from '@/lib/seo'

// Use pre-built metadata for common pages
export const metadata = metadataPresets.howTo

export default function HowToPage() {
  return (
    <div>
      <h1>How It Works</h1>
      <p>Learn how SnapAsset AI helps you manage your home inventory...</p>
    </div>
  )
}
```

### Example 2: Custom Metadata for New Page

```typescript
// app/features/page.tsx
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Features',
  description: 'Discover all the powerful features of SnapAsset AI for home inventory management',
  path: '/features',
  keywords: ['features', 'capabilities', 'ai valuation', 'barcode scanning'],
})

export default function FeaturesPage() {
  return (
    <div>
      <h1>Features</h1>
      {/* Feature content */}
    </div>
  )
}
```

### Example 3: Private Page (No Search Indexing)

```typescript
// app/dashboard/settings/page.tsx
import { createPrivateMetadata } from '@/lib/seo'

// Pages that require authentication should not be indexed
export const metadata = createPrivateMetadata({
  title: 'Settings',
  description: 'Manage your account settings',
})

export default function SettingsPage() {
  return (
    <div>
      <h1>Account Settings</h1>
      {/* Settings form */}
    </div>
  )
}
```

### Example 4: FAQ Page with Structured Data

```typescript
// app/faq/page.tsx
import { createMetadata, generateFAQSchema } from '@/lib/seo'

const faqs = [
  {
    question: 'How does SnapAsset AI work?',
    answer: 'SnapAsset AI uses computer vision and artificial intelligence to automatically identify, catalog, and value your belongings. Simply take photos with your phone, and our AI does the rest.',
  },
  {
    question: 'How accurate are the valuations?',
    answer: 'Our AI-powered valuations use real-time eBay data and are typically within 10-15% of actual market value. For high-value items, we recommend getting a professional appraisal.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use bank-level encryption and never share your data with third parties. All photos and asset information are stored securely in encrypted cloud storage.',
  },
]

export const metadata = createMetadata({
  title: 'Frequently Asked Questions',
  description: 'Get answers to common questions about SnapAsset AI home inventory management',
  path: '/faq',
  keywords: ['faq', 'help', 'questions'],
})

export default function FAQPage() {
  // Generate FAQ structured data for rich snippets
  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div>
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <div key={index}>
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </>
  )
}
```

### Example 5: How-To Guide with Step-by-Step Schema

```typescript
// app/guides/getting-started/page.tsx
import { createMetadata, generateHowToSchema } from '@/lib/seo'

const steps = [
  {
    name: 'Create Your Account',
    text: 'Sign up for a free SnapAsset AI account using your email address.',
    image: 'https://snapassetai.com/images/guides/step-1.jpg',
  },
  {
    name: 'Download the Mobile App',
    text: 'Install the SnapAsset AI app from the App Store or Google Play.',
  },
  {
    name: 'Start Cataloging',
    text: 'Use your phone camera to capture photos of your belongings. Our AI will automatically identify and value them.',
  },
  {
    name: 'Organize by Room',
    text: 'Assign assets to properties and rooms for easy organization.',
  },
  {
    name: 'Generate Reports',
    text: 'Create insurance-ready reports with one click whenever you need them.',
  },
]

export const metadata = createMetadata({
  title: 'Getting Started Guide',
  description: 'Learn how to set up and use SnapAsset AI to create your home inventory in minutes',
  path: '/guides/getting-started',
})

export default function GettingStartedPage() {
  const howToSchema = generateHowToSchema({
    name: 'Getting Started with SnapAsset AI',
    description: 'Complete guide to setting up your home inventory',
    totalTime: 'PT15M', // 15 minutes in ISO 8601 format
    steps,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div>
        <h1>Getting Started with SnapAsset AI</h1>
        <p>Follow these simple steps to create your home inventory:</p>

        {steps.map((step, index) => (
          <div key={index}>
            <h2>Step {index + 1}: {step.name}</h2>
            <p>{step.text}</p>
            {step.image && <img src={step.image} alt={step.name} />}
          </div>
        ))}
      </div>
    </>
  )
}
```

### Example 6: Blog Article with Structured Data

```typescript
// app/blog/maximize-insurance-claims/page.tsx
import { createMetadata, generateArticleSchema } from '@/lib/seo'

const article = {
  title: 'How to Maximize Your Insurance Claim',
  description: 'Expert tips for documenting your belongings and filing successful insurance claims',
  author: 'SnapAsset AI Team',
  datePublished: '2024-01-15',
  dateModified: '2024-01-20',
  image: 'https://snapassetai.com/images/blog/insurance-claims.jpg',
  url: 'https://snapassetai.com/blog/maximize-insurance-claims',
}

export const metadata = createMetadata({
  title: article.title,
  description: article.description,
  path: '/blog/maximize-insurance-claims',
  type: 'article',
  keywords: ['insurance claims', 'documentation', 'tips'],
})

export default function BlogArticlePage() {
  const articleSchema = generateArticleSchema(article)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article>
        <h1>{article.title}</h1>
        <p className="meta">
          By {article.author} | Published {article.datePublished}
        </p>
        <img src={article.image} alt={article.title} />

        {/* Article content */}
      </article>
    </>
  )
}
```

### Example 7: Homepage with Multiple Schemas

```typescript
// app/page.tsx
import {
  metadataPresets,
  generateWebsiteSchema,
  generateSoftwareApplicationSchema
} from '@/lib/seo'

// Use homepage preset
export const metadata = metadataPresets.home

export default function HomePage() {
  // Generate both website and software application schemas
  const websiteSchema = generateWebsiteSchema()
  const appSchema = generateSoftwareApplicationSchema()

  return (
    <>
      {/* Add both schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <div>
        <h1>Never Lose Money on Insurance Claims</h1>
        <p>
          HomeGuard uses AI to scan, document, and value your belongings.
          Get instant valuations and insurance-ready reports.
        </p>
        {/* Homepage content */}
      </div>
    </>
  )
}
```

### Example 8: Breadcrumb Navigation with Schema

```typescript
// app/dashboard/property/[id]/room/[roomId]/page.tsx
import { createPrivateMetadata, generateBreadcrumbSchema } from '@/lib/seo'

export const metadata = createPrivateMetadata({
  title: 'Room Assets',
  description: 'View and manage assets in this room',
})

export default function RoomPage({
  params
}: {
  params: { id: string; roomId: string }
}) {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Dashboard', url: 'https://snapassetai.com/dashboard' },
    { name: 'Properties', url: 'https://snapassetai.com/dashboard/properties' },
    {
      name: 'Property Details',
      url: `https://snapassetai.com/dashboard/property/${params.id}`
    },
    {
      name: 'Room',
      url: `https://snapassetai.com/dashboard/property/${params.id}/room/${params.roomId}`
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Visual breadcrumb navigation */}
      <nav>
        Dashboard &gt; Properties &gt; Property Details &gt; Room
      </nav>

      {/* Room content */}
    </>
  )
}
```

### Example 9: Custom Open Graph Image

```typescript
// app/features/ai-valuation/page.tsx
import { createMetadata, generateOGImageUrl } from '@/lib/seo'

// Generate a custom OG image with dynamic text
const ogImageUrl = generateOGImageUrl({
  title: 'AI-Powered Valuations',
  description: 'Get instant, accurate valuations for your belongings',
})

export const metadata = createMetadata({
  title: 'AI-Powered Valuations',
  description: 'SnapAsset AI uses eBay market data and machine learning to provide instant, accurate valuations',
  path: '/features/ai-valuation',
  images: [
    {
      url: ogImageUrl,
      width: 1200,
      height: 630,
      alt: 'AI-Powered Valuations by SnapAsset AI',
    },
  ],
})

export default function AIValuationPage() {
  return (
    <div>
      <h1>AI-Powered Valuations</h1>
      {/* Feature content */}
    </div>
  )
}
```

### Example 10: Environment-Aware URLs

```typescript
// app/sitemap-generator/route.ts (custom dynamic sitemap)
import { getBaseUrl } from '@/lib/seo'

export async function GET() {
  const baseUrl = getBaseUrl() // Automatically uses correct URL for environment

  // Fetch dynamic routes from database
  const properties = await fetchPropertiesFromDB()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${properties.map(property => `
        <url>
          <loc>${baseUrl}/property/${property.id}</loc>
          <lastmod>${property.updated_at}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>
  `

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

## Testing Your SEO Implementation

### 1. Rich Results Test (Google)

```bash
# Test structured data
https://search.google.com/test/rich-results
```

Paste your page URL or JSON-LD to validate.

### 2. Validate Sitemap

```bash
# Check sitemap in browser
http://localhost:3000/sitemap.xml

# Validate online
https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

### 3. Check Robots.txt

```bash
# View robots.txt
http://localhost:3000/robots.txt

# Test with Google Search Console
# Add site → Settings → robots.txt Tester
```

### 4. Open Graph Preview

Use these tools to preview social media cards:
- https://www.opengraph.xyz/
- https://metatags.io/
- https://cards-dev.twitter.com/validator

## Common Patterns

### Pattern: Adding Multiple Schemas to One Page

```typescript
export default function Page() {
  const schemas = {
    website: generateWebsiteSchema(),
    faq: generateFAQSchema(faqs),
    breadcrumb: generateBreadcrumbSchema(breadcrumbs),
  }

  return (
    <>
      {Object.entries(schemas).map(([key, schema]) => (
        <script
          key={key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {/* Page content */}
    </>
  )
}
```

### Pattern: Conditional Schema Based on Data

```typescript
export default function ProductPage({ product }) {
  // Only add review schema if product has reviews
  const reviewSchema = product.reviews?.length > 0
    ? generateReviewSchema(product.reviews)
    : null

  return (
    <>
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
      {/* Product content */}
    </>
  )
}
```

### Pattern: Server Component with Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import { createMetadata } from '@/lib/seo'
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

// Generate metadata dynamically based on blog post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchBlogPost(params.slug)

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${params.slug}`,
    type: 'article',
    images: [{ url: post.coverImage }],
  })
}

export default async function BlogPost({ params }: Props) {
  const post = await fetchBlogPost(params.slug)

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Post content */}
    </article>
  )
}
```

## Pro Tips

1. **Always use metadata presets** for common pages to maintain consistency
2. **Add structured data** to content-rich pages (FAQs, how-tos, articles)
3. **Use breadcrumbs** for pages more than 2 levels deep
4. **Test with Google's tools** before deploying to production
5. **Monitor Search Console** for indexing issues and rich result errors
6. **Update timestamps** in structured data when content changes
7. **Use environment-aware URLs** via `getBaseUrl()` helper

## Troubleshooting

### Issue: Metadata not appearing in social shares

**Solution:** Check that:
- `metadataBase` is set in root layout
- Images use absolute URLs
- Images are at least 1200x630px for OG images

### Issue: Structured data errors in Search Console

**Solution:**
- Validate JSON-LD with Google's Rich Results Test
- Ensure required fields are present
- Check that dates are in ISO 8601 format
- Verify URLs are absolute, not relative

### Issue: Sitemap not updating

**Solution:**
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build:next`
- Check sitemap generation logic in `app/sitemap.ts`
