"""
FastAPI Backend - Complete API for Factory Copilot
Provides all endpoints needed to replace Streamlit UI
"""
from fastapi import FastAPI, HTTPException, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import sys
import re

# Add src directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from ml_model import DowntimePredictor
from ai_explainer import AIExplainer
from gemini_analyzer import GeminiAnalyzer
from automation import AutomationTrigger
from error_codes import determine_error_code, ErrorCodes
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="Factory Copilot API",
    version="1.0.0",
    description="Complete API for Factory Copilot - All features available via REST endpoints"
)

# Middleware to normalize double slashes in URLs
class NormalizePathMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Normalize multiple slashes in path to single slashes
        path = request.url.path
        if "//" in path or path.startswith("/"):
            # Replace multiple consecutive slashes with single slash
            normalized_path = re.sub(r'/+', '/', path)
            # Ensure path starts with single slash
            if not normalized_path.startswith('/'):
                normalized_path = '/' + normalized_path
            # Update the scope's path_info and raw_path (used for routing)
            if normalized_path != path:
                request.scope["path"] = normalized_path
                request.scope["path_info"] = normalized_path
                # Also update raw_path if it exists
                if "raw_path" in request.scope:
                    request.scope["raw_path"] = normalized_path.encode()
        return await call_next(request)

# Add path normalization middleware (before CORS)
app.add_middleware(NormalizePathMiddleware)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize all services
predictor = DowntimePredictor()
predictor.train()
ai_explainer = AIExplainer()
gemini_analyzer = GeminiAnalyzer()
automation = AutomationTrigger()

# Import LiveSensorGenerator from app.py logic
import numpy as np
from datetime import datetime as dt

class LiveSensorGenerator:
    """Generate live IoT 4.0 sensor data"""
    def __init__(self):
        self.base_temp = 65.0
        self.base_vibration = 2.3
        self.base_cycle_time = 42.5
        self.base_error = 0.3
        self.base_pressure = 105.0
        self.base_humidity = 48.0
        self.base_power = 15250.0
        self.base_production = 94.5
    
    def generate_normal_reading(self, history_length=0):
        cycle_position = (history_length % 100) / 100.0
        smooth_factor = np.sin(cycle_position * np.pi * 2)
        return {
            'timestamp': dt.now().isoformat(),
            'temperature': max(60.0, min(72.0, self.base_temp + smooth_factor * 5)),
            'vibration': max(1.5, min(3.0, self.base_vibration + smooth_factor * 0.5)),
            'cycle_time': max(38.0, min(47.0, self.base_cycle_time + smooth_factor * 3)),
            'error_count': max(0, min(1.0, self.base_error + abs(smooth_factor) * 0.3)),
            'pressure': max(100.0, min(110.0, self.base_pressure + smooth_factor * 3)),
            'humidity': max(45.0, min(52.0, self.base_humidity + smooth_factor * 2)),
            'power': max(14500.0, min(16000.0, self.base_power + smooth_factor * 500)),
            'production': max(92.0, min(97.0, self.base_production + smooth_factor * 1.5))
        }
    
    def generate_failure_reading(self, failure_progress, history_length=0):
        cycle_position = (history_length % 100) / 100.0
        smooth_factor = np.sin(cycle_position * np.pi * 2)
        return {
            'timestamp': dt.now().isoformat(),
            'temperature': min(95.0, self.base_temp + failure_progress * 25 + smooth_factor * 3),
            'vibration': min(8.0, self.base_vibration + failure_progress * 5 + abs(smooth_factor) * 0.8),
            'cycle_time': min(65.0, self.base_cycle_time + failure_progress * 20 + abs(smooth_factor) * 2),
            'error_count': min(10.0, self.base_error + failure_progress * 9 + abs(smooth_factor) * 1),
            'pressure': max(95.0, min(115.0, self.base_pressure - failure_progress * 8 + smooth_factor * 2)),
            'humidity': max(40.0, min(55.0, self.base_humidity + failure_progress * 5 + smooth_factor * 1)),
            'power': max(14000.0, min(17000.0, self.base_power + failure_progress * 2000 + smooth_factor * 300)),
            'production': max(75.0, min(95.0, self.base_production - failure_progress * 18 + smooth_factor * 1))
        }

