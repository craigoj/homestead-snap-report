# SnapAsset AI - Project Documentation

## Project Overview

SnapAsset AI is a comprehensive asset management and inventory tracking platform for homeowners and insurance purposes. The application enables users to catalog their assets with photos, track valuations (including eBay integration), manage properties and rooms, generate insurance claim reports, and handle proof of loss documentation.

### Key Features
- Asset inventory management with photo capture and EXIF data extraction
- Barcode/QR code scanning for quick asset identification
- OCR (Optical Character Recognition) for extracting text from images
- eBay integration for automated asset valuation
- Property and room organization
- Loss event tracking and proof of loss form generation
- Insurance claim report generation with shareable links
- Jumpstart mode for guided asset cataloging
- Admin dashboard for assessment and waitlist management

---

## Tech Stack

### Core Technologies
- **Framework**: React 18.3.1 with TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19 with React SWC plugin
- **Language**: TypeScript (relaxed mode - see TypeScript Configuration)
- **Styling**: Tailwind CSS 3.4.17 with custom design system
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **State Management**: TanStack Query v5 for server state
- **Routing**: React Router DOM v6.30.1
- **Forms**: React Hook Form 7.61.1 + Zod 3.25.76 validation

### UI Component Libraries
- **Base Components**: Radix UI primitives (@radix-ui/*)
- **UI Library**: Shadcn/ui (source-based, not npm package)
- **Icons**: Lucide React 0.462.0
- **Styling Utilities**:
  - clsx + tailwind-merge (via `cn()` utility)
  - class-variance-authority for component variants

### Key Dependencies
- **@supabase/supabase-js**: ^2.57.4 - Supabase client
- **@tanstack/react-query**: ^5.83.0 - Data fetching and caching
- **@zxing/library**: ^0.21.3 - Barcode/QR code scanning
- **exifr**: ^7.1.3 - EXIF data extraction from images
- **date-fns**: ^3.6.0 - Date manipulation
- **recharts**: ^2.15.4 - Data visualization
- **canvas-confetti**: ^1.9.3 - Celebration animations
- **sonner**: ^1.7.4 - Toast notifications
- **next-themes**: ^0.3.0 - Dark mode support

---

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui base components (Button, Card, Dialog, etc.)
│   ├── admin/          # Admin dashboard components
│   ├── assessment/     # Assessment quiz components
│   ├── jumpstart/      # Jumpstart mode components
│   ├── landing/        # Landing page components
│   └── *.tsx           # Feature components (AssetCard, PhotoUpload, etc.)
├── pages/              # Page components (routes)
│   ├── admin/          # Admin pages
│   └── *.tsx           # Main pages (Dashboard, AddAsset, etc.)
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication context and hook
│   ├── useJumpstartSession.ts
│   └── *.tsx           # Other custom hooks
├── lib/                # Utility functions and business logic
│   ├── jumpstart/      # Jumpstart mode utilities
│   └── *.ts            # Utils (equipmentTemplates, errorHandling, etc.)
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase client and generated types
│       ├── client.ts   # Supabase client instance
│       └── types.ts    # Generated database types
└── App.tsx             # Root application component
```

### Component Organization Patterns

1. **UI Components** (`/components/ui/`)
   - Shadcn/ui base components (source-based, customizable)
   - Radix UI primitives wrapped with Tailwind styling
   - Follow Shadcn conventions (variants with CVA)

2. **Feature Components** (`/components/*.tsx`)
   - Self-contained business logic components
   - Examples: `AssetCard`, `PhotoUpload`, `BarcodeScanner`

3. **Feature-Specific Directories** (`/components/{feature}/`)
   - Grouped by feature domain (admin, assessment, jumpstart, landing)
   - Include index files for clean exports where appropriate

4. **Page Components** (`/pages/`)
   - Route-level components
   - Generally load data and compose feature components
   - Admin pages in `/pages/admin/`

---

## Database Schema (Supabase)

### Main Tables

#### `assets`
Core asset inventory table with comprehensive tracking fields:
- Basic info: `title`, `description`, `category`, `condition`
- Identification: `serial_number`, `brand`, `model`, `barcode_data`, `qr_code_data`, `upc`, `gtin`
- Valuation: `estimated_value`, `purchase_price`, `purchase_date`, `appraisal_value`, `appraisal_date`
- OCR data: `ocr_extracted`, `ocr_raw_text`, `ocr_confidence`, `ocr_provider`, `ocr_metadata`
- Relationships: `property_id`, `room_id`, `user_id`, `ebay_valuation_id`

#### `asset_photos`
Photo storage with EXIF metadata:
- `asset_id`, `file_path`, `file_name`, `is_primary`
- EXIF: `camera_make`, `camera_model`, `photo_taken_at`, `gps_coordinates`, `exif_data`
- Integrity: `photo_hash`, `file_size`

#### `properties` & `rooms`
Organizational hierarchy:
- Properties: `name`, `address`, `description`, `user_id`
- Rooms: `name`, `description`, `property_id`

#### `ebay_valuations`
Automated valuation data:
- `asset_id`, `estimated_value`, `confidence_score`
- `ebay_data` (JSON), `search_query`, `search_method`
- `value_range_min`, `value_range_max`, `market_trend`

#### `loss_events` & `proof_of_loss_forms`
Insurance claim management:
- Loss events: `event_type`, `event_date`, `discovery_date`, `police_report_number`
- POL forms: `form_data` (JSON), `signature_data`, `notary_info`, `status`

#### `jumpstart_sessions` & `jumpstart_prompts`
Guided onboarding system:
- Sessions: `mode`, `items_target`, `items_completed`, `total_value`
- Prompts: `prompt_id`, `prompt_index`, `completed`, `skipped`, `asset_id`

#### `assessment_submissions` & `waitlist`
Marketing and user qualification:
- Assessments: `responses` (JSON), `score`, `segment`, `priority_level`
- Waitlist: `email`, `position`, `priority_tier`, `status`

### Enums

```typescript
asset_category: "electronics" | "furniture" | "appliances" | "jewelry"
               | "clothing" | "art" | "books" | "tools" | "sports" | "other"

asset_condition: "excellent" | "good" | "fair" | "poor"

app_role: "admin" | "user"

event_type: "asset_created" | "ocr_success" | "ocr_fail"
           | "export_generated" | "user_signup" | "property_created"

report_status: "generating" | "ready" | "expired" | "failed"
```

### Key Database Functions
- `get_valid_ebay_token()` - Retrieves valid eBay OAuth token
- `has_role(_role, _user_id)` - Role-based access control
- `log_audit_event()` - Audit trail logging
- `should_revalue_asset(p_asset_id)` - Valuation staleness check

---

## Coding Standards & Patterns

### TypeScript Configuration

**Relaxed Mode** - The project uses relaxed TypeScript settings:
```json
{
  "noImplicitAny": false,
  "noUnusedParameters": false,
  "noUnusedLocals": false,
  "strictNullChecks": false,
  "allowJs": true,
  "skipLibCheck": true
}
```

**Guidelines:**
- Implicit `any` is allowed but prefer explicit types when practical
- Null checks are not enforced - use optional chaining (`?.`) liberally
- Unused variables/parameters are permitted
- Focus on developer velocity over strict type safety

### Import Patterns

**Path Aliases:**
```typescript
// Always use @ alias for src imports
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
```

**Common Import Structure:**
```typescript
// 1. React imports
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// 2. UI components
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 3. Icons
import { Package, DollarSign, Calendar } from 'lucide-react'

// 4. Hooks and utilities
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

// 5. Types
import type { Database } from '@/integrations/supabase/types'
```

### Component Patterns

**1. Functional Components with TypeScript:**
```typescript
interface ComponentProps {
  title: string
  optional?: string
  onAction?: (id: string) => void
}

export const Component = ({ title, optional, onAction }: ComponentProps) => {
  const [state, setState] = useState<string>('')

  return (
    <div className="container">
      {/* component content */}
    </div>
  )
}
```

**2. Context + Hook Pattern (Authentication):**
```typescript
// Define context type
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook with error handling
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Implementation
}
```

**3. TanStack Query Patterns:**
```typescript
// In components
const { data: assets, isLoading } = useQuery({
  queryKey: ['assets', propertyId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('property_id', propertyId)

    if (error) throw error
    return data
  }
})

