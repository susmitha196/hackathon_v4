# 📧 n8n Email Alert Setup Guide

Complete guide to set up email alerts when Factory Copilot detects high downtime risk (≥75%).

## 🎯 What You'll Get

When downtime risk reaches 75%+, you'll receive an email with:
- Risk score and alert type
- Current sensor readings (temperature, vibration, etc.)
- AI-powered root cause analysis
- Recommended maintenance actions
- Timestamp

## 🚀 Quick Setup (n8n Cloud)

### Step 1: Create n8n Account

1. Go to https://n8n.io/cloud
2. Sign up (free tier available)
3. Access your n8n instance

### Step 2: Create Email Alert Workflow

1. **Click "Add workflow"** → "Blank workflow"

2. **Add Webhook Node** (Trigger):
   - Drag "Webhook" node onto canvas
   - Settings:
     - **HTTP Method**: POST
     - **Path**: Leave empty or use `/factory-alert`
     - **Response Mode**: "Respond When Last Node Finishes"
   - Click **"Listen for test event"** button
   - **Copy the Webhook URL** (looks like: `https://your-instance.n8n.cloud/webhook/abc123`)
   - Click "Stop listening"

3. **Add Email Node**:
   - Drag "Email Send" node onto canvas
   - Connect it to the Webhook node
   - Configure email provider:

   **Option A: Gmail**
   - Click "Credential to connect with"
   - Select "Gmail OAuth2" or create new
   - Authorize with your Google account
   - **To**: `your-email@example.com`
   - **Subject**: `🚨 Factory Alert: High Downtime Risk ({{ $json.body.risk_score }}%)`
   - **Email Type**: HTML
   - **Message**:
     ```html
     <h2>🚨 Factory Copilot Alert</h2>
     
     <p><strong>Risk Score:</strong> {{ $json.body.risk_score }}%</p>
     <p><strong>Alert Type:</strong> {{ $json.body.alert_type }}</p>
     <p><strong>Timestamp:</strong> {{ $json.body.timestamp }}</p>
     
     <h3>📊 Current Sensor Readings</h3>
     <ul>
       <li><strong>Temperature:</strong> {{ $json.body.sensor_data.temperature }}°C</li>
       <li><strong>Vibration:</strong> {{ $json.body.sensor_data.vibration }} mm/s</li>
       <li><strong>Cycle Time:</strong> {{ $json.body.sensor_data.cycle_time }}s</li>
       <li><strong>Error Count:</strong> {{ $json.body.sensor_data.error_count }}</li>
     </ul>
     
     <h3>🤖 AI Analysis</h3>
     <p><strong>Root Cause:</strong></p>
     <p>{{ $json.body.explanation.root_cause }}</p>
     
     <p><strong>Recommended Action:</strong></p>
     <p>{{ $json.body.explanation.recommended_action }}</p>
     
     <hr>
     <p><small>This is an automated alert from Factory Copilot</small></p>
     ```

   **Option B: SMTP (Any Email Provider)**
   - Click "Credential to connect with"
   - Select "SMTP" or create new
   - Fill in:
     - **User**: your-email@example.com
     - **Password**: your-app-password (not regular password)
     - **Host**: smtp.gmail.com (for Gmail) or your provider's SMTP
     - **Port**: 587 (TLS) or 465 (SSL)
     - **Secure**: TLS or SSL
   - **To**: `your-email@example.com`
   - **Subject**: `🚨 Factory Alert: High Downtime Risk ({{ $json.body.risk_score }}%)`
   - **Message**: Same HTML as above

4. **Activate Workflow**:
   - Toggle **"Active"** switch in top right
   - Workflow is now live!

5. **Add Webhook URL to Factory Copilot**:
   - Add to `.env` file:
     ```env
     N8N_WEBHOOK_URL=https://your-instance.n8n.cloud/webhook/abc123
     ```
   - Or add to `.streamlit/secrets.toml`:
     ```toml
     N8N_WEBHOOK_URL = "https://your-instance.n8n.cloud/webhook/abc123"
     ```

### Step 3: Test It!

1. **Test with script**:
   ```bash
   python test_n8n_webhook.py
   ```

2. **Test in Factory Copilot**:
   - Run: `streamlit run app.py`
   - Enable "Simulate Failure Scenario"
   - Wait for risk to reach 75%+
   - Check your email!

## 📋 Email Provider Setup Guides

### Gmail Setup

**Using OAuth2 (Recommended)**:
1. In n8n Email node, select "Gmail OAuth2"
2. Click "Connect my account"
3. Authorize with Google
4. Done!

**Using SMTP (App Password)**:
1. Enable 2-Factor Authentication on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Use in n8n SMTP credentials:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Secure: `TLS`
   - User: your-email@gmail.com
   - Password: the app password (16 characters)

### Outlook/Office 365 Setup

1. In n8n, use SMTP credentials:
   - Host: `smtp.office365.com`
   - Port: `587`
   - Secure: `TLS`
   - User: your-email@outlook.com
   - Password: your password

### Custom SMTP Setup

