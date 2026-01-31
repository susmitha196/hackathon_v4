"""
FastAPI Backend
Provides /predict endpoint for downtime risk prediction
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_model import DowntimePredictor
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="Factory Copilot API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML model
predictor = DowntimePredictor()
predictor.train()

# Request model
class SensorData(BaseModel):
    temperature: float
    vibration: float
    cycle_time: float
    error_count: float

# Response model
class PredictionResponse(BaseModel):
    risk: int
    feature_importance: dict

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Factory Copilot API",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    """Model status endpoint"""
    return {
        "status": "healthy",
        "model_trained": predictor.trained,
        "model_type": "RandomForestClassifier"
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(sensor_data: SensorData):
    """
    Predict downtime risk from sensor data
    
    Args:
        sensor_data: Sensor readings (temperature, vibration, cycle_time, error_count)
        
    Returns:
        Prediction with risk score (0-100) and feature importance
    """
    try:
        # Convert to dict
        sensor_dict = {
            'temperature': sensor_data.temperature,
            'vibration': sensor_data.vibration,
            'cycle_time': sensor_data.cycle_time,
            'error_count': sensor_data.error_count
        }
        
        # Get prediction
        result = predictor.predict_risk(sensor_dict)
        
        return PredictionResponse(
            risk=result['risk'],
            feature_importance=result['feature_importance']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