// Mutations
const createAsset = useMutation({
  mutationFn: async (newAsset) => {
    const { data, error } = await supabase
      .from('assets')
      .insert(newAsset)
      .select()
      .single()

    if (error) throw error
    return data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['assets'] })
  }
})
```

### Styling Conventions

**Tailwind CSS with Custom Design System:**

1. **Use the `cn()` utility for conditional classes:**
```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes",
  conditional && "conditional-classes",
  className // Allow prop-based override
)}>
```

2. **CSS Variables for theming:**
```css
/* Defined in globals.css */
--primary: hsl(...)
--primary-foreground: hsl(...)
--background: hsl(...)
```

```typescript
// Use in Tailwind classes
<div className="bg-primary text-primary-foreground">
```

3. **Custom animations and gradients:**
```typescript
// Available in tailwind.config.ts
<div className="animate-fade-in-up bg-gradient-primary shadow-elegant">
```

4. **Responsive design:**
```typescript
<div className="flex flex-col md:flex-row lg:grid lg:grid-cols-3">
```

### Supabase Patterns

**1. Client Usage:**
```typescript
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

// Type-safe table access
type Asset = Database['public']['Tables']['assets']['Row']
type AssetInsert = Database['public']['Tables']['assets']['Insert']
```

**2. Query Patterns:**
```typescript
// Basic select with relationships
const { data, error } = await supabase
  .from('assets')
  .select(`
    *,
    properties (name),
    rooms (name),
    asset_photos (*)
  `)
  .eq('user_id', userId)

