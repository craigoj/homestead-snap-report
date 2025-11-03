# SnapAsset AI - Production Deployment Checklist

## Overview
This checklist guides you through deploying SnapAsset AI to production using Vercel for hosting and Supabase for backend services.

---

## Pre-Deployment Requirements

### ✅ Code Readiness
- [ ] All migrations from Vite to Next.js 14 App Router complete (26/27 routes)
- [ ] All tests passing (end-to-end route tests completed)
- [ ] No TypeScript build errors (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Git repository clean with all changes committed
- [ ] Production branch created (e.g., `main` or `production`)

### ✅ Environment Preparation
- [ ] Production domain purchased and configured
- [ ] SSL certificate ready (handled by Vercel)
- [ ] Email service configured (SendGrid or alternative)
- [ ] Analytics platform ready (Google Analytics, Plausible, etc.)

---

## 1. Environment Variables Configuration

### Development vs Production Variables

Create `.env.production` file with production values:

```bash
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key

# Stripe Production (Live Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_ENV=production

# SendGrid (if using for emails)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# eBay API (Production)
EBAY_APP_ID=your_production_app_id
EBAY_CERT_ID=your_production_cert_id
EBAY_DEV_ID=your_production_dev_id

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-...
```

### Vercel Environment Variable Setup

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable:
   - **Name**: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Production value
   - **Environment**: Select "Production" (and "Preview" if needed)
3. Sensitive keys (STRIPE_SECRET_KEY, etc.) should ONLY be in Production

### Security Best Practices
- [ ] Never commit `.env.production` to Git (add to `.gitignore`)
- [ ] Use `NEXT_PUBLIC_` prefix only for client-side variables
- [ ] Keep server-side secrets without `NEXT_PUBLIC_` prefix
- [ ] Rotate all API keys from development to production
- [ ] Use different Stripe test/live keys appropriately

---

## 2. Supabase Production Setup

### Database Configuration

1. **Create Production Project** (if not already done):
   - Go to https://app.supabase.com
   - Create new project or use existing production project
   - Note Project URL and anon key

2. **Run Database Migrations**:
   ```sql
   -- Ensure all tables, functions, and policies are deployed
   -- Run migrations in order from development
   ```

3. **Row Level Security (RLS) Policies**:
   - [ ] Verify all tables have RLS enabled
   - [ ] Test policies with production user roles
   - [ ] Ensure `has_role()` function exists for admin checks

   Key tables requiring RLS:
   - `assets` - Users can only see their own assets
   - `properties` - Users can only see their own properties
   - `rooms` - Users can only see rooms in their properties
   - `loss_events` - Users can only see their own events
   - `proof_of_loss_forms` - Users can only see their own forms
   - `jumpstart_sessions` - Users can only see their own sessions
   - `assessment_submissions` - Users can only see their own submissions
   - `waitlist` - Admin read, public insert
   - Admin tables - Admin role required

4. **Storage Buckets**:
   - [ ] Create production buckets:
     - `asset-photos` - Public read, authenticated upload
     - `receipts` - Private, authenticated read/upload
     - `appraisal-documents` - Private, authenticated read/upload

   - [ ] Configure storage policies:
     ```sql
     -- Example for asset-photos bucket
     CREATE POLICY "Users can upload their own photos"
     ON storage.objects FOR INSERT
     WITH CHECK (
       bucket_id = 'asset-photos'
       AND auth.uid()::text = (storage.foldername(name))[1]
     );

     CREATE POLICY "Anyone can view photos"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'asset-photos');
     ```

   - [ ] Set CORS policies for buckets
   - [ ] Configure file size limits (e.g., 10MB for photos)

5. **Authentication Configuration**:
   - [ ] Configure email templates (Welcome, Magic Link, Password Reset)
   - [ ] Set Site URL: `https://yourdomain.com`
   - [ ] Set Redirect URLs: `https://yourdomain.com/auth/callback`
   - [ ] Enable required auth providers (Email/Password, Magic Link)
   - [ ] Configure password requirements
   - [ ] Set session timeout (default: 604800 seconds / 7 days)
   - [ ] Enable email confirmations if required

6. **Database Backups**:
   - [ ] Enable automatic daily backups (Supabase Pro plan)
   - [ ] Configure backup retention period
   - [ ] Test backup restoration process
   - [ ] Document manual backup procedure:
     ```bash
     # Using Supabase CLI
     supabase db dump -f backup.sql
     ```

7. **Performance Optimization**:
   - [ ] Create indexes on frequently queried columns:
     ```sql
     CREATE INDEX idx_assets_user_id ON assets(user_id);
     CREATE INDEX idx_assets_property_id ON assets(property_id);
     CREATE INDEX idx_asset_photos_asset_id ON asset_photos(asset_id);
     CREATE INDEX idx_loss_events_user_id ON loss_events(user_id);
     ```

   - [ ] Enable connection pooling (Supavisor)
   - [ ] Monitor query performance in Supabase Dashboard

### Supabase Edge Functions

1. **Deploy Edge Functions** (if using):
   ```bash
   # Deploy all functions
   supabase functions deploy send-email
   supabase functions deploy generate-report

   # Set secrets for functions
   supabase secrets set SENDGRID_API_KEY=your_key
   ```

2. **Configure Function Secrets**:
   - [ ] SendGrid API key
   - [ ] eBay API credentials
   - [ ] Any other third-party API keys

---

## 3. Stripe Production Setup

### Live Mode Configuration

1. **Switch to Live Mode** in Stripe Dashboard

2. **Get Live API Keys**:
   - [ ] Copy Publishable Key (pk_live_...)
   - [ ] Copy Secret Key (sk_live_...)
   - [ ] Add to Vercel environment variables

3. **Create Products and Prices**:
   - [ ] Recreate all test products in live mode
   - [ ] Set production pricing
   - [ ] Configure billing intervals
   - [ ] Note Price IDs for code configuration

4. **Webhook Configuration**:
   - [ ] Create webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - [ ] Select events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

   - [ ] Copy Webhook Signing Secret (whsec_...)
   - [ ] Add to environment variables as `STRIPE_WEBHOOK_SECRET`

5. **Payment Methods**:
   - [ ] Enable desired payment methods (cards, ACH, etc.)
   - [ ] Configure currencies
   - [ ] Set up tax collection if required

6. **Customer Portal**:
   - [ ] Enable Customer Portal in Stripe settings
   - [ ] Configure allowed actions (cancel, update payment method, etc.)
   - [ ] Set business information and branding

7. **Testing Checklist**:
   - [ ] Test checkout flow with real card (then refund)
   - [ ] Verify webhook delivery in Stripe Dashboard
   - [ ] Test subscription creation and cancellation
   - [ ] Verify customer portal access

---

## 4. Vercel Deployment Configuration

### Initial Setup

1. **Connect Repository**:
   - Go to https://vercel.com/new
   - Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Select the repository

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or specify if in monorepo)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Environment Variables**:
   - Add all variables from section 1
   - Use different values for Preview vs Production if needed

