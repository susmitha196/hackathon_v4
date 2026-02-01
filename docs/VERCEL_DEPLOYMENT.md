# Vercel Deployment Guide

## Overview
This guide will help you deploy the React UI on Vercel and connect it to your FastAPI backend.

## Prerequisites
1. Vercel account (free tier works)
2. Backend API deployed and accessible (see Backend Deployment section)
3. Git repository with your code

## Step 1: Deploy Backend API

### Option A: Deploy on Railway (Recommended - Easy)
1. Go to [Railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Python
6. Set these environment variables:
   - `OPENAI_API_KEY` (if using AI explanations)
   - `GEMINI_API_KEY` (if using Gemini analysis)
   - `N8N_WEBHOOK_URL` (if using n8n automation)
7. Railway will provide a URL like: `https://your-app.railway.app`
8. **Copy this URL** - you'll need it for the frontend

### Option B: Deploy on Render
1. Go to [Render.com](https://render.com)
2. Sign up/login
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn src.api:app --host 0.0.0.0 --port $PORT`
   - Environment: Python 3
6. Add environment variables (same as Railway)
7. Render will provide: `https://your-app.onrender.com`

### Option C: Deploy on PythonAnywhere/Heroku/Other
- Follow your platform's Python deployment guide
- Ensure the API is accessible via HTTPS
- Note the base URL

## Step 2: Configure Vercel for Frontend

### 2.1 Connect Repository to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Important**: Set Root Directory to `agentic-ai-website`
   - In project settings → General → Root Directory
   - Enter: `agentic-ai-website`

### 2.2 Configure Build Settings
Vercel should auto-detect Vite, but verify:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm ci`

### 2.3 Add Environment Variables
In Vercel project settings → Environment Variables, add:

```
VITE_FACTORY_COPILOT_API_URL=https://your-backend-url.railway.app
```

Replace `https://your-backend-url.railway.app` with your actual backend URL.

**Important**: 
- Variable name must start with `VITE_` for Vite to expose it
- Add for all environments (Production, Preview, Development)

### 2.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Vercel will provide a URL like: `https://your-app.vercel.app`

## Step 3: Verify Backend CORS Configuration

Ensure your backend allows requests from your Vercel domain:

```python
# In src/api.py, the CORS middleware should allow your Vercel domain:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",
        "https://*.vercel.app",  # Allows all Vercel preview deployments
        "http://localhost:5173",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Or use `allow_origins=["*"]` for development (less secure but easier).

## Step 4: Test the Deployment

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Navigate to Live Monitoring Dashboard
3. Check browser console (F12) for any API errors
4. Test features:
   - Live data generation
   - ML predictions
   - AI explanations
   - n8n automation triggers

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_FACTORY_COPILOT_API_URL` is set correctly in Vercel
- Verify backend URL is accessible (try opening in browser)
- Check browser console for CORS errors
- Ensure backend CORS allows your Vercel domain

### 404 errors on routes
- Verify `vercel.json` has rewrites configuration
- Check Root Directory is set to `agentic-ai-website`
- Ensure build completed successfully

### Build fails
- Check build logs in Vercel dashboard
- Verify `package.json` has correct build script
- Ensure all dependencies are in `package.json`

### API returns errors
- Check backend logs
- Verify environment variables are set in backend
- Test backend endpoints directly (use Postman/curl)

## Quick Reference

### Environment Variables Needed

**Frontend (Vercel):**
- `VITE_FACTORY_COPILOT_API_URL` - Backend API URL

**Backend (Railway/Render/etc):**
- `OPENAI_API_KEY` - For AI explanations
- `GEMINI_API_KEY` - For Gemini trend analysis
- `N8N_WEBHOOK_URL` - For automation triggers

### URLs to Note
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app` (or your provider)

## Next Steps
1. Set up custom domain (optional)
2. Configure monitoring/analytics
3. Set up CI/CD for automatic deployments
4. Add error tracking (Sentry, etc.)
