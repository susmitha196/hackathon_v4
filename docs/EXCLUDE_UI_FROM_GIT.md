# Exclude UI from Git - Instructions

## Why Exclude UI?
- Keep repository focused on backend code
- UI can be deployed separately via Vercel (connected to GitHub)
- Reduce repository size
- Separate concerns

## Step 1: Add to .gitignore

The `agentic-ai-website/` directory has been added to `.gitignore`. This prevents Git from tracking it.

## Step 2: Remove from Git Tracking (if already tracked)

If `agentic-ai-website` is already tracked by Git, you need to remove it from tracking (but keep the files locally):

### Option A: Remove entire directory from Git
```bash
git rm -r --cached agentic-ai-website
git commit -m "Remove UI directory from git tracking"
git push
```

### Option B: Remove specific files only
```bash
# Remove only certain files/folders
git rm -r --cached agentic-ai-website/node_modules
git rm -r --cached agentic-ai-website/dist
git commit -m "Remove UI build artifacts from git"
git push
```

**Important**: The `--cached` flag removes files from Git tracking but keeps them on your local filesystem.

## Step 3: Verify

Check that files are no longer tracked:
```bash
git status
```

You should NOT see `agentic-ai-website/` in the output.

## Step 4: Deploy UI Separately

Since the UI is excluded from the main repo, you have two options:

### Option A: Separate Git Repository (Recommended)
1. Create a new repository for the UI
2. Copy `agentic-ai-website/` to the new repo
3. Push to the new repo
4. Connect the new repo to Vercel

### Option B: Keep in Same Repo but Ignore
- Files stay local but won't be pushed
- Deploy manually or use a separate deployment process
- Vercel can still deploy if you connect the repo and set Root Directory

## Current Status

✅ `.gitignore` has been updated to exclude `agentic-ai-website/`

## Next Steps

1. **If UI is already tracked**: Run `git rm -r --cached agentic-ai-website`
2. **Commit the .gitignore change**: `git add .gitignore && git commit -m "Exclude UI from git"`
3. **Push**: `git push`

## Important Notes

- Files in `agentic-ai-website/` will remain on your local machine
- They just won't be tracked by Git anymore
- If you need to share the UI code, use a separate repository
- Vercel can deploy from a separate repo or you can deploy manually
