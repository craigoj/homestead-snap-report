# MCP Integration Plan for SnapAsset AI

## Overview
This document outlines the recommended Model Context Protocol (MCP) servers to integrate with Claude Code for streamlined development of SnapAsset AI.

**Last Updated:** 2025-11-02
**Project:** SnapAsset AI
**Repository:** https://github.com/craigoj/homestead-snap-report

---

## Current Integrations Analysis

### Active Services
1. **Supabase** - Database, Auth, Storage, Edge Functions
2. **GitHub** - Version control (craigoj/homestead-snap-report)
3. **eBay API** - Asset valuation via Browse API
4. **OpenAI API** - OCR extraction and product analysis
5. **Google Cloud Vision** - Enhanced OCR processing
6. **SendGrid** - Email notifications and campaigns
7. **Stripe** - Planned subscription/payment system (in migration plan)

### Current MCP Setup
- ✅ Supabase MCP configured and active
- 🔄 All other services lack MCP integration

---

## Recommended MCP Integrations

### Priority 1: Essential for Development

#### 1. GitHub MCP
**Why:** Version control, issue tracking, PR management directly in Claude Code

**Capabilities:**
- Create and manage issues
- Create branches and pull requests
- Review code changes
- Track milestones and projects
- Query commit history
- Manage GitHub Actions workflows

**Setup:**
```bash
# Install the GitHub MCP server
npm install -g @modelcontextprotocol/server-github

# Generate GitHub Personal Access Token
# Go to: https://github.com/settings/tokens
# Scopes needed: repo, workflow, read:org
```

**Use Cases:**
- "Create an issue for implementing Stripe subscription tiers"
- "Create a PR for the OCR enhancement feature"
- "Show me all open issues labeled 'bug'"
- "What were the commits in the last release?"

---

#### 2. Stripe MCP
**Why:** Essential for planned subscription feature (Next.js migration)

**Capabilities:**
- Manage products and pricing
- Query customer and subscription data
- Test webhook events
- Monitor payment analytics
- Create test customers and payments
- Manage billing portals

**Setup:**
```bash
# Install Stripe CLI and MCP
npm install -g @stripe/mcp-server
stripe login

# Get your API keys
# Go to: https://dashboard.stripe.com/apikeys
```

**Use Cases:**
- "Create a new monthly subscription product for $9.99"
- "Show me all active subscriptions"
- "Test the webhook for subscription.updated event"
- "What's our monthly recurring revenue?"
- "Create a test customer with a trial subscription"

---

### Priority 2: Enhanced Development Experience

#### 3. File System MCP
**Why:** Better file operations, searches, and batch processing

**Capabilities:**
- Advanced file searching with complex patterns
- Safe batch file operations
- File monitoring and change detection
- Directory tree visualization
- Regex-based file content manipulation

**Setup:**
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**Use Cases:**
- "Find all components that use the PhotoUpload component"
- "Rename all files matching pattern 'Jumpstart*' to 'Onboarding*'"
- "Show me the directory structure of the components folder"
- "Find all TODO comments in TypeScript files"

---

#### 4. PostgreSQL MCP (Direct DB Access)
**Why:** Advanced queries and performance optimization beyond Supabase MCP

**Capabilities:**
- Raw SQL execution with query plans
- Database performance analysis
- Index optimization recommendations
- Migration testing and validation
- Complex analytical queries
- Backup and restore operations

**Setup:**
```bash
npm install -g @modelcontextprotocol/server-postgres

# Connection string format:
# postgresql://postgres:[password]@db.hfiznpxdopjdwtuenxqf.supabase.co:5432/postgres
```

**Use Cases:**
- "Analyze the query performance for asset searches"
- "Show me the execution plan for the dashboard query"
- "What indexes should I add to optimize valuation lookups?"
- "Run a migration test on a copy of the database"

---

### Priority 3: Feature Development & Testing

#### 5. OpenAI MCP
**Why:** OCR and AI feature development/testing

**Capabilities:**
- Test and refine prompts
- Compare model responses (GPT-4, GPT-4 Vision, etc.)
- Analyze API costs and usage
- Experiment with new AI features
- Optimize token usage
- Test vision capabilities for asset recognition

**Setup:**
```bash
npm install -g @openai/mcp-server

# Get API key from: https://platform.openai.com/api-keys
```

