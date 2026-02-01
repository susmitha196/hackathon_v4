"""
Test script to verify API connection from external UI
"""
import requests
import json
import sys

def test_api(base_url="http://localhost:8000"):
    """Test API connection and endpoints"""
    
    print("🔍 Testing Factory Copilot API Connection...")
    print(f"📍 Base URL: {base_url}\n")
    
    # Test 1: Health Check
    print("1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        response.raise_for_status()
        health_data = response.json()
        print("   ✅ Health check passed")
        print(f"   📊 Model trained: {health_data.get('model_trained', False)}")
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to API. Is the server running?")
        print("   💡 Start the API with: python run_api.py")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 2: Root endpoint
    print("\n2️⃣ Testing Root Endpoint...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        response.raise_for_status()
        root_data = response.json()
        print("   ✅ Root endpoint accessible")
        print(f"   📋 Service: {root_data.get('service', 'Unknown')}")
    except Exception as e:
        print(f"   ⚠️ Warning: {e}")
    
    # Test 3: Predict endpoint
    print("\n3️⃣ Testing Predict Endpoint...")
    test_data = {
        "temperature": 85.0,
        "vibration": 5.5,
        "cycle_time": 50.0,
        "error_count": 5
    }
    
    try:
        response = requests.post(
            f"{base_url}/predict",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        response.raise_for_status()
        result = response.json()
        print("   ✅ Prediction successful")
        print(f"   📊 Risk Score: {result.get('risk', 'N/A')}%")
        print(f"   🔑 Feature Importance:")
        for feature, importance in result.get('feature_importance', {}).items():
            print(f"      - {feature}: {importance:.2f}")
    except requests.exceptions.HTTPError as e:
        print(f"   ❌ HTTP Error: {e}")
        print(f"   Response: {response.text}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 4: API Info
    print("\n4️⃣ Testing API Info Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/info", timeout=5)
        response.raise_for_status()
        info = response.json()
        print("   ✅ API info retrieved")
        print(f"   📋 Available endpoints:")
        for endpoint, path in info.get('endpoints', {}).items():
            print(f"      - {endpoint}: {path}")
    except Exception as e:
        print(f"   ⚠️ Warning: {e}")
    
    print("\n" + "="*50)
    print("✅ All tests passed! API is ready for external UI connection.")
    print("="*50)
    print("\n📝 Example usage in your UI:")
    print(f"""
    // JavaScript/React
    const response = await fetch('{base_url}/predict', {{
      method: 'POST',
      headers: {{ 'Content-Type': 'application/json' }},
      body: JSON.stringify({{
        temperature: 75.5,
        vibration: 3.2,
        cycle_time: 45.0,
        error_count: 2
      }})
    }});
    const result = await response.json();
    """)
    
    return True

if __name__ == "__main__":
    # Allow custom base URL
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    success = test_api(base_url)
    sys.exit(0 if success else 1)
