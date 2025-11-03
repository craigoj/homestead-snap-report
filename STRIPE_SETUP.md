# Stripe Payment Integration Setup Guide

## Overview

This guide will walk you through setting up Stripe payments for SnapAsset AI. The integration includes:
- ✅ Checkout session creation
- ✅ Webhook event handling
- ✅ Customer billing portal
- ✅ Subscription management
- ✅ Database integration

**Estimated Setup Time:** 30-45 minutes

---

## Prerequisites

- [ ] Stripe account created ([Sign up here](https://dashboard.stripe.com/register))
- [ ] Supabase database running
- [ ] Next.js app deployed or running locally

---

## Step 1: Create Stripe Account & Get API Keys

### 1.1 Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" and sign up
3. Complete the verification process (can skip for testing)

### 1.2 Get Your API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click "Developers" in the top right
3. Click "API keys"
4. **Copy the following keys:**
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...` - click "Reveal test key")

### 1.3 Update Environment Variables
Update your `.env` file with your actual Stripe keys:

```bash
# Replace these with your actual keys from Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_ACTUAL_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_ACTUAL_SECRET_KEY_HERE"
```

**⚠️ Important:** Never commit your secret key to version control!

---

## Step 2: Create Products and Prices

### 2.1 Create a Product
1. In Stripe Dashboard, go to **Products** → **Add product**
2. Fill in the details:
   - **Name:** SnapAsset AI Pro
   - **Description:** Premium subscription with unlimited assets
   - **Image:** (optional) Upload a product image

### 2.2 Create Monthly Price
1. Under **Pricing**, click "Add price"
2. Configure:
   - **Price:** $9.00 (or your desired amount)
   - **Billing period:** Monthly
   - **Currency:** USD
3. Click "Add price"
4. **Copy the Price ID** (starts with `price_...`)

### 2.3 Create Annual Price
1. Click "Add another price" on the same product
2. Configure:
   - **Price:** $90.00 (or your desired amount)
   - **Billing period:** Yearly
   - **Currency:** USD
3. Click "Add price"
4. **Copy the Price ID** (starts with `price_...`)

### 2.4 Update Environment Variables
Add your Price IDs to `.env`:

```bash
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY="price_YOUR_MONTHLY_PRICE_ID"
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL="price_YOUR_ANNUAL_PRICE_ID"
```

---

## Step 3: Set Up Webhooks

Webhooks allow Stripe to notify your app when events occur (e.g., payment succeeded, subscription canceled).

### 3.1 Create Webhook Endpoint

**For Local Development (using Stripe CLI):**

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe

   # Linux
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe CLI:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to localhost:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copy the webhook signing secret** (starts with `whsec_...`)

5. **Update .env:**
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"
   ```

**For Production:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click "Add endpoint"
3. **Endpoint URL:** `https://yourdomain.com/api/stripe/webhook`
4. **Select events to listen to:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Click "Reveal" under "Signing secret" and copy it
7. Update your **production** environment variables with the webhook secret

---

## Step 4: Update Database Schema

Run this SQL in your Supabase SQL Editor to add Stripe-related columns:

```sql
-- Add Stripe columns to user_profiles table
-- If user_profiles doesn't exist, create it first
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Stripe-related columns
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id
  ON user_profiles(stripe_customer_id);

-- Add RLS policies if they don't exist
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY IF NOT EXISTS "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role can insert/update (for webhook processing)
CREATE POLICY IF NOT EXISTS "Service role full access"
  ON user_profiles FOR ALL
  USING (auth.role() = 'service_role');
```

---

## Step 5: Test the Integration

### 5.1 Start Your Development Server
```bash
npm run dev:next
```

### 5.2 Test Checkout Flow

1. **Create a test pricing page** (or use an existing page):

```tsx
// Example: app/pricing/page.tsx
import { SubscriptionButton } from '@/components/SubscriptionButton'

export default function PricingPage() {
  return (
    <div className="container py-12">
      <h1>Choose Your Plan</h1>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Monthly Plan */}
        <div className="border p-6 rounded-lg">
          <h3>Monthly Plan</h3>
          <p className="text-3xl font-bold">$9/month</p>
          <SubscriptionButton
            priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!}
            label="Subscribe Monthly"
          />
        </div>

        {/* Annual Plan */}
        <div className="border p-6 rounded-lg">
          <h3>Annual Plan</h3>
          <p className="text-3xl font-bold">$90/year</p>
          <p className="text-sm text-muted-foreground">Save $18/year</p>
          <SubscriptionButton
            priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL!}
            label="Subscribe Annually"
          />
        </div>
      </div>
    </div>
  )
}
```

2. **Navigate to the pricing page**
3. **Click a subscription button**
4. **Use Stripe test card:**
   - **Card number:** `4242 4242 4242 4242`
   - **Expiry:** Any future date
   - **CVC:** Any 3 digits
   - **ZIP:** Any 5 digits

5. **Complete the checkout**
6. **Verify:**
   - You're redirected to `/dashboard?session_id=...`
   - In Supabase, check `user_profiles` table for updated Stripe fields
   - In Stripe Dashboard, check **Payments** for the test payment

### 5.3 Test Webhook Events

1. **Make sure Stripe CLI is running:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. **In another terminal, trigger a test event:**
   ```bash
   stripe trigger checkout.session.completed
   ```

3. **Check your app logs** to see the webhook was received and processed

4. **Verify in Supabase** that the `user_profiles` table was updated

### 5.4 Test Billing Portal

1. **Add ManageSubscriptionButton to your dashboard:**

```tsx
// app/dashboard/page.tsx
import { ManageSubscriptionButton } from '@/components/ManageSubscriptionButton'

// Inside your component
<ManageSubscriptionButton />
```

2. **Click the button**
3. **Verify you're redirected to Stripe's billing portal**
4. **Test updating payment method or canceling subscription**

---

## Step 6: Production Deployment Checklist

Before going live with real payments:

- [ ] Switch to **live mode** in Stripe Dashboard
- [ ] Get **live API keys** (starts with `pk_live_...` and `sk_live_...`)
- [ ] Update production environment variables with live keys
- [ ] Create **live webhook endpoint** (not using Stripe CLI)
- [ ] Test with a real credit card (use a low amount like $1)
- [ ] Set up **Stripe Radar** for fraud detection
- [ ] Configure **email notifications** in Stripe settings
- [ ] Review and accept **Stripe's Terms of Service**
- [ ] Complete **business verification** (required for payouts)

---

## Common Issues & Troubleshooting

### Issue 1: "No such price"
**Cause:** Wrong Price ID in environment variables
**Fix:** Double-check the Price ID in Stripe Dashboard → Products

### Issue 2: Webhook signature verification failed
**Cause:** Wrong webhook secret or Stripe CLI not running
**Fix:**
- For local dev: Make sure `stripe listen` is running
- For production: Verify webhook secret matches Stripe Dashboard

### Issue 3: "No customer found" when opening billing portal
**Cause:** User hasn't subscribed yet or database not updated
**Fix:** Complete a checkout first, verify webhook processed successfully

### Issue 4: Database permission errors
**Cause:** RLS policies blocking webhook updates
**Fix:** Ensure service role policy exists (see Step 4)

### Issue 5: Redirect not working after checkout
**Cause:** Wrong `NEXT_PUBLIC_SITE_URL` in environment
**Fix:** Verify the URL matches your actual domain

---

## Using the Components

### SubscriptionButton

Subscribe users to a plan:

```tsx
import { SubscriptionButton } from '@/components/SubscriptionButton'

<SubscriptionButton
  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!}
  label="Subscribe Now"
  variant="default"
  size="lg"
  className="w-full"
/>
```

### ManageSubscriptionButton

Let users manage their subscription:

```tsx
import { ManageSubscriptionButton } from '@/components/ManageSubscriptionButton'

<ManageSubscriptionButton
  variant="outline"
  showIcon={true}
/>
```

---

## Security Best Practices

1. **Never expose secret keys:**
   - Only use `NEXT_PUBLIC_` prefix for publishable keys
   - Secret keys should never be in client-side code

2. **Always verify webhook signatures:**
   - Our implementation already does this
   - Never skip signature verification

3. **Use HTTPS in production:**
   - Stripe requires HTTPS for webhooks
   - Use a service like Vercel (auto HTTPS)

4. **Implement proper error handling:**
   - Log errors but don't expose sensitive details to users
   - Monitor Stripe Dashboard for failed payments

5. **Test thoroughly:**
   - Use Stripe's test mode extensively
   - Test edge cases (card declines, subscription cancellations)

---

## Monitoring & Analytics

### Stripe Dashboard

Monitor your payments in real-time:
- **Home:** Overview of revenue and recent activity
- **Payments:** All payment transactions
- **Subscriptions:** Active and canceled subscriptions
- **Customers:** Customer list with subscription status

### Set Up Alerts

1. Go to Stripe Dashboard → **Settings** → **Notifications**
2. Enable email notifications for:
   - Failed payments
   - Successful payments
   - Subscription cancellations
   - Disputes

---

## Next Steps

Now that Stripe is integrated:

1. **Create a pricing page** (see Step 5.2 example)
2. **Add subscription checks** in your app (check `subscription_tier`)
3. **Implement feature gating** based on subscription status
4. **Set up email receipts** (configured in Stripe Dashboard)
5. **Monitor analytics** in Stripe Dashboard

---

## Support Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Stripe API Reference:** https://stripe.com/docs/api
- **Test Cards:** https://stripe.com/docs/testing

---

## Summary

You've successfully integrated Stripe payments! 🎉

**What you can now do:**
- ✅ Accept subscriptions (monthly and annual)
- ✅ Process payments securely
- ✅ Handle subscription lifecycle events
- ✅ Let customers manage their billing
- ✅ Track revenue in Stripe Dashboard

**Files created:**
- `app/api/stripe/checkout/route.ts` - Checkout session creation
- `app/api/stripe/webhook/route.ts` - Event handling
- `app/api/stripe/portal/route.ts` - Billing portal access
- `src/components/SubscriptionButton.tsx` - Subscribe UI
- `src/components/ManageSubscriptionButton.tsx` - Manage billing UI

**Database changes:**
- Added Stripe columns to `user_profiles` table
- Set up RLS policies for webhook access

---

**Need help?** Check the troubleshooting section or consult Stripe's documentation.
