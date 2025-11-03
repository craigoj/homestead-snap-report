# Production Environment Setup Guide

**Last Updated:** 2025-11-03
**Purpose:** Configure production environment variables for SnapAsset AI deployment

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start Checklist](#quick-start-checklist)
- [Netlify Configuration](#netlify-configuration)
- [Environment Variable Reference](#environment-variable-reference)
- [Credential Sources](#credential-sources)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
- [Verification](#verification)

---

## Overview

This guide walks you through setting up all required environment variables for production deployment. You'll configure these directly in your deployment platform (Netlify or Vercel) - **NEVER commit actual production values to git**.

### Critical vs. Optional Variables

**Required for Basic Functionality:**
- Supabase credentials (database, auth, storage)
- App URL configuration
- Stripe keys (if using payments)

**Optional (Enable Advanced Features):**
- eBay integration (automated asset valuation)
- OpenAI API (OCR processing)
- SendGrid (email notifications)
- GitHub/Slack integrations

---

## Prerequisites

Before you begin, ensure you have:

- [ ] Production Supabase project created and configured
- [ ] Stripe account with production mode enabled (if using payments)
- [ ] Access to your deployment platform (Netlify/Vercel)
- [ ] Production domain configured and verified
- [ ] SSL certificate active on production domain

---

## Quick Start Checklist

### Phase 1: Core Configuration (Required)

- [ ] **Step 1:** Set up Supabase environment variables
- [ ] **Step 2:** Configure application URLs
- [ ] **Step 3:** Set up Stripe payment integration
- [ ] **Step 4:** Verify core functionality

### Phase 2: Advanced Features (Optional)

- [ ] **Step 5:** Configure eBay integration
- [ ] **Step 6:** Set up third-party services (OpenAI, SendGrid)
- [ ] **Step 7:** Configure integrations (GitHub, Slack)

### Phase 3: Security & Testing

- [ ] **Step 8:** Review security settings
- [ ] **Step 9:** Test all integrations
- [ ] **Step 10:** Set up monitoring and alerts

---

## Netlify Configuration

### Accessing Environment Variables

1. **Navigate to Site Settings:**
   ```
   Netlify Dashboard → Your Site → Site settings → Environment variables
   ```

2. **Click "Add a variable" or "Import from a .env file"**

3. **Set variable scope:**
   - Choose "Production" for production-only values
   - Choose "All scopes" for shared values (use with caution)

### Adding Variables in Netlify UI

For each environment variable below:

1. Click **"Add a variable"**
2. Enter **Key** (exact name from `.env.production.example`)
3. Enter **Value** (your actual credential)
4. Select **Scope**: "Production" (recommended)
5. Click **"Create variable"**

### Bulk Import (Alternative Method)

1. Copy all variables from `.env.production.example`
2. Replace placeholder values with actual credentials
3. Click **"Import from a .env file"**
4. Paste your configured variables
5. Select scope: "Production"
6. Click **"Import variables"**

**⚠️ WARNING:** Delete the temporary file with actual values immediately after import!

---

## Environment Variable Reference

### 1. Supabase Configuration (REQUIRED)

#### NEXT_PUBLIC_SUPABASE_URL
- **Purpose:** Your production Supabase project URL
- **Format:** `https://your-project-id.supabase.co`
- **Where to get it:**
  1. Go to [Supabase Dashboard](https://app.supabase.com)
  2. Select your PRODUCTION project
  3. Navigate to: Settings → API
  4. Copy "Project URL"
- **Example:** `https://hfiznpxdopjdwtuenxqf.supabase.co`
- **Netlify scope:** Production

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Purpose:** Public API key for client-side Supabase access
- **Format:** Long JWT token starting with `eyJ...`
- **Where to get it:**
  1. Same location as URL above (Settings → API)
  2. Copy "anon public" key under "Project API keys"
- **Security:** Safe to expose (protected by Row Level Security)
- **Netlify scope:** Production

#### Legacy Variable Names (for compatibility)
Also set these with the SAME values as above:
- `VITE_SUPABASE_URL` = Same as `NEXT_PUBLIC_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = Same as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PROJECT_ID` = Extract from URL (e.g., `hfiznpxdopjdwtuenxqf`)

---

### 2. Application URLs (REQUIRED)

#### NEXT_PUBLIC_APP_URL
- **Purpose:** Canonical production URL for SEO and metadata
- **Format:** `https://your-domain.com` (no trailing slash)
- **Example:** `https://snapassetai.com`
- **Used in:** Sitemaps, robots.txt, social sharing metadata
- **Netlify scope:** Production

#### NEXT_PUBLIC_SITE_URL
- **Purpose:** Base URL for authentication redirects
- **Format:** `https://your-domain.com` (no trailing slash)
- **Example:** `https://snapassetai.com`
- **Must match:** Supabase Auth → URL Configuration → Site URL
- **Netlify scope:** Production

#### NEXT_PUBLIC_APP_ENV
- **Purpose:** Environment identifier
- **Value:** `production`
- **Used in:** Analytics, error tracking, feature flags
- **Netlify scope:** Production

#### NODE_ENV
- **Purpose:** Node.js environment mode
- **Value:** `production`
- **Note:** Usually set automatically by Netlify, but set explicitly to be safe
- **Netlify scope:** Production

---

### 3. Stripe Payment Integration (REQUIRED if using payments)

#### Getting Stripe Production Keys

1. **Log in to Stripe Dashboard:** https://dashboard.stripe.com
2. **Switch to Production Mode:**
   - Toggle in top-left: "Test mode" → OFF (switch to Live mode)
3. **Navigate to:** Developers → API keys

#### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **Purpose:** Public key for client-side Stripe.js
- **Format:** Starts with `pk_live_...`
- **Where to get it:** Stripe Dashboard → Developers → API keys → Publishable key
- **⚠️ CRITICAL:** Must use `pk_live_` (NOT `pk_test_`) for production
- **Security:** Safe to expose (public key)
- **Netlify scope:** Production

#### STRIPE_SECRET_KEY
- **Purpose:** Private key for server-side Stripe API calls
- **Format:** Starts with `sk_live_...`
- **Where to get it:** Stripe Dashboard → Developers → API keys → Secret key → Reveal
- **⚠️ CRITICAL:**
  - Must use `sk_live_` (NOT `sk_test_`) for production
  - NEVER expose to client-side code
  - Copy immediately and store securely
- **Netlify scope:** Production (server-side only)

#### STRIPE_WEBHOOK_SECRET
- **Purpose:** Verify webhook signatures from Stripe
- **Format:** Starts with `whsec_...`
- **Where to get it:**
  1. Stripe Dashboard → Developers → Webhooks
  2. Click **"Add endpoint"**
  3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
  4. Events to send: Select all `checkout.session.*`, `customer.subscription.*`, `invoice.*`
  5. Click **"Add endpoint"**
  6. Click on the created endpoint
  7. Click **"Reveal"** under "Signing secret"
  8. Copy the `whsec_...` value
- **Netlify scope:** Production

#### Stripe Product/Price IDs

**Create Products in Stripe:**

1. Stripe Dashboard → Products → **"Add Product"**
2. Create two products:
   - **Monthly Subscription:** (e.g., $9.99/month)
   - **Annual Subscription:** (e.g., $99/year)
3. For each product, copy the **Price ID** (starts with `price_...`)

#### NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
- **Value:** `price_xxxxx` (from monthly product)
- **Netlify scope:** Production

#### NEXT_PUBLIC_STRIPE_PRICE_ANNUAL
- **Value:** `price_xxxxx` (from annual product)
- **Netlify scope:** Production

---

### 4. eBay Integration (OPTIONAL - for automated asset valuation)

#### Getting eBay Production Credentials

1. **Create eBay Developer Account:** https://developer.ebay.com
2. **Create Production Keys:**
   - Navigate to: My Account → Application Keys
   - Click **"Create a Keyset"** → Production
3. **Generate keys and copy immediately**

#### EBAY_APP_ID
- **Purpose:** Application ID for eBay API calls
- **Format:** Long alphanumeric string ending in `-PRD-...`
- **Where to get it:** eBay Developers → Application Keys → Production Keyset
- **Netlify scope:** Production

#### EBAY_CERT_ID
- **Purpose:** Certificate ID for secure authentication
- **Format:** Long alphanumeric string
- **Where to get it:** Same location as App ID
- **Security:** Keep confidential
- **Netlify scope:** Production

#### EBAY_DEV_ID
- **Purpose:** Developer ID for your eBay account
- **Format:** Long alphanumeric string
- **Where to get it:** Same location as App ID
- **Netlify scope:** Production

#### Optional OAuth Credentials

If using eBay OAuth flow (recommended for better rate limits):

#### EBAY_CLIENT_ID
- **Value:** Same as `EBAY_APP_ID`
- **Netlify scope:** Production

#### EBAY_CLIENT_SECRET
- **Value:** Same as `EBAY_CERT_ID`
- **Netlify scope:** Production

---

### 5. Third-Party Services (OPTIONAL - used in Supabase Edge Functions)

#### OpenAI API (for OCR processing)

#### OPENAI_API_KEY
- **Purpose:** OCR text extraction from asset photos
- **Format:** Starts with `sk-...`
- **Where to get it:**
  1. https://platform.openai.com/api-keys
  2. Click **"Create new secret key"**
  3. Name: "SnapAsset Production OCR"
  4. Permissions: "All" or "Read & Write"
  5. Copy immediately (shown only once)
- **Rate limits:** Set up billing limits in OpenAI dashboard
- **Netlify scope:** Production

#### SendGrid (for email notifications)

#### SENDGRID_API_KEY
- **Purpose:** Send transactional emails (notifications, reports)
- **Format:** Starts with `SG.`
- **Where to get it:**
  1. https://app.sendgrid.com/settings/api_keys
  2. Click **"Create API Key"**
  3. Name: "SnapAsset Production"
  4. Permissions: "Full Access" or "Mail Send" only
  5. Click **"Create & View"**
  6. Copy immediately (shown only once)
- **Setup required:** Verify sender email/domain in SendGrid
- **Netlify scope:** Production

#### Google Cloud (for enhanced OCR - optional)

#### GOOGLE_CLOUD_API_KEY
- **Purpose:** Enhanced OCR using Google Vision API
- **Format:** Long alphanumeric string
- **Where to get it:**
  1. https://console.cloud.google.com/apis/credentials
  2. Create new project or select existing
  3. Enable "Cloud Vision API"
  4. Create credentials → API key
  5. Restrict key to Vision API only
- **Netlify scope:** Production

---

### 6. Database (OPTIONAL - for advanced features)

#### POSTGRES_CONNECTION_STRING
- **Purpose:** Direct PostgreSQL access for advanced queries
- **Format:** `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`
- **Where to get it:**
  1. Supabase Dashboard → Project Settings → Database
  2. Connection string → URI
  3. Copy and replace `[YOUR-PASSWORD]` with actual database password
- **⚠️ SECURITY:** Grants direct database access - protect carefully!
- **Netlify scope:** Production

---

### 7. Integrations (OPTIONAL)

#### GitHub Personal Access Token

#### GITHUB_TOKEN
- **Purpose:** GitHub MCP integration for repository access
- **Format:** Starts with `ghp_...`
- **Where to get it:**
  1. https://github.com/settings/tokens
  2. Click **"Generate new token"** → "Classic"
  3. Scopes: Select `repo`, `workflow`, `read:org`
  4. Expiration: Choose appropriate duration
  5. Click **"Generate token"**
  6. Copy immediately (shown only once)
- **Netlify scope:** Production

#### Slack Integration

#### SLACK_BOT_TOKEN
- **Purpose:** Send notifications to Slack workspace
- **Format:** Starts with `xoxb-...`
- **Where to get it:**
  1. https://api.slack.com/apps
  2. Create new app or select existing
  3. OAuth & Permissions → Bot User OAuth Token
- **Netlify scope:** Production

#### SLACK_TEAM_ID
- **Purpose:** Your Slack workspace ID
- **Format:** Starts with `T` (e.g., `T01234ABCDE`)
- **Where to get it:** Slack app settings → Basic Information → Team ID
- **Netlify scope:** Production

---

## Credential Sources

### Quick Reference Table

| Service | Dashboard URL | Required For |
|---------|--------------|--------------|
| Supabase | https://app.supabase.com | Core functionality |
| Stripe | https://dashboard.stripe.com | Payments |
| eBay | https://developer.ebay.com | Asset valuation |
| OpenAI | https://platform.openai.com | OCR processing |
| SendGrid | https://app.sendgrid.com | Email notifications |
| Google Cloud | https://console.cloud.google.com | Enhanced OCR |
| GitHub | https://github.com/settings/tokens | GitHub integration |
| Slack | https://api.slack.com/apps | Slack notifications |

---

## Security Best Practices

### 1. Key Management

- **Never commit secrets to git** - Use `.gitignore` (already configured)
- **Use different keys for each environment** - Don't reuse dev keys in production
- **Rotate keys regularly** - Especially after team member changes
- **Limit key permissions** - Use principle of least privilege
- **Monitor key usage** - Set up alerts for unusual activity

### 2. Netlify-Specific Security

```
✅ DO:
- Use "Production" scope for production-only variables
- Use "Sensitive variable" option for secrets
- Review access logs regularly
- Enable deploy previews with separate environment variables
- Use branch-specific variables for staging

❌ DON'T:
- Use "All scopes" for sensitive credentials
- Share production credentials in team chat
- Include secrets in deploy logs
- Commit .env.production to git
- Use test/sandbox keys in production
```

### 3. Supabase Security

1. **Row Level Security (RLS):**
   - Verify RLS is enabled on all tables
   - Test policies with production data
   - Never disable RLS in production

2. **API Keys:**
   - Use `anon` key for client-side (public)
   - Use `service_role` key ONLY server-side (if needed)
   - Never expose `service_role` key to client

3. **Database:**
   - Use strong database password
   - Restrict PostgreSQL connection to specific IPs (if possible)
   - Enable audit logging

### 4. Stripe Security

1. **Webhook Security:**
   - Always verify webhook signatures
   - Use HTTPS-only endpoints
   - Monitor webhook logs for failures

2. **Key Protection:**
   - Never log full secret keys
   - Use restricted API keys when possible
   - Enable Stripe's radar for fraud detection

3. **Testing:**
   - Use Stripe test mode for all non-production testing
   - Never use production keys in development

### 5. Environment Variable Naming

```
✅ Safe to expose (NEXT_PUBLIC_ prefix):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_APP_ENV

❌ NEVER expose to client (no NEXT_PUBLIC_ prefix):
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- OPENAI_API_KEY
- SENDGRID_API_KEY
- POSTGRES_CONNECTION_STRING
- EBAY_CERT_ID
```

---

## Troubleshooting

### Common Issues

#### 1. Supabase Connection Errors

**Error:** "Failed to connect to Supabase"

**Solutions:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct (check for typos)
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches project
- Check Supabase project is not paused (free tier limitation)
- Verify CORS settings in Supabase allow your domain

#### 2. Stripe Checkout Failures

**Error:** "Stripe is not defined" or "Invalid API key"

**Solutions:**
- Confirm you're using `pk_live_` (not `pk_test_`) for production
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Check Stripe webhook endpoint is accessible (test with `curl`)
- Ensure webhook secret matches (`STRIPE_WEBHOOK_SECRET`)

#### 3. Authentication Redirect Issues

**Error:** Users redirected to localhost after login

**Solutions:**
- Set `NEXT_PUBLIC_SITE_URL` to production domain
- Update Supabase Auth → URL Configuration → Site URL
- Add production domain to Supabase Auth → Redirect URLs
- Clear browser cache and test in incognito mode

#### 4. Missing Environment Variables

**Error:** "process.env.XXX is undefined"

**Solutions:**
- Verify variable is set in Netlify (correct spelling)
- Check variable scope is "Production" or "All scopes"
- Redeploy site after adding variables (Netlify doesn't auto-redeploy)
- Check build logs for environment variable errors

#### 5. eBay Integration Not Working

**Error:** "eBay API authentication failed"

**Solutions:**
- Ensure using PRODUCTION eBay keys (not sandbox)
- Verify all three eBay variables are set (APP_ID, CERT_ID, DEV_ID)
- Check eBay developer account is approved for production
- Monitor eBay API rate limits

### Debugging Steps

1. **Check Netlify Deploy Log:**
   ```
   Netlify Dashboard → Deploys → Latest deploy → Deploy log
   ```
   Look for environment variable warnings

2. **Verify Variables are Set:**
   ```
   Netlify Dashboard → Site settings → Environment variables
   ```
   Confirm all required variables exist with values

3. **Test in Netlify Deploy Preview:**
   - Create a test branch
   - Set up deploy preview with production-like variables
   - Test functionality before promoting to production

4. **Use Netlify Functions Logs:**
   ```
   Netlify Dashboard → Functions → Select function → Logs
   ```
   Debug server-side issues

5. **Browser Console:**
   - Open DevTools → Console
   - Look for `NEXT_PUBLIC_` variable errors
   - Check Network tab for API failures

---

## Verification

### Post-Deployment Checklist

After setting all environment variables and deploying:

#### Core Functionality
- [ ] Site loads at production URL
- [ ] User can sign up with email
- [ ] User receives confirmation email
- [ ] User can log in
- [ ] User redirected to dashboard (not localhost)
- [ ] Assets can be created
- [ ] Photos can be uploaded
- [ ] Supabase Storage accessible

#### Stripe Integration (if applicable)
- [ ] Stripe checkout button renders
- [ ] Clicking checkout redirects to Stripe (live mode)
- [ ] Test payment succeeds (use test card in test mode first!)
- [ ] Webhook receives events (check Stripe webhook logs)
- [ ] Subscription created in database
- [ ] User redirected back to app after payment

#### eBay Integration (if enabled)
- [ ] Asset valuation triggers eBay search
- [ ] eBay data returns successfully
- [ ] Estimated values populate on assets
- [ ] No eBay API errors in logs

#### Email & Notifications (if enabled)
- [ ] Email notifications send via SendGrid
- [ ] OpenAI OCR processes uploaded images
- [ ] Google Cloud Vision OCR works (if configured)
- [ ] Slack notifications send (if configured)

#### SEO & Metadata
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Meta tags use production URL (not localhost)
- [ ] Social sharing shows correct previews

### Testing Tools

**Test Stripe Integration:**
```bash
# Test webhook endpoint (should return 405 Method Not Allowed for GET)
curl https://your-domain.com/api/stripe/webhook

# Check Stripe webhook delivery
# Stripe Dashboard → Developers → Webhooks → Your endpoint → Recent deliveries
```

**Test Supabase Connection:**
```javascript
// Browser console
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL)
```

**Monitor Errors:**
- Netlify Functions logs
- Supabase Dashboard → Logs
- Stripe Dashboard → Developers → Events
- Browser DevTools → Console

---

## Additional Resources

### Documentation
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stripe Production Checklist](https://stripe.com/docs/keys#production-test-modes)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)

### Support Contacts
- **Netlify Support:** https://www.netlify.com/support/
- **Supabase Support:** https://supabase.com/dashboard/support
- **Stripe Support:** https://support.stripe.com

### Project-Specific
- **Main Documentation:** `.claude/CLAUDE.md`
- **Environment Example:** `.env.production.example`
- **Deployment Guide:** `PRODUCTION_DEPLOYMENT.md`
- **Migration Plan:** `NEXTJS_FULL_MIGRATION_PLAN.md`

---

## Maintenance

### Regular Tasks

**Monthly:**
- [ ] Review API usage in all service dashboards
- [ ] Check for unused environment variables
- [ ] Verify webhook endpoints are healthy
- [ ] Review Supabase database backups

**Quarterly:**
- [ ] Rotate API keys (especially after team changes)
- [ ] Update expired GitHub tokens
- [ ] Review and update Rate limits
- [ ] Test disaster recovery procedures

**Annually:**
- [ ] Audit all third-party service subscriptions
- [ ] Review and optimize API costs
- [ ] Update this documentation with any changes
- [ ] Security audit of all credentials

---

## Summary

This guide covered:
- ✅ Setting up Netlify environment variables
- ✅ Configuring Supabase for production
- ✅ Setting up Stripe payments
- ✅ Configuring optional integrations (eBay, OpenAI, SendGrid)
- ✅ Security best practices
- ✅ Troubleshooting common issues
- ✅ Post-deployment verification

**Next Steps:**
1. Work through the [Quick Start Checklist](#quick-start-checklist)
2. Set required variables in Netlify
3. Deploy to production
4. Complete [Verification](#verification) checklist
5. Set up monitoring and alerts

**Questions or Issues?**
- Check [Troubleshooting](#troubleshooting) section
- Review Netlify deploy logs
- Consult service-specific documentation

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-03
**Maintained By:** SnapAsset AI Development Team
