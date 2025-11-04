# SnapAsset AI - Production Deployment Guide

**Generated:** 2025-11-04
**Your Supabase Project:** https://supabase.com/dashboard/project/hfiznpxdopjdwtuenxqf

---

## 🚨 SECURITY ISSUES TO FIX FIRST

### 1. Add RLS Policy for ebay_tokens Table
**Issue:** RLS is enabled but no policies exist
**Fix:** Add this SQL in Supabase SQL Editor:

```sql
-- Allow service role to manage eBay tokens
CREATE POLICY "Service role can manage eBay tokens"
ON public.ebay_tokens
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

**Link:** https://supabase.com/dashboard/project/hfiznpxdopjdwtuenxqf/editor

### 2. Enable Leaked Password Protection
**Issue:** Password breach protection is disabled
**Fix:** 
1. Go to: https://supabase.com/dashboard/project/hfiznpxdopjdwtuenxqf/auth/settings
2. Under "Password Security"
3. Enable "Password Breach Protection"

---

## 📝 STEP 1: GET STRIPE LIVE KEYS

### Switch to Live Mode
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Toggle "Test mode" OFF (top right)
3. Copy your live keys:
   - **Publishable key:** `pk_live_...`
   - **Secret key:** `sk_live_...`

### Create Production Webhook
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** `https://snapassetai.com/api/stripe/webhook`
4. **Events to listen to:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (`whsec_...`)

**Alternatively, use the automated script:**
```bash
./create-stripe-webhook.sh
```

---

## 📝 STEP 2: CONFIGURE NETLIFY ENVIRONMENT VARIABLES

### Option A: Using Netlify CLI (Recommended)
```bash
# Login to Netlify
npm run netlify:login

# Add each variable
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://hfiznpxdopjdwtuenxqf.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmaXpucHhkb3BqZHd0dWVueHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODUyNTYsImV4cCI6MjA3Mzk2MTI1Nn0.ibBtVwjDosfQo928zoUH0cLZ03U0pqBLNVyh88MZqQk"
netlify env:set NEXT_PUBLIC_APP_URL "https://snapassetai.com"
netlify env:set NEXT_PUBLIC_APP_ENV "production"

# Add your Stripe LIVE keys
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_live_YOUR_KEY"
netlify env:set STRIPE_SECRET_KEY "sk_live_YOUR_KEY"
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_YOUR_SECRET"
```

### Option B: Using Netlify Dashboard
1. Go to: https://app.netlify.com/sites/snapassetai/settings/deploys#environment
2. Click "Add a variable"
3. Add each variable from `.env.production`
4. **Important:** Select "Production" deployment context for each

### Required Environment Variables
```bash
# Supabase (already retrieved for you)
NEXT_PUBLIC_SUPABASE_URL=https://hfiznpxdopjdwtuenxqf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (you need to add your LIVE keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Config
NEXT_PUBLIC_APP_URL=https://snapassetai.com
NEXT_PUBLIC_APP_ENV=production
```

---

## 📝 STEP 3: UPDATE SUPABASE AUTH SETTINGS

### Configure Redirect URLs
1. Go to: https://supabase.com/dashboard/project/hfiznpxdopjdwtuenxqf/auth/url-configuration
2. Add these to "Redirect URLs":
   - `https://snapassetai.com`
   - `https://snapassetai.com/auth`
   - `https://snapassetai.com/auth/callback`
   - Your Netlify preview URLs (optional): `https://*.netlify.app`

### Configure Site URL
Set "Site URL" to: `https://snapassetai.com`

---

## 📝 STEP 4: TEST BUILD LOCALLY

```bash
# Test production build
npm run build

# Should output:
# ✓ Compiled successfully
# ✓ Generated all 31 pages
# ✓ No localStorage errors

# Preview production build
npm start

# Open http://localhost:3000
# Test key flows:
# - Sign in/sign up
# - Create asset
# - Navigation between pages
```

---

## 📝 STEP 5: DEPLOY TO NETLIFY

