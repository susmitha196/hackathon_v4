"""
Helper script to create n8n workflow JSON for email alerts
You can import this workflow into n8n instead of building it manually
"""
import json

def create_email_workflow():
    """Generate n8n workflow JSON for Factory Copilot email alerts"""
    
    workflow = {
        "name": "Factory Copilot Email Alerts",
        "nodes": [
            {
                "parameters": {},
                "id": "webhook-trigger",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [250, 300],
                "webhookId": "factory-copilot-alert",
                "settings": {
                    "httpMethod": "POST",
                    "path": "factory-alert",
                    "responseMode": "responseNode",
                    "responseData": "allEntries"
                }
            },
            {
                "parameters": {
                    "conditions": {
                        "options": {
                            "caseSensitive": True,
                            "leftValue": "",
                            "typeValidation": "strict"
                        },
                        "conditions": [
                            {
                                "id": "risk-check",
                                "leftValue": "={{ $json.body.risk_score }}",
                                "rightValue": 75,
                                "operator": {
                                    "type": "number",
                                    "operation": "largerEqual"
                                }
                            }
                        ],
                        "combinator": "and"
                    },
                    "options": {}
                },
                "id": "if-risk-high",
                "name": "IF Risk >= 75%",
                "type": "n8n-nodes-base.if",
                "typeVersion": 1,
                "position": [450, 300]
            },
            {
                "parameters": {
                    "fromEmail": "factory-copilot@your-domain.com",
                    "toEmail": "={{ $json.body.alert_recipient || 'your-email@example.com' }}",
                    "subject": "🚨 Factory Alert: High Downtime Risk ({{ $json.body.risk_score }}%)",
                    "emailType": "html",
                    "message": """<h2>🚨 Factory Copilot Alert</h2>
                    
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
<p><small>This is an automated alert from Factory Copilot</small></p>""",
                    "options": {}
                },
                "id": "send-email",
                "name": "Send Email Alert",
                "type": "n8n-nodes-base.emailSend",
                "typeVersion": 2,
                "position": [650, 300],
                "credentials": {
                    "smtp": {
                        "id": "1",
                        "name": "SMTP Account"
                    }
                }
            }
        ],
        "connections": {
            "Webhook": {
                "main": [
                    [
                        {
                            "node": "IF Risk >= 75%",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "IF Risk >= 75%": {
                "main": [
                    [
                        {
                            "node": "Send Email Alert",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "pinData": {},
        "settings": {
            "executionOrder": "v1"
        },
        "staticData": None,
        "tags": [],
        "triggerCount": 0,
        "updatedAt": "2024-01-15T00:00:00.000Z",
        "versionId": "1"
    }
    
    return workflow

if __name__ == "__main__":
    import sys
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8')
    
    workflow = create_email_workflow()
    
    # Save to file
    with open("n8n_email_workflow.json", "w", encoding='utf-8') as f:
        json.dump(workflow, f, indent=2)
    
    print("[SUCCESS] n8n workflow JSON created: n8n_email_workflow.json")
    print("\nTo import into n8n:")
    print("1. Open n8n")
    print("2. Click 'Workflows' -> 'Import from File'")
    print("3. Select 'n8n_email_workflow.json'")
    print("4. Configure email credentials")
    print("5. Activate workflow")
    print("\nNote: You'll need to configure email credentials in n8n after importing.")