// Insert with select
const { data, error } = await supabase
  .from('assets')
  .insert(newAsset)
  .select()
  .single()

// Update
const { error } = await supabase
  .from('assets')
  .update({ estimated_value: value })
  .eq('id', assetId)
```

**3. Storage Patterns:**
```typescript
// Upload to storage bucket
const { data, error } = await supabase.storage
  .from('asset-photos')
  .upload(filePath, file)

// Public URL construction
const photoUrl = `https://hfiznpxdopjdwtuenxqf.supabase.co/storage/v1/object/public/asset-photos/${filePath}`
```

**4. Authentication:**
```typescript
// Sign up
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: redirectUrl,
    data: { full_name: fullName }
  }
})

// Sign in
await supabase.auth.signInWithPassword({ email, password })

// Magic link
await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: redirectUrl }
})

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth changes
})
```

### Form Handling

**React Hook Form + Zod:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['electronics', 'furniture', ...]),
  estimated_value: z.number().positive().optional()
})

type FormValues = z.infer<typeof formSchema>

// In component
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    title: '',
    category: 'other'
  }
})

const onSubmit = async (values: FormValues) => {
  // Handle submission
}
```

### Error Handling

**Consistent error handling pattern:**
```typescript
import { toast } from 'sonner'
import { logger } from '@/lib/errorHandling'

try {
  const { data, error } = await supabase.from('assets').select()

  if (error) {
    logger.error('Failed to fetch assets', error)
    toast.error('Failed to load assets')
    throw error
  }

  return data
} catch (error) {
  // Error already logged and toasted
  throw error
}
```

---

## Key Features & Implementation

### Photo Upload & EXIF Extraction
- Component: `PhotoUpload.tsx`
- Library: `exifr` for EXIF data extraction
- Process: Upload → Extract EXIF → Store metadata → Link to asset
- Supports: GPS coordinates, camera info, timestamp

### Barcode/QR Code Scanning
- Component: `BarcodeScanner.tsx`
- Library: `@zxing/library`
- Supports: UPC, EAN, QR codes, Code128, etc.
- Integration: Direct barcode data storage on assets

### OCR Processing
- Process: Image upload → OCR service → Extracted text storage
- Fields: `ocr_raw_text`, `ocr_confidence`, `ocr_provider`, `ocr_metadata`
- Review: `OCRReviewModal.tsx` for manual verification

### eBay Valuation Integration
- OAuth token management in `ebay_tokens` table
- Automated valuation via eBay API
- Confidence scoring and value range estimation
- Periodic revaluation logic

### Jumpstart Mode
- Guided onboarding for new users
- Session-based progress tracking
- Category-specific prompts
- Celebration modal on completion
- Components: `jumpstart/` directory

### Insurance Claim Features
- Loss event tracking with deadlines
- Proof of loss form generation with signature capture
- Claim report generation with shareable links
- PDF export capabilities

---

## Performance Optimization

### Vite Build Configuration
- Code splitting: vendor, ui, utils chunks
- Target: ES2020
- Minification: esbuild
- CSS minification enabled
- Compressed size reporting disabled for faster builds

### React Optimizations
- Lazy loading for landing page components (`LazyComponents.tsx`)
- Image optimization with loading states (`LazyImage.tsx`, `OptimizedImage.tsx`)
- React Query caching for API responses
- Dashboard optimization hook (`useDashboardOptimization.tsx`)

### SEO & Pre-rendering
- SEO plugin in Vite config
- Pre-rendered routes: `/`, `/auth`, `/how-to`
- Sitemap generation
- Components: `SEOHead.tsx`, `EnhancedSEO.tsx`, `StructuredData.tsx`

---

## Development Workflow

### Running the Application
```bash
npm run dev          # Development server (port 8080)
npm run build        # Production build
npm run build:dev    # Development mode build
npm run preview      # Preview production build
npm run lint         # ESLint
```

### Environment Variables
Create `.env.local` with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Adding New Features

