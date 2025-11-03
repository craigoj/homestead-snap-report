# Next.js 14 Complete Migration Plan - SnapAsset AI

**Status:** Phase 1 Complete (Foundation) - Ready for Phase 2 (Route Migration)
**Last Updated:** 2025-11-02
**Target Completion:** 2-3 weeks

---

## Executive Summary

### Migration Status
- ✅ **Foundation Complete:** Next.js 14 installed, basic App Router structure created
- 🚧 **In Progress:** Landing page migrated (1 of 27 routes)
- ⏳ **Remaining:** 26 routes to migrate from Vite/React Router to Next.js App Router

### ⚠️ CRITICAL: Enhanced Scope
This plan has been updated to include **essential features missing from the original scope:**

1. **🔐 Server-Side Authentication Strategy** - Supabase Auth + Next.js middleware (Week 1, Day 3)
2. **💳 Stripe Payment Integration** - Subscription management and webhooks (Week 2, Days 3-4)
3. **🎯 Smart Scan Jumpstart MVP** - 3-prompt system for 7x activation improvement (Week 3, Days 1-2)
4. **📱 Mobile-First Testing** - 63% of users are mobile - explicit testing per route
5. **🔍 SEO Technical Implementation** - Schema.org, dynamic meta tags, sitemaps (Week 1, Days 4-5)
6. **🧪 Staging & Testing Strategy** - Environment setup and rollback procedures

### Key Benefits
- 🎯 **SEO:** Server-side rendering and metadata optimization
- ⚡ **Performance:** Automatic code splitting, image optimization, streaming
- 🔒 **Security:** Middleware-based route protection, server-side auth
- 🚀 **Deployment:** Vercel optimization, edge functions, global CDN
- 📱 **UX:** Faster page loads, better mobile performance (63% mobile traffic)
- 💰 **Monetization:** Stripe integration for subscription revenue

---

## 🚨 CRITICAL UPDATES - What Changed in This Plan

This plan has been significantly enhanced based on critical missing requirements. The original scope focused only on route migration but missed **essential launch-blocking features.**

### What Was Added

#### 1. Server-Side Authentication Strategy (Week 1, Day 3) 🔐
**Why Critical:** Without proper SSR auth, protected routes are vulnerable and user experience is poor.
- Complete middleware implementation
- Server-side Supabase client setup
- useAuth hook migration for Next.js
- Comprehensive testing checklist (10+ scenarios)
**Time Added:** 6-9 hours

#### 2. Stripe Payment Integration (Week 2, Days 3-4) 💳
**Why Critical:** **Blocks all revenue generation.** Original plan had no payment system.
- API routes for checkout, webhooks, billing portal
- Subscription UI components
- Database schema updates
- Complete testing strategy
**Time Added:** 10-14 hours

#### 3. Smart Scan Jumpstart MVP (Week 3, Days 2-3) 🎯
**Why Critical:** **67% activation improvement, 7x session completion.** This feature drives core product value.
- 3-prompt guided system
- Category-specific smart prompts
- Progress tracking and value calculation
- Celebration experience with confetti
**Time Added:** 12-16 hours
**Impact:** Reduces time-to-value from 15min → 3min

#### 4. SEO Technical Foundation (Week 1, Days 4-5) 🔍
**Why Critical:** Original plan mentioned SEO but had no implementation details.
- Dynamic sitemap generation
- Robots.txt configuration
- Schema.org structured data helpers
- Dynamic metadata utilities
- Open Graph and Twitter Card setup
**Time Added:** 6-8 hours

#### 5. Mobile-First Testing Strategy 📱
**Why Critical:** **63% of traffic is mobile.** No explicit mobile testing in original plan.
- Mobile testing checklist for every route
- Real device testing requirements
- Touch target validation (44x44px minimum)
- Mobile form usability checks
**Time Added:** Integrated into each route (adds ~15-30min per route)

#### 6. Enhanced Risk Mitigation & Rollback Plans 🛡️
**Why Critical:** Original plan had minimal risk planning.
- 11 identified risks with mitigation strategies
- Rollback procedures for each critical feature
- Staging environment requirements
- Database backup procedures
- Performance monitoring setup
**Time Added:** Planning time, execution integrated

### Updated Timeline Summary

| Original Plan | Enhanced Plan | Difference |
|---------------|---------------|------------|
| 84-114 hours | 98-134 hours | +14-20 hours |
| 2-3 weeks | 3-3.5 weeks | +0.5 weeks |
| 26 routes | 25 routes + 4 critical features | More valuable scope |
| Basic migration | Production-ready app | Launch-capable |

### What Stays the Same

✅ Next.js 14 App Router architecture
✅ Route-by-route migration approach
✅ Supabase backend
✅ TanStack Query for client state
✅ Tailwind CSS + Shadcn/ui
✅ TypeScript (relaxed mode)

### Key Decision Points

Before starting, confirm:

1. **Stripe Account:** Do you have Stripe account set up? (Required Week 2)
2. **Staging Environment:** Can you set up staging.snapassetai.com? (Required Week 3)
3. **Mobile Devices:** Do you have iPhone/Android for testing? (Required throughout)
4. **Time Commitment:** Can you commit 3-3.5 weeks vs. original 2-3 weeks?

### Why These Additions Matter

**Without Auth Infrastructure:** Users can't reliably stay logged in, middleware doesn't work
**Without Stripe:** No revenue, no business model
**Without Smart Scan:** 67% lower activation, users don't see value fast enough
**Without SEO Foundation:** No organic traffic growth
**Without Mobile Testing:** 63% of users have poor experience

This enhanced plan transforms the migration from a **technical exercise** into a **launch-ready product.**

---

## Current State Analysis

### ✅ Completed (Phase 1)
```
✓ Next.js 14.2.33 installed
✓ app/layout.tsx - Root layout with metadata
✓ app/page.tsx - Landing page (/) migrated
✓ app/providers.tsx - React Query, Auth, Toast providers
✓ next.config.mjs - Path aliases, image optimization
✓ TypeScript config compatible
✓ Tailwind CSS configured
✓ npm scripts for Next.js (dev:next, build:next, start:next)
```

### 📊 Routes Inventory

**Total Routes:** 27
**Migrated:** 1 (3.7%)
**Remaining:** 26 (96.3%)

