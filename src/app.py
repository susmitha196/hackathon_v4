"""
Streamlit UI for Factory Copilot Dashboard
Main interface for monitoring machine health and downtime risk
Generates live IoT 4.0 sensor data in real-time
"""
import streamlit as st
import pandas as pd
import requests
import plotly.graph_objs as go
from datetime import datetime, timedelta
import time
import os
import sys
import json
import numpy as np
from dotenv import load_dotenv

# Add current directory to Python path to ensure imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from ml_model import DowntimePredictor
from ai_explainer import AIExplainer
from gemini_analyzer import GeminiAnalyzer
from automation import AutomationTrigger
from error_codes import determine_error_code, ErrorCodes

# Load environment variables
load_dotenv()

# Page config
st.set_page_config(
    page_title="Factory Copilot",
    page_icon="🏭",
    layout="wide"
)

# Initialize session state for live data
if 'sensor_history' not in st.session_state:
    st.session_state.sensor_history = []
if 'data_start_time' not in st.session_state:
    st.session_state.data_start_time = datetime.now()
if 'failure_mode_active' not in st.session_state:
    st.session_state.failure_mode_active = False
if 'failure_progress' not in st.session_state:
    st.session_state.failure_progress = 0.0
if 'data_source_mode' not in st.session_state:
    st.session_state.data_source_mode = 'live'  # 'live' or 'json'
if 'json_data_loaded' not in st.session_state:
    st.session_state.json_data_loaded = None

