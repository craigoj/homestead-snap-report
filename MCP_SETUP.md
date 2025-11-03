# Supabase MCP Setup for Claude Code

This project is configured with the Supabase Model Context Protocol (MCP) server, allowing Claude Code CLI to interact with your Supabase database directly.

## Overview

The Supabase MCP server enables Claude Code to:
- 🗄️ **Query and manage database schema** - Design tables, generate migrations
- 📊 **Run SQL queries** - Query data and generate reports
- 🔄 **Generate migrations** - Create database migrations automatically
- 📝 **TypeScript types** - Generate type definitions from schema
- 📚 **Search documentation** - Access Supabase docs for answers

## Configuration

The MCP server is configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=hfiznpxdopjdwtuenxqf"
    }
  }
}
```

### Project Details
- **Project Ref:** `hfiznpxdopjdwtuenxqf`
- **Project URL:** https://hfiznpxdopjdwtuenxqf.supabase.co
- **MCP Endpoint:** https://mcp.supabase.com/mcp

## Authentication

The Supabase MCP server uses **OAuth authentication** with dynamic client registration. When you first use MCP commands with Claude Code, you'll be prompted to authenticate via browser.

### First-Time Setup

1. **Start Claude Code CLI** in this project:
   ```bash
   cd /path/to/snapassetai
   claude
   ```

2. **The first MCP command will trigger OAuth flow:**
   - A browser window will open
   - Log in to your Supabase account
   - Authorize Claude Code to access your project
   - Return to the terminal

3. **No manual token creation needed!** The OAuth flow handles authentication automatically.

### Manual Authentication (Optional)

If you need to use a Personal Access Token (PAT) instead (e.g., for CI/CD):

1. **Generate a PAT in Supabase Dashboard:**
   - Go to https://supabase.com/dashboard/account/tokens
   - Create a new token with appropriate permissions
   - Copy the token

2. **Update `.mcp.json` with authentication:**
   ```json
   {
     "mcpServers": {
       "supabase": {
         "type": "http",
         "url": "https://mcp.supabase.com/mcp?project_ref=hfiznpxdopjdwtuenxqf",
         "headers": {
           "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
         }
       }
     }
   }
   ```

3. **Add to your environment:**
   ```bash
   # .env.local
   SUPABASE_ACCESS_TOKEN=your_token_here
   ```

## Using MCP with Claude Code

Once configured, you can use natural language to interact with your database:

### Example Commands

**Schema Management:**
```
"Show me all tables in the database"
"What's the schema for the assets table?"
"Create a migration to add a 'tags' column to assets"
```

**Data Queries:**
```
"How many assets are in the database?"
"Show me all users who signed up this month"
"What's the average value of assets by category?"
```

**TypeScript Types:**
```
"Generate TypeScript types for the user_profiles table"
"Update types after the latest migration"
```

**Documentation:**
```
"How do I set up Row Level Security in Supabase?"
"What's the best way to handle file uploads?"
```

## Available MCP Tools

The Supabase MCP server provides these tools:

### Database Management
- `supabase_list_tables` - List all tables in the database
- `supabase_describe_table` - Get schema details for a table
- `supabase_execute_sql` - Run SQL queries (read-only by default)
- `supabase_generate_migration` - Create migration files

### Project Management
- `supabase_list_projects` - List all your Supabase projects
- `supabase_get_project_config` - Get project configuration
- `supabase_manage_branches` - Manage database branches

### Documentation
- `supabase_search_docs` - Search Supabase documentation
- `supabase_get_examples` - Get code examples and patterns

## Security Best Practices

⚠️ **IMPORTANT:** The MCP server is designed for **development and testing** only.

### Recommended Practices:

1. **Use with development database:**
   - Never connect MCP to production data
   - Create a separate development/staging project
   - Test migrations in dev before production

2. **Read-only mode (optional):**
   - For extra safety, you can configure read-only mode
   - Add `?mode=readonly` to the MCP URL
   - Example: `https://mcp.supabase.com/mcp?project_ref=hfiznpxdopjdwtuenxqf&mode=readonly`

3. **Access control:**
   - Use Supabase's project permissions
   - Limit team member access appropriately
   - Regularly rotate access tokens

4. **Development project:**
   - Current setup uses: `hfiznpxdopjdwtuenxqf`
   - This should be your **development** project
   - For production, create a separate project

## Troubleshooting

### MCP Server Not Found

If you get "MCP server not found" error:

1. **Check Claude Code version:**
   ```bash
   claude --version
   ```
   Ensure you have the latest version.

2. **Verify .mcp.json syntax:**
   ```bash
   cat .mcp.json | jq .
   ```
   Should parse without errors.

3. **Restart Claude Code:**
   ```bash
   # Exit and restart
   claude
   ```

### Authentication Failed

If OAuth fails:

1. **Check browser pop-ups are allowed**
2. **Verify you're logged into Supabase**
3. **Try manual PAT authentication** (see above)
4. **Check project access** - ensure you have permission to the project

### Permission Denied

If you get permission errors:

1. **Verify project ref** in `.mcp.json` matches your project
2. **Check Supabase dashboard** - ensure project is accessible
3. **Review access token permissions** if using PAT
4. **Verify RLS policies** don't block the queries

### Queries Not Working

If SQL queries fail:

1. **Check syntax** - use Supabase SQL editor first
2. **Verify table names** - schema may have changed
3. **Check permissions** - RLS may be blocking
4. **Try read-only mode** if writing fails

## Integration with Migration Plan

The MCP server is particularly useful during Next.js migration for:

### Week 1 (Auth & Infrastructure):
- Query user authentication data
- Verify RLS policies
- Generate auth-related migrations
- Check session data structure

### Week 2 (Stripe Integration):
- Create user_profiles columns for Stripe
- Test subscription status queries
- Verify webhook event logging
- Generate payment-related migrations

### Week 3 (Smart Scan & Testing):
- Query jumpstart session data
- Analyze user activation metrics
- Test asset queries for performance
- Generate reports on usage data

## Example Workflows

### 1. Adding a New Feature with Database Changes

```
You: "I need to add a 'favorite' feature to assets"

Claude (via MCP):
- Checks current assets table schema
- Suggests adding a favorites table or boolean field
- Generates migration SQL
- Creates TypeScript types
- Updates RLS policies if needed
```

### 2. Debugging Database Issues

```
You: "Users are reporting missing assets"

Claude (via MCP):
- Queries assets table with user filters
- Checks RLS policies
- Examines audit logs if available
- Suggests fixes and generates test queries
```

### 3. Performance Optimization

```
You: "Asset queries are slow"

Claude (via MCP):
- Analyzes query execution plans
- Checks for missing indexes
- Suggests index creation
- Generates optimized migration
- Tests performance improvement
```

## Additional Resources

- [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp)
- [Model Context Protocol Spec](https://github.com/modelcontextprotocol/specification)
- [Claude Code MCP Guide](https://docs.claude.com/claude-code/mcp)
- [Supabase Dashboard](https://supabase.com/dashboard)

## Next Steps

1. ✅ Configuration file created (`.mcp.json`)
2. ⏳ Test MCP connection with Claude Code
3. ⏳ Try a simple query: "Show me all tables"
4. ⏳ Use MCP during Next.js migration tasks
5. ⏳ Consider creating a staging project for safer testing

---

**Project:** SnapAsset AI
**Environment:** Development
**Supabase Project:** hfiznpxdopjdwtuenxqf
**Last Updated:** 2025-11-02
