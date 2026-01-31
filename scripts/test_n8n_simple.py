"""
Simple n8n webhook test - sends a single test payload
"""
import sys
import os
import requests
import json
from datetime import datetime

# Fix Windows encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

# Import error codes
from error_codes import determine_error_code, ErrorCodes

# Load from Streamlit secrets
secrets_path = os.path.join(os.path.dirname(__file__), '..', '.streamlit', 'secrets.toml')
if os.path.exists(secrets_path):
    with open(secrets_path, 'r', encoding='utf-8') as f:
        content = f.read()
        import re
        match = re.search(r'N8N_WEBHOOK_URL\s*=\s*["\']([^"\']+)["\']', content)
        if match:
            webhook_url = match.group(1)
        else:
            print("ERROR: Could not find N8N_WEBHOOK_URL in secrets.toml")
            sys.exit(1)
else:
    print("ERROR: secrets.toml not found")
    sys.exit(1)

print("=" * 60)
print("Testing n8n Webhook")
print("=" * 60)
print(f"Webhook URL: {webhook_url}")
print()

# Test payload with error code
payload = {
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
    "timestamp": datetime.now().isoformat(),
    "alert_type": "high_downtime_risk",
    "explanation": {
        "root_cause": "Elevated temperature (85.5°C) and high vibration (8.2 mm/s) indicate bearing wear and potential motor overheating.",
        "recommended_action": "Schedule immediate maintenance: 1) Inspect motor bearings, 2) Check cooling system, 3) Replace worn components if necessary."
    }
}

# Determine error code using centralized function
sensor_dict = payload["sensor_data"]
error_code = determine_error_code(sensor_dict, payload["risk_score"])
payload["error_code"] = error_code
payload["error_description"] = ErrorCodes.DESCRIPTIONS.get(error_code, "Unknown")
payload["error_severity"] = ErrorCodes.SEVERITY.get(error_code, "UNKNOWN")

print("Sending payload:")
print(json.dumps(payload, indent=2))
print()
print(f"Error Code: {error_code} - {payload['error_description']} ({payload['error_severity']})")
print()

try:
    response = requests.post(
        webhook_url,
        json=payload,
        timeout=10,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    print()
    
    if response.status_code in [200, 201, 202]:
        print("✅ SUCCESS: Webhook triggered successfully!")
        print("Check your n8n workflow to see the received data.")
    else:
        print(f"❌ FAILED: Webhook returned status {response.status_code}")
        print("Check your n8n workflow configuration.")
        
except requests.exceptions.Timeout:
    print("❌ ERROR: Request timed out")
    print("Check if your n8n instance is accessible.")
except requests.exceptions.RequestException as e:
    print(f"❌ ERROR: {str(e)}")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
