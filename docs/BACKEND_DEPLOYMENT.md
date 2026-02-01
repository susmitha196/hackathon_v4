# Backend Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Easiest - Recommended)

1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **Create Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your hackathon repository
4. **Configure**:
   - Railway auto-detects Python
   - It will look for `requirements.txt` in the root
   - Set the start command: `uvicorn src.api:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**: Add these in Railway dashboard:
   ```
   OPENAI_API_KEY=your_openai_key
   GEMINI_API_KEY=your_gemini_key
   N8N_WEBHOOK_URL=your_n8n_webhook_url
   ```
6. **Deploy**: Railway will automatically deploy
7. **Get URL**: Railway provides a URL like `https://your-app.railway.app`
   - Copy this URL for your frontend configuration

### Option 2: Render

1. **Sign up**: Go to [render.com](https://render.com)
2. **New Web Service**: Click "New" → "Web Service"
3. **Connect Repo**: Connect your GitHub repository
4. **Settings**:
   - **Name**: factory-copilot-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.api:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (or `/` if needed)
5. **Environment Variables**: Add the same variables as Railway
6. **Deploy**: Click "Create Web Service"
7. **Get URL**: Render provides `https://your-app.onrender.com`

### Option 3: PythonAnywhere

1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Upload your code via Git or files
3. Create a web app
4. Set up virtual environment and install dependencies
5. Configure WSGI file to point to `src.api:app`
6. Add environment variables in the web app settings

### Option 4: Heroku

1. Install Heroku CLI
2. Create `Procfile` in root:
   ```
   web: uvicorn src.api:app --host 0.0.0.0 --port $PORT
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set GEMINI_API_KEY=your_key
   heroku config:set N8N_WEBHOOK_URL=your_url
   git push heroku main
   ```

## Verify Deployment

Test your backend is working:

```bash
# Health check
curl https://your-backend-url.railway.app/health

# Should return:
# {"status":"healthy","model_trained":true}
```

## Important Notes

1. **CORS**: The backend already allows all origins (`allow_origins=["*"]`), so it will work with Vercel
2. **Port**: Most platforms set `$PORT` automatically - use that in your start command
3. **HTTPS**: Ensure your backend URL uses HTTPS (most platforms provide this automatically)
4. **Environment Variables**: Keep your API keys secure - never commit them to Git

## Troubleshooting

### Backend not starting
- Check logs in your platform's dashboard
- Verify `requirements.txt` includes all dependencies
- Ensure start command is correct

### CORS errors
- Backend already allows all origins, but if issues persist, check the CORS middleware in `src/api.py`

### API keys not working
- Verify environment variables are set correctly
- Check variable names match exactly (case-sensitive)
- Restart the service after adding variables
