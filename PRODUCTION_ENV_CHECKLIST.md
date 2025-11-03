# Production Environment Variable Checklist

**Quick Reference for Deployment**
Last Updated: 2025-11-03

## Overview

Use this checklist when setting up production environment variables in Netlify. For detailed instructions, see `PRODUCTION_ENV_SETUP.md`.

---

## Critical Variables (REQUIRED)

### Supabase Configuration
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Production Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Production anon/public key
- [ ] `VITE_SUPABASE_URL` - Same as NEXT_PUBLIC_SUPABASE_URL (for compatibility)
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` - Same as NEXT_PUBLIC_SUPABASE_ANON_KEY (for compatibility)
- [ ] `VITE_SUPABASE_PROJECT_ID` - Extract from Supabase URL

### Application URLs
- [ ] `NEXT_PUBLIC_APP_URL` - Production domain (e.g., https://snapassetai.com)
- [ ] `NEXT_PUBLIC_SITE_URL` - Same as NEXT_PUBLIC_APP_URL
- [ ] `NEXT_PUBLIC_APP_ENV` - Set to "production"
- [ ] `NODE_ENV` - Set to "production"

### Stripe Payment Integration (if using payments)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Starts with pk_live_
- [ ] `STRIPE_SECRET_KEY` - Starts with sk_live_ (server-side only!)
- [ ] `STRIPE_WEBHOOK_SECRET` - Starts with whsec_ (from webhook endpoint)
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` - Monthly subscription price ID
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL` - Annual subscription price ID

---

## Optional Variables (Feature-Specific)

### eBay Integration (for asset valuation)
- [ ] `EBAY_APP_ID` - Production App ID (ends with -PRD-)
- [ ] `EBAY_CERT_ID` - Production Certificate ID
- [ ] `EBAY_DEV_ID` - Production Developer ID
- [ ] `EBAY_CLIENT_ID` - Optional: Same as EBAY_APP_ID
- [ ] `EBAY_CLIENT_SECRET` - Optional: Same as EBAY_CERT_ID

### Third-Party Services (for Supabase Edge Functions)
- [ ] `OPENAI_API_KEY` - For OCR processing (starts with sk-)
- [ ] `SENDGRID_API_KEY` - For email notifications (starts with SG.)
- [ ] `GOOGLE_CLOUD_API_KEY` - For enhanced OCR (optional)

### Integrations
- [ ] `GITHUB_TOKEN` - For GitHub MCP (starts with ghp_)
- [ ] `SLACK_BOT_TOKEN` - For Slack notifications (starts with xoxb-)
- [ ] `SLACK_TEAM_ID` - Slack workspace ID (starts with T)

### Advanced Database
- [ ] `POSTGRES_CONNECTION_STRING` - Direct PostgreSQL access (use with caution)

---

## Pre-Deployment Checklist

### Before Setting Variables
- [ ] Production Supabase project created and configured
- [ ] Stripe production mode enabled (if using payments)
- [ ] Production domain configured and SSL active
- [ ] Netlify site created and connected to repository
- [ ] All third-party service accounts created (eBay, OpenAI, etc.)

### Security Checks
- [ ] Using LIVE/PRODUCTION keys (not test/sandbox)
- [ ] All keys are from production environments
- [ ] Keys are set with "Production" scope in Netlify
- [ ] Sensitive variables marked as "Sensitive" in Netlify
- [ ] .gitignore includes all .env* files (VERIFIED)
- [ ] No secrets committed to git repository

### Supabase Specific
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] RLS policies tested with production data
- [ ] Storage buckets created (asset-photos, receipts, appraisal-documents)
- [ ] Storage bucket policies configured
- [ ] Auth redirect URLs include production domain
- [ ] Site URL set to production domain in Supabase Auth

### Stripe Specific (if applicable)
- [ ] Stripe account in live mode
- [ ] Production webhook endpoint created: https://your-domain.com/api/stripe/webhook
- [ ] Webhook events configured (checkout.session.*, customer.subscription.*, invoice.*)
- [ ] Webhook signing secret copied to STRIPE_WEBHOOK_SECRET
- [ ] Monthly and annual products created in Stripe
- [ ] Price IDs copied to environment variables
- [ ] Test payment completed successfully (use live test card first)

---

## Post-Deployment Verification

### Immediate Checks (within 5 minutes)
- [ ] Site loads at production URL
- [ ] No console errors related to environment variables
- [ ] Supabase connection successful (check network tab)
- [ ] User can sign up
- [ ] Confirmation email received
- [ ] User can log in
- [ ] User redirected to dashboard (not localhost)

### Functionality Tests (within 30 minutes)
- [ ] Asset creation works
- [ ] Photo upload works
- [ ] Barcode scanning works
- [ ] Property/room creation works
- [ ] Stripe checkout loads (if applicable)
- [ ] Test payment succeeds (if applicable)
- [ ] Webhook events received (check Stripe dashboard)
- [ ] eBay valuation works (if enabled)
- [ ] OCR processing works (if enabled)

### SEO & Metadata (within 1 hour)
- [ ] Sitemap accessible: /sitemap.xml
- [ ] Robots.txt accessible: /robots.txt
- [ ] Meta tags use production URL (view page source)
- [ ] Social sharing preview correct (test with social debuggers)
- [ ] Structured data valid (test with Google Rich Results Test)

---

## Environment Variable Sources

Quick reference for where to get each credential:

| Variable | Source | URL |
|----------|--------|-----|
| Supabase credentials | Supabase Dashboard | https://app.supabase.com/project/_/settings/api |
| Stripe keys | Stripe Dashboard | https://dashboard.stripe.com/apikeys |
| Stripe webhook secret | Stripe Webhooks | https://dashboard.stripe.com/webhooks |
| eBay credentials | eBay Developer Portal | https://developer.ebay.com/my/keys |
| OpenAI API key | OpenAI Platform | https://platform.openai.com/api-keys |
| SendGrid API key | SendGrid Settings | https://app.sendgrid.com/settings/api_keys |
| GitHub token | GitHub Settings | https://github.com/settings/tokens |

---

## Common Mistakes to Avoid

- **Using test/sandbox keys in production**
  - Stripe: Must use pk_live_ and sk_live_ (not pk_test_ or sk_test_)
  - eBay: Must use production keys (not sandbox)

- **Mismatched URLs**
  - NEXT_PUBLIC_APP_URL must match actual domain
  - Supabase Auth Site URL must match NEXT_PUBLIC_SITE_URL

- **Missing webhook secrets**
  - Stripe webhook events will fail without STRIPE_WEBHOOK_SECRET
  - Must create webhook endpoint FIRST, then copy secret

- **Forgetting to redeploy**
  - Adding/changing env variables requires redeployment in Netlify
  - Netlify does NOT auto-redeploy on env variable changes

- **Exposing server-side secrets**
  - Never use NEXT_PUBLIC_ prefix for secret keys
  - STRIPE_SECRET_KEY, OPENAI_API_KEY should NOT have NEXT_PUBLIC_

- **Wrong variable scope**
  - Production variables should use "Production" scope
  - Using "All scopes" can expose production secrets to previews

---

## Troubleshooting

### If site doesn't load:
1. Check Netlify deploy log for build errors
2. Verify NODE_ENV is set to "production"
3. Check browser console for errors

### If Supabase connection fails:
1. Verify NEXT_PUBLIC_SUPABASE_URL is correct
2. Check NEXT_PUBLIC_SUPABASE_ANON_KEY matches project
3. Ensure Supabase project is not paused

### If authentication redirects to localhost:
1. Set NEXT_PUBLIC_SITE_URL to production domain
2. Update Supabase Auth Site URL
3. Add production domain to Supabase redirect URLs
4. Clear browser cache

### If Stripe checkout fails:
1. Confirm using pk_live_ key (not pk_test_)
2. Verify NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set
3. Check Stripe webhook endpoint is accessible
4. Test webhook with Stripe CLI

### If webhook events not received:
1. Verify webhook URL is correct and accessible
2. Check webhook secret matches STRIPE_WEBHOOK_SECRET
3. Review webhook delivery logs in Stripe dashboard
4. Ensure webhook events are configured correctly

---

## Files Reference

- **Environment Template:** `.env.production.example`
- **Detailed Setup Guide:** `PRODUCTION_ENV_SETUP.md`
- **This Checklist:** `PRODUCTION_ENV_CHECKLIST.md`
- **Deployment Guide:** `PRODUCTION_DEPLOYMENT.md`
- **Git Ignore:** `.gitignore` (includes all .env* files)

---

## Quick Deploy Command

After setting all environment variables in Netlify:

```bash
# Trigger a manual deploy
netlify deploy --prod

# Or push to main branch to trigger automatic deploy
git add .
git commit -m "Configure production environment"
git push origin main
```

---

## Support

For detailed instructions on any step, see:
- **Full Setup Guide:** `PRODUCTION_ENV_SETUP.md`
- **Netlify CLI Guide:** `NETLIFY_CLI_GUIDE.md`
- **Stripe Setup:** `STRIPE_SETUP.md`
- **Supabase Local Development:** `SUPABASE_LOCAL_GUIDE.md`

---

**Checklist Version:** 1.0.0
**Last Updated:** 2025-11-03
