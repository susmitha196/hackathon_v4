# 🔍 How to Check error_code in n8n

The `error_code` field **IS being sent** in the webhook payload. Here's how to verify it in your n8n workflow:

## ✅ Verification

The payload includes:
```json
{
  "error_code": "E001",
  "error_description": "High Temperature",
  "error_severity": "HIGH",
  "risk_score": 85,
  "alert_type": "high_downtime_risk",
  "timestamp": "2026-01-31T20:45:26",
  "sensor_data": {...},
  "explanation": {...}
}
```

## 📋 How to Check in n8n

### Method 1: Check Webhook Node Input

1. Go to your n8n workflow
2. Click on the **Webhook** node
3. Click **"Execute Node"** or trigger the webhook
4. Check the **Input** tab - you should see `error_code` in the JSON

### Method 2: Check Execution Data

1. Go to **"Executions"** in the left sidebar
2. Find the most recent execution
3. Click on it to open
4. Click on the **Webhook** node
5. Check the **Input** data - `error_code` should be visible

### Method 3: Use a Code Node to Log

Add a **Code** node after your Webhook node:

```javascript
// Access error_code from webhook input
const errorCode = $json.error_code;
const errorDescription = $json.error_description;
const errorSeverity = $json.error_severity;

console.log("Error Code:", errorCode);
console.log("Error Description:", errorDescription);
console.log("Error Severity:", errorSeverity);

// Return the data
return {
  error_code: errorCode,
  error_description: errorDescription,
  error_severity: errorSeverity,
  ...$json
};
```

### Method 4: Use Set Node to Extract

Add a **Set** node after Webhook:
- Add field: `error_code` = `{{ $json.error_code }}`
- Add field: `error_description` = `{{ $json.error_description }}`
- Add field: `error_severity` = `{{ $json.error_severity }}`

## 🔧 Troubleshooting

### If error_code is not visible:

1. **Check the Webhook node configuration**
   - Make sure it's set to **POST** method
   - Check if there's any filtering or transformation

2. **Check n8n version**
   - Older versions might handle JSON differently
   - Update n8n if possible

3. **Use the verification script**
   ```bash
   python scripts/verify_n8n_payload.py
   ```
   This will show you exactly what's being sent

4. **Check n8n logs**
   - Look for any errors or warnings
   - Check if the payload is being modified

## 📊 Expected Payload Structure

The complete payload sent to n8n:

```json
{
  "error_code": "E001",
  "error_description": "High Temperature",
  "error_severity": "HIGH",
  "risk_score": 85,
  "alert_type": "high_downtime_risk",
  "timestamp": "2026-01-31T20:45:26.725990",
  "sensor_data": {
    "temperature": 95.5,
    "vibration": 8.2,
    "cycle_time": 65.3,
    "error_count": 12,
    "pressure": 4.8,
    "humidity": 45.2,
    "power_consumption": 1250.0,
    "production_rate": 78.5
  },
  "explanation": {
    "root_cause": "...",
    "recommended_action": "..."
  }
}
```

## ✅ Verification Script

Run this to verify error_code is being sent:

```bash
python scripts/verify_n8n_payload.py
```

This will:
- Show the exact payload being sent
- Verify error_code is included
- Send a test webhook
- Confirm it was received

## 💡 Quick Test

1. Run: `python scripts/test_n8n_simple.py`
2. Check the output - it shows the payload with `error_code`
3. Go to your n8n workflow executions
4. Check the webhook input data

The `error_code` field is definitely being sent - make sure you're checking the right place in n8n!