4. **Deployment Settings**:
   - [ ] Production Branch: `main` (or your production branch)
   - [ ] Enable automatic deployments on push
   - [ ] Enable Preview Deployments for pull requests
   - [ ] Configure deployment protection (optional)

### Build Optimization

1. **Next.js Configuration** (`next.config.mjs`):
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     // Production optimizations
     compress: true,
     poweredByHeader: false,

     // Image optimization
     images: {
       domains: ['hfiznpxdopjdwtuenxqf.supabase.co'],
       formats: ['image/avif', 'image/webp'],
     },

     // Security headers
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'X-DNS-Prefetch-Control',
               value: 'on'
             },
             {
               key: 'Strict-Transport-Security',
               value: 'max-age=63072000; includeSubDomains; preload'
             },
             {
               key: 'X-Frame-Options',
               value: 'SAMEORIGIN'
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff'
             },
             {
               key: 'Referrer-Policy',
               value: 'origin-when-cross-origin'
             }
           ]
         }
       ]
     }
   }

   export default nextConfig
   ```

2. **Vercel Performance Settings**:
   - [ ] Enable Edge Functions for API routes (if applicable)
   - [ ] Configure CDN caching rules
   - [ ] Enable Incremental Static Regeneration (ISR) where applicable

### Custom Domain

1. **Add Domain**:
   - Vercel Dashboard → Your Project → Settings → Domains
   - Add your domain (e.g., `snapasset.ai`)
   - Add `www` subdomain if desired

2. **DNS Configuration**:
   - [ ] Update DNS A record to point to Vercel (`76.76.21.21`)
   - [ ] Or use CNAME record to `cname.vercel-dns.com`
   - [ ] Configure `www` redirect if needed
   - [ ] Wait for DNS propagation (up to 48 hours)

3. **SSL Certificate**:
   - [ ] Vercel auto-provisions SSL certificate (Let's Encrypt)
   - [ ] Verify HTTPS is working
   - [ ] Enable HTTPS redirect

---

## 5. Security Checklist

### Application Security

- [ ] **HTTPS Everywhere**: All traffic redirected to HTTPS
- [ ] **Environment Variables**: No secrets in client-side code
- [ ] **API Rate Limiting**: Implement rate limiting on API routes
- [ ] **CORS Configuration**: Properly configured in Supabase and API routes
- [ ] **Content Security Policy**: Add CSP headers in `next.config.mjs`
- [ ] **SQL Injection Protection**: Using Supabase parameterized queries
- [ ] **XSS Protection**: React escapes by default, verify user input handling
- [ ] **CSRF Protection**: Implement CSRF tokens for forms if needed

### Authentication & Authorization

- [ ] **Password Requirements**: Strong password policy enabled
- [ ] **Session Management**: Secure session storage and timeout
- [ ] **Role-Based Access**: Admin routes protected with `has_role()` check
- [ ] **JWT Validation**: Supabase handles JWT validation
- [ ] **Magic Link Security**: Email verification links expire appropriately

### Data Protection

- [ ] **RLS Policies**: All Supabase tables have RLS enabled
- [ ] **Data Encryption**: Supabase encrypts data at rest
- [ ] **File Upload Validation**: Validate file types and sizes
- [ ] **PII Handling**: Ensure compliance with privacy regulations
- [ ] **Data Retention**: Configure data retention policies

### Infrastructure Security

- [ ] **Dependency Audits**: Run `npm audit` and fix vulnerabilities
- [ ] **Dependency Updates**: Keep dependencies updated
- [ ] **Secrets Rotation**: Rotate API keys and secrets regularly
- [ ] **Logging**: No sensitive data in logs
- [ ] **Error Messages**: Generic error messages to users (no stack traces)

---

## 6. Performance Optimization

### Frontend Optimization

- [ ] **Code Splitting**: Verify Next.js automatic code splitting
- [ ] **Image Optimization**: Use `next/image` for all images
- [ ] **Font Optimization**: Use `next/font` for web fonts
- [ ] **Lazy Loading**: Implement lazy loading for heavy components
- [ ] **Bundle Analysis**: Run `npm run build` and review bundle sizes
  ```bash
  # Install bundle analyzer
  npm install @next/bundle-analyzer

  # Add to next.config.mjs
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })

  # Run analysis
  ANALYZE=true npm run build
  ```

### Database Optimization

- [ ] **Indexes**: Verify all necessary indexes are created
- [ ] **Query Optimization**: Review slow queries in Supabase Dashboard
- [ ] **Connection Pooling**: Enable Supavisor for connection pooling
- [ ] **Caching**: Implement React Query caching (already in place)

### Asset Optimization

- [ ] **Image Compression**: Compress images before upload
- [ ] **CDN Configuration**: Leverage Vercel's CDN
- [ ] **Static Asset Caching**: Configure cache headers
- [ ] **Storage Optimization**: Implement file size limits

### Monitoring

- [ ] **Core Web Vitals**: Monitor LCP, FID, CLS
- [ ] **Performance Budget**: Set performance budgets
- [ ] **Lighthouse Audits**: Run Lighthouse on production URL
- [ ] **Real User Monitoring**: Implement RUM (Vercel Analytics)

---

## 7. Monitoring & Logging

### Vercel Analytics

1. **Enable Vercel Analytics**:
   - Vercel Dashboard → Your Project → Analytics
   - Enable Speed Insights and Web Analytics
   - Review metrics: visitors, page views, Core Web Vitals

2. **Configure Alerts**:
   - Set up deployment status alerts
   - Configure error rate alerts
   - Set budget alerts

### Error Tracking

1. **Sentry Integration** (Recommended):
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

   Configure `sentry.client.config.js`:
   ```javascript
   import * as Sentry from "@sentry/nextjs"

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NEXT_PUBLIC_APP_ENV,
     tracesSampleRate: 0.1,
     replaysOnErrorSampleRate: 1.0,
   })
   ```

   - [ ] Create Sentry project
   - [ ] Add DSN to environment variables
   - [ ] Configure error tracking
   - [ ] Set up release tracking
   - [ ] Configure user feedback

2. **Alternative: Vercel Logs**:
   - View logs in Vercel Dashboard → Your Project → Logs
   - Filter by function, time, status code
   - Set up log drains if needed

### Supabase Monitoring

- [ ] **Database Metrics**: Monitor in Supabase Dashboard
- [ ] **Query Performance**: Review slow queries
- [ ] **Storage Usage**: Monitor storage quotas
- [ ] **API Usage**: Track API request volume
- [ ] **Set Alerts**: Configure alerts for quota limits

### Uptime Monitoring

1. **Set up Uptime Checks** (Options):
   - UptimeRobot (free tier available)
   - Pingdom
   - StatusCake
   - Vercel's built-in monitoring

2. **Configure Checks**:
   - [ ] Homepage (`/`)
   - [ ] API health endpoint (`/api/health`)
   - [ ] Critical user flows
   - [ ] Set alert notifications (email, Slack, etc.)

---

## 8. Analytics & Tracking

### Google Analytics 4 (Optional)

1. **Setup**:
   ```bash
   npm install react-ga4
   ```

2. **Configure** in `app/layout.tsx`:
   ```typescript
   import ReactGA from "react-ga4"

   if (process.env.NEXT_PUBLIC_GA_ID) {
     ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID)
   }
   ```

3. **Add GA_ID** to environment variables

### Custom Events

- [ ] Track key user actions:
  - Sign up
  - Asset creation
  - Photo uploads
  - Report generation
  - Subscription purchases

---

## 9. Email Configuration

### SendGrid Setup (if using)

1. **Production API Key**:
   - [ ] Create production API key in SendGrid
   - [ ] Add to environment variables
   - [ ] Verify domain in SendGrid

2. **Email Templates**:
   - [ ] Create transactional email templates
   - [ ] Test all email flows:
     - Welcome email
     - Password reset
     - Subscription confirmation
     - Report sharing
     - Admin notifications

3. **Sender Authentication**:
   - [ ] Configure SPF records
   - [ ] Configure DKIM
   - [ ] Verify sender domain

4. **Compliance**:
   - [ ] Include unsubscribe link in all emails
   - [ ] Set up unsubscribe handling
   - [ ] Configure bounce handling

---

## 10. Testing in Production

### Pre-Launch Testing

- [ ] **Smoke Tests**: Verify all critical paths work
- [ ] **Authentication Flow**:
  - Sign up new user
  - Email verification
  - Login
  - Password reset
  - Logout

- [ ] **Core Features**:
  - Create property
  - Add asset with photo upload
  - EXIF extraction works
  - Barcode scanning works
  - OCR processing works
  - eBay valuation works
  - Generate report
  - Share report via link

- [ ] **Payment Flow**:
  - Test checkout with real card
  - Verify subscription creation in Stripe
  - Test customer portal
  - Verify webhook delivery
  - Refund test transaction

- [ ] **Admin Features**:
  - Access admin dashboard
  - View assessments
  - Manage waitlist
  - Verify role protection works

### Browser Testing

- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (desktop & mobile)
- [ ] Edge

### Device Testing

- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)

### Performance Testing

- [ ] Run Lighthouse audit (score > 90)
- [ ] Test page load times (< 3 seconds)
- [ ] Test asset upload performance
- [ ] Test with slow 3G network

---

## 11. SEO & Marketing Setup

### SEO Configuration

- [ ] **Sitemap**: Verify sitemap.xml is generated
- [ ] **Robots.txt**: Configure for production
- [ ] **Meta Tags**: Verify all pages have proper meta tags
- [ ] **Structured Data**: Verify schema.org markup
- [ ] **Open Graph**: Verify social sharing previews
- [ ] **Canonical URLs**: Ensure canonical tags are correct

### Google Search Console

- [ ] Add and verify property
- [ ] Submit sitemap
- [ ] Monitor index coverage
- [ ] Check mobile usability

### Social Media

- [ ] Test Open Graph previews (Facebook, LinkedIn)
- [ ] Test Twitter Card previews
- [ ] Verify social share images display correctly

---

## 12. Legal & Compliance

### Privacy & Legal Pages

- [ ] Privacy Policy published and accessible
- [ ] Terms of Service published and accessible
- [ ] Cookie policy (if applicable)
- [ ] GDPR compliance (if applicable)
- [ ] CCPA compliance (if applicable)

### Data Protection

- [ ] Data processing agreement with Supabase
- [ ] Data processing agreement with Stripe
- [ ] Data backup and retention policies documented
- [ ] User data export functionality (if required)
- [ ] User data deletion functionality (if required)

---

## 13. Launch Preparation

### Final Checklist

- [ ] All environment variables configured in Vercel
- [ ] Domain DNS configured and propagated
- [ ] SSL certificate active
- [ ] Database migrations complete
- [ ] RLS policies tested
- [ ] Storage buckets configured
- [ ] Authentication flows tested
- [ ] Payment processing tested
- [ ] Email delivery tested
- [ ] Monitoring and alerts configured
- [ ] Error tracking active
- [ ] Analytics configured
- [ ] Backups configured and tested
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit complete

### Pre-Launch Communication

- [ ] Prepare launch announcement (blog, social media)
- [ ] Notify beta users of production launch
- [ ] Prepare support documentation
- [ ] Train support team (if applicable)
- [ ] Set up status page (e.g., status.yourdomain.com)

---

## 14. Deployment Process

### Step-by-Step Deployment

1. **Final Code Review**:
   ```bash
   # Ensure clean working directory
   git status

   # Run final tests
   npm run lint
   npm run build

   # Review build output for errors
   ```

2. **Merge to Production Branch**:
   ```bash
   git checkout main
   git pull origin main
   git merge develop  # or your feature branch
   git push origin main
   ```

3. **Trigger Deployment**:
   - Vercel automatically deploys on push to main
   - Monitor deployment in Vercel Dashboard
   - Watch build logs for errors

4. **Verify Deployment**:
   - [ ] Visit production URL
   - [ ] Check deployment status in Vercel
   - [ ] Verify environment variables loaded
   - [ ] Run smoke tests

5. **Post-Deployment Checks**:
   - [ ] Monitor error rates in Sentry
   - [ ] Check Vercel Analytics
   - [ ] Review Supabase metrics
   - [ ] Verify uptime monitor is active
   - [ ] Test critical user flows

---

## 15. Post-Launch Monitoring

### First 24 Hours

- [ ] Monitor error rates closely
- [ ] Watch server response times
- [ ] Track user registrations
- [ ] Monitor payment processing
- [ ] Check email delivery rates
- [ ] Review support requests

### First Week

- [ ] Daily review of analytics
- [ ] Monitor database performance
- [ ] Track conversion rates
- [ ] Review user feedback
- [ ] Optimize based on real usage patterns

### Ongoing

- [ ] Weekly performance reviews
- [ ] Monthly security audits
- [ ] Quarterly dependency updates
- [ ] Regular backup testing
- [ ] Feature usage analysis

---

## 16. Rollback Procedures

### If Issues Occur

1. **Immediate Rollback** (via Vercel):
   - Go to Vercel Dashboard → Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"
   - Confirm promotion

2. **Database Rollback** (if schema changed):
   ```bash
   # Restore from backup
   supabase db reset --db-url "postgresql://..."

   # Or restore specific backup
   psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
   ```

3. **Code Rollback** (via Git):
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main

   # Or reset to specific commit
   git reset --hard <commit-hash>
   git push --force origin main
   ```

