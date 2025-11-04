# Stripe CLI - Manual Installation Guide

**Purpose:** Install Stripe CLI on your local machine for webhook setup
**Time:** 10-15 minutes
**Difficulty:** Easy

---

## ⚠️ Network Environment Note

The development environment doesn't have internet access to download directly. **You'll need to run these commands on your local machine** (Mac, Windows, or Linux where you have internet).

---

## Installation for macOS (Intel or Apple Silicon)

### Option 1: Using Homebrew (Easiest if Homebrew is installed)

**Check if Homebrew is installed:**
```bash
which brew
```

**If installed, run:**
```bash
brew install stripe/stripe-cli/stripe
```

**If NOT installed, use Option 2 below.**

---

### Option 2: Direct Download from GitHub (No Homebrew needed)

**Step 1: Download**

For **Apple Silicon Macs** (M1, M2, M3, etc.):
```bash
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_mac_arm64.zip -o stripe_mac.zip
```

For **Intel Macs** (older machines):
```bash
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_mac_x86_64.zip -o stripe_mac.zip
```

**Step 2: Unzip**
```bash
unzip stripe_mac.zip
```

**Step 3: Move to your PATH**
```bash
sudo mv stripe /usr/local/bin/stripe
```

**Step 4: Verify Installation**
```bash
stripe --version
# Should output: stripe version 1.18.0 (or similar)
```

---

### Option 3: Manual Download from Website

1. Go to: https://github.com/stripe/stripe-cli/releases
2. Find the latest release
3. Download the file for your system:
   - **Apple Silicon:** `stripe_X.X.X_mac_arm64.zip`
   - **Intel:** `stripe_X.X.X_mac_x86_64.zip`
4. Unzip the file
5. Move `stripe` to `/usr/local/bin/`:
   ```bash
   sudo mv ~/Downloads/stripe /usr/local/bin/stripe
   ```
6. Verify:
   ```bash
   stripe --version
   ```

---

## Installation for Windows

### Option 1: Using Chocolatey (Package Manager)

**If Chocolatey is installed:**
```powershell
choco install stripe-cli
```

### Option 2: Direct Download

1. Go to: https://github.com/stripe/stripe-cli/releases
2. Download `stripe_X.X.X_windows_x86_64.zip`
3. Unzip the file
4. Add `stripe.exe` to your PATH:
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", click "Path" and add the folder where you unzipped stripe
5. Verify in PowerShell:
   ```powershell
   stripe --version
   ```

---

## Installation for Linux

### Debian/Ubuntu

```bash
# Method 1: Using apt
sudo apt-get update
sudo apt-get install stripe

# Method 2: Direct download
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_linux_x86_64.tar.gz -o stripe.tar.gz
tar -xzf stripe.tar.gz
sudo mv stripe /usr/local/bin/stripe
stripe --version
```

### Other Linux Distributions

```bash
# Download the latest release
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_linux_x86_64.tar.gz -o stripe.tar.gz

# Extract
tar -xzf stripe.tar.gz

# Move to PATH
sudo mv stripe /usr/local/bin/stripe

# Verify
stripe --version
```

---

## Next Steps After Installation

Once Stripe CLI is installed, follow these steps:

### Step 1: Authenticate with Your Stripe Account

```bash
stripe login
```

This will:
1. Open your browser to Stripe's login page
2. Show a pairing code
3. Ask you to confirm
4. Store your API key locally for CLI commands

### Step 2: Create Your Webhook Endpoint

```bash
stripe webhooks create \
  --url https://snapassetai.com/api/stripe/webhook \
  --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed
```

### Step 3: Copy the Webhook Secret

Output will show:
```
Successfully created webhook endpoint we_1234567890abcdef
Signing secret: whsec_test_secret_1234567890abcdef
```

**Important:** Copy the `whsec_` value - this is your `STRIPE_WEBHOOK_SECRET`

### Step 4: Add to Netlify

1. Go to: https://app.netlify.com/sites/snapassetai/settings/deploys#environment
2. Click "Add a variable"
3. **Key:** `STRIPE_WEBHOOK_SECRET`
4. **Value:** Paste the `whsec_` value from Step 3
5. **Scope:** Production
6. Click "Create variable"

---

## Troubleshooting

### "stripe: command not found"

**Solution:** Path not set correctly

```bash
# Find where stripe is located
which stripe

# If empty, stripe is not in your PATH
# Try moving it to a standard location:
sudo mv ~/Downloads/stripe /usr/local/bin/stripe

# Then verify:
stripe --version
```

### "Permission denied"

**Solution:** Stripe doesn't have execute permissions

```bash
chmod +x /usr/local/bin/stripe
stripe --version
```

### "Not authenticated"

**Solution:** Run `stripe login` first

```bash
stripe login
# Follow browser confirmation
```

### Can't download from GitHub

**Solution:** Direct download page

1. Open in browser: https://github.com/stripe/stripe-cli/releases
2. Find the latest release
3. Download the file for your operating system manually
4. Unzip and move to `/usr/local/bin/`

---

## Verify Installation is Complete

Run this command to confirm everything is working:

```bash
stripe --version
stripe login --status
stripe webhooks list
```

If all three commands work, you're ready to create your webhook!

---

## Quick Command Summary

```bash
# Install (macOS with Homebrew)
brew install stripe/stripe-cli/stripe

# Or download directly (all platforms)
# Go to: https://github.com/stripe/stripe-cli/releases

# Authenticate
stripe login

# Create webhook (copy the whsec_ value)
stripe webhooks create \
  --url https://snapassetai.com/api/stripe/webhook \
  --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed

# List webhooks to verify
stripe webhooks list

# Get details of a specific webhook
stripe webhooks get we_xxxxxxxxxx

# Delete a webhook (if needed)
stripe webhooks delete we_xxxxxxxxxx
```

---

## Next: Continue with Deployment

Once you have Stripe CLI installed and your webhook secret:

1. **Follow:** `DEPLOYMENT_ACTION_PLAN.md` Phase 1 Step 1.2 (get your Stripe webhook secret)
2. **Add to Netlify:** Environment variable `STRIPE_WEBHOOK_SECRET`
3. **Continue:** With Phase 2 (other environment variables)
4. **Deploy:** Phase 3 (deploy to production)

---

## Resources

- **Stripe CLI GitHub:** https://github.com/stripe/stripe-cli/releases
- **Stripe CLI Docs:** https://stripe.com/docs/stripe-cli
- **Webhook Testing:** https://stripe.com/docs/webhooks/test

---

**Status:** Manual Installation Guide
**Last Updated:** November 4, 2025
**Difficulty:** Easy - 4 simple commands
