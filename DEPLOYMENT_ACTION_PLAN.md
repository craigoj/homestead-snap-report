# SnapAsset AI - Production Deployment Action Plan

**Status:** Ready for Production Deployment
**Last Updated:** November 3, 2025
**Estimated Time:** 2-3 hours (depends on credential gathering)

---

## 🎯 Executive Summary

Your SnapAsset AI application is **95% production-ready**. All code fixes are complete and committed to GitHub. To deploy to production at https://snapassetai.com, you need to:

1. **Gather production credentials** (Supabase, Stripe) - 45 minutes
2. **Configure environment variables in Netlify** - 30 minutes
3. **Deploy to production** - 10 minutes
4. **Verify deployment** - 30 minutes

**Total time: 2-3 hours** (mostly waiting for Supabase/Stripe to provision)

---

## ✅ Current Status

### What's Already Done ✅
- [x] All code migrated from React Router to Next.js 14
- [x] All authentication flows working (signup, signin, magic link, logout)
- [x] Build system configured for production
- [x] Netlify configuration updated for Next.js
- [x] All SSR issues fixed
- [x] Supabase integration working
- [x] Stripe integration ready
- [x] TypeScript compilation passing
- [x] All changes committed and pushed to GitHub
- [x] Production documentation created

### What You Need to Do ❌
- [ ] Create Supabase production project
- [ ] Create/enable Stripe production mode
- [ ] Gather production credentials
- [ ] Configure environment variables in Netlify
- [ ] Deploy to production
- [ ] Run post-deployment verification tests

---

## 📋 Phase 1: Gather Production Credentials (45 minutes)

### Step 1.1: Create Supabase Production Project

**Why:** You need a separate production database with your production data/schema.

**Instructions:**
1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name:** SnapAsset AI Production
   - **Database Password:** Create a secure password (save this!)
   - **Region:** Choose the region closest to your users
   - **Pricing Plan:** Choose based on expected usage
4. Click "Create new project"
5. Wait for database to initialize (5-10 minutes)

**Get Your Credentials:**
1. Once created, go to **Settings → API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Save these somewhere safe!** You'll need them in Phase 2.

---

### Step 1.2: Stripe Production Setup

**Why:** Stripe has separate keys for test (sandbox) and production (live). You must use LIVE keys in production.

**⚠️ CRITICAL WARNING:**
- **Test Keys:** pk_test_, sk_test_ (for development only)
- **Live Keys:** pk_live_, sk_live_ (for production only)
- **Using wrong keys = payments won't work and will confuse customers**

**Instructions:**

1. **Enable Live Mode:**
   - Go to https://dashboard.stripe.com/
   - Look for "View test data" toggle in top left
   - Make sure it's toggled OFF (showing "Live data")

2. **Get Live Keys:**
   - Go to **Developers → API Keys**
   - Under "Standard keys" section, copy:
     - **Publishable key** (starts with pk_live_) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - **Secret key** (starts with sk_live_) → `STRIPE_SECRET_KEY`

3. **Create Webhook Endpoint:**
   - Go to **Developers → Webhooks**
   - Click "Add an endpoint"
   - **Endpoint URL:** `https://snapassetai.com/api/stripe/webhook` (replace with your actual domain!)
   - **Events to listen for:** Select:
     - checkout.session.completed
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.payment_succeeded
     - invoice.payment_failed
   - Click "Create endpoint"
   - Copy the **Signing secret** (starts with whsec_) → `STRIPE_WEBHOOK_SECRET`

4. **Create Products & Prices (if not already done):**
   - Go to **Products**
   - Create two products if they don't exist:
     - **SnapAsset Pro Monthly** - Monthly subscription
     - **SnapAsset Pro Annual** - Annual subscription
   - For each product, create a price and copy the price ID:
     - Monthly Price ID → `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`
     - Annual Price ID → `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL`

**Save all Stripe values!** You'll need them in Phase 2.

---

### Step 1.3: Application URLs

You already have these, but verify:
- **Domain:** https://snapassetai.com
- **App URL:** https://snapassetai.com
- **Site URL:** https://snapassetai.com

---

## 📝 Phase 2: Configure Environment Variables in Netlify (30 minutes)

### Step 2.1: Access Netlify Environment Variables

1. Go to https://app.netlify.com/sites/snapassetai/settings/deploys#environment
2. Scroll to **Environment variables** section
3. You'll see variables can be scoped to different contexts:
   - **Production** - Only for production deployments
   - **Preview** - For preview/PR deployments
   - **Development** - For local dev environment
   - **All scopes** - For all contexts (use with caution!)

### Step 2.2: Add Required Variables

**IMPORTANT:** Use "Production" scope for all production variables. This prevents them from leaking to preview deployments.

For each variable below:
1. Click **"Add variable"**
2. Enter the **Key** (exact name shown below)
3. Enter the **Value** (from your credentials gathered in Phase 1)
4. Select **Scope: Production**
5. Click **"Create variable"**

Repeat for all variables below:

#### Critical Variables (Must Have)

