# Connecting External UI to This Project

This guide explains how to connect a UI created in a different Cursor account (or any external frontend) to this Factory Copilot backend.

## Option 1: Use the FastAPI Backend (Recommended)

This project includes a FastAPI backend that can serve any external UI.

### Step 1: Start the API Server

```bash
# From project root
python run_api.py
```

The API will run on: `http://localhost:8000`

### Step 2: Available API Endpoints

#### Health Check
```http
GET http://localhost:8000/
GET http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Factory Copilot API",
  "version": "1.0.0"
}
```

#### Predict Downtime Risk
```http
POST http://localhost:8000/predict
Content-Type: application/json

{
  "temperature": 75.5,
  "vibration": 3.2,
  "cycle_time": 45.0,
  "error_count": 2
}
```

**Response:**
```json
{
  "risk": 45,
  "feature_importance": {
    "temperature": 0.35,
    "vibration": 0.28,
    "cycle_time": 0.22,
    "error_count": 0.15
  }
}
```

### Step 3: Connect Your External UI

#### JavaScript/React/Vue Example

```javascript
// Fetch prediction from API
async function getPrediction(sensorData) {
  const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      temperature: sensorData.temperature,
      vibration: sensorData.vibration,
      cycle_time: sensorData.cycleTime,
      error_count: sensorData.errorCount
    })
  });
  
  const result = await response.json();
  return result;
}

// Usage
const sensorData = {
  temperature: 75.5,
  vibration: 3.2,
  cycleTime: 45.0,
  errorCount: 2
};

getPrediction(sensorData).then(result => {
  console.log('Risk Score:', result.risk);
  console.log('Feature Importance:', result.feature_importance);
});
```

#### Python Example

```python
import requests

def get_prediction(temperature, vibration, cycle_time, error_count):
    url = "http://localhost:8000/predict"
    payload = {
        "temperature": temperature,
        "vibration": vibration,
        "cycle_time": cycle_time,
        "error_count": error_count
    }
    response = requests.post(url, json=payload)
    return response.json()

# Usage
result = get_prediction(75.5, 3.2, 45.0, 2)
print(f"Risk Score: {result['risk']}%")
```

### Step 4: CORS Configuration

CORS is already enabled for all origins (`allow_origins=["*"]`), so your external UI can make requests from any domain.

If you need to restrict to specific domains, edit `src/api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-ui-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Option 2: Share Project via Git

### Step 1: Push to Git Repository

```bash
# If not already initialized
git init
git remote add origin <your-repo-url>
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 2: Clone in Other Account

```bash
git clone <your-repo-url>
cd hackathon
pip install -r requirements.txt
```

### Step 3: Run API Server

```bash
python run_api.py
```

## Option 3: Deploy API to Cloud

### Deploy to Heroku

1. Create `Procfile`:
```
web: python run_api.py
```

2. Deploy:
```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Railway/Render/Fly.io

Use the `run_api.py` script as your start command.

## Option 4: Use Streamlit App Directly

If you want to embed the Streamlit app:

1. Run the Streamlit app:
```bash
python run_app.py
```

2. Access at: `http://localhost:8501`

3. Embed in iframe (if allowed):
```html
<iframe src="http://localhost:8501" width="100%" height="800px"></iframe>
```

## API Documentation

Once the API is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

If your external UI needs to call other services (n8n, OpenAI, Gemini), ensure these are set:

```bash
# .env file
N8N_WEBHOOK_URL=https://your-n8n-webhook-url
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
```

## Testing the Connection

### Test Script

Create `test_api_connection.py`:

```python
import requests
import json

def test_api():
    url = "http://localhost:8000/predict"
    payload = {
        "temperature": 85.0,
        "vibration": 5.5,
        "cycle_time": 50.0,
        "error_count": 5
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        print("✅ API Connection Successful!")
        print(f"Risk Score: {result['risk']}%")
        print(f"Feature Importance: {json.dumps(result['feature_importance'], indent=2)}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Is the server running?")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_api()
```

Run: `python test_api_connection.py`

## Troubleshooting

### Connection Refused
- Ensure API server is running: `python run_api.py`
- Check port 8000 is not in use
- Verify firewall settings

### CORS Errors
- Check CORS configuration in `src/api.py`
- Ensure `allow_origins` includes your UI's domain

### 404 Errors
- Verify endpoint URL: `http://localhost:8000/predict`
- Check API server logs for errors

### Port Conflicts
- Change port in `run_api.py`: `uvicorn.run(app, host="0.0.0.0", port=8001)`
- Update your UI to use the new port

## Next Steps

1. **Start the API**: `python run_api.py`
2. **Test connection**: Use the test script above
3. **Integrate in your UI**: Use the JavaScript/Python examples
4. **Deploy**: Choose a cloud platform for production

## Support

For issues or questions:
- Check API docs at `http://localhost:8000/docs`
- Review `src/api.py` for endpoint details
- Check logs for error messages