#### Vite Routes (Current - React Router)
```javascript
// App.tsx - BrowserRouter with 27 routes

PUBLIC ROUTES (10):
  /                           → Index (MIGRATED ✅)
  /auth                       → Auth
  /how-to                     → HowToGuide
  /assessment                 → Assessment
  /assessment/quiz            → AssessmentQuiz
  /assessment/results         → AssessmentResults
  /waitlist                   → Waitlist
  /privacy-policy             → PrivacyPolicy
  /terms-of-service           → TermsOfService
  /unsubscribe                → Unsubscribe

PROTECTED ROUTES (12):
  /dashboard                  → Dashboard (with Layout)
  /properties                 → Properties (with Layout)
  /properties/:id             → PropertyDetail (with Layout)
  /assets/add                 → AddAsset (with Layout)
  /assets/:id                 → AssetDetail (with Layout)
  /assets/:id/edit            → EditAsset (with Layout)
  /reports                    → Reports (with Layout)
  /bulk-operations            → BulkAssetOperations (with Layout)
  /proof-of-loss              → ProofOfLoss (no Layout)
  /jumpstart                  → JumpstartMode (with Layout)
  /jumpstart/guide            → JumpstartGuide (no Layout)
  /jumpstart/complete         → JumpstartComplete (no Layout)

ADMIN ROUTES (4):
  /admin                      → AdminDashboard (with Layout)
  /admin/assessments          → AssessmentsManager (with Layout)
  /admin/waitlist             → WaitlistManager (with Layout)
  /admin/test-email           → TestEmail (with Layout)

ERROR HANDLING (1):
  /*                          → NotFound
```

#### Next.js Target Structure
```
app/
├── layout.tsx              ✅ Root layout
├── page.tsx                ✅ Landing (/)
├── providers.tsx           ✅ Client providers
├── not-found.tsx           ⏳ 404 page
├── auth/
│   └── page.tsx            ⏳ /auth
├── how-to/
│   └── page.tsx            ⏳ /how-to
├── assessment/
│   ├── page.tsx            ⏳ /assessment
│   ├── quiz/
│   │   └── page.tsx        ⏳ /assessment/quiz
│   └── results/
│       └── page.tsx        ⏳ /assessment/results
├── waitlist/
│   └── page.tsx            ⏳ /waitlist
├── privacy-policy/
│   └── page.tsx            ⏳ /privacy-policy
├── terms-of-service/
│   └── page.tsx            ⏳ /terms-of-service
├── unsubscribe/
│   └── page.tsx            ⏳ /unsubscribe
├── dashboard/
│   ├── layout.tsx          ⏳ Dashboard layout (with sidebar)
│   └── page.tsx            ⏳ /dashboard
├── properties/
│   ├── page.tsx            ⏳ /properties
│   └── [id]/
│       └── page.tsx        ⏳ /properties/:id
├── assets/
│   ├── add/
│   │   └── page.tsx        ⏳ /assets/add
│   └── [id]/
│       ├── page.tsx        ⏳ /assets/:id
│       └── edit/
│           └── page.tsx    ⏳ /assets/:id/edit
├── reports/
│   └── page.tsx            ⏳ /reports
├── bulk-operations/
│   └── page.tsx            ⏳ /bulk-operations
├── proof-of-loss/
│   └── page.tsx            ⏳ /proof-of-loss
├── jumpstart/
│   ├── page.tsx            ⏳ /jumpstart
│   ├── guide/
│   │   └── page.tsx        ⏳ /jumpstart/guide
│   └── complete/
│       └── page.tsx        ⏳ /jumpstart/complete
└── admin/
    ├── layout.tsx          ⏳ Admin layout
    ├── page.tsx            ⏳ /admin
    ├── assessments/
    │   └── page.tsx        ⏳ /admin/assessments
    ├── waitlist/
    │   └── page.tsx        ⏳ /admin/waitlist
    └── test-email/
        └── page.tsx        ⏳ /admin/test-email
```

---

## Phase 2: Route Migration Strategy

### Migration Principles

1. **Incremental Migration:** Migrate routes one-by-one, testing each
2. **Layout Hierarchy:** Create shared layouts for dashboard/admin sections
3. **Server Components First:** Use Server Components by default, add `'use client'` only when needed
4. **Metadata Optimization:** Add proper metadata to each route
5. **Type Safety:** Maintain TypeScript types throughout
6. **Testing:** Test each route before moving to the next

### Component Types Decision Tree

```
┌─ Does it use hooks/state/events? ─ YES ─→ 'use client'
│
└─ NO ─→ Can data be fetched on server? ─ YES ─→ Server Component
                                        │
                                        └─ NO ─→ 'use client'
```

### Route Migration Priorities (UPDATED)

**Priority 1: Foundation & Auth (Week 1, Days 1-2)**
1. `not-found.tsx` - Error handling
2. `auth/page.tsx` - Authentication (blocks all protected routes)
3. Test auth flows thoroughly before proceeding

**Priority 2: Auth Infrastructure (Week 1, Day 3)** 🔐 NEW
- `middleware.ts` - Route protection setup
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/supabase/client.ts` - Client-side Supabase client (update for Next.js)
- Migrate `useAuth` hook for Next.js compatibility
- **Test all auth flows:** Sign up, sign in, sign out, magic link, protected routes

**Priority 3: SEO Foundation (Week 1, Days 4-5)** 🔍 NEW
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.ts` - Robots.txt configuration
- Schema.org structured data helpers
- Dynamic metadata utilities
- Open Graph and Twitter Card setup
- **Test:** Validate with Google Search Console, Facebook Debugger

**Priority 4: Core Dashboard (Week 1, Days 5-6)** 📊 ADJUSTED
4. `dashboard/layout.tsx` - Shared layout with sidebar
5. `dashboard/page.tsx` - Main dashboard
6. `properties/page.tsx` - Property listing
7. `properties/[id]/page.tsx` - Property details
- **Mobile Test:** Each route must be tested on mobile viewport

**Priority 5: Asset Management (Week 2, Days 1-2)** 📦 ADJUSTED
8. `assets/add/page.tsx` - Add asset
9. `assets/[id]/page.tsx` - Asset details
10. `assets/[id]/edit/page.tsx` - Edit asset
11. `reports/page.tsx` - Reports listing
12. `bulk-operations/page.tsx` - Bulk operations

**Priority 6: Stripe Payment Integration (Week 2, Days 3-4)** 💳 NEW
- Install Stripe dependencies
- Create `app/api/stripe/` routes (checkout, webhook, portal)
- Build subscription management UI
- Implement webhook handlers
- Test payment flows end-to-end
- **Critical:** This blocks monetization

**Priority 7: Public & Marketing (Week 2, Day 5)** 📢 ADJUSTED
13. `how-to/page.tsx` - How-to guide
14. `assessment/page.tsx` - Assessment landing
15. `assessment/quiz/page.tsx` - Quiz
16. `assessment/results/page.tsx` - Results
17. `waitlist/page.tsx` - Waitlist signup

**Priority 8: Legal & Misc (Week 3, Day 1)** 📄 ADJUSTED
18. `privacy-policy/page.tsx` - Privacy policy
19. `terms-of-service/page.tsx` - Terms of service
20. `unsubscribe/page.tsx` - Unsubscribe page
21. `proof-of-loss/page.tsx` - Proof of loss form

