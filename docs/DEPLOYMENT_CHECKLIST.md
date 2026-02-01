# Deployment Checklist

## ✅ Step-by-Step Deployment Guide

### Phase 1: Deploy Backend API

- [ ] **Choose a platform** (Railway recommended - easiest)
  - [ ] Sign up at [railway.app](https://railway.app)
  - [ ] Connect GitHub account
  - [ ] Create new project from GitHub repo

- [ ] **Configure Backend**
  - [ ] Set start command: `uvicorn src.api:app --host 0.0.0.0 --port $PORT`
  - [ ] Add environment variables:
    - [ ] `OPENAI_API_KEY` (optional - for AI explanations)
    - [ ] `GEMINI_API_KEY` (optional - for Gemini analysis)
    - [ ] `N8N_WEBHOOK_URL` (optional - for automation)
  - [ ] Deploy and wait for success
  - [ ] **Copy backend URL** (e.g., `https://your-app.railway.app`)

- [ ] **Test Backend**
  - [ ] Open `https://your-backend-url/health` in browser
  - [ ] Should see: `{"status":"healthy","model_trained":true}`
  - [ ] Test API endpoint: `https://your-backend-url/api/info`

### Phase 2: Deploy Frontend on Vercel

- [ ] **Connect Repository**
  - [ ] Go to [vercel.com](https://vercel.com)
  - [ ] Click "Add New" → "Project"
  - [ ] Import your GitHub repository

- [ ] **Configure Project Settings**
  - [ ] **Root Directory**: Set to `agentic-ai-website`
    - Go to Settings → General → Root Directory
    - Enter: `agentic-ai-website`
  - [ ] Verify Framework: Vite (auto-detected)
  - [ ] Build Command: `npm run build` (auto-detected)
  - [ ] Output Directory: `dist` (auto-detected)

- [ ] **Add Environment Variables**
  - [ ] Go to Settings → Environment Variables
  - [ ] Add: `VITE_FACTORY_COPILOT_API_URL`
  - [ ] Value: Your backend URL (from Phase 1)
    - Example: `https://your-app.railway.app`
  - [ ] Select all environments (Production, Preview, Development)
  - [ ] Save

- [ ] **Deploy**
  - [ ] Click "Deploy" button
  - [ ] Wait for build to complete
  - [ ] **Copy frontend URL** (e.g., `https://your-app.vercel.app`)

### Phase 3: Verify Everything Works

- [ ] **Test Frontend**
  - [ ] Open your Vercel URL in browser
  - [ ] Navigate to different pages (Home, Login, Dashboard)
  - [ ] Check browser console (F12) for errors

- [ ] **Test Live Monitoring Dashboard**
  - [ ] Go to `/services/factory-orchestrator/dashboard`
  - [ ] Select "Live Generation"
  - [ ] Verify data is being generated
  - [ ] Check if API calls are working (Network tab in DevTools)

- [ ] **Test Backend Connection**
  - [ ] Open browser DevTools → Network tab
  - [ ] Navigate to Live Monitoring Dashboard
  - [ ] Look for API calls to your backend URL
  - [ ] Verify responses are successful (status 200)

- [ ] **Test Features**
  - [ ] Live sensor data generation
  - [ ] ML predictions (Downtime Risk Score)
  - [ ] AI explanations (if OpenAI key is set)
  - [ ] Error code determination
  - [ ] n8n automation (if webhook URL is set)

## 🔧 Troubleshooting

### Frontend shows "Failed to fetch" or CORS errors
- ✅ Backend CORS is already configured to allow all origins
- Check backend URL is correct in Vercel environment variables
- Verify backend is accessible (try opening `/health` endpoint)

### 404 errors on routes
- Verify `vercel.json` exists in `agentic-ai-website/` directory
- Check Root Directory is set correctly in Vercel
- Ensure rewrites configuration is present

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Verify `package.json` has correct build script: `"build": "vite build"`
- Ensure all dependencies are listed in `package.json`

### Backend not responding
- Check backend logs in Railway/Render dashboard
- Verify environment variables are set
- Test backend URL directly in browser
- Check if backend is running (look for "Application startup complete" in logs)

## 📝 Quick Reference

### URLs to Save
- **Backend URL**: `https://your-backend.railway.app`
- **Frontend URL**: `https://your-frontend.vercel.app`

### Environment Variables

**Vercel (Frontend):**
```
VITE_FACTORY_COPILOT_API_URL=https://your-backend.railway.app
```

**Railway/Render (Backend):**
```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
```

## 🎉 Success Criteria

You'll know everything is working when:
1. ✅ Frontend loads without errors
2. ✅ Live Monitoring Dashboard shows sensor data
3. ✅ ML predictions appear (Downtime Risk Score)
4. ✅ No CORS errors in browser console
5. ✅ API calls succeed (check Network tab)

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- See `VERCEL_DEPLOYMENT.md` for detailed instructions
- See `BACKEND_DEPLOYMENT.md` for backend-specific details