live_generator = LiveSensorGenerator()

# Request/Response models
class SensorData(BaseModel):
    temperature: float
    vibration: float
    cycle_time: float
    error_count: float

class SensorReading(BaseModel):
    timestamp: Optional[str] = None
    temperature: float
    vibration: float
    cycle_time: float
    error_count: float
    pressure: Optional[float] = None
    humidity: Optional[float] = None
    power: Optional[float] = None
    production: Optional[float] = None

class PredictionResponse(BaseModel):
    risk: int
    feature_importance: dict

class AIExplanationResponse(BaseModel):
    root_cause: str
    recommended_action: str

class TrendAnalysisResponse(BaseModel):
    summary: str
    anomalies: List[str]
    status: str

class AutomationResponse(BaseModel):
    success: bool
    message: str
    triggered: bool
    response_data: Optional[Dict[str, Any]] = None
    status_code: Optional[int] = None
    error_code: Optional[str] = None

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

@app.get("/api/info")
def api_info():
    """API information endpoint - lists all available endpoints"""
    return {
        "name": "Factory Copilot API",
        "version": "1.0.0",
        "description": "Complete API for Factory Copilot - All Streamlit features available via REST",
        "endpoints": {
            "prediction": {
                "predict": "POST /predict - Get downtime risk prediction",
                "complete_analysis": "POST /complete-analysis - Get prediction + AI explanation + error code"
            },
            "ai_features": {
                "explain": "POST /ai/explain - Get AI explanation (OpenAI)",
                "trends": "POST /ai/trends - Analyze trends (Gemini)"
            },
            "sensor_data": {
                "generate": "POST /sensor/generate - Generate live sensor reading"
            },
            "automation": {
                "trigger": "POST /automation/trigger - Trigger n8n workflow"
            },
            "error_codes": {
                "list": "GET /error-codes - Get all error codes",
                "determine": "POST /error-codes/determine - Determine error code from sensor data"
            },
            "system": {
                "health": "GET /health - Health check",
                "docs": "GET /docs - Interactive API documentation",
                "redoc": "GET /redoc - Alternative API documentation"
            }
        },
        "cors_enabled": True,
        "model_ready": predictor.trained,
        "services_available": {
            "ml_model": predictor.trained,
            "ai_explainer": ai_explainer.llm is not None,
            "gemini_analyzer": gemini_analyzer.model is not None,
            "automation": automation.enabled
        }
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

@app.post("/ai/explain", response_model=AIExplanationResponse)
def get_ai_explanation(
    prediction: PredictionResponse = Body(...),
    sensor_data: SensorData = Body(...)
):
    """
    Get AI explanation for downtime prediction (OpenAI)
    
    Returns root cause analysis and recommended actions
    """
    try:
        prediction_dict = {
            'risk': prediction.risk,
            'feature_importance': prediction.feature_importance
        }
        sensor_dict = {
            'temperature': sensor_data.temperature,
            'vibration': sensor_data.vibration,
            'cycle_time': sensor_data.cycle_time,
            'error_count': sensor_data.error_count
        }
        
        explanation = ai_explainer.explain(prediction_dict, sensor_dict)
        return AIExplanationResponse(**explanation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI explanation error: {str(e)}")

@app.post("/ai/trends", response_model=TrendAnalysisResponse)
def analyze_trends(sensor_history: List[SensorReading]):
    """
    Analyze sensor trends using Gemini AI
    
    Args:
        sensor_history: List of sensor readings (at least 10 recommended)
        
    Returns:
        Trend summary and detected anomalies
    """
    try:
        if len(sensor_history) < 5:
            raise HTTPException(
                status_code=400,
                detail="At least 5 sensor readings required for trend analysis"
            )
        
        # Convert to list of dicts
        history_dicts = [reading.dict() for reading in sensor_history]
        
        analysis = gemini_analyzer.analyze_trends(history_dicts)
        return TrendAnalysisResponse(**analysis)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis error: {str(e)}")

@app.post("/sensor/generate")
def generate_sensor_reading(
    mode: str = Body(..., embed=True, description="'normal' or 'failure'"),
    failure_progress: float = Body(0.0, embed=True, description="Failure progress 0.0-1.0"),
    history_length: int = Body(0, embed=True, description="Length of sensor history")
):
    """
    Generate live sensor reading
    
    Args:
        mode: 'normal' or 'failure'
        failure_progress: 0.0-1.0 (only used for failure mode)
        history_length: Length of sensor history for cyclical patterns
        
    Returns:
        Generated sensor reading
    """
    try:
        if mode == "failure":
            reading = live_generator.generate_failure_reading(failure_progress, history_length)
        else:
            reading = live_generator.generate_normal_reading(history_length)
        
        return reading
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sensor generation error: {str(e)}")

@app.post("/automation/trigger")
def trigger_automation(
    risk_score: float = Body(..., embed=True),
    sensor_data: SensorData = Body(...),
    explanation: Optional[Dict[str, str]] = Body(None, embed=True),
    error_code: Optional[str] = Body(None, embed=True)
):
    """
    Trigger n8n automation workflow
    
    Args:
        risk_score: Downtime risk score (0-100)
        sensor_data: Current sensor readings
        explanation: Optional AI explanation dict
        error_code: Optional error code
        
    Returns:
        Automation trigger result
    """
    try:
        sensor_dict = {
            'temperature': sensor_data.temperature,
            'vibration': sensor_data.vibration,
            'cycle_time': sensor_data.cycle_time,
            'error_count': sensor_data.error_count
        }
        
        # Determine error code if not provided
        if not error_code:
            error_code = determine_error_code(sensor_dict, risk_score)
        
        result = automation.trigger_maintenance_alert(
            risk_score,
            sensor_dict,
            explanation,
            error_code
        )
        
        return AutomationResponse(
            success=result.get('success', False),
            message=result.get('message', ''),
            triggered=result.get('triggered', False),
            response_data=result.get('response_data'),
            status_code=result.get('status_code'),
            error_code=error_code
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Automation error: {str(e)}")

@app.get("/error-codes")
def get_error_codes():
    """Get all available error codes and their information"""
    return {
        "error_codes": {
            code: {
                "description": ErrorCodes.DESCRIPTIONS.get(code, "Unknown"),
                "severity": ErrorCodes.SEVERITY.get(code, "UNKNOWN"),
                "causes": ErrorCodes.CAUSES.get(code, []),
                "recommended_actions": ErrorCodes.RECOMMENDED_ACTIONS.get(code, [])
            }
            for code in [
                ErrorCodes.UNKNOWN,
                ErrorCodes.HIGH_TEMPERATURE,
                ErrorCodes.HIGH_VIBRATION,
                ErrorCodes.HIGH_ERROR_COUNT,
                ErrorCodes.SLOW_CYCLE_TIME,
                ErrorCodes.CRITICAL_RISK,
                ErrorCodes.HIGH_RISK
            ]
        }
    }

@app.post("/error-codes/determine")
def determine_error_code_endpoint(
    sensor_data: SensorData = Body(...),
    risk_score: float = Body(..., embed=True)
):
    """Determine error code from sensor data and risk score"""
    try:
        sensor_dict = {
            'temperature': sensor_data.temperature,
            'vibration': sensor_data.vibration,
            'cycle_time': sensor_data.cycle_time,
            'error_count': sensor_data.error_count
        }
        
        error_code = determine_error_code(sensor_dict, risk_score)
        error_info = {
            "code": error_code,
            "description": ErrorCodes.DESCRIPTIONS.get(error_code, "Unknown"),
            "severity": ErrorCodes.SEVERITY.get(error_code, "UNKNOWN"),
            "causes": ErrorCodes.CAUSES.get(error_code, []),
            "recommended_actions": ErrorCodes.RECOMMENDED_ACTIONS.get(error_code, [])
        }
        
        return error_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error code determination error: {str(e)}")

@app.post("/complete-analysis")
def complete_analysis(sensor_data: SensorData):
    """
    Complete analysis endpoint - returns prediction, AI explanation, and error code
    
    This is a convenience endpoint that combines multiple features
    """
    try:
        sensor_dict = {
            'temperature': sensor_data.temperature,
            'vibration': sensor_data.vibration,
            'cycle_time': sensor_data.cycle_time,
            'error_count': sensor_data.error_count
        }
        
        # Get prediction
        prediction_result = predictor.predict_risk(sensor_dict)
        prediction = PredictionResponse(
            risk=prediction_result['risk'],
            feature_importance=prediction_result['feature_importance']
        )
        
        # Get AI explanation
        explanation = ai_explainer.explain(prediction_result, sensor_dict)
        
        # Determine error code
        error_code = determine_error_code(sensor_dict, prediction.risk)
        error_info = {
            "code": error_code,
            "description": ErrorCodes.DESCRIPTIONS.get(error_code, "Unknown"),
            "severity": ErrorCodes.SEVERITY.get(error_code, "UNKNOWN")
        }
        
        return {
            "prediction": prediction.dict(),
            "explanation": explanation,
            "error_code": error_info,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Complete analysis error: {str(e)}")

# Add /api prefix routes for frontend compatibility
# These duplicate routes ensure both /endpoint and /api/endpoint work
@app.post("/api/predict", response_model=PredictionResponse)
def predict_api(sensor_data: SensorData):
    """API-prefixed version of predict endpoint"""
    return predict(sensor_data)

@app.post("/api/ai/explain", response_model=AIExplanationResponse)
def get_ai_explanation_api(
    prediction: PredictionResponse = Body(...),
    sensor_data: SensorData = Body(...)
):
    """API-prefixed version of AI explain endpoint"""
    return get_ai_explanation(prediction, sensor_data)

@app.post("/api/ai/trends", response_model=TrendAnalysisResponse)
def analyze_trends_api(sensor_history: List[SensorReading]):
    """API-prefixed version of trends endpoint"""
    return analyze_trends(sensor_history)

@app.post("/api/sensor/generate")
def generate_sensor_reading_api(
    mode: str = Body(..., embed=True, description="'normal' or 'failure'"),
    failure_progress: float = Body(0.0, embed=True, description="Failure progress 0.0-1.0"),
    history_length: int = Body(0, embed=True, description="Length of sensor history")
):
    """API-prefixed version of sensor generate endpoint"""
    return generate_sensor_reading(mode, failure_progress, history_length)

@app.post("/api/automation/trigger")
def trigger_automation_api(
    risk_score: float = Body(..., embed=True),
    sensor_data: SensorData = Body(...),
    explanation: Optional[Dict[str, str]] = Body(None, embed=True),
    error_code: Optional[str] = Body(None, embed=True)
):
    """API-prefixed version of automation trigger endpoint"""
    return trigger_automation(risk_score, sensor_data, explanation, error_code)

@app.get("/api/error-codes")
def get_error_codes_api():
    """API-prefixed version of error codes endpoint"""
    return get_error_codes()

@app.post("/api/error-codes/determine")
def determine_error_code_endpoint_api(
    sensor_data: SensorData = Body(...),
    risk_score: float = Body(..., embed=True)
):
    """API-prefixed version of error code determine endpoint"""
    return determine_error_code_endpoint(sensor_data, risk_score)

@app.post("/api/complete-analysis")
def complete_analysis_api(sensor_data: SensorData):
    """API-prefixed version of complete analysis endpoint"""
    return complete_analysis(sensor_data)

if __name__ == "__main__":
    # Use PORT environment variable if available (for Railway/Render/etc), otherwise default to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