**Use Cases:**
- "Test this OCR prompt with 5 sample images"
- "Compare GPT-4 vs GPT-4 Turbo for asset categorization"
- "What's the average token cost for OCR extraction?"
- "Optimize the prompt for better brand/model extraction"
- "Test vision capabilities for furniture recognition"

---

#### 6. SendGrid MCP
**Why:** Email template testing and delivery monitoring

**Capabilities:**
- Test email templates
- Monitor delivery and open rates
- Manage contact lists
- Query email analytics
- Debug delivery issues
- A/B test email campaigns

**Setup:**
```bash
# SendGrid doesn't have an official MCP yet
# Consider using HTTP MCP or creating custom server
# Get API key from: https://app.sendgrid.com/settings/api_keys
```

**Use Cases:**
- "Test the proof of loss email template"
- "Show me email delivery rates for the last week"
- "Why are emails bouncing for domain X?"
- "Send a test waitlist invitation email"

---

### Priority 4: Optional but Useful

#### 7. Slack MCP (Team Collaboration)
**Why:** Deployment notifications and team updates

**Capabilities:**
- Send notifications to channels
- Create and manage threads
- Post deployment updates
- Share reports and analytics
- Alert on critical errors

**Setup:**
```bash
npm install -g @modelcontextprotocol/server-slack

# Create Slack App and get tokens
# Go to: https://api.slack.com/apps
```

**Use Cases:**
- "Send a deployment notification to #dev-updates"
- "Alert the team about the database migration"
- "Share this week's user growth stats in #metrics"

---

#### 8. Browser Automation MCP (Playwright/Puppeteer)
**Why:** E2E testing and automated screenshots

**Capabilities:**
- Automated browser testing
- Screenshot generation for assets
- Form submission testing
- User flow validation
- Performance monitoring

**Setup:**
```bash
npm install -g @modelcontextprotocol/server-playwright
```

**Use Cases:**
- "Test the asset upload flow end-to-end"
- "Take screenshots of the dashboard on mobile"
- "Verify the Jumpstart mode completion flow"
- "Test payment form with test card"

---

## Implementation Roadmap

### Phase 1: Core Development MCPs (Week 1)
1. ✅ Supabase MCP (Already configured)
2. 🔄 GitHub MCP - Version control and collaboration
3. 🔄 File System MCP - Enhanced file operations

**Actions:**
- Install GitHub and File System MCPs
- Configure environment variables
- Test basic operations
- Update team documentation

### Phase 2: Feature Development MCPs (Week 2)
1. 🔄 Stripe MCP - Payment integration
2. 🔄 PostgreSQL MCP - Advanced database operations
3. 🔄 OpenAI MCP - AI feature development

**Actions:**
- Set up Stripe test environment
- Configure PostgreSQL connection
- Test OpenAI integration
- Create usage examples

### Phase 3: Testing & Operations MCPs (Week 3)
1. 🔄 SendGrid MCP - Email testing
2. 🔄 Slack MCP (Optional) - Team notifications
3. 🔄 Browser Automation MCP - E2E testing

**Actions:**
- Configure email testing
- Set up Slack webhooks
- Create test suites
- Document workflows

---

## Updated .mcp.json Configuration

