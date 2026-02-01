# Removing Streamlit and Integrating with Your New UI

This guide explains how to use all Factory Copilot features via the API, allowing you to remove Streamlit and integrate with your custom UI theme.

## 🎯 Overview

All Streamlit features are now available via REST API endpoints. You can:
- ✅ Remove Streamlit completely
- ✅ Use your custom UI theme
- ✅ Keep all existing features (ML, AI, Automation, etc.)

## 🚀 Quick Start

### 1. Start the API Server

```bash
python run_api.py
```

The API runs on: `http://localhost:8000`

### 2. View API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 3. Test the API

```bash
python scripts/test_api_connection.py
```

## 📋 All Available Endpoints

### Prediction & Analysis

#### `POST /predict`
Get downtime risk prediction from sensor data.

**Request:**
```json
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

#### `POST /complete-analysis`
Get everything in one call: prediction + AI explanation + error code.

**Request:**
```json
{
  "temperature": 85.0,
  "vibration": 5.5,
  "cycle_time": 50.0,
  "error_count": 5
}
```

**Response:**
```json
{
  "prediction": {
    "risk": 75,
    "feature_importance": {...}
  },
  "explanation": {
    "root_cause": "High temperature and vibration detected...",
    "recommended_action": "Schedule immediate maintenance..."
  },
  "error_code": {
    "code": "E001",
    "description": "High Temperature",
    "severity": "HIGH"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### AI Features

#### `POST /ai/explain`
Get AI explanation using OpenAI.

**Request:**
```json
{
  "prediction": {
    "risk": 75,
    "feature_importance": {...}
  },
  "sensor_data": {
    "temperature": 85.0,
    "vibration": 5.5,
    "cycle_time": 50.0,
    "error_count": 5
  }
}
```

**Response:**
```json
{
  "root_cause": "Elevated temperature suggests...",
  "recommended_action": "Immediate cooling system check..."
}
```

#### `POST /ai/trends`
Analyze trends using Gemini AI.

**Request:**
```json
[
  {
    "timestamp": "2024-01-15T10:00:00",
    "temperature": 65.0,
    "vibration": 2.3,
    "cycle_time": 42.0,
    "error_count": 0
  },
  {
    "timestamp": "2024-01-15T10:01:00",
    "temperature": 67.0,
    "vibration": 2.5,
    "cycle_time": 43.0,
    "error_count": 1
  }
  // ... more readings
]
```

**Response:**
```json
{
  "summary": "Temperature and vibration showing upward trend...",
  "anomalies": ["Rising temperature detected", "Elevated vibration observed"],
  "status": "analyzed"
}
```

### Sensor Data Generation

#### `POST /sensor/generate`
Generate realistic sensor readings.

**Request:**
```json
{
  "mode": "normal",  // or "failure"
  "failure_progress": 0.0,  // 0.0-1.0 (only for failure mode)
  "history_length": 0
}
```

**Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "temperature": 65.5,
  "vibration": 2.3,
  "cycle_time": 42.5,
  "error_count": 0.3,
  "pressure": 105.0,
  "humidity": 48.0,
  "power": 15250.0,
  "production": 94.5
}
```

### Automation

#### `POST /automation/trigger`
Trigger n8n workflow automation.

**Request:**
```json
{
  "risk_score": 85.0,
  "sensor_data": {
    "temperature": 90.0,
    "vibration": 6.0,
    "cycle_time": 55.0,
    "error_count": 8
  },
  "explanation": {
    "root_cause": "...",
    "recommended_action": "..."
  },
  "error_code": "E001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Maintenance alert triggered successfully",
  "triggered": true,
  "response_data": {...},
  "status_code": 200,
  "error_code": "E001"
}
```

### Error Codes

#### `GET /error-codes`
Get all available error codes.

**Response:**
```json
{
  "error_codes": {
    "E001": {
      "description": "High Temperature",
      "severity": "HIGH",
      "causes": [...],
      "recommended_actions": [...]
    },
    // ... more codes
  }
}
```

#### `POST /error-codes/determine`
Determine error code from sensor data.

**Request:**
```json
{
  "sensor_data": {
    "temperature": 90.0,
    "vibration": 3.0,
    "cycle_time": 45.0,
    "error_count": 2
  },
  "risk_score": 75.0
}
```

## 💻 Integration Examples

### JavaScript/React Example

```javascript
// Complete analysis in one call
async function getCompleteAnalysis(sensorData) {
  const response = await fetch('http://localhost:8000/complete-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sensorData)
  });
  return await response.json();
}

// Generate sensor reading
async function generateSensorReading(mode = 'normal', failureProgress = 0) {
  const response = await fetch('http://localhost:8000/sensor/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      failure_progress: failureProgress,
      history_length: 0
    })
  });
  return await response.json();
}

