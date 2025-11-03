# Stripe CLI - Local Development Guide

## Overview
The Stripe CLI is now installed and ready to use via Docker! This enables you to test payments, webhooks, and Stripe integrations locally without affecting your production data.

---

## Installation

✅ **Stripe CLI v1.32.0** - Installed via Docker
✅ **Wrapper Script** - Created at `~/bin/stripe` for easy access
✅ **npm Scripts** - Added to package.json for common operations

---

## Getting Started

### 1. Authenticate with Your Stripe Account

**First time setup:**
```bash
npm run stripe:login
```
Or:
```bash
~/bin/stripe login
```

This will:
1. Open your browser
2. Ask you to log in to Stripe
3. Connect the CLI to your Stripe account
4. Store your credentials in `~/.config/stripe`

**Choose the right account:**
- **Test Mode** (recommended for local dev)
- **Live Mode** (only if testing production)

---

## Webhook Testing (Most Important!)

### Start Webhook Forwarding

Stripe webhooks need to reach your local dev server. The CLI creates a secure tunnel:

```bash
npm run stripe:listen
```

Or:
```bash
~/bin/stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**What this does:**
1. Creates a tunnel from Stripe → your local server
2. Forwards all webhook events to `http://localhost:3000/api/stripe/webhook`
3. Provides a webhook signing secret (save this!)

**Example output:**
```
Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Important:** Copy the `whsec_...` secret and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Keep It Running

The `stripe listen` command must stay running while you develop:
```bash
# Terminal 1: Stripe webhook listener
npm run stripe:listen

# Terminal 2: Your Next.js app
npm run dev:next

# Terminal 3: Supabase (if using)
npm run supabase:start
```

---

## Testing Webhooks

### Trigger Test Events

Simulate Stripe events locally:

```bash
# Trigger a successful payment
npm run stripe:trigger payment_intent.succeeded

# Trigger a checkout session completion
~/bin/stripe trigger checkout.session.completed

# Trigger a subscription creation
~/bin/stripe trigger customer.subscription.created

# See all available events
~/bin/stripe trigger --help
```

### Watch Webhook Activity

In your webhook listener terminal, you'll see events in real-time:
```
2025-11-03 11:00:00  --> payment_intent.succeeded [evt_xxxxx]
2025-11-03 11:00:01  <-- [200] POST http://localhost:3000/api/stripe/webhook
```

---

## Common Stripe CLI Commands

### Viewing Data

```bash
# List products
npm run stripe:products

# List customers
npm run stripe:customers

# List payment intents
~/bin/stripe payment_intents list

# List subscriptions
~/bin/stripe subscriptions list --limit 10

# Get specific customer
~/bin/stripe customers retrieve cus_xxxxx
```

### Creating Test Data

```bash
# Create a test customer
~/bin/stripe customers create \
  --email="test@example.com" \
  --name="Test Customer"

# Create a test product
~/bin/stripe products create \
  --name="Test Product" \
  --description="For testing"

# Create a price for product
~/bin/stripe prices create \
  --product=prod_xxxxx \
  --unit-amount=2000 \
  --currency=usd \
  --recurring[interval]=month
```

### Payment Testing

```bash
# Create a payment intent
~/bin/stripe payment_intents create \
  --amount=2000 \
  --currency=usd \
  --payment-method-types[]=card

# Confirm a payment intent
~/bin/stripe payment_intents confirm pi_xxxxx \
  --payment-method=pm_card_visa
```

### Logs & Debugging

```bash
# Tail live API logs
npm run stripe:logs

# Filter logs
~/bin/stripe logs tail --filter-status=200

# View specific request
~/bin/stripe logs tail --filter-request-id=req_xxxxx
```

---

## npm Scripts Available

All scripts are in `package.json`:

| Command | Description |
|---------|-------------|
| `npm run stripe:login` | Authenticate with Stripe |
| `npm run stripe:listen` | Forward webhooks to localhost:3000 |
| `npm run stripe:trigger` | Trigger test webhook events |
| `npm run stripe:logs` | Tail live API request logs |
| `npm run stripe:products` | List all products |
| `npm run stripe:customers` | List all customers |

---

## Webhook Setup in Your Code

### 1. Verify Webhook Signature

Your webhook handler should verify signatures:

```typescript
// app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      // Handle successful checkout
      break

    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription
      // Handle subscription creation
      break

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice
      // Handle successful payment
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
```

### 2. Environment Variables

Update `.env.local`:
```env
# Get from Stripe Dashboard → Developers → API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Get from `stripe listen` command output
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Testing Payment Flows

### Test Cards

