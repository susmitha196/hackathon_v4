# Connect Railway Backend to Vercel UI

## Step 1: Get Your Railway Backend URL

1. Go to [Railway Dashboard](https://railway.app)
2. Click on your deployed project
3. Click on your service (the one you just deployed)
4. Go to the **Settings** tab
5. Scroll down to **Domains** section
6. You'll see a URL like: `https://your-app-name.up.railway.app`
7. **Copy this URL** - you'll need it in the next step

**OR** if you see it in the **Deployments** tab:
- Click on the latest deployment
- Look for the URL in the deployment logs or overview

## Step 2: Configure Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click on your frontend project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Key**: `VITE_FACTORY_COPILOT_API_URL`
   - **Value**: Your Railway backend URL (from Step 1)
     - Example: `https://your-app-name.up.railway.app`
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**

## Step 3: Redeploy Frontend

After adding the environment variable, you need to trigger a new deployment:

1. In Vercel dashboard, go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or make a small change and push to trigger auto-deploy

**Important**: Environment variables are only available after redeployment!

## Step 4: Verify Connection

1. Open your Vercel frontend URL
2. Open Browser DevTools (F12)
3. Go to **Console** tab - check for errors
4. Go to **Network** tab
5. Navigate to: `/services/factory-orchestrator/dashboard`
6. Select "Live Generation"
7. Look for API calls in the Network tab:
   - Should see requests to your Railway backend URL
   - Status should be `200 OK`
   - Check the response data

## Step 5: Test Features

Test these features to verify everything works:

- ✅ **Live Data Generation**: Should fetch sensor data from backend
- ✅ **ML Predictions**: Downtime Risk Score should appear
- ✅ **Error Codes**: Should be determined by backend
- ✅ **AI Explanations**: Should work if OpenAI key is set
- ✅ **n8n Automation**: Should trigger if webhook URL is set

## Troubleshooting

### Frontend shows "Failed to fetch"
- ✅ Check `VITE_FACTORY_COPILOT_API_URL` is set correctly in Vercel
- ✅ Verify you redeployed after adding the environment variable
- ✅ Check Railway backend URL is accessible (try opening `/health` endpoint)
- ✅ Check browser console for CORS errors

### CORS Errors
- ✅ Backend already allows all origins (`allow_origins=["*"]`)
- ✅ If still seeing CORS errors, check Railway logs

### Backend not responding
- ✅ Check Railway deployment logs for errors
- ✅ Test backend directly: `https://your-backend-url/health`
- ✅ Verify environment variables are set in Railway

### Environment variable not working
- ✅ Variable name must start with `VITE_` for Vite to expose it
- ✅ Must redeploy after adding environment variables
- ✅ Check variable is added to all environments (Production, Preview, Development)

## Quick Checklist

- [ ] Got Railway backend URL
- [ ] Added `VITE_FACTORY_COPILOT_API_URL` in Vercel
- [ ] Redeployed frontend on Vercel
- [ ] Tested backend URL directly (`/health` endpoint)
- [ ] Verified API calls in browser Network tab
- [ ] Tested Live Monitoring Dashboard
- [ ] Checked browser console for errors

## Success Indicators

You'll know it's working when:
- ✅ No errors in browser console
- ✅ API calls appear in Network tab with 200 status
- ✅ Sensor data appears in Live Monitoring Dashboard
- ✅ ML predictions show up
- ✅ No CORS errors
