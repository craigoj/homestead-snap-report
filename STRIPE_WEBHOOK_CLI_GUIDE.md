# Stripe CLI - Webhook Endpoint Setup Guide

**Purpose:** Use Stripe CLI to create a production webhook endpoint and get the signing secret
**Time Required:** 15-20 minutes
**Difficulty:** Easy

---

## Step 1: Install Stripe CLI

**⚠️ For Detailed Instructions:** See `STRIPE_CLI_INSTALL_MANUAL.md`

This guide covers:
- Installation for macOS, Windows, and Linux
- Multiple installation methods for each OS
- Troubleshooting common issues
- Step-by-step verification

### Quick Installation

**macOS (with Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**macOS (without Homebrew - Recommended):**
```bash
# Apple Silicon (M1/M2/M3):
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_mac_arm64.zip -o stripe_mac.zip

# Intel Mac:
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_mac_x86_64.zip -o stripe_mac.zip

# Then:
unzip stripe_mac.zip
sudo mv stripe /usr/local/bin/stripe
stripe --version
```

**Windows (Chocolatey):**
```powershell
choco install stripe-cli
```

**Linux (Debian/Ubuntu):**
```bash
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_linux_x86_64.tar.gz -o stripe.tar.gz
tar -xzf stripe.tar.gz
sudo mv stripe /usr/local/bin/stripe
stripe --version
```

**If you need detailed help:** See `STRIPE_CLI_INSTALL_MANUAL.md` for all platforms and troubleshooting.

---

## Step 2: Authenticate with Your Stripe Account

Once Stripe CLI is installed, authenticate:

```bash
stripe login
```

This will:
1. Open your browser to stripe.com
2. Ask you to confirm login
3. Return a restricted API key
4. Store it locally for CLI commands

**You'll see output like:**
```
Your pairing code is: pc_1234567890abcdef1234567890
This pairing code will expire in 10 minutes.

Press Enter to open the browser or visit: https://dashboard.stripe.com/stripecli/confirm_auth?...
```

---

## Step 3: Create Webhook Endpoint

Now create a webhook endpoint for your production domain:

```bash
# Create webhook for production
stripe webhooks create \
  --url https://snapassetai.com/api/stripe/webhook \
  --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed
```

**What each part means:**
- `--url https://snapassetai.com/api/stripe/webhook` - Your production webhook URL
- `--events` - Events to listen for:
  - `checkout.session.completed` - When customer completes checkout
  - `customer.subscription.created` - When subscription starts
  - `customer.subscription.updated` - When subscription changes
  - `customer.subscription.deleted` - When subscription cancels
  - `invoice.payment_succeeded` - When payment succeeds
  - `invoice.payment_failed` - When payment fails

---

## Step 4: Copy Your Webhook Signing Secret

After running the create command, you'll see output like:

```
Successfully created webhook endpoint we_1234567890abcdef
URL: https://snapassetai.com/api/stripe/webhook
Signing secret: whsec_test_secret_1234567890abcdef
```

**Copy the signing secret** (starts with `whsec_`)

This is your `STRIPE_WEBHOOK_SECRET` value to add to Netlify!

---

## Step 5: Verify Webhook Endpoint

List all your webhook endpoints to verify it was created:

```bash
stripe webhooks list
```

**Output example:**
```
id                    url                                        events
we_1234567890abcdef   https://snapassetai.com/api/stripe/webhook checkout.session.completed,customer.subscription.created,...
we_9876543210zyxwvu   https://localhost:3000/api/stripe/webhook  checkout.session.completed,...
```

---

## Step 6: Test Webhook (Optional but Recommended)

Test that your webhook endpoint is working:

```bash
# Forward webhook events from Stripe to your local dev server
# (useful for testing, but not needed for production)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, trigger a test event
stripe trigger payment_intent.succeeded
```

---

## Webhook Secret for Netlify

Your webhook signing secret from Step 4 (the `whsec_` value) goes into Netlify:

1. Go to: https://app.netlify.com/sites/snapassetai/settings/deploys#environment
2. Click "Add a variable"
3. **Key:** `STRIPE_WEBHOOK_SECRET`
4. **Value:** Paste the `whsec_` secret from Step 4
5. **Scope:** Production
6. Click "Create variable"

---

## Important Notes

### Test vs Production Mode

**During Development (Test Mode):**
- Webhooks start with: `whsec_test_`
- Use test Stripe keys: `pk_test_`, `sk_test_`
- URL can be localhost: `http://localhost:3000/api/stripe/webhook`

**For Production (Live Mode):**
- Webhooks start with: `whsec_` (no "test_")
- Use live Stripe keys: `pk_live_`, `sk_live_`
- URL must be production domain: `https://snapassetai.com/api/stripe/webhook`

### Switching Between Test and Production

If you need to toggle between test and production mode in Stripe:

```bash
# Logout and login again to switch accounts/mode
stripe logout
stripe login
```

Or use the Stripe dashboard toggle (top left: "View test data")

---

## Troubleshooting

### "Command not found: stripe"
**Solution:** Stripe CLI not in PATH. Try:
```bash
# Find where stripe is installed
which stripe

# Or install to /usr/local/bin
sudo mv stripe /usr/local/bin/stripe
```

### "Not authenticated"
**Solution:** Run `stripe login` first to authenticate

### Webhook already exists
**Solution:** List and delete the old one:
```bash
stripe webhooks list
stripe webhooks delete we_xxxxxxxxxx  # the old endpoint ID
```

### URL returns 404 or connection refused
**Solution:**
- Verify URL is correct and accessible from internet
- Ensure your API route exists at `/api/stripe/webhook`
- Check that your server is running and publicly accessible
- For production, verify domain is live before creating webhook

---

## Complete Command Reference

```bash
# Install
brew install stripe/stripe-cli/stripe

# Authenticate
stripe login

# Create webhook endpoint
stripe webhooks create --url https://snapassetai.com/api/stripe/webhook --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed

# List all webhooks
stripe webhooks list

# Delete a webhook
stripe webhooks delete we_xxxxxxxxxx

# Test webhook locally
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test event
stripe trigger payment_intent.succeeded

# Get webhook details
stripe webhooks get we_xxxxxxxxxx

# Update webhook endpoint
stripe webhooks update we_xxxxxxxxxx --url https://new-url.com/webhook
```

---

## Next Steps

After creating your webhook endpoint:

1. **Copy the `whsec_` secret** from the creation output
2. **Add to Netlify** as `STRIPE_WEBHOOK_SECRET` environment variable
3. **Deploy your site** to production
4. **Test the webhook** by making a test payment
5. **Verify in Stripe dashboard** that events are being received

---

## Resources

- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Events Reference](https://stripe.com/docs/api/events/types)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
- [Stripe CLI GitHub](https://github.com/stripe/stripe-cli)

---

**Status:** Ready to create webhook endpoint
**Time Estimate:** 15-20 minutes
**Difficulty:** Easy - just 3 commands!
