"""
Verify that error_code is being sent to n8n webhook
"""
import sys
import os
import json
import requests

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

# Fix Windows encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

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
            print("ERROR: Could not find N8N_WEBHOOK_URL")
            sys.exit(1)
else:
    print("ERROR: secrets.toml not found")
    sys.exit(1)

from error_codes import determine_error_code, ErrorCodes
from datetime import datetime

print("=" * 60)
print("Verifying error_code in n8n webhook payload")
print("=" * 60)

# Test payload
sensor_data = {
    "temperature": 95.5,
    "vibration": 8.2,
    "cycle_time": 65.3,
    "error_count": 12
}

risk_score = 85
error_code = determine_error_code(sensor_data, risk_score)

payload = {
    'error_code': error_code,
    'error_description': ErrorCodes.DESCRIPTIONS.get(error_code, 'Unknown error'),
    'error_severity': ErrorCodes.SEVERITY.get(error_code, 'UNKNOWN'),
    'risk_score': risk_score,
    'alert_type': 'high_downtime_risk',
    'timestamp': datetime.now().isoformat(),
    'sensor_data': sensor_data,
    'explanation': 'Test verification'
}

print(f"\nError Code: {error_code}")
print(f"Error Description: {ErrorCodes.DESCRIPTIONS.get(error_code)}")
print(f"\nPayload JSON:")
print(json.dumps(payload, indent=2))

# Verify error_code is present
if 'error_code' not in payload:
    print("\n❌ ERROR: error_code is NOT in payload!")
    sys.exit(1)

if payload['error_code'] is None or payload['error_code'] == '':
    print("\n❌ ERROR: error_code is None or empty!")
    sys.exit(1)

print(f"\n✅ VERIFIED: error_code '{payload['error_code']}' is in payload")

# Send to n8n
print(f"\nSending to n8n webhook...")
try:
    response = requests.post(
        webhook_url,
        json=payload,
        timeout=10,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code in [200, 201, 202]:
        print("\n✅ SUCCESS: Webhook sent successfully")
        print(f"✅ VERIFIED: error_code '{error_code}' was sent to n8n")
        print("\n💡 Check your n8n workflow execution to see if error_code is received")
    else:
        print(f"\n❌ FAILED: Webhook returned status {response.status_code}")
        
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    sys.exit(1)
