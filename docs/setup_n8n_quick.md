# 🚀 Quick n8n Setup Guide

## Option 1: Use Webhook.site (Fastest - 30 seconds)

Perfect for testing and demos!

1. **Go to Webhook.site**: https://webhook.site
2. **Copy your unique URL** (looks like: `https://webhook.site/abc123-def456-...`)
3. **Add to `.env` file**:
   ```env
   N8N_WEBHOOK_URL=https://webhook.site/your-unique-id
   ```
4. **Test it**:
   ```bash
   python test_n8n_webhook.py
   ```
5. **Check webhook.site** - you'll see the payload there!

## Option 2: n8n Cloud (5 minutes)

For production use with real automation.

1. **Sign up**: https://n8n.io/cloud (free tier available)
2. **Create workflow**:
   - Click "Add workflow" → "Blank workflow"
   - Add **Webhook** node
   - Set method to `POST`
   - Click "Listen for test event"
   - Copy the **Webhook URL**
3. **Add action** (optional):
   - Add **Email** node → Configure Gmail/SMTP
   - Add **Slack** node → Connect workspace
4. **Activate workflow** (toggle in top right)
5. **Add to `.env`**:
   ```env
   N8N_WEBHOOK_URL=https://your-instance.n8n.cloud/webhook/abc123
   ```
6. **Test**: `python test_n8n_webhook.py`

## Option 3: Local n8n (Self-hosted)

For local development.

```bash
# Using npm
npm install n8n -g
n8n start

# Or using Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

Then:
1. Open http://localhost:5678
2. Create webhook workflow (same as Option 2)
3. Use URL: `http://localhost:5678/webhook/abc123`

## 📋 Simple Email Alert Workflow

1. **Webhook** node (trigger) - copy URL
2. **Email** node:
   - Provider: Gmail (or SMTP)
   - To: your-email@example.com
   - Subject: `🚨 Factory Alert: Risk {{ $json.body.risk_score }}%`
   - Body:
     ```
     Risk Score: {{ $json.body.risk_score }}%
     
     Temperature: {{ $json.body.sensor_data.temperature }}°C
     Vibration: {{ $json.body.sensor_data.vibration }} mm/s
     
     {{ $json.body.explanation.root_cause }}
     
     Action: {{ $json.body.explanation.recommended_action }}
     ```
3. **Activate** workflow

## ✅ Verify Setup

Run the test script:
```bash
python test_n8n_webhook.py
```

If successful, you'll see:
- ✅ Response Status: 200
- ✅ SUCCESS! Webhook is working correctly!

## 🎯 Next Steps

Once webhook is configured:
1. Run Factory Copilot: `streamlit run app.py`
2. Enable "Simulate Failure Scenario"
3. Wait for risk to reach 75%+
4. Check your n8n workflow or webhook.site for the alert!

---

**Need help?** Check `N8N_SETUP.md` for detailed instructions.
