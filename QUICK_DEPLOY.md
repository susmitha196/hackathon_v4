# 🚀 Quick Deployment Guide

## Deploy Your Full Stack App in 15 Minutes

### Part 1: Deploy Backend (5 minutes)

**Using Railway (Easiest):**

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. In Settings → Deploy:
   - Start Command: `uvicorn src.api:app --host 0.0.0.0 --port $PORT`
5. In Variables tab, add:
   - `OPENAI_API_KEY` = (your key, optional)
   - `GEMINI_API_KEY` = (your key, optional)
   - `N8N_WEBHOOK_URL` = (your webhook, optional)
6. Wait for deployment → Copy the URL (e.g., `https://your-app.railway.app`)

**✅ Test**: Open `https://your-backend-url/health` - should show `{"status":"healthy"}`

---

### Part 2: Deploy Frontend (5 minutes)

**Using Vercel:**

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New" → "Project" → Import your repo
3. **IMPORTANT**: In Settings → General:
   - Set **Root Directory** to: `agentic-ai-website`
4. In Settings → Environment Variables:
   - Add: `VITE_FACTORY_COPILOT_API_URL`
   - Value: Your backend URL from Part 1
   - Example: `https://your-app.railway.app`
5. Click "Deploy"

**✅ Test**: Open your Vercel URL → Should load the homepage

---

### Part 3: Verify Connection (5 minutes)

1. Open your Vercel frontend URL
2. Navigate to: `/services/factory-orchestrator/dashboard`
3. Select "Live Generation"
4. Open Browser DevTools (F12) → Network tab
5. Verify API calls are going to your backend URL
6. Check that sensor data appears

**✅ Success Indicators:**
- ✅ No CORS errors in console
- ✅ Sensor data appears
- ✅ ML predictions show up
- ✅ API calls return 200 status

---

## 🎯 That's It!

Your app is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`

## 🔧 Troubleshooting

**Frontend can't connect to backend?**
- Check `VITE_FACTORY_COPILOT_API_URL` is set in Vercel
- Verify backend URL is accessible (try `/health` endpoint)
- Check browser console for errors

**404 errors?**
- Verify Root Directory is set to `agentic-ai-website` in Vercel
- Check `vercel.json` exists in `agentic-ai-website/` folder

**Build fails?**
- Check Vercel build logs
- Verify `package.json` has `"build": "vite build"`

---

## 📚 Need More Details?

- See `docs/DEPLOYMENT_CHECKLIST.md` for step-by-step checklist
- See `docs/VERCEL_DEPLOYMENT.md` for detailed Vercel setup
- See `docs/BACKEND_DEPLOYMENT.md` for backend deployment options