Here's the recommended configuration with all Priority 1-2 MCPs:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=hfiznpxdopjdwtuenxqf",
      "metadata": {
        "description": "Supabase MCP server for SnapAsset AI project",
        "priority": "P1",
        "capabilities": [
          "Database schema management",
          "SQL queries and data access",
          "Migration generation",
          "TypeScript type generation",
          "Documentation search"
        ]
      }
    },
    "github": {
      "type": "npm",
      "package": "@modelcontextprotocol/server-github",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      },
      "metadata": {
        "description": "GitHub integration for version control and collaboration",
        "priority": "P1",
        "repository": "craigoj/homestead-snap-report",
        "capabilities": [
          "Issue management",
          "Pull request creation and review",
          "Branch management",
          "Commit history queries",
          "GitHub Actions workflow management"
        ]
      }
    },
    "stripe": {
      "type": "npm",
      "package": "@stripe/mcp-server",
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      },
      "metadata": {
        "description": "Stripe integration for subscription and payment management",
        "priority": "P1",
        "mode": "test",
        "capabilities": [
          "Product and pricing management",
          "Subscription queries and management",
          "Customer data access",
          "Webhook testing",
          "Payment analytics"
        ]
      }
    },
    "filesystem": {
      "type": "npm",
      "package": "@modelcontextprotocol/server-filesystem",
      "args": {
        "allowedDirectories": [
          "/Users/craigj/Documents/snapassetai/src",
          "/Users/craigj/Documents/snapassetai/supabase"
        ]
      },
      "metadata": {
        "description": "Enhanced file system operations",
        "priority": "P2",
        "capabilities": [
          "Advanced file search",
          "Batch file operations",
          "Safe file manipulation",
          "Directory tree visualization"
        ]
      }
    },
    "postgres": {
      "type": "npm",
      "package": "@modelcontextprotocol/server-postgres",
      "env": {
        "POSTGRES_CONNECTION_STRING": "${POSTGRES_CONNECTION_STRING}"
      },
      "metadata": {
        "description": "Direct PostgreSQL access for advanced queries",
        "priority": "P2",
        "capabilities": [
          "Raw SQL execution",
          "Query optimization and analysis",
          "Performance monitoring",
          "Migration testing"
        ]
      }
    },
    "openai": {
      "type": "npm",
      "package": "@openai/mcp-server",
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}"
      },
      "metadata": {
        "description": "OpenAI integration for OCR and AI feature development",
        "priority": "P2",
        "capabilities": [
          "Prompt testing and optimization",
          "Model comparison",
          "Cost analysis",
          "Vision API testing"
        ]
      }
    }
  }
}
```

---

## Environment Variables Setup

Create or update `.env.local` with these additional variables:

```bash
# Existing
VITE_SUPABASE_PROJECT_ID="hfiznpxdopjdwtuenxqf"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."
VITE_SUPABASE_URL="https://hfiznpxdopjdwtuenxqf.supabase.co"

# New MCP Integrations

# GitHub MCP
GITHUB_TOKEN="ghp_your_personal_access_token_here"

# Stripe MCP
STRIPE_SECRET_KEY="sk_test_your_test_secret_key_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_test_publishable_key_here"

# PostgreSQL MCP (Supabase direct connection)
POSTGRES_CONNECTION_STRING="postgresql://postgres:[password]@db.hfiznpxdopjdwtuenxqf.supabase.co:5432/postgres"

# OpenAI MCP (if not already in Supabase secrets)
OPENAI_API_KEY="sk-your_openai_api_key_here"

# SendGrid (already used in Edge Functions)
SENDGRID_API_KEY="SG.your_sendgrid_api_key_here"

# Slack MCP (Optional)
SLACK_BOT_TOKEN="xoxb-your-slack-bot-token"
SLACK_TEAM_ID="T01234ABCDE"
```

---

## Security Best Practices

### API Key Management
1. **Never commit API keys** - Use `.env.local` and add to `.gitignore`
2. **Use test keys for development** - Especially for Stripe
3. **Rotate keys regularly** - Every 90 days minimum
4. **Limit key permissions** - Only grant necessary scopes

### MCP Access Control
1. **Restrict file system access** - Only allow specific directories
2. **Use read-only mode** - For production database connections
3. **Monitor MCP usage** - Track API calls and costs
4. **Audit MCP actions** - Log all database modifications

### Development vs Production
1. **Separate projects** - Use different Supabase/Stripe projects
2. **Test mode only** - Never connect MCPs to production Stripe
3. **Staging environment** - Test MCPs in staging first
4. **Backup before migrations** - Always backup before MCP-generated migrations

---

## MCP Usage Examples

### GitHub MCP Examples

```
# Issue Management
"Create an issue titled 'Add Stripe subscription tiers' with label 'enhancement'"
"Show me all open issues assigned to me"
"Close issue #42 with a comment about the fix"

# Pull Requests
"Create a PR for branch 'feature/stripe-integration' targeting 'main'"
"Show me all PRs that need review"
"Merge PR #15 after approval"

# Repository Insights
"What files were changed in the last 10 commits?"
"Show me all commits by author in the last month"
"Which branches are stale and can be deleted?"
```

### Stripe MCP Examples

```
# Product Management
"Create a 'Basic' plan for $9.99/month"
"Create an 'Enterprise' plan for $99/year with 20% discount"
"List all active products and their prices"

# Subscription Management
"Show me all subscriptions expiring this month"
"Cancel subscription for customer cus_abc123"
"Upgrade customer's subscription to Enterprise plan"

# Testing
"Create a test customer with email test@example.com"
"Simulate a successful payment for $50"
"Test the subscription.updated webhook"
```

### PostgreSQL MCP Examples

```
# Performance Analysis
"Analyze the query performance for asset searches by category"
"Show me the slowest queries from the last hour"
"What indexes are missing for optimal performance?"