For any email provider:
- **Host**: smtp.yourprovider.com
- **Port**: Usually 587 (TLS) or 465 (SSL)
- **Secure**: TLS or SSL
- **User**: your-email@domain.com
- **Password**: your password or app password

## 🎨 Advanced Email Templates

### Template 1: Simple Text Email

```
Subject: Factory Alert: Risk {{ $json.body.risk_score }}%

Risk Score: {{ $json.body.risk_score }}%
Temperature: {{ $json.body.sensor_data.temperature }}°C
Vibration: {{ $json.body.sensor_data.vibration }} mm/s

Root Cause: {{ $json.body.explanation.root_cause }}
Action: {{ $json.body.explanation.recommended_action }}
```

### Template 2: Rich HTML Email

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .alert { background: #ff4444; color: white; padding: 20px; }
    .data { background: #f5f5f5; padding: 15px; margin: 10px 0; }
    .action { background: #4CAF50; color: white; padding: 15px; }
  </style>
</head>
<body>
  <div class="alert">
    <h1>🚨 Factory Copilot Alert</h1>
    <h2>Risk Score: {{ $json.body.risk_score }}%</h2>
  </div>
  
  <div class="data">
    <h3>Sensor Data</h3>
    <table>
      <tr><td>Temperature:</td><td>{{ $json.body.sensor_data.temperature }}°C</td></tr>
      <tr><td>Vibration:</td><td>{{ $json.body.sensor_data.vibration }} mm/s</td></tr>
      <tr><td>Cycle Time:</td><td>{{ $json.body.sensor_data.cycle_time }}s</td></tr>
      <tr><td>Errors:</td><td>{{ $json.body.sensor_data.error_count }}</td></tr>
    </table>
  </div>
  
  <div class="action">
    <h3>Recommended Action</h3>
    <p>{{ $json.body.explanation.recommended_action }}</p>
  </div>
</body>
</html>
```

### Template 3: Multiple Recipients

Add **"Split In Batches"** node before Email node:
- Batch Size: 1
- This sends separate emails to each recipient

Or use **"Set"** node to create array:
```json
{
  "to": ["engineer1@factory.com", "manager@factory.com", "maintenance@factory.com"]
}
```

## 🔔 Conditional Alerts

Add **"IF"** node to send different emails based on risk level:

1. **Add IF Node** between Webhook and Email:
   - Condition: `{{ $json.body.risk_score }} > 90`
   - **True branch**: Critical alert email
   - **False branch**: Regular alert email

2. **Create two Email nodes**:
   - **Critical Email** (risk > 90%):
     - Subject: `🚨 CRITICAL: Risk {{ $json.body.risk_score }}%`
     - More urgent tone
   
   - **Warning Email** (risk 75-90%):
     - Subject: `⚠️ Warning: Risk {{ $json.body.risk_score }}%`
     - Standard alert

## 📊 Email with Attachments

To include sensor data as CSV:

1. Add **"Code"** node before Email:
   ```javascript
   // Convert sensor data to CSV
   const csv = `timestamp,temperature,vibration,cycle_time,error_count
   ${$json.body.timestamp},${$json.body.sensor_data.temperature},${$json.body.sensor_data.vibration},${$json.body.sensor_data.cycle_time},${$json.body.sensor_data.error_count}`;
   
   return {
     json: $json.body,
     binary: {
       data: {
         data: Buffer.from(csv).toString('base64'),
         mimeType: 'text/csv',
         fileName: 'sensor_data.csv'
       }
     }
   };
   ```

2. In Email node, add attachment:
   - **Attachments**: `{{ $binary.data }}`

## ✅ Testing Checklist

- [ ] Webhook URL copied and added to `.env`
- [ ] Email credentials configured
- [ ] Workflow activated
- [ ] Test script runs successfully: `python test_n8n_webhook.py`
- [ ] Test email received
- [ ] Factory Copilot triggers email when risk ≥ 75%

## 🐛 Troubleshooting

**No email received?**
- Check n8n execution logs (click on workflow → Executions)
- Verify email credentials are correct
- Check spam folder
- Test email node separately

**"Authentication failed" error?**
- For Gmail: Use app password, not regular password
- Enable "Less secure app access" or use OAuth2
- Verify SMTP settings match your provider

**Webhook not triggering?**
- Verify workflow is **Active**
- Check webhook URL in `.env` is correct
- Test with `python test_n8n_webhook.py`

**Email formatting issues?**
- Use HTML email type for rich formatting
- Test HTML in browser first
- Check n8n execution data to see what's being sent

## 🎯 Example: Complete Workflow

```
Webhook (Trigger)
    ↓
IF (risk_score > 90)
    ↓
    ├─ True → Critical Email
    └─ False → Warning Email
```

## 📚 Resources

- **n8n Email Node Docs**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.email/
- **Gmail App Passwords**: https://support.google.com/accounts/answer/185833
- **n8n Community**: https://community.n8n.io/

---

**Ready to set up?** Follow Step 1-3 above, then test with `python test_n8n_webhook.py`!
