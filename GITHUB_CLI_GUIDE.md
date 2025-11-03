# GitHub CLI - Project Management Guide

## Overview
GitHub CLI (gh) v2.82.1 is now installed! Manage your entire GitHub workflow from the command line - create PRs, manage issues, view repos, and more.

---

## Installation

✅ **GitHub CLI v2.82.1** - Installed at `~/bin/gh`
✅ **npm Scripts** - Added 7 helpful commands to package.json
✅ **Ready to Use** - Just need to authenticate

---

## Getting Started

### 1. Authenticate with GitHub

**First time setup:**
```bash
npm run gh:auth
```
Or:
```bash
~/bin/gh auth login
```

**Choose your preferences:**
1. **GitHub.com** or GitHub Enterprise
2. **Protocol**: HTTPS or SSH (HTTPS recommended)
3. **Authenticate**: Browser or Token
4. **Git protocol**: HTTPS or SSH

The CLI will:
- Open your browser
- Authenticate with GitHub
- Store credentials securely
- Configure git to use gh

### 2. Verify Authentication

```bash
npm run gh:status
```

Should show:
```
✓ Logged in to github.com as YOUR_USERNAME
✓ Git operations for github.com configured to use https protocol
✓ Token: ghp_************************************
```

---

## Common Commands

### Repository Management

```bash
# View current repository info
npm run gh:repo

# View a specific repository
~/bin/gh repo view owner/repo

# Clone a repository
~/bin/gh repo clone owner/repo

# Create a new repository
~/bin/gh repo create project-name --public --clone

# Fork a repository
~/bin/gh repo fork owner/repo --clone

# Open repo in browser
npm run gh:browse
```

### Pull Requests

```bash
# List all PRs
npm run gh:prs

# List your PRs
~/bin/gh pr list --author "@me"

# View a specific PR
~/bin/gh pr view 123

# Create a new PR
npm run gh:create-pr

# Create PR with all options
~/bin/gh pr create --title "Feature: Add X" --body "Description" --base main

# Check out a PR locally
~/bin/gh pr checkout 123

# Review a PR
~/bin/gh pr review 123 --approve
~/bin/gh pr review 123 --request-changes --body "Please fix X"

# Merge a PR
~/bin/gh pr merge 123 --squash
~/bin/gh pr merge 123 --merge
~/bin/gh pr merge 123 --rebase

# Close a PR
~/bin/gh pr close 123
```

### Issues

```bash
# List all issues
npm run gh:issues

# List open issues assigned to you
~/bin/gh issue list --assignee "@me"

# Create a new issue
~/bin/gh issue create --title "Bug: X doesn't work" --body "Description"

# View an issue
~/bin/gh issue view 456

# Comment on an issue
~/bin/gh issue comment 456 --body "This is fixed in PR #123"

# Close an issue
~/bin/gh issue close 456

# Reopen an issue
~/bin/gh issue reopen 456

# Assign an issue
~/bin/gh issue edit 456 --add-assignee username

# Add labels
~/bin/gh issue edit 456 --add-label bug,priority:high
```

### Releases

```bash
# List releases
~/bin/gh release list

# Create a release
~/bin/gh release create v1.0.0 --title "Version 1.0.0" --notes "Release notes"

# Upload release assets
~/bin/gh release upload v1.0.0 dist/*.tar.gz

# View a release
~/bin/gh release view v1.0.0

# Delete a release
~/bin/gh release delete v1.0.0
```

---

## npm Scripts Available

| Command | Description |
|---------|-------------|
| `npm run gh:auth` | Authenticate with GitHub |
| `npm run gh:status` | Check authentication status |
| `npm run gh:repo` | View current repository |
| `npm run gh:issues` | List all issues |
| `npm run gh:prs` | List all pull requests |
| `npm run gh:create-pr` | Create a new pull request |
| `npm run gh:browse` | Open repository in browser |

---

## Workflow Examples

### Daily Development Workflow

```bash
# 1. Check what's happening
npm run gh:issues          # See open issues
npm run gh:prs             # See open PRs

# 2. Create a feature branch
git checkout -b feature/new-thing

# 3. Make changes and commit
git add .
git commit -m "feat: add new thing"

# 4. Push and create PR
git push -u origin feature/new-thing
npm run gh:create-pr

# 5. Review and merge
~/bin/gh pr view
~/bin/gh pr merge --squash
```

### Creating a Pull Request