**Priority 9: Smart Scan Jumpstart MVP (Week 3, Days 2-3)** 🎯 NEW
- Implement 3-prompt guided system
- Add progress tracking and celebration
- Category-specific smart prompts
- Value estimation and summary
- **Impact:** 67% activation improvement, 7x session completion
- This is CRITICAL for user activation

**Priority 10: Admin & Final Routes (Week 3, Days 4-5)** 👨‍💼 ADJUSTED
22. `jumpstart/page.tsx` - Standard jumpstart mode
23. `jumpstart/guide/page.tsx` - Jumpstart guide
24. `jumpstart/complete/page.tsx` - Completion
25. `admin/layout.tsx` - Admin layout
26. `admin/page.tsx` - Admin dashboard
27. `admin/assessments/page.tsx` - Assessments manager
28. `admin/waitlist/page.tsx` - Waitlist manager
29. `admin/test-email/page.tsx` - Email testing

---

## Phase 3: Middleware & Route Protection

### Create middleware.ts

**File:** `middleware.ts` (root level)

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define route patterns
  const isPublicRoute = [
    '/',
    '/auth',
    '/how-to',
    '/assessment',
    '/waitlist',
    '/privacy-policy',
    '/terms-of-service',
    '/unsubscribe',
  ].some(path => req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path + '/'))

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  // Redirect unauthenticated users from protected routes
  if (!isPublicRoute && !session) {
    const redirectUrl = new URL('/auth', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check admin access
  if (isAdminRoute && session) {
    const { data: hasAdminRole } = await supabase.rpc('has_role', {
      _user_id: session.user.id,
      _role: 'admin'
    })

    if (!hasAdminRole) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Supabase Auth Helpers for Next.js

**Install dependency:**
```bash
npm install @supabase/auth-helpers-nextjs
```

**Create server-side Supabase client:**

**File:** `lib/supabase/server.ts`
```typescript
import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/integrations/supabase/types'

export function createServerClient() {
  const cookieStore = cookies()

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### Migrating useAuth Hook for Next.js

**Current Implementation Issues:**
- Uses `window.location.origin` (not available in SSR)
- Context provider needs to be client-side only
- Auth state management needs to work with middleware

**Updated Implementation:**

**File:** `hooks/useAuth.tsx`
```typescript
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  signInWithMagicLink: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      router.refresh() // Refresh server components
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Use environment variable or hardcoded production URL
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://snapassetai.com'

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined,
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      router.push('/dashboard')
      router.refresh()
    }
    return { error }
  }

  const signInWithMagicLink = async (email: string) => {
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://snapassetai.com'

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithMagicLink,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

**Environment Variables:**
Add to `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Dev
# Production: https://snapassetai.com
```

### Testing Authentication Migration

**Checklist:**
- [ ] Sign up with email/password works
- [ ] Sign in with email/password works
- [ ] Magic link sign in works
- [ ] Sign out works and redirects correctly
- [ ] Protected routes redirect to /auth when not logged in
- [ ] Auth redirects back to original page after sign in
- [ ] Admin routes require admin role
- [ ] Session persists across page refreshes
- [ ] Middleware correctly identifies authenticated users
- [ ] Server components can access session data

---

## Phase 3A: Stripe Payment Integration (NEW) 💳

**Timeline:** Week 2, Days 3-4 (8-12 hours)
**Priority:** HIGH - Blocks monetization

### Overview
Implement Stripe for subscription payments, enabling monthly/annual billing and revenue generation.

### Install Dependencies

```bash
npm install stripe @stripe/stripe-js
npm install -D @types/stripe
```

### 1. Setup Stripe Environment Variables

**File:** `.env.local`
```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product/Price IDs
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_...
```

### 2. Create Stripe API Routes

**File:** `app/api/stripe/checkout/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await req.json()

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        user_id: session.user.id,
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

**File:** `app/api/stripe/webhook/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServerClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id

      if (userId && session.subscription) {
        // Update user subscription status in Supabase
        await supabase
          .from('user_profiles')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
            subscription_tier: 'pro',
          })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const status = subscription.status === 'active' ? 'active' : 'inactive'

      await supabase
        .from('user_profiles')
        .update({
          subscription_status: status,
          subscription_tier: status === 'active' ? 'pro' : 'free',
        })
        .eq('stripe_customer_id', customerId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

**File:** `app/api/stripe/portal/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

### 3. Database Schema Updates

Add to `user_profiles` table (if not exists):
```sql
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
```

### 4. Subscription Management UI

**File:** `components/SubscriptionButton.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export function SubscriptionButton({
  priceId,
  label = 'Subscribe',
}: {
  priceId: string
  label?: string
}) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        toast.error(error)
        return
      }

      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      toast.error('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Loading...' : label}
    </Button>
  )
}
```

**File:** `components/ManageSubscriptionButton.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  const handleManage = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const { url, error } = await response.json()

      if (error) {
        toast.error(error)
        return
      }

      window.location.href = url
    } catch (error) {
      toast.error('Failed to open billing portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleManage} disabled={loading} variant="outline">
      {loading ? 'Loading...' : 'Manage Subscription'}
    </Button>
  )
}
```

### 5. Stripe Configuration Steps

1. **Create Stripe Account:** https://stripe.com
2. **Create Products:**
   - Monthly subscription ($9/month)
   - Annual subscription ($90/year)
3. **Get API Keys:** Dashboard → Developers → API keys
4. **Setup Webhook:**
   - Dashboard → Developers → Webhooks
   - Endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook secret

### Testing Checklist

- [ ] Stripe test mode configured
- [ ] Monthly subscription checkout works
- [ ] Annual subscription checkout works
- [ ] Webhook receives events correctly
- [ ] User profile updates on successful payment
- [ ] Billing portal opens and works
- [ ] Subscription cancellation works
- [ ] Test with Stripe test cards: 4242 4242 4242 4242

---

## Phase 3B: Smart Scan Jumpstart MVP (NEW) 🎯

**Timeline:** Week 3, Days 2-3 (12-16 hours)
**Priority:** CRITICAL - 67% activation improvement

### Overview
Implement guided 3-prompt system that dramatically improves user onboarding and activation rates.

**Impact Metrics:**
- 67% improvement in activation rate
- 7x increase in session completion
- Reduces time to first value from 15min → 3min

### Implementation Strategy

### 1. Smart Prompt System

**File:** `lib/jumpstart/smartPrompts.ts`
```typescript
export type RoomCategory =
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'garage'
  | 'office'
  | 'other'

export interface SmartPrompt {
  id: string
  prompt: string
  category: RoomCategory
  examples: string[]
  estimatedValue: number
}

