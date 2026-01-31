"""
Gemini Trend Analyzer
Uses Google Gemini to analyze sensor trends and detect anomalies
"""
import os
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

class GeminiAnalyzer:
    """Analyze sensor trends using Google Gemini"""
    
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.model = None
        
        if GEMINI_AVAILABLE and self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.model = genai.GenerativeModel('gemini-pro')
            except Exception as e:
                print(f"Warning: Could not initialize Gemini: {e}")
                self.model = None
    
    def analyze_trends(self, sensor_history):
        """
        Analyze sensor trends and detect anomalies
        
        Args:
            sensor_history: List of sensor readings (dicts) or DataFrame
            
        Returns:
            Dict with 'summary' and 'anomalies'
        """
        if not self.model:
            return self._dummy_analysis(sensor_history)
        
        try:
            import pandas as pd
            
            # Convert to DataFrame if needed
            if isinstance(sensor_history, list):
                df = pd.DataFrame(sensor_history)
            else:
                df = sensor_history
            
            if len(df) < 5:
                return self._dummy_analysis(sensor_history)
            
            # Prepare summary data
            summary_data = {
                'temperature': {
                    'current': df['temperature'].iloc[-1],
                    'avg': df['temperature'].mean(),
                    'trend': 'increasing' if df['temperature'].iloc[-1] > df['temperature'].iloc[0] else 'decreasing'
                },
                'vibration': {
                    'current': df['vibration'].iloc[-1],
                    'avg': df['vibration'].mean(),
                    'trend': 'increasing' if df['vibration'].iloc[-1] > df['vibration'].iloc[0] else 'decreasing'
                },
                'error_count': {
                    'current': df['error_count'].iloc[-1],
                    'avg': df['error_count'].mean(),
                    'trend': 'increasing' if df['error_count'].iloc[-1] > df['error_count'].iloc[0] else 'stable'
                }
            }
            
            # Build prompt
            prompt = f"""Analyze this industrial machine sensor data trend:

Recent Sensor Readings (last {len(df)} readings):
- Temperature: Current {summary_data['temperature']['current']:.1f}°C, Average {summary_data['temperature']['avg']:.1f}°C, Trend: {summary_data['temperature']['trend']}
- Vibration: Current {summary_data['vibration']['current']:.2f} mm/s, Average {summary_data['vibration']['avg']:.2f} mm/s, Trend: {summary_data['vibration']['trend']}
- Error Count: Current {summary_data['error_count']['current']:.0f}, Average {summary_data['error_count']['avg']:.1f}, Trend: {summary_data['error_count']['trend']}

Provide:
1. Brief trend summary (1-2 sentences)
2. Any anomalies detected (if any)
3. Key observations

Keep it concise and actionable."""
            
            # Generate response
            response = self.model.generate_content(prompt)
            
            content = response.text if hasattr(response, 'text') else str(response)
            
            return {
                'summary': content,
                'anomalies': self._extract_anomalies(content),
                'status': 'analyzed'
            }
            
        except Exception as e:
            print(f"Error analyzing trends with Gemini: {e}")
            return self._dummy_analysis(sensor_history)
    
    def _extract_anomalies(self, text):
        """Extract anomaly mentions from text"""
        anomalies = []
        text_lower = text.lower()
        
        if 'anomaly' in text_lower or 'unusual' in text_lower or 'abnormal' in text_lower:
            anomalies.append("Unusual patterns detected in sensor readings")
        if 'increasing' in text_lower and ('temperature' in text_lower or 'vibration' in text_lower):
            anomalies.append("Rising temperature or vibration detected")
        if 'error' in text_lower and ('high' in text_lower or 'increasing' in text_lower):
            anomalies.append("Elevated error count observed")
        
        return anomalies if anomalies else ["No significant anomalies detected"]
    
    def _dummy_analysis(self, sensor_history):
        """Fallback dummy analysis"""
        import pandas as pd
        
        if isinstance(sensor_history, list):
            df = pd.DataFrame(sensor_history)
        else:
            df = sensor_history
        
        if len(df) == 0:
            return {
                'summary': "No sensor data available for analysis.",
                'anomalies': [],
                'status': 'no_data'
            }
        
        temp_trend = "increasing" if df['temperature'].iloc[-1] > df['temperature'].iloc[0] else "stable"
        vib_trend = "increasing" if df['vibration'].iloc[-1] > df['vibration'].iloc[0] else "stable"
        
        summary = f"Sensor trends show temperature {temp_trend} and vibration {vib_trend}. "
        summary += f"Current readings: Temp {df['temperature'].iloc[-1]:.1f}°C, Vibration {df['vibration'].iloc[-1]:.2f} mm/s."
        
        anomalies = []
        if df['temperature'].iloc[-1] > 85:
            anomalies.append("High temperature detected (>85°C)")
        if df['vibration'].iloc[-1] > 5:
            anomalies.append("Elevated vibration detected (>5 mm/s)")
        
        return {
            'summary': summary,
            'anomalies': anomalies if anomalies else ["No significant anomalies"],
            'status': 'dummy'
        }