4. **Communication**:
   - Update status page
   - Notify affected users
   - Post incident report after resolution

---

## 17. Maintenance Schedule

### Daily
- Monitor error logs
- Review analytics
- Check uptime status

### Weekly
- Review performance metrics
- Check database size and query performance
- Review user feedback and support tickets

### Monthly
- Security audit
- Dependency updates (`npm update`)
- Backup testing
- Review and optimize database indexes

### Quarterly
- Major dependency updates
- Security penetration testing
- Performance optimization review
- Feature usage analysis
- Cost optimization review

---

## 18. Emergency Contacts

### Critical Services

| Service | Dashboard URL | Support |
|---------|--------------|---------|
| Vercel | https://vercel.com/dashboard | support@vercel.com |
| Supabase | https://app.supabase.com | support@supabase.com |
| Stripe | https://dashboard.stripe.com | support@stripe.com |
| SendGrid | https://app.sendgrid.com | support@sendgrid.com |
| Domain Registrar | [Your registrar] | [Support contact] |

### Team Contacts
- **Primary Admin**: [Name, Email, Phone]
- **Technical Lead**: [Name, Email, Phone]
- **DevOps**: [Name, Email, Phone]

---

## 19. Success Criteria

### Launch Metrics

- [ ] 99.9% uptime in first week
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Error rate < 1%
- [ ] Zero critical security issues
- [ ] All user flows tested and working

### Business Metrics

- [ ] User registration tracking active
- [ ] Conversion funnel tracking active
- [ ] Payment processing at 100% success rate
- [ ] Customer support ticketing system ready

---

## Conclusion

This checklist ensures a smooth, secure, and optimized production deployment of SnapAsset AI. Complete each section methodically, and don't rush the process. Production stability is more important than launch speed.

**Remember**:
- Test thoroughly before launch
- Monitor closely after launch
- Have rollback procedures ready
- Communicate transparently with users

**Good luck with your production deployment! 🚀**

---

**Document Version**: 1.0
**Last Updated**: 2025-11-03
**Next Review**: After production launch