export const smartPrompts: Record<RoomCategory, SmartPrompt[]> = {
  living_room: [
    {
      id: 'tv',
      prompt: "Let's start with your TV - snap a photo of it",
      category: 'living_room',
      examples: ['Samsung 65" QLED', 'LG OLED', 'Sony Bravia'],
      estimatedValue: 800,
    },
    {
      id: 'sofa',
      prompt: 'Great! Now photograph your sofa or couch',
      category: 'living_room',
      examples: ['Leather sectional', 'Fabric loveseat', 'Recliner'],
      estimatedValue: 1200,
    },
    {
      id: 'coffee_table',
      prompt: "Let's get your coffee table or main furniture piece",
      category: 'living_room',
      examples: ['Wood coffee table', 'Glass center table', 'Ottoman'],
      estimatedValue: 300,
    },
  ],
  bedroom: [
    {
      id: 'bed',
      prompt: 'Start by photographing your bed frame or mattress',
      category: 'bedroom',
      examples: ['Queen mattress', 'King bed frame', 'Platform bed'],
      estimatedValue: 900,
    },
    {
      id: 'dresser',
      prompt: 'Next, get a photo of your dresser or wardrobe',
      category: 'bedroom',
      examples: ['6-drawer dresser', 'Wardrobe closet', 'Chest of drawers'],
      estimatedValue: 500,
    },
    {
      id: 'nightstand',
      prompt: 'Finally, capture your nightstand or bedside table',
      category: 'bedroom',
      examples: ['Nightstand', 'Bedside table', 'End table'],
      estimatedValue: 150,
    },
  ],
  kitchen: [
    {
      id: 'refrigerator',
      prompt: "Let's photograph your refrigerator",
      category: 'kitchen',
      examples: ['French door fridge', 'Side-by-side', 'Top freezer'],
      estimatedValue: 1500,
    },
    {
      id: 'stove',
      prompt: 'Now get your stove or range',
      category: 'kitchen',
      examples: ['Gas range', 'Electric stove', 'Induction cooktop'],
      estimatedValue: 800,
    },
    {
      id: 'microwave',
      prompt: "Let's capture your microwave",
      category: 'kitchen',
      examples: ['Over-range microwave', 'Countertop microwave'],
      estimatedValue: 200,
    },
  ],
  // Add other categories...
}

export function getPromptsForRoom(category: RoomCategory): SmartPrompt[] {
  return smartPrompts[category] || []
}

export function calculateEstimatedTotal(completedPrompts: string[]): number {
  let total = 0
  Object.values(smartPrompts)
    .flat()
    .forEach((prompt) => {
      if (completedPrompts.includes(prompt.id)) {
        total += prompt.estimatedValue
      }
    })
  return total
}
```

### 2. Jumpstart Session Management

**File:** `app/jumpstart/smart/page.tsx`
```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PhotoUpload } from '@/components/PhotoUpload'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Camera, ArrowRight } from 'lucide-react'
import { getPromptsForRoom, calculateEstimatedTotal, type RoomCategory } from '@/lib/jumpstart/smartPrompts'
import confetti from 'canvas-confetti'

export default function SmartJumpstartPage() {
  const router = useRouter()
  const [selectedRoom, setSelectedRoom] = useState<RoomCategory>('living_room')
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [completedPrompts, setCompletedPrompts] = useState<string[]>([])
  const [totalValue, setTotalValue] = useState(0)

  const prompts = getPromptsForRoom(selectedRoom)
  const currentPrompt = prompts[currentPromptIndex]
  const progress = ((currentPromptIndex + 1) / prompts.length) * 100

  const handlePhotoUploaded = (assetId: string) => {
    // Mark prompt as completed
    setCompletedPrompts([...completedPrompts, currentPrompt.id])
    setTotalValue(calculateEstimatedTotal([...completedPrompts, currentPrompt.id]))

    // Move to next prompt or finish
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1)
    } else {
      // All prompts completed - celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      router.push(`/jumpstart/complete?value=${totalValue}`)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quick Start: {selectedRoom.replace('_', ' ')}</span>
            <span className="text-sm text-muted-foreground">
              {currentPromptIndex + 1} of {prompts.length}
            </span>
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Prompt */}
          <div className="text-center space-y-4">
            <Camera className="h-16 w-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">{currentPrompt.prompt}</h2>
            <p className="text-muted-foreground">
              Examples: {currentPrompt.examples.join(', ')}
            </p>
          </div>

          {/* Photo Upload */}
          <PhotoUpload
            onPhotoUploaded={handlePhotoUploaded}
            promptCategory={currentPrompt.category}
          />

          {/* Progress Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Items Cataloged:</span>
              <span className="font-bold">{completedPrompts.length}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Estimated Value:</span>
              <span className="font-bold text-primary">
                ${totalValue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Completed Prompts */}
          {completedPrompts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Completed:
              </h3>
              {completedPrompts.map((promptId) => {
                const prompt = prompts.find((p) => p.id === promptId)
                return (
                  <div
                    key={promptId}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{prompt?.prompt}</span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

### 3. Celebration Experience

**File:** `app/jumpstart/complete/page.tsx`
```typescript
'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, Download } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function JumpstartCompletePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const totalValue = searchParams.get('value') || '0'

  useEffect(() => {
    // Trigger celebration confetti
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card className="text-center">
        <CardContent className="pt-12 pb-8 space-y-6">
          <CheckCircle2 className="h-24 w-24 mx-auto text-green-500" />

          <div>
            <h1 className="text-4xl font-bold mb-2">Congratulations!</h1>
            <p className="text-xl text-muted-foreground">
              You've completed your first inventory
            </p>
          </div>

          <div className="bg-primary/10 p-6 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Total Estimated Value
            </p>
            <p className="text-5xl font-bold text-primary">
              ${parseInt(totalValue).toLocaleString()}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              View Your Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => router.push('/jumpstart')}
            >
              Add More Items
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Your inventory is automatically backed up and insured
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Testing Checklist

- [ ] Room category selection works
- [ ] Prompts display correctly for each room
- [ ] Photo upload progresses through prompts
- [ ] Progress bar updates correctly
- [ ] Value calculation is accurate
- [ ] Completion celebration triggers
- [ ] Navigation after completion works
- [ ] Mobile experience is smooth

---

## Phase 4: Layout Hierarchy

### Root Layout (Already Complete ✅)
**File:** `app/layout.tsx`
- Font configuration
- Metadata
- Providers wrapper
- Theme support

### Dashboard Layout
**File:** `app/dashboard/layout.tsx`

```typescript
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  return <DashboardShell>{children}</DashboardShell>
}
```

**Create DashboardShell component:**
**File:** `components/DashboardShell.tsx`
- Convert `Layout.tsx` to Next.js compatible component
- Replace `react-router-dom` Link with `next/link`
- Replace `useLocation` with `usePathname` from `next/navigation`
- Replace `useNavigate` with `useRouter` from `next/navigation`

### Admin Layout
**File:** `app/admin/layout.tsx`

Similar to dashboard layout but with admin role check.

---

## Phase 5: Component Adaptations

### Key Changes Required

#### 1. Navigation Changes
```typescript
// Before (React Router)
import { Link, useNavigate, useLocation } from 'react-router-dom'

const navigate = useNavigate()
const location = useLocation()
navigate('/dashboard')

// After (Next.js)
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const router = useRouter()
const pathname = usePathname()
router.push('/dashboard')
```

#### 2. Route Parameters
```typescript
// Before (React Router)
import { useParams } from 'react-router-dom'

const { id } = useParams()

// After (Next.js)
// In Server Component
type Params = { id: string }
export default async function Page({ params }: { params: Params }) {
  const { id } = params
}

// In Client Component
import { useParams } from 'next/navigation'
const params = useParams()
const id = params.id
```

#### 3. Search Params
```typescript
// Before (React Router)
import { useSearchParams } from 'react-router-dom'

const [searchParams] = useSearchParams()
const query = searchParams.get('q')

// After (Next.js)
// In Server Component
export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q
}

// In Client Component
import { useSearchParams } from 'next/navigation'
const searchParams = useSearchParams()
const query = searchParams.get('q')
```

#### 4. Metadata
```typescript
// Before (React Helmet)
import { Helmet } from 'react-helmet-async'

<Helmet>
  <title>Page Title</title>
  <meta name="description" content="..." />
</Helmet>

// After (Next.js)
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: '...',
}
```

#### 5. Environment Variables
```typescript
// Before (Vite)
import.meta.env.VITE_SUPABASE_URL

// After (Next.js)
process.env.NEXT_PUBLIC_SUPABASE_URL
```

#### 6. Protected Route Wrapper
```typescript
// Before (React Router + ProtectedRoute component)
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Layout>
      <Dashboard />
    </Layout>
  </ProtectedRoute>
} />

// After (Next.js middleware + layouts)
// Protection handled by middleware.ts
// Layout handled by layout.tsx
// Just create app/dashboard/page.tsx
```

---

## Phase 6: Image Optimization

### Using next/image

```typescript
// Before
<img src={photoUrl} alt={title} className="w-full h-64 object-cover" />

// After
import Image from 'next/image'

<Image
  src={photoUrl}
  alt={title}
  width={800}
  height={600}
  className="w-full h-64 object-cover"
  priority={isPrimaryPhoto}
/>
```

### Supabase Storage Images
Already configured in `next.config.mjs`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'hfiznpxdopjdwtuenxqf.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

---

## Phase 7: Data Fetching Patterns

### Pattern 1: Server Component with Direct Fetch
```typescript
// app/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerClient()

  const { data: assets } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return <DashboardContent assets={assets} />
}
```

### Pattern 2: Client Component with React Query
```typescript
// components/AssetList.tsx
'use client'

