# Supabase Local Development Guide

## Overview
Your local Supabase instance is now running with Docker! This gives you a complete Supabase environment for local development.

---

## Quick Access URLs

### Development Tools
- **Supabase Studio**: http://127.0.0.1:54323
  - Full database management UI (like Supabase cloud dashboard)
  - View tables, run queries, manage storage

- **Mailpit**: http://127.0.0.1:54324
  - Email testing interface
  - View all emails sent during local development

### API Endpoints
- **API URL**: http://127.0.0.1:54321
- **GraphQL URL**: http://127.0.0.1:54321/graphql/v1
- **Storage URL**: http://127.0.0.1:54321/storage/v1/s3
- **MCP URL**: http://127.0.0.1:54321/mcp

### Database Connection
```
postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### API Keys
- **Publishable Key**: `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH`
- **Secret Key**: `sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz`

---

## Supabase CLI Commands

The Supabase CLI is installed at `~/bin/supabase`. Here are the most common commands:

### Starting & Stopping

```bash
# Start local Supabase (downloads Docker images on first run)
~/bin/supabase start

# Stop local Supabase (keeps data)
~/bin/supabase stop

# Stop and remove all data
~/bin/supabase stop --no-backup

# Restart services
~/bin/supabase restart
```

### Database Management

```bash
# Check status of all services
~/bin/supabase status

# Reset database (deletes all data)
~/bin/supabase db reset

# Create a new migration
~/bin/supabase migration new <migration_name>

# Apply migrations
~/bin/supabase db push

# Pull schema from remote to local
~/bin/supabase db pull

# Dump database to SQL file
~/bin/supabase db dump -f backup.sql
```

### Database Diffing & Migrations

```bash
# Generate migration from current schema changes
~/bin/supabase db diff -f <migration_name>

# List all migrations
~/bin/supabase migration list

# Apply specific migration
~/bin/supabase migration up
```

### Edge Functions

```bash
# Create new Edge Function
~/bin/supabase functions new <function_name>

# Serve Edge Functions locally
~/bin/supabase functions serve

# Deploy Edge Function to remote
~/bin/supabase functions deploy <function_name>
```

### Remote Project Linking

```bash
# Link to your cloud project (optional)
~/bin/supabase link --project-ref hfiznpxdopjdwtuenxqf

# Check current link status
~/bin/supabase status

# Unlink from remote project
~/bin/supabase unlink
```

### Type Generation

```bash
# Generate TypeScript types from local schema
~/bin/supabase gen types typescript --local > src/lib/supabase/database.types.ts

# Generate from remote project (requires link)
~/bin/supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

---

## Workflow Examples

### 1. Daily Development Workflow

```bash
# Start Supabase
~/bin/supabase start

# Start your Next.js app
npm run dev:next

# Open Studio to view/manage data
open http://127.0.0.1:54323

# When done for the day
~/bin/supabase stop
```

### 2. Making Schema Changes

```bash
# Option A: Use Studio UI
# 1. Open Studio at http://127.0.0.1:54323
# 2. Make changes via UI (create tables, columns, etc.)
# 3. Generate migration from changes
~/bin/supabase db diff -f add_new_feature

# Option B: Write SQL migration directly
# 1. Create migration file
~/bin/supabase migration new add_new_table

# 2. Edit the migration file in supabase/migrations/
# 3. Apply the migration
~/bin/supabase db reset
```

### 3. Testing Email Flows

```bash
# 1. Your app sends email (using local Supabase)
# 2. View email in Mailpit
open http://127.0.0.1:54324

# All emails are caught by Mailpit instead of being sent
# Great for testing signup, password reset, etc.
```

### 4. Syncing with Cloud Project

```bash
# Pull production schema to local
~/bin/supabase link --project-ref hfiznpxdopjdwtuenxqf
~/bin/supabase db pull

# After developing locally, push migrations to cloud
~/bin/supabase db push
```

---

## Environment Variables

The `.env.local` file has been configured to use your local Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

To switch back to cloud Supabase:
1. Rename or delete `.env.local`
2. The app will use `.env` values instead

---

## Docker Containers

Supabase local development uses these Docker containers:

- **supabase_db_\*** - PostgreSQL database
- **supabase_auth_\*** - GoTrue (Auth server)
- **supabase_rest_\*** - PostgREST (API server)
- **supabase_realtime_\*** - Realtime subscriptions
- **supabase_storage_\*** - Storage API
- **supabase_kong_\*** - API Gateway
- **supabase_studio_\*** - Studio UI
- **supabase_mailpit_\*** - Email testing
- **supabase_vector_\*** - Vector/Analytics
- **supabase_edge_runtime_\*** - Edge Functions runtime

View running containers:
```bash
docker ps | grep supabase
```

---

## Troubleshooting

### Services won't start
```bash
# Check Docker is running
docker ps

# Stop and restart
~/bin/supabase stop
~/bin/supabase start
```

### Port conflicts
If ports 54321-54324 are already in use, edit `supabase/config.toml`:
```toml
[api]
port = 54321  # Change this

[db]
port = 54322  # Change this

[studio]
port = 54323  # Change this
```

### Database reset needed
```bash
# Reset database to initial state (runs all migrations fresh)
~/bin/supabase db reset
```

### Can't connect to database
```bash
# Check all services are running
~/bin/supabase status

# Should show all services as "running"
```

### Clear all data and start fresh
```bash
# Stop and remove all volumes
~/bin/supabase stop --no-backup

# Start fresh
~/bin/supabase start
```

---

## Useful Tips

### 1. Add alias for easier access
Add to `~/.zshrc` or `~/.bashrc`:
```bash
alias supabase='~/bin/supabase'
```

Then you can use:
```bash
supabase start
supabase status
```

### 2. Auto-start with your app
Add to `package.json` scripts:
```json
{
  "scripts": {
    "dev": "supabase start && npm run dev:next",
    "supabase:start": "~/bin/supabase start",
    "supabase:stop": "~/bin/supabase stop",
    "supabase:status": "~/bin/supabase status"
  }
}
```

### 3. Seed data for testing
Create `supabase/seed.sql`:
```sql
-- Insert test data
INSERT INTO users (email) VALUES ('test@example.com');
```

Run on reset:
```bash
~/bin/supabase db reset
```

### 4. Use Studio for quick testing
- Create test users
- Insert sample data
- Test RLS policies
- View query performance

---

## Next Steps

### Recommended Setup

1. **Link to your cloud project** (optional):
   ```bash
   ~/bin/supabase link --project-ref hfiznpxdopjdwtuenxqf
   ```

2. **Pull production schema**:
   ```bash
   ~/bin/supabase db pull
   ```

3. **Create seed data** in `supabase/seed.sql`

4. **Generate TypeScript types**:
   ```bash
   ~/bin/supabase gen types typescript --local > src/lib/supabase/types-local.ts
   ```

5. **Test your app** against local Supabase:
   ```bash
   npm run dev:next
   ```

---

## Resources

- **Supabase Local Development**: https://supabase.com/docs/guides/cli/local-development
- **CLI Reference**: https://supabase.com/docs/reference/cli/introduction
- **Migrations**: https://supabase.com/docs/guides/cli/local-development#database-migrations
- **Edge Functions**: https://supabase.com/docs/guides/functions

---

**Your local Supabase is ready to use! 🎉**

Access Studio at http://127.0.0.1:54323 to get started.