# Data Analysis
"Calculate the average asset value by category for this year"
"Show me user growth trends by month"
"What's the distribution of assets across properties?"

# Migration Testing
"Test the migration to add 'tags' column to assets table"
"Validate all foreign key constraints"
"Check for orphaned records in asset_photos"
```

### OpenAI MCP Examples

```
# OCR Optimization
"Test the OCR prompt with these 5 sample asset images"
"Compare GPT-4 vs GPT-4 Vision for serial number extraction"
"Optimize the prompt to improve brand detection accuracy"

# Cost Analysis
"What's the average token cost for OCR extraction?"
"Compare costs between gpt-4-vision and gpt-4o for our use case"
"Estimate monthly OCR costs for 1000 assets"

# Feature Development
"Test asset categorization accuracy with this prompt"
"Generate descriptions for these asset types"
"Experiment with few-shot learning for better valuation"
```

---

## Testing Plan

### Phase 1: Basic MCP Testing
- [ ] Verify Supabase MCP connection
- [ ] Test GitHub MCP with simple query
- [ ] Test File System MCP with file search
- [ ] Validate environment variable loading

### Phase 2: Integration Testing
- [ ] GitHub: Create test issue and PR
- [ ] Stripe: Create test product and customer
- [ ] PostgreSQL: Run complex analytical query
- [ ] OpenAI: Test prompt optimization

### Phase 3: Workflow Testing
- [ ] Complete feature development cycle with GitHub MCP
- [ ] Test subscription flow with Stripe MCP
- [ ] Optimize database queries with PostgreSQL MCP
- [ ] Improve OCR accuracy with OpenAI MCP

---

## Troubleshooting

### Common Issues

#### MCP Server Not Found
```bash
# Check Claude Code version
claude --version

# Verify .mcp.json syntax
cat .mcp.json | jq .

# Reinstall MCP packages
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-filesystem
```

#### Authentication Errors
```bash
# GitHub: Check token scopes
gh auth status

# Stripe: Verify test mode
stripe config --list

# Supabase: Test connection
psql $POSTGRES_CONNECTION_STRING
```

#### Permission Denied
- Check API key permissions and scopes
- Verify file system allowed directories
- Review Supabase RLS policies
- Ensure Stripe keys are for test mode

---

## Cost Considerations

### OpenAI MCP Usage
- GPT-4 Vision: ~$0.01 per image for OCR
- Monthly estimate: $50-200 based on 1000-5000 assets
- Optimize with caching and batch processing

### Stripe MCP
- Free for test mode
- Production: Standard Stripe fees apply
- No additional MCP costs

### GitHub MCP
- Free for public repositories
- Check GitHub Actions minutes for private repos

### Supabase MCP
- Included in Supabase plan
- Monitor database query costs
- Watch for connection pooling limits

---

## Next Steps

1. **Immediate Actions:**
   - [ ] Install GitHub MCP
   - [ ] Configure File System MCP
   - [ ] Test Supabase MCP connection
   - [ ] Update environment variables

2. **This Week:**
   - [ ] Set up Stripe test account and MCP
   - [ ] Configure PostgreSQL direct connection
   - [ ] Document MCP workflows for team

3. **Next Sprint:**
   - [ ] Integrate OpenAI MCP for OCR optimization
   - [ ] Set up SendGrid MCP for email testing
   - [ ] Create automated MCP testing suite

4. **Future Considerations:**
   - [ ] Evaluate Browser Automation MCP for E2E tests
   - [ ] Consider Slack MCP for team notifications
   - [ ] Explore custom MCPs for eBay API

---

## Resources

### Official Documentation
- [Model Context Protocol Spec](https://github.com/modelcontextprotocol/specification)
- [Claude Code MCP Guide](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [Supabase MCP Docs](https://supabase.com/docs/guides/platform/mcp)

### MCP Servers
- [GitHub MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [File System MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [PostgreSQL MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)

### Project Resources
- [SnapAsset AI Repository](https://github.com/craigoj/homestead-snap-report)
- [Supabase Dashboard](https://supabase.com/dashboard/project/hfiznpxdopjdwtuenxqf)
- [Next.js Migration Plan](./NEXTJS_MIGRATION_PLAN.md)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-02
**Maintained By:** Development Team