import { useQuery } from '@tanstack/react-query'

export function AssetList() {
  const { data, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data } = await supabase.from('assets').select('*')
      return data
    }
  })

  if (isLoading) return <LoadingSkeleton />
  return <div>{/* render assets */}</div>
}
```

### Pattern 3: Hybrid (Server + Client)
```typescript
// app/assets/[id]/page.tsx (Server Component)
import { createServerClient } from '@/lib/supabase/server'
import { AssetDetailClient } from '@/components/AssetDetailClient'

export default async function AssetPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: asset } = await supabase
    .from('assets')
    .select('*, asset_photos(*), properties(*), rooms(*)')
    .eq('id', params.id)
    .single()

  if (!asset) notFound()

  return <AssetDetailClient initialAsset={asset} />
}
```

---

## Phase 8: SEO Optimization

### Metadata for Each Route

**Example - Dashboard:**
```typescript
// app/dashboard/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | SnapAsset AI',
  description: 'Manage your home inventory and asset valuations',
}
```

**Example - Dynamic Route:**
```typescript
// app/assets/[id]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = createServerClient()
  const { data: asset } = await supabase
    .from('assets')
    .select('title, description')
    .eq('id', params.id)
    .single()

  return {
    title: `${asset?.title || 'Asset'} | SnapAsset AI`,
    description: asset?.description || 'View asset details',
  }
}
```

### Sitemap Generation

**File:** `app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://snapassetai.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://snapassetai.com/auth',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://snapassetai.com/how-to',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Add all public routes
  ]
}
```

### Robots.txt

**File:** `app/robots.ts`
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://snapassetai.com/sitemap.xml',
  }
}
```

---

## Phase 9: Testing Strategy

### Testing Checklist per Route

For each migrated route, verify:

**Functionality:**
- [ ] Page loads without errors
- [ ] All interactive elements work
- [ ] Forms submit correctly
- [ ] Navigation works (links, back button)
- [ ] Auth protection works (if protected route)
- [ ] Data loads correctly
- [ ] Images display properly
- [ ] Responsive design works

**Performance:**
- [ ] Fast initial load
- [ ] No layout shift
- [ ] Images optimized
- [ ] No console errors/warnings

**SEO:**
- [ ] Metadata present and correct
- [ ] Open Graph tags
- [ ] Structured data (if applicable)

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Proper heading hierarchy
- [ ] Alt text on images

### Testing Tools

```bash
# Lighthouse audit
npm run build:next
npm run start:next
# Then run Lighthouse in Chrome DevTools

# Bundle analysis
npm install @next/bundle-analyzer
```

---

## Phase 10: Deployment

### Pre-Deployment Checklist

**Environment Variables:**
```bash
# .env.local (development)
# .env.production (production)

NEXT_PUBLIC_SUPABASE_URL=https://hfiznpxdopjdwtuenxqf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here

# Server-only variables (no NEXT_PUBLIC prefix)
EBAY_CLIENT_ID=...
EBAY_CLIENT_SECRET=...
```

**Build Test:**
```bash
npm run build:next
npm run start:next
# Test all critical flows
```

**Vercel Configuration:**

**File:** `vercel.json`
```json
{
  "buildCommand": "npm run build:next",
  "devCommand": "npm run dev:next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Deployment Steps

**Option A: Vercel (Recommended)**
1. Push to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy
5. Test production build
6. Configure custom domain

**Option B: Self-Hosted**
1. Build: `npm run build:next`
2. Copy `.next` folder to server
3. Install dependencies on server
4. Run: `npm run start:next`
5. Use PM2 or systemd for process management
6. Set up reverse proxy (Nginx/Caddy)

---

## Phase 11: Cleanup & Finalization

### Remove Vite Dependencies

**After full migration and testing:**

```bash
# Remove Vite and React Router
npm uninstall vite @vitejs/plugin-react-swc vite-plugin-prerender
npm uninstall react-router-dom
npm uninstall react-helmet-async

# Remove Vite-specific files
rm vite.config.ts
rm index.html
rm src/main.tsx

