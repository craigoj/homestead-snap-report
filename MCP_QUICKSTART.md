# MCP Quick Start Guide

Get started with Model Context Protocol integrations in under 10 minutes.

## Step 1: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your API keys to `.env.local`:**

### GitHub Token (Required for GitHub MCP)
```bash
# Go to: https://github.com/settings/tokens/new
# Token name: "Claude Code MCP - SnapAsset AI"
# Scopes needed:
#   ✓ repo (Full control of private repositories)
#   ✓ workflow (Update GitHub Action workflows)
#   ✓ read:org (Read org and team membership)
# Expiration: 90 days (recommended)
# Click "Generate token" and copy it

GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Test the GitHub MCP
Once configured, you can use commands like:
- "Show me all open issues in the repository"
- "Create a new issue for adding Stripe integration"
- "List all branches in the repository"
- "Show me commits from the last week"

---

## Step 2: Verify MCP Configuration

1. **Check the .mcp.json file:**
   ```bash
   cat .mcp.json | jq .
   ```

   Should show 3 configured MCPs:
   - ✅ supabase (active)
   - 🔄 github (ready to configure)
   - 🔄 filesystem (ready to configure)

2. **Test the connection:**
   ```bash
   # Start Claude Code in this directory
   cd /Users/craigj/Documents/snapassetai
   claude
   ```

3. **Try your first MCP command:**
   ```
   "List all tables in the Supabase database"
   ```

---

## Step 3: Test Each MCP

### Supabase MCP (Already Active ✅)
```
Test commands:
- "List all tables in the database"
- "Show me the schema for the assets table"
- "How many users are in the database?"
- "Generate TypeScript types for the database"
```

### GitHub MCP (Once GITHUB_TOKEN is set)
```
Test commands:
- "Show me all open issues"
- "List recent commits"
- "Create a new branch called 'feature/mcp-testing'"
- "What pull requests are open?"
```

### File System MCP (No config needed)
```
Test commands:
- "Find all components that use Supabase"
- "Show me the directory structure of src/components"
- "Search for TODO comments in TypeScript files"
- "List all files that import 'useAuth'"
```

---

## Step 4: Optional MCPs (For Later)

### Stripe MCP (For subscription feature)
**When to add:** When implementing subscription/payment features

**Setup:**
1. Create Stripe account (if not already)
2. Get TEST API keys from: https://dashboard.stripe.com/test/apikeys
3. Add to `.env.local`:
   ```bash
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```
4. Add to `.mcp.json`:
   ```json
   "stripe": {
     "type": "stdio",
     "command": "npx",
     "args": ["-y", "@stripe/mcp-server"],
     "env": {
       "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
     }
   }
   ```

**Test commands:**
```
- "List all Stripe products"
- "Create a test subscription for $9.99/month"
- "Show me all active subscriptions"
```

---

### PostgreSQL MCP (For advanced queries)
**When to add:** For complex database analysis and optimization

**Setup:**
1. Get Supabase database password from: https://supabase.com/dashboard/project/hfiznpxdopjdwtuenxqf/settings/database
2. Add to `.env.local`:
   ```bash
   POSTGRES_CONNECTION_STRING="postgresql://postgres:[YOUR_PASSWORD]@db.hfiznpxdopjdwtuenxqf.supabase.co:5432/postgres"
   ```
3. Add to `.mcp.json`:
   ```json
   "postgres": {
     "type": "stdio",
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-postgres"],
     "env": {
       "POSTGRES_CONNECTION_STRING": "${POSTGRES_CONNECTION_STRING}"
     }
   }
   ```

**Test commands:**
```
- "Analyze query performance for asset searches"
- "Show me the execution plan for the dashboard query"
- "What indexes are missing?"
```

---

### OpenAI MCP (For OCR improvements)
**When to add:** For optimizing OCR prompts and AI features

**Setup:**
1. Get API key from: https://platform.openai.com/api-keys
2. Add to `.env.local`:
   ```bash
   OPENAI_API_KEY="sk-..."
   ```
3. Add to `.mcp.json`:
   ```json
   "openai": {
     "type": "stdio",
     "command": "npx",
     "args": ["-y", "@openai/mcp-server"],
     "env": {
       "OPENAI_API_KEY": "${OPENAI_API_KEY}"
     }
   }
   ```

**Test commands:**
```
- "Test the OCR prompt with sample images"
- "Compare GPT-4 vs GPT-4o for asset categorization"
- "What's the token cost for OCR extraction?"
```

---

## Common MCP Commands by Task

### Development Workflow
```
# Start working on a feature
"Create a new branch called 'feature/stripe-payments'"
"Show me all files in src/components/payment"

# Database work
"Show me the schema for the assets table"
"Generate a migration to add 'stripe_customer_id' to profiles"

# Code exploration
"Find all components that use the useAuth hook"
"Show me TODO comments in the codebase"

# Testing
"What are the recent test failures?"
"Show me the CI/CD pipeline status"
```

### Code Review
```
"Show me changes in the last commit"
"List all files modified in the feature branch"
"What are the open pull requests?"
"Review the diff for PR #42"
```

### Database Analysis
```
"How many assets were created this week?"
"What's the average asset value by category?"
"Show me users who haven't created any assets"
"List all properties with more than 50 assets"
```

### Deployment & Monitoring
```
"Show me the latest deployment status"
"What GitHub Actions workflows are running?"
"Check if there are any failed Edge Functions"
"Show me database migrations pending"
```

---

## Troubleshooting

### "MCP server not responding"
```bash
# Check if environment variable is loaded
echo $GITHUB_TOKEN

# Restart Claude Code
# Exit and restart the CLI
```

### "Authentication failed"
```bash
# Verify GitHub token is valid
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user

# Check Supabase connection
curl https://hfiznpxdopjdwtuenxqf.supabase.co/rest/v1/
```

### "Permission denied"
```bash
# For File System MCP: Ensure paths are correct
ls -la /Users/craigj/Documents/snapassetai/src

# For GitHub MCP: Verify token scopes
# Go to: https://github.com/settings/tokens
# Click on your token and verify scopes
```

### "Command not found"
```bash
# Ensure npx is installed
npm --version

# Update to latest npm
npm install -g npm@latest
```

---

## Next Steps

1. **Read the full plan:** See `MCP_INTEGRATION_PLAN.md` for detailed documentation

2. **Add more MCPs:** As you need them, add Stripe, PostgreSQL, and OpenAI MCPs

3. **Create workflows:** Document your common MCP workflows for the team

4. **Optimize usage:** Track which MCPs save the most time and focus on those

5. **Stay updated:** MCP is evolving - check for new servers regularly

---

## Resources

- **MCP Documentation:** https://github.com/modelcontextprotocol/specification
- **Claude Code Docs:** https://docs.anthropic.com/claude/docs/model-context-protocol
- **Supabase MCP:** https://supabase.com/docs/guides/platform/mcp
- **GitHub MCP:** https://github.com/modelcontextprotocol/servers/tree/main/src/github

---

## Security Reminders

⚠️ **IMPORTANT:**
- Never commit `.env.local` to git (already in .gitignore)
- Use TEST keys for Stripe in development
- Rotate API keys every 90 days
- Never connect MCPs to production databases
- Review MCP permissions regularly

---

**Need Help?**
- Check `MCP_INTEGRATION_PLAN.md` for detailed info
- Review `MCP_SETUP.md` for Supabase-specific setup
- Create a GitHub issue for bugs or questions

**Last Updated:** 2025-11-02
