# 🚀 Deploy Factory Copilot to Google Cloud

This guide covers deploying the Factory Copilot application to Google Cloud Platform.

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud SDK (gcloud)** installed and configured
3. **Docker** installed (for local testing)

## 🎯 Deployment Options

### Option 1: Google Cloud Run (Recommended) ⭐

**Best for:** Serverless, auto-scaling, pay-per-use

#### Step 1: Set Up Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create factory-copilot-project --name="Factory Copilot"

# Set as active project
gcloud config set project factory-copilot-project

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### Step 2: Build and Deploy with Cloud Build

```bash
# Submit build to Cloud Build
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/factory-copilot

# Deploy to Cloud Run
gcloud run deploy factory-copilot \
  --image gcr.io/$(gcloud config get-value project)/factory-copilot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars PORT=8080 \
  --memory 2Gi \
  --cpu 2
```

#### Step 3: Set Environment Variables (Optional)

```bash
# Set API keys as secrets
gcloud run services update factory-copilot \
  --update-secrets OPENAI_API_KEY=openai-key:latest \
  --update-secrets GEMINI_API_KEY=gemini-key:latest \
  --region us-central1

# Or set as environment variables
gcloud run services update factory-copilot \
  --set-env-vars OPENAI_API_KEY=your_key_here \
  --set-env-vars GEMINI_API_KEY=your_key_here \
  --region us-central1
```

#### Step 4: Get Your URL

After deployment, Cloud Run will provide a URL like:
```
https://factory-copilot-xxxxx-uc.a.run.app
```

---

### Option 2: Deploy FastAPI and Streamlit Separately

Since you have two services (FastAPI backend + Streamlit frontend), you can deploy them separately:

#### Deploy FastAPI Backend

```bash
# Create Dockerfile.api
cat > Dockerfile.api << EOF
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD uvicorn api:app --host 0.0.0.0 --port \$PORT
EOF

# Build and deploy API
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/factory-copilot-api -f Dockerfile.api

gcloud run deploy factory-copilot-api \
  --image gcr.io/$(gcloud config get-value project)/factory-copilot-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars PORT=8080
```

#### Deploy Streamlit Frontend

```bash
# Update app.py to use Cloud Run API URL
# Change: API_URL = "http://localhost:8000"
# To: API_URL = os.getenv("API_URL", "https://factory-copilot-api-xxxxx-uc.a.run.app")

# Build and deploy Streamlit
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/factory-copilot-ui

gcloud run deploy factory-copilot-ui \
  --image gcr.io/$(gcloud config get-value project)/factory-copilot-ui \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars PORT=8080,API_URL=https://factory-copilot-api-xxxxx-uc.a.run.app
```

---

### Option 3: App Engine (Alternative)

**Best for:** Traditional PaaS, simpler setup

```bash
# Deploy to App Engine
gcloud app deploy app.yaml

# Open in browser
gcloud app browse
```

**Note:** App Engine may require modifications to handle both FastAPI and Streamlit in one service.

---

## 🔧 Configuration

### Environment Variables

Set these in Cloud Run:

- `OPENAI_API_KEY` - For AI explanations (optional)
- `GEMINI_API_KEY` - For trend analysis (optional)
- `N8N_WEBHOOK_URL` - For automation (optional)
- `PORT` - Server port (Cloud Run sets this automatically)

### Update API URL in Streamlit App

If deploying separately, update `app.py`:

```python
# Change this line:
API_URL = "http://localhost:8000"

# To:
API_URL = os.getenv("API_URL", "https://your-api-url.run.app")
```

---

## 🧪 Testing Locally with Docker

Before deploying, test locally:

```bash
# Build image
docker build -t factory-copilot .

# Run container
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e OPENAI_API_KEY=your_key \
  factory-copilot

# Open http://localhost:8080
```

---

## 📊 Monitoring & Logs

```bash
# View logs
gcloud run services logs read factory-copilot --region us-central1

# View metrics in Cloud Console
# https://console.cloud.google.com/run
```

---

## 💰 Cost Estimation

**Cloud Run Pricing:**
- Free tier: 2 million requests/month
- After free tier: ~$0.40 per million requests
- Memory/CPU: ~$0.00002400 per GB-second

**Estimated monthly cost:** $5-20 for moderate usage

---

## 🚨 Troubleshooting

**Build fails:**
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Check Cloud Build logs: `gcloud builds list`

**Deployment fails:**
- Verify project has billing enabled
- Check service account permissions
- Review Cloud Run logs

**App doesn't work:**
- Verify PORT environment variable is set
- Check CORS settings in FastAPI
- Verify API_URL is correct in Streamlit app

---

## 🔗 Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"

echo "Building and deploying Factory Copilot..."

gcloud builds submit --tag gcr.io/$PROJECT_ID/factory-copilot

gcloud run deploy factory-copilot \
  --image gcr.io/$PROJECT_ID/factory-copilot \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars PORT=8080 \
  --memory 2Gi \
  --cpu 2

echo "Deployment complete!"
gcloud run services describe factory-copilot --region $REGION --format 'value(status.url)'
```

Make it executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📝 Next Steps

1. Set up custom domain (optional)
2. Configure Cloud CDN for faster loading
3. Set up monitoring alerts
4. Configure auto-scaling parameters
5. Set up CI/CD with Cloud Build

---

**Need help?** Check Google Cloud documentation or Cloud Run logs for detailed error messages.