# Update package.json scripts
# Remove: dev, build, build:dev, preview
# Keep: dev:next, build:next, start:next, lint:next
# Rename: dev:next → dev, build:next → build, etc.
```

### Update Documentation

**Files to update:**
- `.claude/CLAUDE.md` - Remove Vite references, add Next.js patterns
- `README.md` - Update setup instructions
- `.gitignore` - Add Next.js specific entries

### Update .gitignore

```gitignore
# Next.js
/.next/
/out/

# Production
/build

# Local env files
.env*.local

# Vercel
.vercel
```

---

## Migration Timeline (UPDATED WITH CRITICAL FEATURES)

### Week 1: Foundation, Auth & Core Routes
| Day | Focus | Deliverables | Hours |
|-----|-------|--------------|-------|
| Mon | **Not Found + Auth Page** | `not-found.tsx`, `auth/page.tsx` | 6-8h |
| | Test all auth flows thoroughly | Sign in/up/out, magic link | 2-3h |
| Tue | **Auth Infrastructure** 🔐 | `middleware.ts`, `lib/supabase/server.ts` | 4-6h |
| | Update useAuth hook | Next.js compatibility | 2-3h |
| Wed | **SEO Foundation** 🔍 | `sitemap.ts`, `robots.ts`, Schema.org helpers | 6-8h |
| | SEO utilities | Dynamic metadata, OG tags | |
| Thu | **Dashboard Layout** | `dashboard/layout.tsx`, `DashboardShell` component | 6-8h |
| | Mobile testing | Test responsive nav | |
| Fri | **Core Dashboard Routes** | `dashboard/page.tsx`, `properties/page.tsx` | 6-8h |
| | Property Detail | `properties/[id]/page.tsx` | |

**Week 1 Total:** 3 routes + auth infrastructure + SEO + layout (32-43 hours)

**Critical Checkpoints:**
- ✅ Authentication working perfectly (all flows tested)
- ✅ Middleware protecting routes correctly
- ✅ SEO foundation in place
- ✅ Mobile navigation tested

### Week 2: Assets, Stripe & Marketing
| Day | Focus | Deliverables | Hours |
|-----|-------|--------------|-------|
| Mon | **Asset Management Routes** | `assets/add`, `assets/[id]`, `assets/[id]/edit` | 8-10h |
| | Mobile testing | Photo upload on mobile | |
| Tue | **Reports + Bulk Ops** | `reports/page.tsx`, `bulk-operations/page.tsx` | 6-8h |
| Wed | **Stripe Integration** 💳 | `app/api/stripe/*` routes | 6-8h |
| | Payment UI | Subscription buttons, billing portal | 2-3h |
| Thu | **Stripe Testing & Polish** | Database updates, webhook testing | 4-6h |
| | Public routes start | `how-to/page.tsx` | 2-3h |
| Fri | **Marketing Pages** | Assessment pages (3), waitlist, legal (3) | 6-8h |

**Week 2 Total:** 12 routes + Stripe integration (32-45 hours)

**Critical Checkpoints:**
- ✅ Stripe checkout working (test mode)
- ✅ Webhooks receiving events
- ✅ Subscription status updating
- ✅ All mobile routes tested

### Week 3: Smart Scan, Jumpstart, Admin & Launch Prep
| Day | Focus | Deliverables | Hours |
|-----|-------|--------------|-------|
| Mon | **Proof of Loss Route** | `proof-of-loss/page.tsx` | 4-6h |
| | Legal pages finish | Polish remaining public pages | 2-3h |
| Tue | **Smart Scan Jumpstart** 🎯 | `app/jumpstart/smart/page.tsx` | 8-10h |
| | Smart prompts system | `lib/jumpstart/smartPrompts.ts` | |
| Wed | **Jumpstart Celebration** | `jumpstart/complete/page.tsx` | 4-6h |
| | Standard jumpstart | `jumpstart/page.tsx`, `jumpstart/guide` | 2-3h |
| Thu | **Admin Section** | Admin layout + 4 admin routes | 8-10h |
| | Admin testing | Role checks, access control | |
| Fri | **Final Testing & Staging** | Full QA, staging deployment | 8-10h |
| | Documentation | Update docs, create launch checklist | |

**Week 3 Total:** 10 routes + Smart Scan + Admin + testing (34-46 hours)

**Critical Checkpoints:**
- ✅ Smart Scan Jumpstart tested (high priority)
- ✅ Admin access control working
- ✅ Staging environment deployed
- ✅ All routes pass mobile testing
- ✅ SEO metadata verified on all pages
- ✅ Payment flows tested end-to-end

### **Updated Grand Total:** 25 routes + auth + SEO + Stripe + Smart Scan + layouts = 98-134 hours (3-3.5 weeks)

**New Features Added:**
- 🔐 Complete auth infrastructure (Week 1)
- 🔍 SEO foundation with sitemaps and structured data (Week 1)
- 💳 Stripe payment integration (Week 2)
- 🎯 Smart Scan Jumpstart MVP (Week 3) - **CRITICAL FOR ACTIVATION**
- 📱 Explicit mobile testing for every route

---

## Risk Mitigation (ENHANCED)

### Risk 1: Auth State Issues 🔐
**Risk:** Authentication may break during migration
**Impact:** HIGH - Blocks all protected routes
**Mitigation:**
- ✅ Migrate auth page early (Day 1)
- ✅ Test ALL auth flows before proceeding (sign in, sign up, magic link, sign out)
- ✅ Use `@supabase/auth-helpers-nextjs` for proper SSR support
- ✅ Keep existing Vite app running until auth is confirmed working
- ✅ Test middleware with and without sessions
- ✅ Verify session persists across page refreshes
- ✅ Add comprehensive auth testing checklist (10+ scenarios)

**Rollback Plan:** Revert middleware and continue with client-side auth only

### Risk 2: Stripe Payment Integration Failures 💳
**Risk:** Payment processing may fail or webhooks may not trigger
**Impact:** CRITICAL - Blocks all revenue
**Mitigation:**
- ✅ Use Stripe test mode initially
- ✅ Test with Stripe test cards (4242 4242 4242 4242)
- ✅ Verify webhook endpoint is publicly accessible
- ✅ Test webhook locally with Stripe CLI
- ✅ Add extensive error logging for all payment operations
- ✅ Test subscription lifecycle: create → active → cancel → reactivate
- ✅ Verify database updates on webhook events
- ✅ Add Stripe dashboard monitoring alerts

**Rollback Plan:** Disable payment UI, continue with free tier only

### Risk 3: Mobile UX Issues 📱
**Risk:** App may not work properly on mobile (63% of traffic)
**Impact:** HIGH - Blocks majority of users
**Mitigation:**
- ✅ Test every route on mobile viewport during development
- ✅ Use Chrome DevTools mobile emulation
- ✅ Test on real devices (iPhone, Android)
- ✅ Verify photo upload works on mobile
- ✅ Test touch interactions for all UI elements
- ✅ Check that forms are mobile-friendly
- ✅ Verify navigation works on small screens
- ✅ Test landscape and portrait orientations

**Testing Checklist per Route:**
- [ ] Loads correctly on 375px width (iPhone SE)
- [ ] All buttons/links tappable (min 44x44px)
- [ ] Text is readable without zooming
- [ ] Forms work with mobile keyboard
- [ ] Images scale properly

### Risk 4: SEO Regression 🔍
**Risk:** Metadata missing or incorrect, losing search rankings
**Impact:** HIGH - Blocks organic traffic growth
**Mitigation:**
- ✅ Add metadata export to every page
- ✅ Generate dynamic metadata for dynamic routes
- ✅ Implement sitemap.xml generation
- ✅ Configure robots.txt properly
- ✅ Add Schema.org structured data
- ✅ Test Open Graph tags with Facebook Debugger
- ✅ Verify with Google Search Console
- ✅ Check for crawl errors in staging
- ✅ Monitor Core Web Vitals

**Validation Tools:**
- Facebook Sharing Debugger
- Twitter Card Validator
- Google Rich Results Test
- Lighthouse SEO audit

### Risk 5: Smart Scan Jumpstart Not Delivering Value 🎯
**Risk:** Smart Scan implementation doesn't improve activation
**Impact:** CRITICAL - Miss 67% activation improvement
**Mitigation:**
- ✅ Follow exact 3-prompt pattern from successful tests
- ✅ Test prompt flow end-to-end before launch
- ✅ Implement celebration experience (confetti, value display)
- ✅ Track activation metrics from day 1
- ✅ A/B test vs. standard onboarding
- ✅ Get user feedback on prompt clarity
- ✅ Ensure mobile experience is smooth

**Success Metrics to Track:**
- Session completion rate (target: 7x baseline)
- Time to first value (target: <3 minutes)
- Activation rate (target: 67% improvement)

### Risk 6: Breaking Changes in Dependencies
**Risk:** Some components may not be SSR-compatible
**Impact:** MEDIUM - May require refactoring
**Mitigation:**
- ✅ Audit all third-party components early
- ✅ Use `'use client'` directive liberally
- ✅ Dynamic imports with `ssr: false` for problematic components
- ✅ Test all interactive components in SSR context

**Known SSR-Incompatible:**
- `canvas-confetti` (use dynamic import)
- `react-signature-canvas` (use 'use client')
- Any component using `window` or `document` directly

### Risk 7: Data Fetching Patterns
**Risk:** React Query patterns may need adjustment
**Impact:** MEDIUM - May affect performance
**Mitigation:**
- ✅ Use hybrid approach (Server Components for initial data)
- ✅ Keep React Query for mutations and client-side updates
- ✅ Test data loading thoroughly
- ✅ Verify cache hydration works correctly

### Risk 8: Route Protection Edge Cases
**Risk:** Middleware may not catch all edge cases
**Impact:** HIGH - Security vulnerability
**Mitigation:**
- ✅ Test all protected routes without auth
- ✅ Test admin routes without admin role
- ✅ Test with expired sessions
- ✅ Add fallback checks in layouts
- ✅ Log unauthorized access attempts

### Risk 9: Deployment & Staging Issues 🚀
**Risk:** Production deployment may fail or behave differently
**Impact:** CRITICAL - Blocks launch
**Mitigation:**
- ✅ Set up staging environment (Week 3, Day 5)
- ✅ Test complete user journeys in staging
- ✅ Verify all environment variables in production
- ✅ Test with production-like data volumes
- ✅ Have rollback plan ready
- ✅ Deploy during low-traffic window
- ✅ Monitor error rates closely post-deploy

**Staging Environment Checklist:**
- [ ] Separate Supabase project or branch
- [ ] Stripe test mode configured
- [ ] All environment variables set
- [ ] Database migrations tested
- [ ] Webhook endpoints accessible
- [ ] DNS configured (staging.snapassetai.com)

### Risk 10: Data Migration & Database Schema Changes
**Risk:** Database changes may break existing data
**Impact:** CRITICAL - Data loss
**Mitigation:**
- ✅ Backup database before any schema changes
- ✅ Test migrations on staging first
- ✅ Use Supabase migrations for version control
- ✅ Add rollback scripts for each migration
- ✅ Verify RLS policies still work after changes

**Database Backup Procedure:**
```bash
# Before adding Stripe fields
pg_dump > backup_before_stripe_$(date +%Y%m%d).sql

# Test migration in staging
# Verify data integrity
# Then apply to production
```

### Risk 11: Performance Regression
**Risk:** Next.js app may be slower than Vite in some scenarios
**Impact:** MEDIUM - Poor user experience
**Mitigation:**
- ✅ Monitor Core Web Vitals from day 1
- ✅ Use Next.js Image optimization
- ✅ Implement proper code splitting
- ✅ Use loading states and Suspense
- ✅ Monitor bundle sizes
- ✅ Set up performance monitoring (Vercel Analytics or similar)

**Target Metrics:**
- FCP < 1.5s
- LCP < 2.5s
- TTI < 3.5s
- CLS < 0.1

---

## Success Criteria (UPDATED)

### Technical Metrics
- ✅ All 27 routes functional in Next.js
- ✅ Zero TypeScript errors
- ✅ Zero console errors in production
- ✅ All tests passing
- ✅ Build time < 2 minutes
- ✅ Lighthouse score > 90 (Performance, SEO, Accessibility)
- 🆕 ✅ Middleware protecting all routes correctly
- 🆕 ✅ Server-side auth working with no edge cases
- 🆕 ✅ SEO metadata present on all routes
- 🆕 ✅ Sitemap generating correctly
- 🆕 ✅ Schema.org structured data implemented

### Performance Metrics
- ✅ FCP (First Contentful Paint) < 1.5s
- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ TTI (Time to Interactive) < 3.5s
- ✅ CLS (Cumulative Layout Shift) < 0.1
- ✅ Bundle size < 500KB (initial load)
- 🆕 ✅ Mobile performance score > 85
- 🆕 ✅ All routes tested on mobile devices

### Business Metrics
- ✅ Feature parity with Vite version
- ✅ All user flows working
- ✅ No data loss during migration
- ✅ Zero downtime deployment
- ✅ SEO rankings maintained or improved
- 🆕 ✅ **Stripe payments working (test mode)**
- 🆕 ✅ **Subscription management functional**
- 🆕 ✅ **Smart Scan Jumpstart achieving target metrics:**
  - Session completion rate: 7x baseline
  - Time to first value: < 3 minutes
  - Activation rate: 67% improvement
- 🆕 ✅ **Mobile user satisfaction maintained (63% of traffic)**

### Critical Feature Checkpoints
- 🔐 **Authentication:**
  - [ ] Sign up/in/out working perfectly
  - [ ] Magic link functional
  - [ ] Session persistence working
  - [ ] Middleware protecting routes
  - [ ] Admin role checks working

- 💳 **Stripe Integration:**
  - [ ] Checkout session creation working
  - [ ] Webhooks receiving events
  - [ ] Database updates on payment events
  - [ ] Billing portal accessible
  - [ ] Test cards working

- 🎯 **Smart Scan Jumpstart:**
  - [ ] 3-prompt flow working smoothly
  - [ ] Progress tracking accurate
  - [ ] Value calculation correct
  - [ ] Celebration experience delightful
  - [ ] Mobile experience smooth

- 🔍 **SEO:**
  - [ ] All pages have metadata
  - [ ] Sitemap accessible
  - [ ] Robots.txt configured
  - [ ] OG tags validated
  - [ ] Schema.org markup present

- 📱 **Mobile:**
  - [ ] All routes tested on 375px width
  - [ ] Photo upload works on mobile
  - [ ] Forms usable with mobile keyboard
  - [ ] Navigation works on small screens
  - [ ] Touch targets meet 44x44px minimum

---

## Daily Migration Workflow

### For Each Route:

**1. Create File Structure (5 min)**
```bash
mkdir -p app/[route-path]
touch app/[route-path]/page.tsx
```

**2. Copy Content (10 min)**
- Copy from `src/pages/[Route].tsx`
- Paste into `app/[route-path]/page.tsx`

**3. Convert to Next.js (30-60 min)**
- Add `'use client'` if needed
- Replace React Router imports
- Replace navigation hooks
- Add metadata export (if Server Component)
- Update environment variables
- Update image tags (if any)

**4. Test Functionality (15-30 min)**
- Run `npm run dev:next`
- Navigate to route
- Test all interactions
- Check console for errors
- Test on mobile viewport

**5. Optimize (15-30 min)**
- Add loading states
- Optimize images
- Check bundle size
- Add error boundaries

**6. Document (5 min)**
- Update this plan's checklist
- Note any issues found
- Document any deviations

**Total per route:** 1.5-2.5 hours average

---

## Helper Scripts

### Create Route Structure Script

**File:** `scripts/create-route.sh`
```bash
#!/bin/bash
# Usage: ./scripts/create-route.sh dashboard

ROUTE=$1

if [ -z "$ROUTE" ]; then
  echo "Usage: ./create-route.sh <route-name>"
  exit 1
fi

mkdir -p "app/$ROUTE"

cat > "app/$ROUTE/page.tsx" << 'EOF'
export default function Page() {
  return (
    <div>
      <h1>[Route Name] Page</h1>
    </div>
  )
}
EOF

echo "Created app/$ROUTE/page.tsx"
```

### Test All Routes Script

**File:** `scripts/test-routes.js`
```javascript
const routes = [
  '/',
  '/auth',
  '/dashboard',
  '/properties',
  // ... add all routes
]

async function testRoutes() {
  for (const route of routes) {
    const res = await fetch(`http://localhost:3000${route}`)
    console.log(`${route}: ${res.status}`)
  }
}

testRoutes()
```

---

## Next Immediate Actions

### Today (Day 1)
1. ✅ Review this plan
2. ⏳ Create `app/not-found.tsx`
3. ⏳ Start migrating `app/auth/page.tsx`
4. ⏳ Create `middleware.ts`
5. ⏳ Install `@supabase/auth-helpers-nextjs`
6. ⏳ Create `lib/supabase/server.ts`

### Tomorrow (Day 2)
1. Finish auth page migration
2. Test authentication flows thoroughly
3. Create `app/dashboard/layout.tsx`
4. Convert `components/Layout.tsx` to `components/DashboardShell.tsx`
5. Start migrating `app/dashboard/page.tsx`

### This Week Goal
- Complete 6 core routes
- Have working authentication
- Have dashboard accessible with sidebar navigation

---

## Resources & References

### Documentation
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

### Migration Patterns
- [React Router to Next.js](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#migrating-from-react-router)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

## Route Migration Checklist

Track your progress:

### Public Routes (10)
- [x] `/` - Landing page ✅
- [ ] `/auth` - Authentication
- [ ] `/how-to` - How-to guide
- [ ] `/assessment` - Assessment landing
- [ ] `/assessment/quiz` - Assessment quiz
- [ ] `/assessment/results` - Assessment results
- [ ] `/waitlist` - Waitlist signup
- [ ] `/privacy-policy` - Privacy policy
- [ ] `/terms-of-service` - Terms of service
- [ ] `/unsubscribe` - Unsubscribe

### Protected Routes (12)
- [ ] `/dashboard` - Main dashboard
- [ ] `/properties` - Property listing
- [ ] `/properties/:id` - Property details
- [ ] `/assets/add` - Add asset
- [ ] `/assets/:id` - Asset details
- [ ] `/assets/:id/edit` - Edit asset
- [ ] `/reports` - Reports listing
- [ ] `/bulk-operations` - Bulk operations
- [ ] `/proof-of-loss` - Proof of loss
- [ ] `/jumpstart` - Jumpstart mode
- [ ] `/jumpstart/guide` - Jumpstart guide
- [ ] `/jumpstart/complete` - Jumpstart complete

### Admin Routes (4)
- [ ] `/admin` - Admin dashboard
- [ ] `/admin/assessments` - Assessments manager
- [ ] `/admin/waitlist` - Waitlist manager
- [ ] `/admin/test-email` - Email testing

### Infrastructure (5)
- [ ] `not-found.tsx` - 404 page
- [ ] `middleware.ts` - Route protection
- [ ] `dashboard/layout.tsx` - Dashboard layout
- [ ] `admin/layout.tsx` - Admin layout
- [ ] `components/DashboardShell.tsx` - Layout component

---

## Questions & Decisions

### To Decide:
1. **Deployment target:** Vercel or self-hosted?
2. **Data fetching strategy:** Mostly Server Components or hybrid?
3. **Image optimization:** Use Next.js Image component everywhere?
4. **Keep Vite during migration:** Run both in parallel or fully switch?
5. **Bundle analysis:** Should we optimize bundle size during or after migration?

### Assumptions:
1. Keeping React Query for client-side mutations
2. Using Supabase Auth Helpers for Next.js
3. Targeting Vercel for deployment
4. Using TypeScript throughout (relaxed mode)
5. Maintaining Tailwind CSS + Shadcn/ui

---

**Status:** Ready to begin Phase 2 (Route Migration)
**Next Step:** Create not-found.tsx and start auth page migration
**Owner:** Development Team
**Timeline:** 2-3 weeks to completion

---

*This plan is a living document. Update it as you progress through the migration.*