class LiveSensorGenerator:
    """
    Generate live IoT 4.0 sensor data based on real industrial machine databases
    References: ISO 10816 (vibration), ISO 7919 (rotating machinery), 
    Industrial IoT sensor databases (CNC, pumps, compressors)
    """
    def __init__(self):
        # Realistic industrial machine baseline values (based on CNC/manufacturing equipment)
        # Temperature: Normal operating range 20-80°C (ISO standards)
        self.base_temp = 65.0  # Typical CNC spindle temperature
        
        # Vibration: ISO 10816 Class A (excellent) < 2.8 mm/s, Class B (good) 2.8-4.5 mm/s
        self.base_vibration = 2.3  # mm/s RMS (Class A - excellent condition)
        
        # Cycle time: Typical manufacturing cycle 30-60 seconds
        self.base_cycle_time = 42.5  # seconds (optimized production)
        
        # Error count: Normal < 1 error/hour, warning 1-5/hour
        self.base_error = 0.3  # errors per reading (very low)
        
        # Pressure: Hydraulic systems typically 100-150 bar (1000-1500 PSI)
        self.base_pressure = 105.0  # bar (typical hydraulic pressure)
        
        # Humidity: Manufacturing environments 40-60% RH
        self.base_humidity = 48.0  # % RH (controlled environment)
        
        # Power: Industrial machines 5-50 kW typical, using 15 kW example
        self.base_power = 15250.0  # Watts (15.25 kW - realistic industrial motor)
        
        # Production rate: OEE (Overall Equipment Effectiveness) 85-95% excellent
        self.base_production = 94.5  # % (high efficiency operation)
    
    def generate_normal_reading(self, history_length=0):
        """
        Generate normal operation sensor reading with smooth gradual patterns
        Creates rise-and-fall patterns like turbine/industrial equipment cycles
        """
        # Create smooth cyclical pattern based on history (simulates operational cycles)
        cycle_position = (history_length % 100) / 100.0  # 0 to 1 cycle
        
        # Smooth sine wave pattern for gradual rise and fall (like turbine startup/shutdown)
        smooth_factor = np.sin(cycle_position * np.pi * 2)  # -1 to 1
        
        # Base values with smooth variations (no sharp spikes)
        return {
            'timestamp': datetime.now(),
            # Temperature: Smooth gradual rise and fall pattern
            'temperature': max(60.0, min(72.0, 
                self.base_temp + smooth_factor * 4 + np.random.normal(0, 0.8))),
            
            # Vibration: Smooth pattern with minimal noise
            'vibration': max(1.8, min(2.8, 
                self.base_vibration + smooth_factor * 0.3 + np.random.normal(0, 0.15))),
            
            # Cycle time: Smooth operational cycle
            'cycle_time': max(40.0, min(45.0, 
                self.base_cycle_time + smooth_factor * 1.5 + np.random.normal(0, 0.5))),
            
            # Error count: Very low, smooth (no spikes)
            'error_count': max(0, int(np.random.poisson(0.1))),
            
            # Pressure: Smooth hydraulic cycle
            'pressure': max(103.0, min(107.0, 
                self.base_pressure + smooth_factor * 1.5 + np.random.normal(0, 0.5))),
            
            # Humidity: Stable with minimal variation
            'humidity': max(45.0, min(51.0, 
                self.base_humidity + np.random.normal(0, 1.0))),
            
            # Power consumption: Smooth load variations
            'power_consumption': max(15100.0, min(15400.0, 
                self.base_power + smooth_factor * 100 + np.random.normal(0, 30))),
            
            # Production rate: Smooth efficiency curve
            'production_rate': max(93.0, min(96.0, 
                self.base_production + smooth_factor * 1.0 + np.random.normal(0, 0.3)))
        }
    
    def generate_failure_reading(self, progress, history_length=0):
        """
        Generate failure scenario with smooth gradual rise pattern (like turbine startup)
        Progress: 0.0 (normal) to 1.0 (critical failure)
        Creates smooth curves similar to turbine/industrial equipment patterns
        """
        # Smooth failure progression (no sudden spikes)
        # Use smooth curve: progress^2 for gradual acceleration
        smooth_progress = progress ** 1.2  # Smooth acceleration curve
        
        # Add cyclical pattern for smooth variations
        cycle_position = (history_length % 80) / 80.0
        cycle_factor = np.sin(cycle_position * np.pi * 2) * 0.3  # Smooth oscillation
        
        return {
            'timestamp': datetime.now(),
            # Temperature: Smooth gradual rise (like turbine heating up)
            'temperature': max(65.0, min(110.0, 
                self.base_temp + (smooth_progress * 40) + cycle_factor * 2 + np.random.normal(0, 1.5))),
            
            # Vibration: Smooth exponential rise (gradual bearing wear)
            'vibration': max(2.3, min(14.0, 
                self.base_vibration * (1 + smooth_progress * 4.5) + cycle_factor * 0.5 + np.random.normal(0, 0.5))),
            
            # Cycle time: Smooth gradual increase
            'cycle_time': max(42.5, min(75.0, 
                self.base_cycle_time + (smooth_progress * 28) + cycle_factor * 1.5 + np.random.normal(0, 1.0))),
            
            # Error count: Smooth gradual increase (no sudden spikes)
            'error_count': max(0, int(self.base_error + (smooth_progress * 18) + np.random.poisson(0.5))),
            
            # Pressure: Smooth gradual rise
            'pressure': max(105.0, min(130.0, 
                self.base_pressure + (smooth_progress * 22) + cycle_factor * 1.5 + np.random.normal(0, 1.2))),
            
            # Humidity: Smooth gradual decrease
            'humidity': max(42.0, min(50.0, 
                self.base_humidity - (smooth_progress * 3.5) + np.random.normal(0, 0.8))),
            
            # Power consumption: Smooth gradual increase
            'power_consumption': max(15250.0, min(18500.0, 
                self.base_power * (1 + smooth_progress * 0.20) + cycle_factor * 80 + np.random.normal(0, 60))),
            
            # Production rate: Smooth gradual decline
            'production_rate': max(60.0, min(95.0, 
                self.base_production - (smooth_progress * 32) + cycle_factor * 1.5 + np.random.normal(0, 1.5)))
        }

# Initialize components
live_generator = LiveSensorGenerator()

# Initialize ML predictor
@st.cache_resource
def init_predictor():
    predictor = DowntimePredictor()
    predictor.train()
    return predictor