```bash
# Method 1: Interactive (recommended)
npm run gh:create-pr

# Method 2: With all details
~/bin/gh pr create \
  --title "feat: Add user authentication" \
  --body "Implements login/logout functionality" \
  --base main \
  --head feature/auth

# Method 3: From template
~/bin/gh pr create --fill  # Uses commit messages

# Add reviewers
~/bin/gh pr create \
  --title "Fix bug" \
  --body "Description" \
  --reviewer username1,username2

# Add labels and assignees
~/bin/gh pr create \
  --title "Feature" \
  --body "Description" \
  --label feature,enhancement \
  --assignee @me
```

### Reviewing Pull Requests

```bash
# List PRs needing review
~/bin/gh pr list --search "review:required"

# Check out PR locally to test
~/bin/gh pr checkout 123
npm run dev:next  # Test it

# Review with feedback
~/bin/gh pr review 123 --comment --body "LGTM, just one small thing..."
~/bin/gh pr review 123 --approve
~/bin/gh pr review 123 --request-changes --body "Please fix X"

# Merge after approval
~/bin/gh pr merge 123 --squash
```

### Managing Issues

```bash
# Create bug report
~/bin/gh issue create \
  --title "Bug: Dashboard not loading" \
  --body "Steps to reproduce: ..." \
  --label bug,priority:high \
  --assignee @me

# Link issue to PR
~/bin/gh pr create \
  --title "Fix dashboard loading" \
  --body "Fixes #456"  # Links to issue

# Bulk operations
~/bin/gh issue list --label bug --json number --jq '.[].number' | \
  xargs -I {} gh issue edit {} --add-label needs-triage
```

### Release Management

```bash
# Create a release from tag
git tag v1.0.0
git push --tags
~/bin/gh release create v1.0.0 \
  --title "Version 1.0.0" \
  --notes "Release notes here"

# Upload build artifacts
npm run build:next
~/bin/gh release upload v1.0.0 .next/**/*

# Create draft release
~/bin/gh release create v1.1.0 \
  --draft \
  --title "Version 1.1.0 (Draft)" \
  --notes "Draft release notes"

# Publish draft
~/bin/gh release edit v1.1.0 --draft=false
```

---

## Advanced Features

### Actions & Workflows

```bash
# List workflow runs
~/bin/gh run list

# View specific run
~/bin/gh run view 12345

# Watch a running workflow
~/bin/gh run watch

# Re-run a failed workflow
~/bin/gh run rerun 12345

# View workflow logs
~/bin/gh run view 12345 --log
```

### Gists

```bash
# Create a gist
~/bin/gh gist create file.js --public
~/bin/gh gist create file.js --secret

# List your gists
~/bin/gh gist list

# View a gist
~/bin/gh gist view GIST_ID

# Edit a gist
~/bin/gh gist edit GIST_ID
```

### GitHub API

```bash
# Make API requests
~/bin/gh api repos/:owner/:repo/issues

# Get user info
~/bin/gh api user

# List repository collaborators
~/bin/gh api repos/:owner/:repo/collaborators

# Create an issue via API
~/bin/gh api repos/:owner/:repo/issues -f title="Bug" -f body="Description"
```

### Aliases

Create shortcuts for common commands:

```bash
# Create alias
~/bin/gh alias set prs 'pr list --author "@me"'
~/bin/gh alias set issues-me 'issue list --assignee "@me"'

# Use alias
~/bin/gh prs
~/bin/gh issues-me

# List aliases
~/bin/gh alias list
```

---

## Integration with Your Project

### Automated PR Creation

Create this script in your project:

```bash
# scripts/create-pr.sh
#!/bin/bash

BRANCH=$(git branch --show-current)
TITLE=$(git log -1 --pretty=%B)

~/bin/gh pr create \
  --title "$TITLE" \
  --body "Automated PR from branch $BRANCH" \
  --base main \
  --head "$BRANCH"
```

### Issue from Error Logs

```bash
# scripts/create-bug-issue.sh
#!/bin/bash

ERROR_LOG=$1

~/bin/gh issue create \
  --title "Bug: $(head -1 $ERROR_LOG)" \
  --body "$(cat $ERROR_LOG)" \
  --label bug,needs-triage
```

### Auto-assign PRs

```bash
# .github/workflows/auto-assign.yml
name: Auto-assign PR
on:
  pull_request:
    types: [opened]

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - name: Assign to author
        run: gh pr edit ${{ github.event.pull_request.number }} --add-assignee ${{ github.event.pull_request.user.login }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Project-Specific Workflows

### SnapAsset AI Development

```bash
# Start new feature
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: implement new feature"
git push -u origin feature/new-feature

