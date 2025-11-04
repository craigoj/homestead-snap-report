#!/bin/bash

# Stripe Webhook Creation Script
# Run this with: bash create-stripe-webhook.sh

echo "Creating Stripe webhook endpoint..."
echo ""

stripe webhooks create \
  --url https://snapassetai.com/api/stripe/webhook \
  --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed

echo ""
echo "✅ Done! Copy the 'whsec_...' secret from above and add it to Netlify as STRIPE_WEBHOOK_SECRET"