1. **New Component:**
   - Place in appropriate directory (`/components/{feature}/`)
   - Follow TypeScript interface pattern
   - Use Tailwind + `cn()` utility
   - Export from index file if in feature directory

2. **New Page:**
   - Create in `/pages/` or `/pages/{section}/`
   - Add route in main router configuration
   - Protect with `ProtectedRoute` if authentication required
   - Add to sitemap if public

3. **New Database Table:**
   - Create migration in Supabase dashboard
   - Regenerate types: Update `types.ts` from Supabase
   - Add TanStack Query hooks for data access
   - Update RLS policies

4. **New UI Component:**
   - If from Shadcn: Use CLI to add
   - Place in `/components/ui/`
   - Customize theme in `tailwind.config.ts`

---

## Common Tasks

### Adding a New Asset Category
1. Update enum in Supabase: `asset_category`
2. Regenerate types from Supabase
3. Update any category selection UI components
4. Add category-specific logic if needed

### Implementing a New Report Type
1. Add to `claim_reports` table: `report_type` field
2. Create report template in `report_templates` table
3. Implement generation logic (likely in Edge Function)
4. Add UI for report selection
5. Update report preview/download components

### Adding Authentication Methods
1. Configure in Supabase Auth settings
2. Update `useAuth.tsx` hook with new method
3. Add UI in `Auth.tsx` page
4. Test redirect URLs and callbacks

### Customizing Theme
1. Edit CSS variables in `src/index.css`
2. Update `tailwind.config.ts` for new colors/utilities
3. Use `cn()` utility for dynamic classes
4. Test in both light and dark modes

---

## Testing Guidelines

### Manual Testing Checklist
- [ ] Photo upload and EXIF extraction
- [ ] Barcode/QR code scanning
- [ ] Asset CRUD operations
- [ ] Property and room management
- [ ] Authentication flows (signup, signin, signout, magic link)
- [ ] Report generation and sharing
- [ ] Jumpstart mode flow
- [ ] Responsive design on mobile/tablet

### Performance Testing
- [ ] Check Web Vitals (hook: `useWebVitals.tsx`)
- [ ] Verify lazy loading of images
- [ ] Test TanStack Query caching
- [ ] Monitor bundle size (vendor, ui, utils chunks)

---

## Deployment

### Build Process
1. Run `npm run build`
2. Static files generated in `/dist`
3. Pre-rendered routes included
4. Sitemap generated

### Environment Configuration
- Supabase project with proper RLS policies
- Storage buckets configured (asset-photos, receipts, etc.)
- Edge Functions deployed (if any)
- Environment variables set in hosting platform

### Recommended Hosting
- Vercel/Netlify for static frontend
- Supabase for backend (DB, Auth, Storage, Edge Functions)

---

## Troubleshooting

### Common Issues

**1. Supabase Type Errors:**
- Regenerate types from Supabase dashboard
- Check `tsconfig.json` path aliases
- Verify Supabase client initialization

**2. Image Upload Failures:**
- Check storage bucket policies
- Verify file size limits
- Ensure proper CORS configuration

**3. Authentication Issues:**
- Verify redirect URLs in Supabase Auth settings
- Check email template configuration
- Test with different auth methods

**4. Build Errors:**
- Clear node_modules and reinstall
- Check for TypeScript errors (loose config may hide issues)
- Verify all imports use correct path aliases

---

## Resources

### Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Project-Specific
- Supabase Project: `hfiznpxdopjdwtuenxqf.supabase.co`
- Storage Buckets: `asset-photos`, `receipts`, `appraisal-documents`

---

## Notes for Claude Code

### When Making Changes:
1. Always use `@/` path alias for imports
2. Follow existing TypeScript patterns (relaxed mode)
3. Use `cn()` utility for conditional Tailwind classes
4. Prefer TanStack Query for data fetching
5. Use Supabase client for all backend operations
6. Add toast notifications for user feedback (sonner)
7. Handle errors consistently with try/catch + logging

### When Adding Features:
1. Check if Supabase table changes needed
2. Consider RLS policy implications
3. Add appropriate loading states
4. Implement error handling
5. Update types if database schema changes
6. Consider mobile responsive design
7. Add SEO metadata for new pages

### Project Conventions:
- Component file names: PascalCase (e.g., `AssetCard.tsx`)
- Utility file names: camelCase (e.g., `errorHandling.ts`)
- CSS: Tailwind classes, avoid custom CSS when possible
- State: React hooks + TanStack Query (no Redux/Zustand)
- Async: async/await pattern, avoid callbacks
- Icons: Lucide React only
- Dates: date-fns for formatting
- Toast: sonner library

---

**Last Updated:** 2025-11-02
**Claude Code Version:** This document is designed for Claude Code's context understanding