### Deploy Preview First (Recommended)
```bash
# Deploy to preview URL for testing
npm run netlify:deploy

# Netlify will output a preview URL like:
# https://673abc123-snapassetai.netlify.app

# Test thoroughly:
# ✓ Authentication works
# ✓ Assets can be created
# ✓ Photos upload properly
# ✓ Stripe checkout works (use test card: 4242 4242 4242 4242)
# ✓ All pages load correctly
# ✓ Mobile responsive
```

### Deploy to Production
**Only after preview testing passes:**

```bash
# Deploy to https://snapassetai.com
npm run netlify:deploy:prod

# Or use Git auto-deploy:
git push origin main  # Netlify will auto-deploy
```

---

## 📝 STEP 6: VERIFY PRODUCTION DEPLOYMENT

### Checklist
- [ ] Visit https://snapassetai.com
- [ ] All pages load without errors
- [ ] Sign up flow works (test with real email)
- [ ] Sign in flow works
- [ ] Magic link emails arrive
- [ ] Asset creation works
- [ ] Photo uploads work
- [ ] Stripe checkout redirects correctly
- [ ] Webhook events log in Stripe Dashboard
- [ ] Mobile view works on real device
- [ ] Check Netlify logs: `npm run netlify:logs`

### Test Payment Flow
1. Create a test purchase with Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Date: Any future date
   - CVC: Any 3 digits
2. Verify webhook event appears in Stripe Dashboard
3. **Important:** Refund the test payment immediately

---

## 🔍 MONITORING & TROUBLESHOOTING

### View Logs
```bash
# Netlify function logs
npm run netlify:logs

# Netlify build logs
netlify deploy logs

# Netlify site status
npm run netlify:status
```

### Common Issues

**Issue:** "Failed to fetch" errors
**Solution:** Check CORS settings in Supabase

**Issue:** Stripe webhook not receiving events
**Solution:** 
1. Check webhook URL is correct: `https://snapassetai.com/api/stripe/webhook`
2. Verify webhook secret matches environment variable
3. Check Netlify function logs

**Issue:** Authentication redirects fail
**Solution:** Check redirect URLs in Supabase Auth settings

**Issue:** Images not loading
**Solution:** 
1. Check storage bucket permissions
2. Verify RLS policies on asset_photos table
3. Check CORS in Supabase Storage settings

---

## 📊 YOUR PROJECT STATUS

### Database Summary
- **Tables:** 26 (all with RLS enabled ✓)
- **Users:** 6 profiles
- **Assets:** 9 assets with photos
- **Properties:** 3 properties
- **Assessment Submissions:** 1
- **Waitlist:** 1 entry

### Build Status
✅ **Production build succeeds** - All 31 routes compile
✅ **No localStorage errors** - SSR-safe implementation
✅ **Netlify config correct** - Ready for Next.js deployment
✅ **Git committed & pushed** - Latest code on GitHub

### What's Ready
✅ All critical blocking issues resolved
✅ SSR-safe localStorage utility implemented
✅ Production environment template created
✅ Supabase project populated with data
✅ Netlify configuration correct
✅ All routes building successfully

### What You Need to Do
🔴 Fix 2 security issues in Supabase (see above)
🔴 Get Stripe live mode keys
🔴 Create Stripe production webhook
🔴 Add environment variables to Netlify
🔴 Test preview deployment
🔴 Deploy to production

---

## 📞 SUPPORT LINKS

- **Supabase Dashboard:** https://supabase.com/dashboard/project/hfiznpxdopjdwtuenxqf
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Netlify Dashboard:** https://app.netlify.com/sites/snapassetai
- **GitHub Repo:** https://github.com/craigoj/homestead-snap-report
- **Netlify CLI Docs:** https://docs.netlify.com/cli/get-started/

---

## 🎯 ESTIMATED TIME TO PRODUCTION

- Fix security issues: 10 minutes
- Get Stripe keys: 15 minutes
- Configure Netlify: 15 minutes
- Test preview: 30 minutes
- Deploy production: 10 minutes
- Verify deployment: 20 minutes

**Total:** ~1.5 hours

---

**Your app is build-ready and waiting for deployment!** 🚀