// Trigger automation
async function triggerAutomation(riskScore, sensorData, explanation, errorCode) {
  const response = await fetch('http://localhost:8000/automation/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      risk_score: riskScore,
      sensor_data: sensorData,
      explanation,
      error_code: errorCode
    })
  });
  return await response.json();
}

// Usage in React component
function Dashboard() {
  const [sensorData, setSensorData] = useState({
    temperature: 65.0,
    vibration: 2.3,
    cycle_time: 42.5,
    error_count: 0
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const reading = await generateSensorReading('normal');
      setSensorData(reading);
      
      const analysis = await getCompleteAnalysis({
        temperature: reading.temperature,
        vibration: reading.vibration,
        cycle_time: reading.cycle_time,
        error_count: reading.error_count
      });
      
      // Update UI with analysis results
      if (analysis.prediction.risk > 75) {
        await triggerAutomation(
          analysis.prediction.risk,
          sensorData,
          analysis.explanation,
          analysis.error_code.code
        );
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Your custom UI theme here */}
      <h1>Factory Copilot Dashboard</h1>
      {/* Display sensor data, predictions, etc. */}
    </div>
  );
}
```

### Python Example

```python
import requests

API_BASE = "http://localhost:8000"

def get_complete_analysis(sensor_data):
    """Get prediction, explanation, and error code"""
    response = requests.post(
        f"{API_BASE}/complete-analysis",
        json=sensor_data
    )
    return response.json()

def generate_sensor_reading(mode="normal", failure_progress=0.0):
    """Generate sensor reading"""
    response = requests.post(
        f"{API_BASE}/sensor/generate",
        json={
            "mode": mode,
            "failure_progress": failure_progress,
            "history_length": 0
        }
    )
    return response.json()

def trigger_automation(risk_score, sensor_data, explanation, error_code):
    """Trigger n8n automation"""
    response = requests.post(
        f"{API_BASE}/automation/trigger",
        json={
            "risk_score": risk_score,
            "sensor_data": sensor_data,
            "explanation": explanation,
            "error_code": error_code
        }
    )
    return response.json()

# Usage
sensor_data = {
    "temperature": 85.0,
    "vibration": 5.5,
    "cycle_time": 50.0,
    "error_count": 5
}

analysis = get_complete_analysis(sensor_data)
print(f"Risk: {analysis['prediction']['risk']}%")
print(f"Root Cause: {analysis['explanation']['root_cause']}")
print(f"Error Code: {analysis['error_code']['code']}")
```

## 🗑️ Removing Streamlit

### Option 1: Keep Streamlit Files (Recommended)
Keep `src/app.py` and `run_app.py` for reference, but don't use them.

### Option 2: Remove Streamlit Completely

1. **Remove Streamlit files:**
   ```bash
   rm src/app.py
   rm run_app.py
   ```

2. **Remove Streamlit from requirements:**
   ```bash
   # Edit requirements.txt, remove streamlit line
   ```

3. **Update README:**
   - Remove Streamlit instructions
   - Add API usage instructions

## 📊 Feature Mapping: Streamlit → API

| Streamlit Feature | API Endpoint |
|------------------|--------------|
| ML Prediction | `POST /predict` |
| AI Explanation | `POST /ai/explain` |
| Gemini Trend Analysis | `POST /ai/trends` |
| Live Sensor Generation | `POST /sensor/generate` |
| n8n Automation | `POST /automation/trigger` |
| Error Code Lookup | `GET /error-codes` |
| Error Code Determination | `POST /error-codes/determine` |
| Complete Analysis | `POST /complete-analysis` |

## 🎨 UI Integration Checklist

- [ ] Start API server: `python run_api.py`
- [ ] Test API connection: `python scripts/test_api_connection.py`
- [ ] Review API docs: `http://localhost:8000/docs`
- [ ] Integrate `/complete-analysis` endpoint in your UI
- [ ] Add sensor data generation: `/sensor/generate`
- [ ] Implement automation triggers: `/automation/trigger`
- [ ] Add error code display: `/error-codes`
- [ ] Style with your custom theme
- [ ] Remove Streamlit dependencies (optional)

## 🔧 Configuration

All configuration remains the same:
- `.env` file for API keys
- `.streamlit/secrets.toml` (not needed if removing Streamlit)
- Environment variables work the same way

## 📝 Next Steps

1. **Start the API**: `python run_api.py`
2. **Test endpoints**: Use `http://localhost:8000/docs`
3. **Integrate in your UI**: Use the examples above
4. **Customize theme**: Apply your UI styling
5. **Deploy**: Deploy API separately from UI

## 🆘 Support

- API Documentation: `http://localhost:8000/docs`
- Test Script: `python scripts/test_api_connection.py`
- See `docs/EXTERNAL_UI_INTEGRATION.md` for more examples
