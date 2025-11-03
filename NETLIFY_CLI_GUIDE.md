# Netlify CLI - Deployment & Management Guide

## Overview
Netlify CLI v23.9.5 is now installed! Manage your site deployments, serverless functions, environment variables, and more - all from the command line.

---

## Installation

✅ **Netlify CLI v23.9.5** - Installed as dev dependency
✅ **npm Scripts** - Added 8 helpful commands to package.json
✅ **Ready to Deploy** - Just need to authenticate

---

## Getting Started

### 1. Authenticate with Netlify

**First time setup:**
```bash
npm run netlify:login
```

This will:
- Open your browser
- Log you in to Netlify
- Generate an access token
- Store credentials locally

### 2. Link Your Site (If Already Deployed)

If your site is already on Netlify:

```bash
netlify link
```

Choose:
- **Use existing site** (if already deployed)
- Enter your site name or URL

Or manually set site ID:
```bash
netlify link --id YOUR_SITE_ID
```

### 3. Verify Connection

```bash
npm run netlify:status
```

Should show:
```
Current Netlify Site: your-site-name
Site URL: https://your-site.netlify.app
Admin URL: https://app.netlify.com/sites/your-site
```

---

## Deployment Commands

### Preview Deploy (Draft)

```bash
npm run netlify:deploy
```

This creates a **draft deploy** for testing:
- Gets a unique preview URL
- Doesn't affect production
- Perfect for testing before going live

```
Deploying to draft URL...
✔ Deploy complete!
Draft URL: https://507bab47--your-site.netlify.app
```

### Production Deploy

```bash
npm run netlify:deploy:prod
```

Deploys to production (your main site URL).

### Deploy with Build

```bash
# Build then deploy
npm run build:next
npm run netlify:deploy:prod
```

Or combine:
```bash
netlify deploy --prod --build
```

---

## Local Development

### Netlify Dev Server

Run your site locally with Netlify features:

```bash
npm run netlify:dev
```

**Benefits:**
- Test serverless functions locally
- Environment variables from Netlify
- Redirects and headers work
- Edge functions support

**Port**: Usually starts on http://localhost:8888

**With existing dev server:**
```bash
# Terminal 1: Your Next.js app
npm run dev:next

# Terminal 2: Netlify proxy (for functions)
npm run netlify:dev
```

---

## Serverless Functions

### List Functions

```bash
npm run netlify:functions
```

Shows all deployed functions with:
- Function name
- Endpoint URL
- Last deployment

### Create a Function

```bash
netlify functions:create
```

**Choose template:**
- hello-world
- serverless-auth
- subscription-webhook
- etc.

**Example function** (`netlify/functions/hello.ts`):
```typescript
import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World!',
      event,
    }),
  }
}
```

### Test Function Locally

```bash
npm run netlify:dev

# Access at:
# http://localhost:8888/.netlify/functions/hello
```

### View Function Logs

```bash
npm run netlify:logs hello
```

Or tail logs in real-time:
```bash
netlify logs:function hello --tail
```

---

## Environment Variables

### List Environment Variables

```bash
netlify env:list
```

### Set Environment Variable

```bash
netlify env:set VARIABLE_NAME value
```

For production and branch deploys:
```bash
netlify env:set API_KEY abc123 --context production
netlify env:set API_KEY xyz789 --context branch-deploy
```

### Get Environment Variable

```bash
netlify env:get VARIABLE_NAME
```

### Delete Environment Variable

```bash
netlify env:unset VARIABLE_NAME
```

### Import from File

```bash
netlify env:import .env
```

---

## Site Management

### Open Site in Browser

```bash
npm run netlify:open
```

Opens your live site.

### Open Admin Dashboard

```bash
netlify open:admin
```

### Site Information

```bash
npm run netlify:status
```

Shows:
- Site name and ID
- URLs (production, admin)
- Build settings
- Custom domain

### List All Sites

```bash
netlify sites:list
```

### Create New Site

```bash
netlify sites:create
```

---

## Build & Deploy Workflows

### Build Settings

**Configure in `netlify.toml`:**
```toml
[build]
  command = "npm run build:next"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

### Deploy Contexts

```toml
# Production
[context.production]
  command = "npm run build:next"

[context.production.environment]
  NEXT_PUBLIC_ENV = "production"

# Branch deploys
[context.branch-deploy]
  command = "npm run build:next"

# Deploy previews (PRs)
[context.deploy-preview]
  command = "npm run build:next"
```

---

## npm Scripts Available

| Command | Description |
|---------|-------------|
| `npm run netlify:login` | Authenticate with Netlify |
| `npm run netlify:status` | View site status |
| `npm run netlify:deploy` | Deploy to draft URL |
| `npm run netlify:deploy:prod` | Deploy to production |
| `npm run netlify:dev` | Start local dev server |
| `npm run netlify:functions` | List all functions |
| `npm run netlify:logs` | View function logs |
| `npm run netlify:open` | Open live site |

---

## Workflow Examples

### Daily Development

```bash
# 1. Work locally with Netlify features
npm run netlify:dev

# 2. Make changes...

# 3. Deploy preview for testing
npm run build:next
npm run netlify:deploy

# 4. Test on preview URL
# Visit: https://PREVIEW_ID--your-site.netlify.app

# 5. Deploy to production when ready
npm run netlify:deploy:prod
```

### Feature Branch Deploy

```bash
# 1. Create feature branch
git checkout -b feature/new-thing

# 2. Make changes and commit
git add .
git commit -m "feat: add new thing"

# 3. Push to GitHub
git push -u origin feature/new-thing

# 4. Netlify auto-deploys branch (if configured)
# Or manually deploy
npm run netlify:deploy

