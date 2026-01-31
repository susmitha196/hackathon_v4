# 🔑 API Keys Setup Guide

This guide explains how to configure API keys for OpenAI, Google Gemini, and n8n webhooks.

## 📋 Overview

The Factory Copilot uses three optional services:
1. **OpenAI** - For AI-powered root cause explanations
2. **Google Gemini** - For trend analysis and anomaly detection
3. **n8n** - For automation webhooks (maintenance alerts)

**Note:** The app works without these keys using dummy/local predictions. API keys are optional but enable full AI features.

## 🔐 Where to Add API Keys

You can configure API keys in two ways:

### Option 1: Streamlit Secrets (Recommended for Streamlit apps)

Edit `.streamlit/secrets.toml`:

```toml
# OpenAI API Key (for AI explanations)
OPENAI_API_KEY = "sk-your-openai-key-here"

# Google Gemini API Key (for trend analysis)
GEMINI_API_KEY = "your-gemini-key-here"

# n8n Webhook URL (for automation)
N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/your-webhook-id"
```

### Option 2: Environment Variables (For FastAPI backend)

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=your-gemini-key-here
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

## 🔑 How to Get API Keys

### 1. OpenAI API Key

**Steps:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add it to `.streamlit/secrets.toml` or `.env`

**Pricing:** Pay-as-you-go. Check [OpenAI Pricing](https://openai.com/pricing)

**Usage in app:** Used for generating root cause explanations and recommended actions

---

### 2. Google Gemini API Key

**Steps:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Select or create a Google Cloud project
5. Copy the API key
6. Add it to `.streamlit/secrets.toml` or `.env`

**Pricing:** Free tier available. Check [Gemini Pricing](https://ai.google.dev/pricing)

**Usage in app:** Used for analyzing sensor trends and detecting anomalies

---

### 3. n8n Webhook URL

**Option A: n8n Cloud (Easiest)**

1. Sign up at [n8n Cloud](https://n8n.io/cloud/)
2. Create a new workflow
3. Add a "Webhook" node
4. Configure the webhook (HTTP Method: POST)
5. Copy the webhook URL (looks like: `https://your-instance.n8n.cloud/webhook/abc123`)
6. Add it to `.streamlit/secrets.toml` or `.env`

**Option B: Local n8n**

1. Install n8n: `npm install n8n -g`
2. Start n8n: `n8n start`
3. Access at `http://localhost:5678`
4. Create a workflow with a Webhook node
5. Copy the webhook URL
6. Add it to `.streamlit/secrets.toml` or `.env`

**Option C: Webhook.site (Testing)**

1. Go to [Webhook.site](https://webhook.site/)
2. Copy the unique URL
3. Use it for testing (no setup required)
4. Add it to `.streamlit/secrets.toml` or `.env`

**Pricing:** 
- n8n Cloud: Free tier available
- Local n8n: Free and open-source
- Webhook.site: Free for testing

**Usage in app:** Triggers when downtime risk ≥ 75% to send maintenance alerts

---

## ✅ Verification

After adding your keys, verify they're working:

### Test OpenAI
```bash
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('OpenAI Key:', 'Set' if os.getenv('OPENAI_API_KEY') else 'Not set')"
```

### Test Gemini
```bash
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('Gemini Key:', 'Set' if os.getenv('GEMINI_API_KEY') else 'Not set')"
```

### Test n8n
```bash
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('n8n URL:', 'Set' if os.getenv('N8N_WEBHOOK_URL') else 'Not set')"
```

Or check in the Streamlit app:
- If keys are configured, you'll see real AI explanations instead of dummy text
- If keys are missing, you'll see "💡 Configure API_KEY in .env for AI-powered features"

## 🔒 Security Notes

✅ **Safe:** These files are already in `.gitignore` and will NOT be pushed to Git
- `.env`
- `.streamlit/secrets.toml`
- `.gitcredentials`

❌ **Never commit:**
- API keys in code files
- Credentials in version control
- Keys in public repositories

## 📝 Example Configuration

### `.streamlit/secrets.toml` (Full Example)
```toml
# OpenAI API Key
OPENAI_API_KEY = "sk-proj-abc123xyz..."

# Google Gemini API Key  
GEMINI_API_KEY = "AIzaSyAbc123xyz..."

# n8n Webhook URL
N8N_WEBHOOK_URL = "https://your-instance.n8n.cloud/webhook/abc123"
```

### `.env` (Full Example)
```env
OPENAI_API_KEY=sk-proj-abc123xyz...
GEMINI_API_KEY=AIzaSyAbc123xyz...
N8N_WEBHOOK_URL=https://your-instance.n8n.cloud/webhook/abc123
```

## 🚀 Next Steps

1. Get your API keys from the services above
2. Add them to `.streamlit/secrets.toml` (for Streamlit) or `.env` (for FastAPI)
3. Restart your app: `python run_app.py`
4. Check the dashboard - you should see real AI features working!

## 🆘 Troubleshooting

**Keys not working?**
- Check for typos in the keys
- Ensure no extra spaces or quotes
- Verify the keys are active/valid
- Restart the app after adding keys

**Still seeing dummy responses?**
- Check the app logs for error messages
- Verify the file path (`.streamlit/secrets.toml` vs `.env`)
- Make sure you're using the correct format (no quotes in `.env`, quotes OK in `.toml`)

**Need help?**
- Check the individual service documentation
- Review `src/ai_explainer.py`, `src/gemini_analyzer.py`, `src/automation.py` for implementation details
