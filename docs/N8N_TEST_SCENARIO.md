# 🧪 n8n Webhook Test Scenario

## 📋 Test Scenario Explanation

### How It Works

The Factory Copilot app monitors machine sensor data and calculates a **downtime risk score** (0-100%). When the risk score reaches **≥75%**, it automatically triggers an n8n webhook to send maintenance alerts.

### Test Flow

1. **Normal Operation** (Risk < 75%)
   - Sensor readings are normal
   - Risk score: 0-74%
   - **No webhook triggered** ✅

2. **High Risk Detected** (Risk ≥ 75%)
   - Sensor readings show anomalies:
     - High temperature (>85°C)
     - High vibration (>8 mm/s)
     - Increased cycle time
     - Error count rising
   - Risk score: 75-100%
   - **Webhook triggered automatically** 🚨

### What Gets Sent to n8n

When risk ≥ 75%, the app sends a JSON payload:

```json
{
  "risk_score": 85,
  "sensor_data": {
    "temperature": 85.5,
    "vibration": 8.2,
    "cycle_time": 65.3,
    "error_count": 12,
    "pressure": 4.8,
    "humidity": 45.2,
    "power_consumption": 1250.0,
    "production_rate": 78.5
  },
  "timestamp": "2026-01-31T16:30:00",
  "alert_type": "high_downtime_risk",
  "explanation": {
    "root_cause": "Elevated temperature and high vibration indicate bearing wear...",
    "recommended_action": "Schedule immediate maintenance..."
  }
}
```

## 🔧 Current Test Results

**Status:** ⚠️ Webhook URL configured but returning 404

**Your Webhook URL:** `https://ariefshaik.app.n8n.cloud/webhook-test/446f32f9-f474-4ef2-8d9e-0d536ace8e43`

### Possible Issues

1. **Workflow Not Active**
   - Check if your n8n workflow is **activated** (toggle switch in top right)
   - Inactive workflows won't receive webhooks

2. **Webhook Path Incorrect**
   - Verify the webhook URL path matches your n8n workflow
   - Check if it should be `/webhook/` instead of `/webhook-test/`

3. **Webhook Node Configuration**
   - Ensure the webhook node is set to **POST** method
   - Check if authentication is required

## ✅ How to Fix

### Step 1: Verify n8n Workflow

1. Go to your n8n instance: `https://ariefshaik.app.n8n.cloud`
2. Open your workflow
3. Check the **Webhook** node:
   - Is it set to **POST**?
   - Is the path correct?
   - Copy the **exact webhook URL** from the node

### Step 2: Activate Workflow

1. Click the **toggle switch** in the top right to activate
2. Make sure it shows "Active" (green)

### Step 3: Test Webhook Directly

You can test the webhook URL directly using curl or Postman:

```bash
curl -X POST https://ariefshaik.app.n8n.cloud/webhook-test/446f32f9-f474-4ef2-8d9e-0d536ace8e43 \
  -H "Content-Type: application/json" \
  -d '{
    "risk_score": 85,
    "sensor_data": {"temperature": 85.5, "vibration": 8.2},
    "alert_type": "high_downtime_risk"
  }'
```

Or use PowerShell:

```powershell
$body = @{
    risk_score = 85
    sensor_data = @{
        temperature = 85.5
        vibration = 8.2
    }
    alert_type = "high_downtime_risk"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://ariefshaik.app.n8n.cloud/webhook-test/446f32f9-f474-4ef2-8d9e-0d536ace8e43" -Method Post -Body $body -ContentType "application/json"
```

### Step 4: Update Webhook URL

If the URL is different, update `.streamlit/secrets.toml`:

```toml
N8N_WEBHOOK_URL = "https://ariefshaik.app.n8n.cloud/webhook/your-actual-webhook-id"
```

## 🎯 Testing in the App

### Method 1: Simulate Failure Scenario

1. Run the app: `python run_app.py`
2. In the sidebar, check **"Simulate Failure Scenario"**
3. Watch the risk score increase
4. When it reaches ≥75%, the webhook should trigger automatically
5. Check your n8n workflow to see if the webhook was received

### Method 2: Use Test Script

Run the test script:

```bash
python scripts/test_n8n_webhook.py
```

This will test multiple scenarios and show you the results.

## 📊 Expected Behavior

### ✅ Success Indicators

- Webhook returns status **200, 201, or 202**
- You see "✅ SUCCESS: Maintenance alert triggered successfully"
- Your n8n workflow receives the data
- You can see the payload in n8n execution logs

### ❌ Failure Indicators

- **404**: Webhook URL incorrect or workflow not active
- **401/403**: Authentication required
- **500**: n8n workflow error
- **Timeout**: n8n instance not responding

## 🔍 Debugging Tips

1. **Check n8n Execution Logs**
   - Go to "Executions" in n8n
   - Look for recent webhook calls
   - Check if there are any errors

2. **Verify Webhook Node**
   - Right-click webhook node → "Test URL"
   - Copy the exact URL shown
   - Compare with your configuration

3. **Check Network**
   - Ensure your n8n instance is accessible
   - Try accessing the webhook URL in a browser (should show webhook info)

4. **Test with Simple Payload**
   - Start with a minimal JSON payload
   - Gradually add more fields

## 📝 Next Steps

1. ✅ Verify your n8n workflow is active
2. ✅ Check the exact webhook URL from the webhook node
3. ✅ Update `.streamlit/secrets.toml` if needed
4. ✅ Run the test script again: `python scripts/test_n8n_webhook.py`
5. ✅ Test in the Streamlit app with failure simulation

Once the webhook is working, you can configure your n8n workflow to:
- Send email alerts
- Create tickets in your system
- Notify maintenance teams
- Log to databases
- Trigger other automations
