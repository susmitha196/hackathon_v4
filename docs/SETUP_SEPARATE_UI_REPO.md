# Setup Separate Repository for UI

## Step 1: Create New GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon → **New repository**
3. Name it: `factory-copilot-ui` (or any name you prefer)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **Create repository**
7. **Copy the repository URL** (e.g., `https://github.com/yourusername/factory-copilot-ui.git`)

## Step 2: Initialize Git in UI Directory

Run these commands in the `agentic-ai-website` directory:

```bash
cd agentic-ai-website
git init
git add .
git commit -m "Initial commit: Factory Copilot UI"
```

## Step 3: Connect to New Repository

```bash
git remote add origin https://github.com/yourusername/factory-copilot-ui.git
git branch -M main
git push -u origin main
```

## Step 4: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **Add New** → **Project**
3. Import the **new UI repository** (factory-copilot-ui)
4. Set **Root Directory** to: `/` (or leave empty)
5. Add environment variable:
   - `VITE_FACTORY_COPILOT_API_URL` = Your Railway backend URL
6. Deploy

## Benefits

- ✅ Separate repositories for backend and frontend
- ✅ Independent version control
- ✅ Easier collaboration
- ✅ Cleaner git history
- ✅ Separate deployment pipelines
