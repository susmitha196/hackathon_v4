# 🔗 n8n Setup Guide for Factory Copilot

This guide will help you set up n8n automation to receive alerts when machine downtime risk exceeds 75%.

## What is n8n?

n8n is a workflow automation tool that allows you to create automated workflows. In Factory Copilot, it receives webhook triggers when downtime risk is high and can:
- Send email alerts
- Post to Slack/Teams
- Create tickets in Jira/ServiceNow
- Send SMS notifications
- Trigger other maintenance workflows

## 🚀 Quick Setup Options

### Option 1: n8n Cloud (Easiest - Recommended for Demo)

1. **Sign up for n8n Cloud** (Free tier available):
   - Go to https://n8n.io/cloud
   - Sign up for a free account
   - You get a hosted n8n instance

2. **Create a Webhook Workflow**:
   - Click "Add workflow" → "Blank workflow"
   - Add a **Webhook** node (trigger)
   - Set method to `POST`
   - Click "Listen for test event"
   - Copy the **Webhook URL** (looks like: `https://your-instance.n8n.cloud/webhook/abc123`)

3. **Add Action Nodes** (optional):
   - **Email** node: Send alert emails
   - **Slack** node: Post to Slack channel
   - **HTTP Request** node: Call other APIs
   - **IF** node: Conditional logic

4. **Activate the Workflow**:
   - Click "Active" toggle in top right
   - Your webhook is now live!

5. **Configure Factory Copilot**:
   - Add to `.env` file:
     ```env
     N8N_WEBHOOK_URL=https://your-instance.n8n.cloud/webhook/abc123
     ```
   - Or add to `.streamlit/secrets.toml`:
     ```toml
     N8N_WEBHOOK_URL = "https://your-instance.n8n.cloud/webhook/abc123"
     ```

### Option 2: Local n8n (Self-Hosted)

1. **Install n8n**:
   ```bash
   npm install n8n -g
   ```

   Or using Docker:
   ```bash
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

2. **Access n8n**:
   - Open http://localhost:5678
   - Set up your account

3. **Create Webhook Workflow** (same as Option 1, step 2-4)

4. **Get Webhook URL**:
   - For local n8n: `http://localhost:5678/webhook/abc123`
   - For Docker: Use your machine's IP or set up port forwarding

### Option 3: Test with Webhook.site (Quick Testing)

1. **Go to Webhook.site**:
   - Visit https://webhook.site
   - Copy your unique webhook URL

2. **Use it temporarily**:
   ```env
   N8N_WEBHOOK_URL=https://webhook.site/your-unique-id
   ```

3. **Test**: When risk ≥ 75%, check webhook.site to see the payload

## 📋 Example n8n Workflow

Here's a simple workflow you can create:

```
Webhook (Trigger)
    ↓
IF (Check risk_score > 75)
    ↓
Email (Send Alert)
    ↓
Slack (Post to Channel)
```

### Step-by-Step Workflow Creation:

1. **Add Webhook Node**:
   - Method: POST
   - Path: `/factory-copilot-alert` (or leave empty)
   - Response Mode: "Respond When Last Node Finishes"
   - Click "Listen for test event"
   - Copy the webhook URL

2. **Add IF Node** (Optional):
   - Condition: `{{ $json.body.risk_score }} > 75`
   - This ensures we only process high-risk alerts

3. **Add Email Node**:
   - Configure your email provider (Gmail, SMTP, etc.)
   - Subject: `🚨 Factory Alert: High Downtime Risk ({{ $json.body.risk_score }}%)`
   - Body:
     ```
     Risk Score: {{ $json.body.risk_score }}%
     
     Sensor Data:
     - Temperature: {{ $json.body.sensor_data.temperature }}°C
     - Vibration: {{ $json.body.sensor_data.vibration }} mm/s
     - Cycle Time: {{ $json.body.sensor_data.cycle_time }}s
     - Errors: {{ $json.body.sensor_data.error_count }}
     
     AI Explanation:
     {{ $json.body.explanation }}
     
     Timestamp: {{ $json.body.timestamp }}
     ```

4. **Add Slack Node** (Optional):
   - Connect your Slack workspace
   - Channel: `#factory-alerts`
   - Message: Similar to email body

5. **Activate Workflow**

## 🔍 Webhook Payload Structure

When Factory Copilot triggers the webhook, it sends this JSON:

```json
{
  "risk_score": 85,
  "sensor_data": {
    "temperature": 95.5,
    "vibration": 8.2,
    "cycle_time": 65.0,
    "error_count": 12
  },
  "timestamp": "2024-01-15T10:30:00",
  "alert_type": "high_downtime_risk",
  "explanation": {
    "root_cause": "High temperature and vibration detected...",
    "recommended_action": "Inspect bearings immediately..."
  }
}
```

## ✅ Testing Your Setup

1. **Test the Webhook**:
   ```bash
   curl -X POST https://your-webhook-url \
     -H "Content-Type: application/json" \
     -d '{
       "risk_score": 85,
       "sensor_data": {"temperature": 95, "vibration": 8},
       "alert_type": "high_downtime_risk"
     }'
   ```

2. **Test in Factory Copilot**:
   - Enable "Simulate Failure Scenario"
   - Wait for risk to reach 75%+
   - Check your n8n workflow execution logs
   - Verify alerts were sent

## 🎯 Common Use Cases

### 1. Email Alert
- Send email to maintenance team when risk > 75%
- Include sensor data and AI explanation

### 2. Slack Notification
- Post to #factory-alerts channel
- Use Slack formatting for better readability

### 3. Create Maintenance Ticket
- Use HTTP Request node to call Jira/ServiceNow API
- Create ticket with sensor data

### 4. SMS Alert (Critical)
- Use Twilio node for SMS
- Only for risk > 90%

### 5. Log to Database
- Use PostgreSQL/MySQL node
- Store alerts for historical analysis

## 🔧 Troubleshooting

**Webhook not triggering?**
- Check `N8N_WEBHOOK_URL` in `.env` or `.streamlit/secrets.toml`
- Verify webhook URL is correct
- Ensure n8n workflow is **Active**
- Check n8n execution logs

**Getting 404 errors?**
- Verify webhook path is correct
- Check if workflow is activated
- For local n8n, ensure it's accessible from your app

**Timeout errors?**
- Increase timeout in `automation.py` (default: 5 seconds)
- Check network connectivity
- Verify n8n instance is running

**Payload not received?**
- Check n8n execution logs
- Verify webhook node is listening
- Test with curl/Postman first

## 📚 Resources

- **n8n Documentation**: https://docs.n8n.io/
- **n8n Cloud**: https://n8n.io/cloud
- **Webhook Testing**: https://webhook.site
- **n8n Community**: https://community.n8n.io/

## 💡 Pro Tips

1. **Use webhook.site first** to verify payload format
2. **Test with low risk** to ensure it doesn't trigger unnecessarily
3. **Add logging** in n8n to debug issues
4. **Use IF nodes** to filter and route alerts
5. **Set up multiple workflows** for different risk levels (75%, 90%, etc.)

---

**Ready to automate?** Set up your n8n webhook and add the URL to your `.env` file!