| Key | Value | Where to Get |
|-----|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase Settings → API |
| `NEXT_PUBLIC_APP_URL` | https://snapassetai.com | Your production domain |
| `NEXT_PUBLIC_SITE_URL` | https://snapassetai.com | Your production domain |
| `NEXT_PUBLIC_APP_ENV` | production | Literal value "production" |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_live_xxxx... | Stripe Developers → API Keys |
| `STRIPE_SECRET_KEY` | sk_live_xxxx... | Stripe Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | whsec_xxxx... | Stripe Developers → Webhooks |

#### Optional Variables (Only if you're using these features)

| Key | Value | Where to Get |
|-----|-------|--------------|
| `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` | price_xxxx... | Stripe Products → Your monthly price |
| `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL` | price_xxxx... | Stripe Products → Your annual price |
| `EBAY_APP_ID` | Your eBay production ID | eBay Developer Center |
| `EBAY_CERT_ID` | Your eBay production cert | eBay Developer Center |
| `EBAY_DEV_ID` | Your eBay dev ID | eBay Developer Center |
| `OPENAI_API_KEY` | sk-... | OpenAI Platform |

### Step 2.3: Verify All Variables Are Set

1. Reload the page to confirm all variables appear in the list
2. Check that all "Critical Variables" from the table above are present
3. Verify each variable has "Production" scope

**Example screenshot of what this should look like:**
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co          (Scope: Production)
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxxx...                    (Scope: Production)
NEXT_PUBLIC_APP_URL = https://snapassetai.com                 (Scope: Production)
NEXT_PUBLIC_SITE_URL = https://snapassetai.com                (Scope: Production)
... and so on
```

---

## 🚀 Phase 3: Deploy to Production (10 minutes)

### Option A: Deploy via Netlify Dashboard (Easiest)

1. Go to https://app.netlify.com/sites/snapassetai
2. Go to **Deploys** tab
3. Click the **Deploy site** button
4. Watch the build logs for any errors
5. Once complete, you'll get a deployment summary

### Option B: Deploy via Git Push (Automatic)

1. Make a small change to trigger deployment, or manually trigger via dashboard
2. Netlify will automatically build and deploy any push to `main` branch
3. Check **Deploys** tab to watch progress

### Option C: Deploy via Netlify CLI (Advanced)

```bash
# Make sure you're logged in
netlify login

# Deploy to production
netlify deploy --prod
```

---

## ✅ Phase 4: Post-Deployment Verification (30 minutes)

### Immediate Checks (5 minutes)

Run these checks right after deployment completes:

- [ ] Site loads at https://snapassetai.com
- [ ] No error page or "failed to connect" message
- [ ] Open browser DevTools → Console tab
- [ ] No red error messages about environment variables or Supabase
- [ ] Page source contains `snapassetai.com` (not localhost)

### Authentication Tests (10 minutes)

Test that users can sign up and log in:

1. **Sign Up:**
   - Go to https://snapassetai.com/auth
   - Click "Sign Up" tab
   - Enter a real email address (not demo@example.com)
   - Create a password
   - Click "Create Account"
   - Check your email for confirmation link
   - Click the confirmation link
   - Should redirect back to auth page showing "Email confirmed"

2. **Sign In:**
   - Enter your new email and password
   - Click "Sign In"
   - Should redirect to /dashboard
   - Dashboard should load without errors

3. **Check User Data:**
   - In Supabase dashboard, go to **Database → auth.users**
   - Verify your test user appears in the list

### Feature Tests (10 minutes)

- [ ] **Dashboard loads** - No errors, can see empty state
- [ ] **Create Asset** - Can create a new asset with name and category
- [ ] **Add Property** - Can create a property
- [ ] **Add Room** - Can create a room in a property
- [ ] **Photo Upload** - Can upload a photo to an asset
- [ ] **Stripe Checkout** (if applicable) - Can click subscribe button and proceed to Stripe
- [ ] **Mobile Responsive** - Open on mobile, navigation and forms work

### Supabase Health Checks (5 minutes)

1. Go to https://app.supabase.com/project/_/
2. Check **Database → Tables** - All tables show
3. Check **Authentication → Users** - Your test user appears
4. Check **Storage** - asset-photos bucket exists and is accessible
5. Check for any warnings/alerts on the dashboard

### Stripe Webhook Verification (5 minutes)

1. Go to https://dashboard.stripe.com/webhooks
2. Click your webhook endpoint for production
3. Check **Recent events** section
4. Should show delivery attempts (even if failed, that's normal)

---

## 🔍 Troubleshooting Common Issues

### Issue: Site Shows "Failed to Build"

**Cause:** Build failed in Netlify
**Solution:**
1. Go to **Deploys** tab in Netlify
2. Click on the failed deploy
3. Scroll down to see build log
4. Look for error messages starting with ❌
5. Common issues:
   - Missing environment variable (check Phase 2)
   - TypeScript error in code
   - Git conflict

**Fix:** Most common is missing env var - verify all variables from Phase 2 are set.

---

### Issue: "Supabase connection failed" or "Cannot find Supabase"

**Cause:** `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing or wrong
**Solution:**
1. Go to Netlify settings → Environment variables
2. Verify both Supabase variables exist
3. Copy the exact URL and key from https://app.supabase.com/project/_/settings/api
4. Redeploy (click "Deploy site" button again)