Use these test card numbers (any future expiry, any CVC):

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Payment declined |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 0341` | Attached to existing customer |

### Full Checkout Flow Test

1. **Start your app**:
```bash
npm run dev:next
```

2. **Start webhook listener**:
```bash
npm run stripe:listen
```

3. **Test checkout**:
   - Navigate to your checkout page
   - Use test card `4242 4242 4242 4242`
   - Complete payment
   - Watch webhook events in terminal

4. **Verify webhook received**:
   - Check your webhook handler logs
   - Verify database was updated (if applicable)
   - Confirm email was sent (if applicable)

---

## Workflow Examples

### Daily Development Workflow

```bash
# Terminal 1: Start Supabase (if using)
npm run supabase:start

# Terminal 2: Start Stripe webhook listener
npm run stripe:listen

# Terminal 3: Start your app
npm run dev:next

# Now test payment flows!
```

### Testing Subscription Lifecycle

```bash
# Create test subscription
~/bin/stripe checkout sessions create \
  --success-url="http://localhost:3000/success" \
  --mode=subscription \
  --line-items[0][price]=price_xxxxx \
  --line-items[0][quantity]=1

# Trigger subscription created
npm run stripe:trigger customer.subscription.created

# Trigger successful payment
npm run stripe:trigger invoice.payment_succeeded

# Trigger subscription canceled
npm run stripe:trigger customer.subscription.deleted
```

### Debugging Failed Webhooks

```bash
# 1. Check webhook listener is running
# Look for "Ready! Your webhook signing secret..."

# 2. Tail logs to see what's happening
npm run stripe:logs

# 3. Trigger a test event
npm run stripe:trigger payment_intent.succeeded

# 4. Check your app's webhook handler
# Look for errors in Next.js terminal

# 5. Verify webhook secret is correct
echo $STRIPE_WEBHOOK_SECRET
```

---

## Switching Between Test & Live Mode

### Test Mode (Local Development)
```env
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Live Mode (Production)
```env
# .env.production (or Vercel environment variables)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # From production webhook endpoint
```

**Important:**
- Test mode and live mode have separate data
- Use test mode for development
- Use live mode only for production
- Never commit API keys to Git!

---

## Troubleshooting

### Issue: Webhook not receiving events

**Solution:**
1. Ensure `stripe listen` is running
2. Check the forwarding URL matches your webhook route
3. Verify webhook secret is in `.env.local`
4. Check your webhook handler is at the correct path

```bash
# Correct forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Your route file should be at
# app/api/stripe/webhook/route.ts
```

### Issue: Authentication failed

**Solution:**
```bash
# Re-authenticate
npm run stripe:login

# Check stored credentials
cat ~/.config/stripe/config.toml
```

### Issue: Webhook signature verification failed

**Solution:**
1. Get new webhook secret:
```bash
npm run stripe:listen
# Copy the whsec_... secret
```

2. Update `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Restart your Next.js app

### Issue: Docker container not starting

**Solution:**
```bash
# Pull latest image
docker pull stripe/stripe-cli

# Test manually
docker run --rm stripe/stripe-cli --version
```

---

## Advanced Usage

### Custom Webhook Endpoint

Forward to a different port or path:
```bash
~/bin/stripe listen --forward-to localhost:4000/webhooks/stripe
```

### Filter Specific Events

Only forward certain events:
```bash
~/bin/stripe listen \
  --forward-to localhost:3000/api/stripe/webhook \
  --events checkout.session.completed,customer.subscription.created
```

### Load Events from Production

Replay production events locally (careful!):
```bash
~/bin/stripe events resend evt_xxxxx
```

### Export Test Data

```bash
# Export customers to JSON
~/bin/stripe customers list --limit 100 > customers.json

# Export products
~/bin/stripe products list > products.json
```

---

## Integration with Supabase

### Webhook Handler with Supabase

```typescript
// app/api/stripe/webhook/route.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for webhooks
)

export async function POST(req: Request) {
  // ... verify webhook signature ...

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session

      // Update user's subscription in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: session.client_reference_id,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          status: 'active'
        })

      if (error) {
        console.error('Error saving subscription:', error)
        return new Response('Database error', { status: 500 })
      }
      break
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
```

---

## Resources

- **Stripe CLI Docs**: https://stripe.com/docs/stripe-cli
- **Webhook Events Reference**: https://stripe.com/docs/api/events/types
- **Test Cards**: https://stripe.com/docs/testing
- **Webhook Testing**: https://stripe.com/docs/webhooks/test

---

## Quick Reference Card

### Essential Commands
```bash
# Authenticate
npm run stripe:login

# Start webhook forwarding
npm run stripe:listen

# Trigger test payment
npm run stripe:trigger payment_intent.succeeded

# View logs
npm run stripe:logs

# List products
npm run stripe:products

# List customers
npm run stripe:customers
```

### Test Card Numbers
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 9995`
- 3D Secure: `4000 0025 0000 3155`

### Environment Variables
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From stripe listen
```

---

**Your Stripe CLI is ready! Start webhook forwarding with `npm run stripe:listen` 🚀**
