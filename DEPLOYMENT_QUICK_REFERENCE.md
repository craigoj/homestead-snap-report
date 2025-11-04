# SnapAsset AI - Deployment Quick Reference Card

**Print this or keep it open while deploying!**

---

## 🎯 3-Step Deployment Summary

### Step 1: Gather Credentials (45 min)
```
□ Supabase Production Project
  ├─ Go to: https://app.supabase.com → New Project
  ├─ Copy Project URL → NEXT_PUBLIC_SUPABASE_URL
  └─ Copy Anon Key → NEXT_PUBLIC_SUPABASE_ANON_KEY

□ Stripe Live Keys
  ├─ Go to: https://dashboard.stripe.com/apikeys
  ├─ Toggle OFF "View test data" (switch to Live)
  ├─ Copy pk_live_... → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ├─ Copy sk_live_... → STRIPE_SECRET_KEY
  ├─ Go to Developers → Webhooks
  ├─ Add endpoint: https://snapassetai.com/api/stripe/webhook
  └─ Copy whsec_... → STRIPE_WEBHOOK_SECRET
```

### Step 2: Configure Netlify (30 min)
```
Go to: https://app.netlify.com/sites/snapassetai/settings/deploys#environment

Add Variables (use "Production" scope):
├─ NEXT_PUBLIC_SUPABASE_URL
├─ NEXT_PUBLIC_SUPABASE_ANON_KEY
├─ NEXT_PUBLIC_APP_URL = https://snapassetai.com
├─ NEXT_PUBLIC_SITE_URL = https://snapassetai.com
├─ NEXT_PUBLIC_APP_ENV = production
├─ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_...)
├─ STRIPE_SECRET_KEY (sk_live_...)
└─ STRIPE_WEBHOOK_SECRET (whsec_...)
```

### Step 3: Deploy (10 min)
```
Option A: Dashboard
└─ Go to Deploys tab → Click "Deploy site"

Option B: Git Push
└─ git push origin main (auto-deploys)

Option C: CLI
└─ netlify deploy --prod
```

---

## ⚠️ CRITICAL WARNINGS

**Don't Use Test Keys in Production!**
```
❌ WRONG:  pk_test_XXX, sk_test_XXX, whsec_test_XXX
✅ RIGHT:  pk_live_XXX, sk_live_XXX, whsec_XXX
```

**Don't Commit .env Files**
```
❌ WRONG:  git add .env.production
✅ RIGHT:  Store in Netlify UI only
```

**Use Production Scope**
```
❌ WRONG:  Scope: All scopes
✅ RIGHT:  Scope: Production
```

---

## ✅ Post-Deployment Checklist

```
Immediate (5 min):
□ Site loads at https://snapassetai.com
□ No console errors (DevTools → Console)
□ Page source contains snapassetai.com (not localhost)

Auth Tests (10 min):
□ Sign up works
□ Confirmation email received
□ Login works
□ Redirects to /dashboard (not localhost)

Feature Tests (10 min):
□ Can create asset
□ Can upload photo
□ Dashboard loads
□ Mobile responsive

Verification (5 min):
□ Supabase: user appears in auth.users
□ Stripe: webhooks showing in dashboard
□ Netlify: deploy log shows "Deployed successfully"
```

---

## 🔗 Important URLs During Deployment

**Supabase:**
- API Settings: https://app.supabase.com/project/_/settings/api
- Auth Config: https://app.supabase.com/project/_/auth/url-configuration
- Database: https://app.supabase.com/project/_/database/tables

**Stripe:**
- API Keys: https://dashboard.stripe.com/apikeys
- Webhooks: https://dashboard.stripe.com/webhooks
- Products: https://dashboard.stripe.com/products
- Mode Toggle: Top left of dashboard

**Netlify:**
- Environment Vars: https://app.netlify.com/sites/snapassetai/settings/deploys#environment
- Deploy Log: https://app.netlify.com/sites/snapassetai/deploys
- Domain Settings: https://app.netlify.com/sites/snapassetai/settings/domain

**Production Site:**
- Home: https://snapassetai.com
- Auth: https://snapassetai.com/auth
- Dashboard: https://snapassetai.com/dashboard

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Build fails** | Check Netlify build log for errors |
| **Supabase error** | Verify URL and anon key in env vars |
| **Auth redirects to localhost** | Set Supabase Site URL and redirect URLs to production domain |
| **Stripe checkout fails** | Verify using pk_live_ (not pk_test_), redeploy |
| **Photos won't upload** | Check Supabase storage bucket policies |
| **Confirmation emails not received** | Check Supabase email templates and SMTP config |

---

## 📞 If Stuck

1. Check `DEPLOYMENT_ACTION_PLAN.md` (full guide with explanations)
2. Check `PRODUCTION_ENV_CHECKLIST.md` (complete variable reference)
3. Check `PRODUCTION_DEPLOYMENT.md` (detailed deployment guide)
4. Review troubleshooting section in `DEPLOYMENT_ACTION_PLAN.md`

---

## 🎉 Success = Site Live

When all checks pass, you're done!
Your site is live at **https://snapassetai.com** 🚀