# Create PR with template
~/bin/gh pr create \
  --title "Feature: New Feature" \
  --body "## Summary

  Description of changes

  ## Test Plan
  - [ ] Unit tests pass
  - [ ] Integration tests pass
  - [ ] Manual testing complete

  ## Related Issues
  Closes #123" \
  --label enhancement \
  --assignee @me

# Request review from team
~/bin/gh pr edit --add-reviewer teammate1,teammate2
```

### Bug Fix Workflow

```bash
# Create issue for bug
~/bin/gh issue create \
  --title "Bug: Specific issue" \
  --body "Steps to reproduce..." \
  --label bug,priority:high

# Create branch from issue
ISSUE_NUM=$(~/bin/gh issue list --limit 1 --json number --jq '.[0].number')
git checkout -b fix/issue-$ISSUE_NUM

# Fix and create PR
# ... make fixes ...
~/bin/gh pr create \
  --title "Fix: Resolve issue #$ISSUE_NUM" \
  --body "Fixes #$ISSUE_NUM"
```

---

## GitHub Actions Integration

### View CI/CD Status

```bash
# Check latest workflow run
~/bin/gh run list --limit 1

# Watch current run
~/bin/gh run watch

# View logs if failed
~/bin/gh run view --log
```

### Trigger Workflows Manually

```bash
# Trigger a workflow dispatch event
~/bin/gh workflow run deploy.yml

# With inputs
~/bin/gh workflow run deploy.yml \
  -f environment=production \
  -f version=v1.0.0
```

---

## Tips & Tricks

### 1. Set Default Repository

```bash
# Set default repo for current directory
cd /path/to/your/repo
~/bin/gh repo set-default

# Now commands work without specifying repo
~/bin/gh pr list
~/bin/gh issue create
```

### 2. Use JSON Output for Scripting

```bash
# Get PR numbers as JSON
~/bin/gh pr list --json number,title

# Use with jq
~/bin/gh pr list --json number --jq '.[].number'

# Get all open issues
~/bin/gh issue list --state open --json number,title
```

### 3. Templates for Issues/PRs

Create `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
## Summary
Brief description of changes

## Test Plan
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing complete

## Related Issues
Closes #

## Screenshots (if applicable)
```

Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug Report
about: Create a report to help us improve
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.
```

### 4. Quick Commands

```bash
# Open current repo in browser
npm run gh:browse

# Open specific PR
~/bin/gh pr view 123 --web

# Open specific issue
~/bin/gh issue view 456 --web

# Compare branches
~/bin/gh browse -- compare/main...feature-branch
```

---

## Troubleshooting

### Authentication Issues

```bash
# Re-authenticate
npm run gh:auth

# Check status
npm run gh:status

# Logout and login again
~/bin/gh auth logout
npm run gh:auth
```

### Permission Denied

```bash
# Check repo permissions
~/bin/gh repo view

# Ensure you have push access
~/bin/gh api repos/:owner/:repo | grep -A2 permissions
```

### Rate Limiting

GitHub API has rate limits:
- **Authenticated**: 5,000 requests per hour
- **Unauthenticated**: 60 requests per hour

```bash
# Check rate limit status
~/bin/gh api rate_limit
```

---

## Keyboard Shortcuts in Browser

When using `gh browse`:
- `?` - Show keyboard shortcuts
- `t` - Open file finder
- `s` or `/` - Focus search bar
- `g n` - Go to notifications
- `g i` - Go to issues
- `g p` - Go to pull requests

---

## Resources

- **GitHub CLI Docs**: https://cli.github.com/manual/
- **GitHub CLI Repository**: https://github.com/cli/cli
- **GitHub API Docs**: https://docs.github.com/en/rest

---

## Quick Reference

### Essential Commands
```bash
# Authentication
npm run gh:auth
npm run gh:status

# Pull Requests
npm run gh:prs                    # List PRs
npm run gh:create-pr              # Create PR
~/bin/gh pr checkout 123          # Checkout PR
~/bin/gh pr merge 123 --squash    # Merge PR

# Issues
npm run gh:issues                 # List issues
~/bin/gh issue create             # Create issue
~/bin/gh issue view 456           # View issue

# Repository
npm run gh:repo                   # View repo
npm run gh:browse                 # Open in browser

# Workflows
~/bin/gh run list                 # List runs
~/bin/gh run watch                # Watch current run
```

---

**Your GitHub CLI is ready! Authenticate with `npm run gh:auth` to get started 🚀**
