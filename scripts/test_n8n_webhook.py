"""
Test script for n8n webhook integration
Tests the automation trigger when downtime risk exceeds threshold
"""
import sys
import os

# Fix Windows encoding for emojis
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

# Import error codes
from error_codes import determine_error_code, ErrorCodes

# Try to load from Streamlit secrets.toml
secrets_path = os.path.join(os.path.dirname(__file__), '..', '.streamlit', 'secrets.toml')
if os.path.exists(secrets_path):
    try:
        # Simple TOML parsing (without external library)
        with open(secrets_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract N8N_WEBHOOK_URL value
            import re
            match = re.search(r'N8N_WEBHOOK_URL\s*=\s*["\']([^"\']+)["\']', content)
            if match:
                os.environ['N8N_WEBHOOK_URL'] = match.group(1)
    except Exception as e:
        print(f"Warning: Could not read secrets.toml: {e}")

from automation import AutomationTrigger
from datetime import datetime

def test_n8n_webhook():
    """Test n8n webhook with sample data"""
    
    print("=" * 60)
    print("🧪 Testing n8n Webhook Integration")
    print("=" * 60)
    
    # Initialize automation trigger
    automation = AutomationTrigger()
    
    # Check if configured
    if not automation.is_configured():
        print("❌ ERROR: n8n webhook URL not configured!")
        print("\n💡 Please add N8N_WEBHOOK_URL to:")
        print("   - .streamlit/secrets.toml (for Streamlit)")
        print("   - .env (for environment variables)")
        print("\nExample:")
        print('   N8N_WEBHOOK_URL = "https://your-instance.n8n.cloud/webhook/abc123"')
        return False
    
    print(f"✅ Webhook URL configured: {automation.webhook_url[:50]}...")
    print()
    
    # Test scenarios
    test_scenarios = [
        {
            "name": "Low Risk (Should NOT trigger)",
            "risk_score": 45,
            "should_trigger": False
        },
        {
            "name": "Medium Risk (Should NOT trigger)",
            "risk_score": 65,
            "should_trigger": False
        },
        {
            "name": "High Risk (SHOULD trigger - ≥75%)",
            "risk_score": 85,
            "should_trigger": True
        },
        {
            "name": "Critical Risk (SHOULD trigger - ≥75%)",
            "risk_score": 95,
            "should_trigger": True
        }
    ]
    
    # Sample sensor data
    sample_sensor_data = {
        "temperature": 85.5,
        "vibration": 8.2,
        "cycle_time": 65.3,
        "error_count": 12,
        "pressure": 4.8,
        "humidity": 45.2,
        "power_consumption": 1250.0,
        "production_rate": 78.5
    }
    
    # Determine error code for sample data
    sample_error_code = determine_error_code(sample_sensor_data, 85)
    
    # Sample explanation
    sample_explanation = {
        "root_cause": "Elevated temperature (85.5°C) and high vibration (8.2 mm/s) indicate bearing wear and potential motor overheating.",
        "recommended_action": "Schedule immediate maintenance: 1) Inspect motor bearings, 2) Check cooling system, 3) Replace worn components if necessary."
    }
    
    print("📊 Running Test Scenarios:")
    print("-" * 60)
    
    results = []
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n{i}. {scenario['name']}")
        print(f"   Risk Score: {scenario['risk_score']}%")
        print(f"   Expected: {'TRIGGER' if scenario['should_trigger'] else 'NO TRIGGER'}")
        
        # Only trigger if risk >= 75%
        if scenario['risk_score'] >= 75:
            print("   🔔 Triggering webhook...")
            # Determine error code for this scenario
            scenario_error_code = determine_error_code(sample_sensor_data, scenario['risk_score'])
            print(f"   📋 Error Code: {scenario_error_code} - {ErrorCodes.DESCRIPTIONS.get(scenario_error_code)}")
            result = automation.trigger_maintenance_alert(
                risk_score=scenario['risk_score'],
                sensor_data=sample_sensor_data,
                explanation=sample_explanation,
                error_code=scenario_error_code
            )
            
            if result['triggered']:
                print(f"   ✅ SUCCESS: {result['message']}")
                results.append(True)
            else:
                print(f"   ❌ FAILED: {result['message']}")
                results.append(False)
        else:
            print("   ⏭️  Skipped (risk < 75%)")
            results.append(True)  # Not a failure, just not triggered
    
    print("\n" + "=" * 60)
    print("📋 Test Summary")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("✅ All tests passed!")
        print("\n💡 Next Steps:")
        print("   1. Check your n8n workflow to see if webhooks were received")
        print("   2. Verify the payload structure matches your workflow")
        print("   3. Test in the Streamlit app by enabling 'Simulate Failure Scenario'")
        print("   4. When risk reaches ≥75%, the webhook should trigger automatically")
    else:
        print("❌ Some tests failed. Check the error messages above.")
        print("\n💡 Troubleshooting:")
        print("   - Verify your webhook URL is correct")
        print("   - Check if your n8n workflow is active")
        print("   - Ensure the webhook accepts POST requests")
        print("   - Check n8n logs for errors")
    
    return passed == total

if __name__ == "__main__":
    try:
        success = test_n8n_webhook()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