predictor = init_predictor()

# Initialize AI components
ai_explainer = AIExplainer()
gemini_analyzer = GeminiAnalyzer()
automation = AutomationTrigger()

# Load sensor data from JSON file (for JSON mode)
@st.cache_data
def load_json_sensor_data():
    """Load IoT 4.0 sensor data from JSON file"""
    try:
        # Try multiple paths to find the JSON file
        # Get project root (parent of src directory)
        project_root = os.path.dirname(current_dir)
        json_paths = [
            os.path.join(project_root, 'data', 'sample_sensor_data.json'),  # From project root
            os.path.join(current_dir, '..', 'data', 'sample_sensor_data.json'),  # Relative from src
            'data/sample_sensor_data.json',  # Relative from project root (when running from root)
            'sample_sensor_data.json',  # Fallback for old location
        ]
        
        json_path = None
        for path in json_paths:
            abs_path = os.path.abspath(path)
            if os.path.exists(abs_path):
                json_path = abs_path
                break
        
        if not json_path:
            raise FileNotFoundError("sample_sensor_data.json not found in any expected location")
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        df = pd.DataFrame(data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        # Sort by timestamp to ensure proper order
        df = df.sort_values('timestamp').reset_index(drop=True)
        return df
    except FileNotFoundError:
        st.error("❌ sample_sensor_data.json not found in data/ folder!")
        st.info("💡 Make sure sample_sensor_data.json exists in the data/ directory")
        return pd.DataFrame()
    except Exception as e:
        st.error(f"❌ Error loading JSON: {str(e)}")
        return pd.DataFrame()

# API endpoint - can be overridden by environment variable for cloud deployment
API_URL = os.getenv("API_URL", "http://localhost:8000")

# Title
st.title("🏭 Factory Copilot Dashboard")
st.markdown("**Real-time Machine Health Monitoring & Downtime Prediction**")

# Sidebar controls
st.sidebar.header("⚙️ Controls")

# Data source selection
st.sidebar.subheader("📊 Data Source")
data_source = st.sidebar.radio(
    "Select data source:",
    ["Live Data Generation", "JSON File"],
    index=0 if st.session_state.data_source_mode == 'live' else 1,
    help="Live Data: Generates real-time sensor data\nJSON File: Loads data from sample_sensor_data.json"
)

# Update mode when changed
if data_source == "Live Data Generation":
    st.session_state.data_source_mode = 'live'
else:
    st.session_state.data_source_mode = 'json'
    # Clear live history when switching to JSON mode
    if len(st.session_state.sensor_history) > 0:
        st.session_state.sensor_history = []

st.sidebar.markdown("---")

USE_DUMMY_MODE = st.sidebar.checkbox("Use Local Predictions (No API Required)", value=True)
show_failure = st.sidebar.checkbox("Simulate Failure Scenario", value=False)
auto_refresh = st.sidebar.checkbox("Auto Refresh (Live Data)", value=st.session_state.data_source_mode == 'live')
refresh_interval = st.sidebar.slider("Refresh Interval (seconds)", 0.5, 5.0, 1.0, 0.5)
refresh_button = st.sidebar.button("🔄 Refresh Now")

# Data loading based on selected source
if st.session_state.data_source_mode == 'json':
    # Load data from JSON file
    json_df = load_json_sensor_data()
    
    if len(json_df) == 0:
        st.error("No JSON data available. Please ensure sample_sensor_data.json exists.")
        st.stop()
    
    # Show failure scenario (last readings) or normal (first readings)
    if show_failure:
        # Show failure scenarios (last portion of data)
        current_row = json_df.iloc[-1]
        # Show last 50 readings (failure scenarios)
        trend_df = json_df.tail(50).copy()
        scenario_name = "Failure Scenarios"
    else:
        # Show normal operation (first portion of data)
        current_row = json_df.iloc[0]
        # Show first 41 readings (original normal + gradual failure)
        trend_df = json_df.head(41).copy()
        scenario_name = "Normal Operation"
    
    # Disable auto-refresh for JSON mode
    if auto_refresh:
        st.sidebar.info("ℹ️ Auto-refresh disabled in JSON file mode")
        auto_refresh = False

else:
    # Live data generation mode
    # Update failure mode state
    if show_failure != st.session_state.failure_mode_active:
        st.session_state.failure_mode_active = show_failure
        if not show_failure:
            st.session_state.failure_progress = 0.0

    # Generate new live sensor reading with smooth patterns
    history_len = len(st.session_state.sensor_history)

    if show_failure:
        # Increment failure progress gradually (resets when unchecked)
        st.session_state.failure_progress = min(1.0, st.session_state.failure_progress + 0.012)
        new_reading = live_generator.generate_failure_reading(st.session_state.failure_progress, history_len)
        scenario_name = f"Failure Scenario ({int(st.session_state.failure_progress * 100)}% progress)"
    else:
        # Normal operation with smooth cycles
        new_reading = live_generator.generate_normal_reading(history_len)
        st.session_state.failure_progress = 0.0
        scenario_name = "Normal Operation"

    # Add to history (keep last 50 readings for live chart)
    st.session_state.sensor_history.append(new_reading)
    if len(st.session_state.sensor_history) > 50:
        st.session_state.sensor_history.pop(0)

    # Convert history to DataFrame
    if len(st.session_state.sensor_history) > 0:
        trend_df = pd.DataFrame(st.session_state.sensor_history)
        current_row = trend_df.iloc[-1]
    else:
        # Fallback if no history
        current_row = new_reading
        trend_df = pd.DataFrame([new_reading])

# Get current sensor reading for ML prediction
current_sensor = {
    'temperature': float(current_row['temperature']),
    'vibration': float(current_row['vibration']),
    'cycle_time': float(current_row['cycle_time']),
    'error_count': float(current_row['error_count'])
}

# Handle manual refresh
if refresh_button:
    st.rerun()

# Main columns
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("📊 Current Sensor Readings")
    
    # Sensor metrics
    metric_col1, metric_col2, metric_col3, metric_col4 = st.columns(4)
    
    with metric_col1:
        temp_color = "🔴" if current_sensor['temperature'] > 85 else "🟢"
        st.metric(
            label=f"{temp_color} Temperature",
            value=f"{current_sensor['temperature']:.1f}°C",
            delta=f"{current_sensor['temperature'] - 75:.1f}°C" if current_sensor['temperature'] > 75 else None
        )
    
    with metric_col2:
        vib_color = "🔴" if current_sensor['vibration'] > 5 else "🟢"
        st.metric(
            label=f"{vib_color} Vibration",
            value=f"{current_sensor['vibration']:.2f} mm/s",
            delta=f"{current_sensor['vibration'] - 2.5:.2f} mm/s" if current_sensor['vibration'] > 2.5 else None
        )
    
    with metric_col3:
        cycle_color = "🔴" if current_sensor['cycle_time'] > 50 else "🟢"
        st.metric(
            label=f"{cycle_color} Cycle Time",
            value=f"{current_sensor['cycle_time']:.1f}s",
            delta=f"{current_sensor['cycle_time'] - 45:.1f}s" if current_sensor['cycle_time'] > 45 else None
        )
    
    with metric_col4:
        error_color = "🔴" if current_sensor['error_count'] > 3 else "🟢"
        st.metric(
            label=f"{error_color} Error Count",
            value=f"{current_sensor['error_count']:.0f}",
            delta=f"{current_sensor['error_count']:.0f}" if current_sensor['error_count'] > 0 else None
        )
    
    # Sensor trend chart
    st.subheader("📈 IoT 4.0 Sensor Trends")
    
    # Ensure trend_df has data and is properly formatted
    if len(trend_df) > 0:
        # Make sure timestamp is datetime
        if not pd.api.types.is_datetime64_any_dtype(trend_df['timestamp']):
            trend_df['timestamp'] = pd.to_datetime(trend_df['timestamp'])
        
        fig = go.Figure()
        
        # Add temperature trace - smooth spline curve (like turbine graph)
        fig.add_trace(go.Scatter(
            x=trend_df['timestamp'],
            y=trend_df['temperature'],
            name='Temperature (°C)',
            line=dict(color='#FF6B6B', width=2.5, shape='spline', smoothing=1.3),
            yaxis='y',
            mode='lines'
        ))
        
        # Add vibration trace - smooth curve
        fig.add_trace(go.Scatter(
            x=trend_df['timestamp'],
            y=trend_df['vibration'] * 10,  # Scale for visibility
            name='Vibration (mm/s × 10)',
            line=dict(color='#4ECDC4', width=2.5, shape='spline', smoothing=1.3),
            yaxis='y2',
            mode='lines'
        ))
        
        # Add cycle time trace - smooth curve
        fig.add_trace(go.Scatter(
            x=trend_df['timestamp'],
            y=trend_df['cycle_time'],
            name='Cycle Time (s)',
            line=dict(color='#95E1D3', width=2.5, shape='spline', smoothing=1.3),
            yaxis='y3',
            mode='lines'
        ))
        
        # Add error count trace - smooth curve
        fig.add_trace(go.Scatter(
            x=trend_df['timestamp'],
            y=trend_df['error_count'] * 5,  # Scale for visibility
            name='Error Count (× 5)',
            line=dict(color='#F38181', width=2.5, shape='spline', smoothing=1.3),
            yaxis='y4',
            mode='lines'
        ))
        
        fig.update_layout(
            title=dict(
                text=f"Multi-Sensor Timeline - IoT 4.0 Data ({len(trend_df)} readings)",
                font=dict(size=18, color='#2C3E50')
            ),
            xaxis=dict(
                title="Time",
                showgrid=True,
                gridwidth=1,
                gridcolor='rgba(128, 128, 128, 0.2)',
                showline=True,
                linewidth=1,
                linecolor='rgba(128, 128, 128, 0.5)'
            ),
            yaxis=dict(
                title="Temperature (°C)",
                side="left",
                showgrid=True,
                gridwidth=1,
                gridcolor='rgba(128, 128, 128, 0.15)',
                showline=True
            ),
            yaxis2=dict(
                title="Vibration (mm/s)",
                overlaying="y",
                side="right",
                showgrid=False,
                showline=True
            ),
            yaxis3=dict(
                title="Cycle Time (s)",
                overlaying="y",
                side="right",
                position=0.85,
                showgrid=False,
                showline=True
            ),
            yaxis4=dict(
                title="Error Count",
                overlaying="y",
                side="right",
                position=0.95,
                showgrid=False,
                showline=True
            ),
            height=500,
            hovermode='x unified',
            legend=dict(
                yanchor="top",
                y=0.99,
                xanchor="left",
                x=0.01,
                bgcolor='rgba(255, 255, 255, 0.8)',
                bordercolor='rgba(0, 0, 0, 0.2)',
                borderwidth=1
            ),
            plot_bgcolor='white',
            paper_bgcolor='white',
            font=dict(family="Arial, sans-serif", size=12, color='#2C3E50')
        )
        
        st.plotly_chart(fig, use_container_width=True, key=f"chart_{show_failure}_{len(trend_df)}")  # Key forces update
        
        # Show data info
        time_range = f"{trend_df['timestamp'].min().strftime('%H:%M')} - {trend_df['timestamp'].max().strftime('%H:%M')}"
        st.caption(f"📊 Showing {len(trend_df)} data points | Scenario: {scenario_name} | Time Range: {time_range}")
    else:
        st.warning("⚠️ No data available for chart")
    
    # Additional IoT 4.0 sensors
    st.subheader("📊 Additional IoT 4.0 Metrics")
    metric_col5, metric_col6, metric_col7, metric_col8 = st.columns(4)
    
    with metric_col5:
        st.metric("Pressure", f"{current_row['pressure']:.1f} kPa")
    with metric_col6:
        st.metric("Humidity", f"{current_row['humidity']:.1f}%")
    with metric_col7:
        st.metric("Power Consumption", f"{current_row['power_consumption']:.1f} W")
    with metric_col8:
        st.metric("Production Rate", f"{current_row['production_rate']:.1f}%")

with col2:
    st.subheader("⚠️ Downtime Risk")
    
    # Get prediction (from API or local dummy)
    prediction = None
    use_local = USE_DUMMY_MODE
    
    if not use_local:
        # Try API first
        try:
            response = requests.post(
                f"{API_URL}/predict",
                json=current_sensor,
                timeout=2
            )
            
            if response.status_code == 200:
                prediction = response.json()
            else:
                use_local = True  # Fallback to local
        except:
            use_local = True  # Fallback to local if API unavailable
    
    # Use local prediction if API failed or dummy mode enabled
    if use_local:
        prediction = predictor.predict_risk(current_sensor)
        if not USE_DUMMY_MODE:
            st.info("ℹ️ Using local predictions (API unavailable)")
    
    if prediction:
        risk = prediction['risk']
        
        # Risk gauge
        risk_color = "🔴" if risk > 75 else "🟡" if risk > 50 else "🟢"
        st.markdown(f"### {risk_color} Risk Score: **{risk}%**")
        
        # Risk bar
        st.progress(risk / 100)
        
        # Feature importance
        st.markdown("**Key Factors:**")
        importance = prediction['feature_importance']
        sorted_features = sorted(importance.items(), key=lambda x: x[1], reverse=True)
        
        for feature, imp in sorted_features:
            st.markdown(f"- {feature.title()}: {imp:.1%}")
        
        # AI Explanation (OpenAI)
        st.subheader("🤖 AI Analysis")
        explanation_dict = ai_explainer.explain(prediction, current_sensor)
        st.markdown("**Root Cause:**")
        st.info(explanation_dict['root_cause'])
        st.markdown("**Recommended Action:**")
        st.success(explanation_dict['recommended_action'])
        
        # Trigger automation if risk is high
        if risk >= 75:
            # Determine error code using centralized error code definitions
            error_code = determine_error_code(current_sensor, risk)
            error_description = ErrorCodes.DESCRIPTIONS.get(error_code, 'Unknown error')
            
            auto_result = automation.trigger_maintenance_alert(risk, current_sensor, explanation_dict, error_code)
            if auto_result['triggered']:
                # Store alarm trigger time in session state
                st.session_state.last_alarm_time = datetime.now().isoformat()
                st.session_state.last_alarm_code = error_code
                st.session_state.last_alarm_risk = risk
                
                # Display prominent alarm message banner
                st.markdown("---")
                alarm_html = f"""
                <div style='background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%); 
                            padding: 25px; 
                            border-radius: 10px; 
                            border: 4px solid #ff0000; 
                            margin: 20px 0;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                            animation: pulse 2s infinite;'>
                    <h2 style='color: white; 
                               text-align: center; 
                               margin: 0 0 15px 0; 
                               font-size: 28px;
                               text-shadow: 2px 2px 4px rgba(0,0,0,0.5);'>
                        🚨 ALARM MESSAGE SENT 🚨
                    </h2>
                    <p style='color: white; 
                               text-align: center; 
                               margin: 10px 0; 
                               font-size: 18px;
                               font-weight: bold;'>
                        Maintenance alert has been successfully sent to n8n workflow
                    </p>
                    <div style='background-color: rgba(255,255,255,0.2); 
                                padding: 15px; 
                                border-radius: 5px; 
                                margin-top: 15px;'>
                        <p style='color: white; 
                                   text-align: center; 
                                   margin: 5px 0; 
                                   font-size: 16px;'>
                            <strong>Error Code:</strong> {error_code} - {error_description}
                        </p>
                        <p style='color: white; 
                                   text-align: center; 
                                   margin: 5px 0; 
                                   font-size: 16px;'>
                            <strong>Risk Score:</strong> {risk}% | <strong>Time:</strong> {datetime.now().strftime('%H:%M:%S')}
                        </p>
                    </div>
                </div>
                <style>
                    @keyframes pulse {{
                        0% {{ opacity: 1; }}
                        50% {{ opacity: 0.9; }}
                        100% {{ opacity: 1; }}
                    }}
                </style>
                """
                st.markdown(alarm_html, unsafe_allow_html=True)
                st.success(f"✅ **Automation Triggered:** {auto_result['message']}")
                st.info(f"📋 **Error Code:** {error_code} - {error_description}")
                
                # Display webhook response data
                st.markdown("---")
                st.subheader("📥 Webhook Response from n8n")
                
                # Show webhook URL used
                webhook_url = auto_result.get('url', 'N/A')
                st.markdown(f"**🌐 Webhook URL:** `{webhook_url}`")
                
                # Show response status
                response_status = auto_result.get('status_code', 'Unknown')
                if response_status in [200, 201, 202]:
                    st.success(f"✅ **Status Code:** {response_status} - Success")
                else:
                    st.error(f"❌ **Status Code:** {response_status} - Error")
                
                # Display response headers if available
                response_headers = auto_result.get('response_headers', {})
                if response_headers:
                    with st.expander("📋 View Response Headers"):
                        st.json(response_headers)
                
                # Display response data
                response_data = auto_result.get('response_data', {})
                full_response = auto_result.get('response', '')
                
                # Extract Gemini response from n8n workflow output
                gemini_response = None
                if response_data and isinstance(response_data, dict):
                    # Try different n8n response structures
                    # Structure 1: {"output": [{"json": {"output": "text"}}]}
                    if 'output' in response_data:
                        output = response_data['output']
                        if isinstance(output, list) and len(output) > 0:
                            if isinstance(output[0], list) and len(output[0]) > 0:
                                first_item = output[0][0]
                                if isinstance(first_item, dict) and 'json' in first_item:
                                    json_data = first_item['json']
                                    if isinstance(json_data, dict):
                                        # Look for common output fields
                                        gemini_response = json_data.get('output') or json_data.get('text') or json_data.get('response') or json_data.get('message')
                        elif isinstance(output, str):
                            gemini_response = output
                    # Structure 2: Direct text response
                    elif 'text' in response_data:
                        gemini_response = response_data['text']
                    elif 'response' in response_data:
                        gemini_response = response_data['response']
                    elif 'message' in response_data:
                        gemini_response = response_data['message']
                    # Structure 3: Check if entire response is a string (raw text)
                    elif len(response_data) == 1 and 'raw_response' in response_data:
                        raw = response_data['raw_response']
                        if isinstance(raw, str) and not raw.startswith('{'):
                            gemini_response = raw
                
                # Display Gemini response prominently if found
                if gemini_response:
                    st.markdown("---")
                    st.subheader("🤖 Gemini AI Response from n8n Workflow")
                    st.markdown(f"""
                    <div style='
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                        border-radius: 10px;
                        border: 2px solid #667eea;
                        margin: 15px 0;
                        color: white;
                    '>
                        <h3 style='color: white; margin: 0 0 10px 0;'>💡 AI-Generated Error Description</h3>
                        <p style='color: white; font-size: 16px; line-height: 1.6; margin: 0;'>{gemini_response}</p>
                    </div>
                    """, unsafe_allow_html=True)
                    st.markdown("---")
                
                if response_data and isinstance(response_data, dict) and len(response_data) > 0:
                    st.markdown("**📦 Full Parsed JSON Response:**")
                    st.json(response_data)
                    
                    # Display key fields prominently if available
                    st.markdown("**🔑 Key Information:**")
                    key_found = False
                    if 'message' in response_data and not gemini_response:
                        st.info(f"💬 **Message:** {response_data['message']}")
                        key_found = True
                    if 'executionId' in response_data:
                        st.info(f"🆔 **Execution ID:** {response_data['executionId']}")
                        key_found = True
                    if 'workflowId' in response_data:
                        st.info(f"📋 **Workflow ID:** {response_data['workflowId']}")
                        key_found = True
                    if 'data' in response_data:
                        st.info(f"📊 **Data:** {response_data['data']}")
                        key_found = True
                    if not key_found and not gemini_response:
                        # Show all keys if no standard keys found
                        for key, value in response_data.items():
                            if key != 'raw_response':
                                st.info(f"**{key}:** {value}")
                
                # Always show full raw response
                if full_response:
                    st.markdown("**📄 Full Raw Response Text:**")
                    st.code(full_response, language='json' if response_data else 'text')
                
                # Show what was sent
                with st.expander("📤 View Data Sent to n8n"):
                    sent_data = {
                        'error_code': error_code,
                        'error_description': error_description,
                        'error_severity': ErrorCodes.SEVERITY.get(error_code, 'UNKNOWN'),
                        'risk_score': risk,
                        'alert_type': 'high_downtime_risk',
                        'timestamp': datetime.now().isoformat(),
                        'sensor_data': current_sensor,
                        'explanation': explanation_dict
                    }
                    st.json(sent_data)
            elif auto_result.get('success') == False and automation.is_configured():
                error_message = auto_result.get('message', 'Unknown error')
                st.warning(f"⚠️ Automation failed: {error_message}")
                
                # Special handling for timeout errors
                if auto_result.get('timeout'):
                    st.info("💡 **Tip:** Gemini API calls in n8n can take 10-20 seconds. Consider:")
                    st.markdown("""
                    - Check if your n8n workflow is active
                    - Verify Gemini API credentials in n8n
                    - Check n8n execution logs for errors
                    - Consider optimizing your workflow for faster execution
                    """)
                
                # Still show response data even if it failed
                if auto_result.get('status_code'):
                    st.markdown("---")
                    st.subheader("📥 Webhook Response from n8n (Error)")
                    
                    webhook_url = auto_result.get('url', 'N/A')
                    st.markdown(f"**🌐 Webhook URL:** `{webhook_url}`")
                    
                    response_status = auto_result.get('status_code')
                    st.error(f"❌ **Status Code:** {response_status}")
                    
                    response_data = auto_result.get('response_data', {})
                    full_response = auto_result.get('response', '')
                    
                    if response_data:
                        st.markdown("**📦 Response Data:**")
                        st.json(response_data)
                    
                    if full_response:
                        st.markdown("**📄 Full Response Text:**")
                        st.code(full_response, language='text')
        
        # Gemini Trend Analysis
        data_length = len(trend_df) if st.session_state.data_source_mode == 'json' else len(st.session_state.sensor_history)
        if data_length >= 10:
            st.subheader("📊 Trend Analysis (Gemini)")
            trend_analysis = gemini_analyzer.analyze_trends(trend_df)
            st.markdown("**Summary:**")
            st.info(trend_analysis['summary'])
            if trend_analysis.get('anomalies'):
                st.markdown("**Anomalies Detected:**")
                for anomaly in trend_analysis['anomalies']:
                    st.warning(f"⚠️ {anomaly}")
            if trend_analysis.get('status') == 'dummy':
                st.caption("💡 Configure GEMINI_API_KEY in .env for AI-powered trend analysis")
    else:
        st.error("❌ Failed to get prediction")

# Footer
st.markdown("---")
st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
st.caption("Factory Copilot v1.0 | IoT 4.0 Data | Hackathon MVP")

# Handle auto-refresh at the end (after UI is rendered)
if auto_refresh:
    # Show refresh status in sidebar
    with st.sidebar:
        refresh_status = st.empty()
        refresh_status.info(f"🔄 Auto-refreshing in {refresh_interval}s...")
    
    # Wait for the interval, then rerun
    time.sleep(refresh_interval)
    st.rerun()