---

### Issue: Sign In Works, But Redirects to Localhost

**Cause:** Supabase auth is redirecting to localhost instead of production domain
**Solution:**
1. Go to https://app.supabase.com/project/_/auth/url-configuration
2. Under **Site URL**, set it to `https://snapassetai.com`
3. Under **Redirect URLs**, add:
   - `https://snapassetai.com/auth`
   - `https://snapassetai.com/auth/callback`
   - `https://snapassetai.com/`
4. Save changes
5. Clear browser cache and try again

---

### Issue: Stripe Checkout Fails or Button Doesn't Work

**Cause:** Missing or incorrect Stripe key
**Solution:**
1. Verify you're using **LIVE keys** (pk_live_, sk_live_) not test keys
2. Check Netlify environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` should start with `pk_live_`
   - `STRIPE_SECRET_KEY` should start with `sk_live_`
3. If using test card (4242...), switch to live test card: **4000002500003155**
4. If still failing, check **Netlify build log** for Stripe-related errors
5. Redeploy after fixing

---

### Issue: "Error 403 - Access Denied" When Uploading Photos

**Cause:** Supabase storage bucket permissions not configured
**Solution:**
1. Go to https://app.supabase.com/project/_/storage/buckets
2. Click on **asset-photos** bucket
3. Go to **Policies** tab
4. Ensure policies allow authenticated users to upload
5. If no policies, you may need to add them in SQL:
   ```sql
   CREATE POLICY "Allow authenticated users to upload" ON storage.objects
     FOR INSERT TO authenticated
     WITH CHECK (bucket_id = 'asset-photos');
   ```

---

### Issue: Emails Not Sending (Confirmation, Password Reset)

**Cause:** Supabase email templates not configured or SMTP not set up
**Solution:**
1. Go to https://app.supabase.com/project/_/auth/templates
2. Review email templates
3. For production, configure SMTP:
   - Go to **Project Settings → Email**
   - Choose "SMTP" instead of default
   - Enter your email service credentials (SendGrid, Mailgun, etc.)
4. Send yourself a test email to verify

---

## 📊 Success Criteria

Your deployment is **successful** when:

✅ Site loads at production URL
✅ No console errors related to configuration
✅ Users can sign up and receive confirmation emails
✅ Users can log in and access dashboard
✅ Can create assets and upload photos
✅ Stripe checkout loads (if using payments)
✅ No warnings in Netlify deploy logs

---

## 📞 Support Resources

If you get stuck, these resources will help:

**SnapAsset AI Guides:**
- `PRODUCTION_ENV_SETUP.md` - Detailed environment variable guide
- `PRODUCTION_ENV_CHECKLIST.md` - Complete checklist of all variables
- `PRODUCTION_DEPLOYMENT.md` - Detailed deployment guide
- `NETLIFY_CLI_GUIDE.md` - Using Netlify CLI for advanced deployments
- `STRIPE_SETUP.md` - Complete Stripe integration guide
- `SUPABASE_LOCAL_GUIDE.md` - Supabase setup and troubleshooting

**External Documentation:**
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Next.js Docs](https://nextjs.org/docs)

---

## 🎉 After Successful Deployment

Once your site is live and verified:

1. **Tell everyone!** Share https://snapassetai.com with early users
2. **Monitor performance:**
   - Check Netlify Analytics (https://app.netlify.com/sites/snapassetai/analytics)
   - Monitor Stripe dashboard for payments
   - Watch Supabase dashboard for database usage
3. **Watch for errors:**
   - Netlify deploy logs
   - Browser console errors (check daily)
   - Stripe webhook delivery logs
4. **Plan next features:**
   - SEO optimization (add page metadata)
   - Advanced features (eBay integration, OCR)
   - Marketing automation

---

## ⏱️ Timeline Summary

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Gather credentials | 45 min | Pending |
| 2 | Configure Netlify env vars | 30 min | Pending |
| 3 | Deploy to production | 10 min | Pending |
| 4 | Verify deployment | 30 min | Pending |
| **TOTAL** | **Production Launch** | **2-3 hours** | **Ready to Start** |

---

## 🎯 Next Steps

**To get your site live, follow this sequence:**

1. **Right now:** Gather Supabase and Stripe production credentials (Phase 1)
2. **While waiting:** Set up environment variables in Netlify (Phase 2)
3. **After env vars set:** Deploy to production (Phase 3)
4. **Immediately after deploy:** Run verification tests (Phase 4)
5. **When all tests pass:** Your site is live! 🚀

---

**Last Updated:** November 3, 2025
**Version:** 1.0.0
**Status:** Production Ready

Questions? Check the support resources above or review the detailed guides in the project root.
