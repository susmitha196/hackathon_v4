# Push Backend to New Repository (Without UI)

## Step 1: Create New GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon → **New repository**
3. Name it: `factory-copilot-backend` (or any name you prefer)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **Create repository**
7. **Copy the repository URL** (e.g., `https://github.com/yourusername/factory-copilot-backend.git`)

## Step 2: Add New Remote

Run these commands in your project root:

```bash
# Add the new repository as a remote (name it 'new-origin' or 'backend')
git remote add backend https://github.com/yourusername/factory-copilot-backend.git

# Verify remotes
git remote -v
```

## Step 3: Push to New Repository

```bash
# Push current branch to new repository
git push backend master

# Or if your default branch is 'main':
git push backend main
```

## Step 4: Verify

1. Go to your new GitHub repository
2. Verify all files are there (except agentic-ai-website)
3. Check that .gitignore excludes the UI directory

## Alternative: Push Only Current State

If you want to push only what's currently committed:

```bash
# Push to new remote
git push backend HEAD:master
```

## Notes

- ✅ The UI directory (`agentic-ai-website/`) is already in `.gitignore`, so it won't be pushed
- ✅ All backend code (src/, scripts/, docs/, etc.) will be included
- ✅ You can keep both remotes if needed
- ✅ The UI can be in a separate repository