# 5. Test and merge
# Auto-deploy to production on merge
```

### Quick Production Deploy

```bash
# One command: build and deploy
netlify deploy --prod --build

# Or separate steps
npm run build:next
npm run netlify:deploy:prod
```

### Function Development

```bash
# 1. Create function
netlify functions:create

# 2. Edit function in netlify/functions/

# 3. Test locally
npm run netlify:dev

# 4. Test function
curl http://localhost:8888/.netlify/functions/your-function

# 5. Deploy
npm run netlify:deploy:prod

# 6. Monitor logs
netlify logs:function your-function --tail
```

---

## Advanced Features

### Deploy Notifications

**Slack integration:**
```bash
netlify notifications:add slack --event deploy-succeeded
netlify notifications:add slack --event deploy-failed
```

**Email notifications:**
```bash
netlify notifications:add email --event deploy-succeeded \
  --email your@email.com
```

### Custom Headers

In `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Redirects & Rewrites

```toml
# Redirect old URLs
[[redirects]]
  from = "/old-page"
  to = "/new-page"
  status = 301

# Proxy API requests
[[redirects]]
  from = "/api/*"
  to = "https://api.example.com/:splat"
  status = 200

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Split Testing

```toml
[[redirects]]
  from = "/*"
  to = "/variant-a/:splat"
  status = 200
  conditions = {Cookie=[ab_test=a]}

[[redirects]]
  from = "/*"
  to = "/variant-b/:splat"
  status = 200
  conditions = {Cookie=[ab_test=b]}
```

### Build Hooks

Create build hooks for external triggers:

```bash
# In Netlify Dashboard or CLI
netlify hooks:create build --name "Trigger Deploy"

# Returns webhook URL
# POST to this URL to trigger deploy
curl -X POST https://api.netlify.com/build_hooks/HOOK_ID
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build:next

      - name: Deploy to Netlify
        run: npx netlify deploy --prod --dir=.next
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Get Auth Token

```bash
# Generate personal access token
netlify login
netlify status
# Or create in Netlify Dashboard → User Settings → Applications
```

---

## Netlify Configuration File

### Complete `netlify.toml` Example

```toml
[build]
  command = "npm run build:next"
  publish = ".next"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

# Production context
[context.production]
  command = "npm run build:next"

[context.production.environment]
  NEXT_PUBLIC_APP_ENV = "production"
  NODE_ENV = "production"

# Branch deploys
[context.branch-deploy]
  command = "npm run build:next"

# Deploy previews (PRs)
[context.deploy-preview]
  command = "npm run build:next"

# Redirects
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Domain Management

### Add Custom Domain

```bash
netlify domains:add yourdomain.com
```

### List Domains

```bash
netlify domains:list
```

### Setup DNS

```bash
# Netlify DNS (recommended)
netlify domains:setup yourdomain.com

# External DNS
# Add these records:
# A record: 75.2.60.5
# CNAME: www -> your-site.netlify.app
```

### SSL Certificate

Netlify automatically provisions SSL:
- Free Let's Encrypt certificate
- Auto-renewal
- HTTPS enforced

---

## Troubleshooting

### Build Fails

```bash
# View build logs
netlify logs:deploy

# Test build locally
npm run build:next

# Check build settings
netlify status
```

### Function Not Working

```bash
# List functions
npm run netlify:functions

# Test locally
npm run netlify:dev

# View function logs
netlify logs:function function-name --tail

# Check function endpoint
curl https://your-site.netlify.app/.netlify/functions/function-name
```

### Environment Variables Not Working

```bash
# List all env vars
netlify env:list

# Set missing variable
netlify env:set VARIABLE_NAME value

# Re-deploy
npm run netlify:deploy:prod
```

### Deploy Preview Not Created

Check:
1. GitHub integration is connected
2. Branch deploys enabled in settings
3. PR from forked repo (requires approval)

### Cache Issues

```bash
# Clear cache and deploy
netlify deploy --prod --build --clear-cache
```

---

## Best Practices

### 1. Use netlify.toml

Keep configuration in version control:
```toml
[build]
  command = "npm run build:next"
  publish = ".next"
```

### 2. Environment Variables

- Store secrets in Netlify (not in code)
- Use different values per context
- Never commit `.env` files

### 3. Deploy Previews

- Enable for all PRs
- Test before merging
- Share preview URLs with team

### 4. Functions

- Keep functions small and focused
- Use environment variables for config
- Monitor function logs
- Set appropriate timeouts

### 5. Build Optimization

- Use build plugins
- Cache dependencies
- Minimize build time
- Use incremental builds (if supported)

---

## Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify CLI Docs**: https://docs.netlify.com/cli/get-started/
- **Functions**: https://docs.netlify.com/functions/overview/
- **Build Configuration**: https://docs.netlify.com/configure-builds/overview/

---

## Quick Reference

### Essential Commands
```bash
# Authentication
npm run netlify:login
npm run netlify:status

# Deployment
npm run netlify:deploy           # Preview
npm run netlify:deploy:prod      # Production
netlify deploy --prod --build    # Build & deploy

# Development
npm run netlify:dev              # Local dev server

# Functions
npm run netlify:functions        # List
netlify functions:create         # Create
npm run netlify:logs             # View logs

# Environment
netlify env:list                 # List all
netlify env:set KEY value        # Set variable
netlify env:get KEY              # Get variable

# Site
npm run netlify:open             # Open site
netlify open:admin               # Open dashboard
netlify sites:list               # List all sites
```

### Deployment Workflow
```bash
# 1. Build
npm run build:next

# 2. Test preview
npm run netlify:deploy

# 3. Deploy production
npm run netlify:deploy:prod
```

---

**Your Netlify CLI is ready! Authenticate with `npm run netlify:login` to get started 🚀**
