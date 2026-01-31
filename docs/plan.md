# Hackathon Build Plan — Factory Copilot

> **Goal:** Build a working, rule-compliant MVP of an AI-powered Factory Copilot that predicts machine downtime, explains why it happens, and automatically triggers maintenance actions.

This plan reflects the **current implemented state** of the project.

---

## 🧠 One-Sentence Pitch

> An AI copilot for factories that predicts machine downtime using ML, displays real-time IoT 4.0 sensor data with smooth visualizations, and provides actionable insights for predictive maintenance.

---

## 🏗️ System Overview

**Core flow:**

Live Sensor Data Generation → ML Prediction → Real-time Visualization → UI Dashboard

**Current Tech stack:**
- Frontend: Streamlit (standalone app)
- ML: scikit-learn (RandomForestClassifier)
- Data Visualization: Plotly (smooth spline curves)
- Data Generation: NumPy (realistic IoT 4.0 patterns)
- Backend API: FastAPI (optional, can run in dummy mode)
- Deployment: Google Cloud Run/App Engine ready

---

## ✅ Current Implementation Status

### ✅ Completed Features

**1. Live IoT 4.0 Sensor Data Generation**
- `LiveSensorGenerator` class generates realistic sensor data
- Based on ISO 10816 (vibration) and ISO 7919 (rotating machinery) standards
- 8 sensor types: temperature, vibration, cycle_time, error_count, pressure, humidity, power_consumption, production_rate
- Smooth cyclical patterns (sine waves) for realistic industrial behavior
- Normal operation and failure simulation modes

**2. ML Downtime Prediction**
- `ml_model.py` with `DowntimePredictor` class
- RandomForestClassifier trained on synthetic data
- Predicts downtime risk (0-100%)
- Feature importance analysis
- Works standalone (no API required)

**3. Real-time Streamlit Dashboard (`app.py`)**
- Live data generation with auto-refresh (configurable 0.5-5 seconds)
- Smooth spline curve visualizations (Plotly)
- Multi-sensor timeline chart with 4 Y-axes
- Current sensor readings display
- Downtime risk gauge and feature importance
- Failure scenario simulation toggle
- Local prediction mode (works without API)

**4. Optional FastAPI Backend (`api.py`)**
- `/predict` endpoint for ML predictions
- Can be used for distributed deployments
- Falls back to local predictions if unavailable

**5. Deployment Ready**
- Dockerfile for containerization
- Google Cloud Run/App Engine configurations
- Cloud Build YAML
- Deployment scripts (Windows/Linux)

### 📁 Current Project Structure

```
hackathon/
├── app.py                    # Main Streamlit UI (live data generation)
├── ml_model.py               # ML prediction model (RandomForest)
├── api.py                    # Optional FastAPI backend
├── requirements.txt          # Dependencies (streamlit, plotly, scikit-learn, etc.)
├── sample_sensor_data.json   # Sample data file (for reference)
├── Dockerfile                # Container configuration
├── cloudbuild.yaml           # Google Cloud Build config
├── app.yaml                  # Google App Engine config
├── deploy.sh / deploy.bat     # Deployment scripts
├── DEPLOY.md                 # Deployment guide
├── QUICKSTART.md             # Quick start guide
├── README.md                 # Project documentation
└── plan.md                   # This file
```

### 🎯 Key Features

- **Live Data Generation**: Real-time IoT sensor data with realistic patterns
- **Smooth Visualizations**: Professional spline curves matching industrial dashboards
- **ML Predictions**: Local RandomForest model for downtime risk
- **Auto-Refresh**: Configurable refresh intervals (0.5-5 seconds)
- **Failure Simulation**: Toggle to simulate gradual machine failure
- **Standalone Operation**: Works without external APIs or services
- **Cloud Ready**: Dockerized and deployable to Google Cloud

---

## 🚀 How to Run

### Quick Start (Standalone Mode)

```bash
# Install dependencies
pip install -r requirements.txt

# Run Streamlit app (works standalone, no API needed)
streamlit run app.py
```

The app will:
- Generate live sensor data automatically
- Display real-time charts with smooth curves
- Show ML predictions (local mode)
- Auto-refresh every 1 second (configurable)

### With FastAPI Backend (Optional)

```bash
# Terminal 1: Start API
python api.py

# Terminal 2: Start UI
streamlit run app.py
```

Uncheck "Use Local Predictions" in the UI to use the API.

## 🎥 Demo Flow

1. **Normal Operation (30s)**
   - Show live sensor readings
   - Low downtime risk (< 30%)
   - Smooth cyclical patterns in graphs

2. **Failure Simulation (60s)**
   - Enable "Simulate Failure Scenario"
   - Watch gradual increase in:
     - Temperature (65°C → 110°C)
     - Vibration (2.3 → 14 mm/s)
     - Cycle time (42s → 75s)
     - Error count (0 → 18)
   - Risk score increases (0% → 100%)
   - Feature importance shows contributing factors

3. **Visualization (30s)**
   - Smooth spline curves (no spikes)
   - Multi-sensor timeline
   - Real-time updates

## 🎯 Current Capabilities

✅ **Real-time IoT 4.0 Data Generation**
- 8 sensor types with realistic industrial patterns
- ISO standard-based values
- Smooth cyclical variations

✅ **ML-Based Downtime Prediction**
- RandomForest model
- Risk scoring (0-100%)
- Feature importance analysis

✅ **Professional Visualizations**
- Smooth spline curves
- Multi-axis charts
- Real-time updates

✅ **Standalone Operation**
- No external dependencies required
- Works offline
- Local ML predictions

✅ **Cloud Deployment Ready**
- Dockerized
- Google Cloud configurations
- Deployment scripts included

## 🚫 Removed/Deferred Features

- ❌ AI explanations (LangChain + OpenAI) - Removed for simplicity
- ❌ Gemini trend analysis - Removed for simplicity  
- ❌ n8n automation webhooks - Removed for simplicity
- ❌ Static JSON data loading - Replaced with live generation
- ❌ Multiple failure scenarios - Simplified to single gradual failure

**Reason**: Focused on core functionality (live data + ML prediction + visualization) for stability and clarity.

## 🏁 Current Status

✅ **Working Features:**
- Live sensor data generation
- ML downtime prediction
- Real-time visualizations
- Auto-refresh functionality
- Failure simulation
- Standalone operation

✅ **Demo Ready:**
- Clean, professional UI
- Smooth visualizations
- Clear risk indicators
- Easy to demonstrate

---

> **Current State**: MVP complete with live data generation, ML predictions, and professional visualizations. Ready for demo and deployment.

