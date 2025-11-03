# SEO Quick Reference

## Common Tasks

### 1. Add Metadata to a New Page

```typescript
// app/your-page/page.tsx
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  path: '/your-page',
})

export default function YourPage() {
  return <div>Your content</div>
}
```

### 2. Use a Preset for Common Pages

```typescript
// app/how-to/page.tsx
import { metadataPresets } from '@/lib/seo'

export const metadata = metadataPresets.howTo
```

### 3. Add FAQ Structured Data

```typescript
import { generateFAQSchema } from '@/lib/seo'

const faqs = [
  { question: 'Q1?', answer: 'A1' },
  { question: 'Q2?', answer: 'A2' },
]

export default function Page() {
  const schema = generateFAQSchema(faqs)

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      {/* Your content */}
    </>
  )
}
```

### 4. Mark a Page as Private (No Index)

```typescript
import { createPrivateMetadata } from '@/lib/seo'

export const metadata = createPrivateMetadata({
  title: 'Dashboard',
  description: 'User dashboard',
})
```

### 5. Add Breadcrumbs

```typescript
import { generateBreadcrumbSchema } from '@/lib/seo'

const breadcrumbs = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://snapassetai.com' },
  { name: 'Features', url: 'https://snapassetai.com/features' },
])

// Add to page
<script type="application/ld+json">
  {JSON.stringify(breadcrumbs)}
</script>
```

## Available Presets

```typescript
metadataPresets.home       // Homepage
metadataPresets.auth       // Login/Signup
metadataPresets.howTo      // How-to guide
metadataPresets.assessment // Assessment quiz
metadataPresets.waitlist   // Waitlist page
metadataPresets.privacy    // Privacy policy
metadataPresets.terms      // Terms of service
metadataPresets.dashboard  // Dashboard (no-index)
```

## Schema Types

- `generateWebsiteSchema()` - Organization/Website
- `generateSoftwareApplicationSchema()` - App info
- `generateFAQSchema(questions)` - FAQ rich snippets
- `generateBreadcrumbSchema(items)` - Navigation
- `generateArticleSchema(article)` - Blog posts
- `generateHowToSchema(howTo)` - Step-by-step guides
- `generateLocalBusinessSchema(business)` - Business location

## Testing URLs

- Sitemap: http://localhost:3000/sitemap.xml
- Robots: http://localhost:3000/robots.txt
- Rich Results: https://search.google.com/test/rich-results
- OG Preview: https://www.opengraph.xyz/

## Import Paths

```typescript
// All-in-one import
import {
  createMetadata,
  metadataPresets,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo'

// Or individual imports
import { createMetadata } from '@/lib/seo/metadata'
import { generateFAQSchema } from '@/lib/seo/structured-data'
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Dev
# or
NEXT_PUBLIC_APP_URL=https://snapassetai.com  # Prod
```

Defaults to https://snapassetai.com if not set.
