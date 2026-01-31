"""
Automation Module for n8n Webhook Integration
Triggers automated workflows when downtime risk exceeds thresholds
"""
import os
import requests
from datetime import datetime
from dotenv import load_dotenv
from error_codes import determine_error_code, ErrorCodes

load_dotenv()

class AutomationTrigger:
    """Trigger automated workflows via n8n webhooks"""
    
    def __init__(self):
        self.webhook_url = os.getenv("N8N_WEBHOOK_URL")
        self.enabled = bool(self.webhook_url)
    
    def trigger_maintenance_alert(self, risk_score, sensor_data, explanation=None, error_code=None):
        """
        Trigger maintenance alert via n8n webhook
        
        Args:
            risk_score: Downtime risk percentage (0-100)
            sensor_data: Current sensor readings
            explanation: Optional AI explanation
            error_code: Optional error code (e.g., 'E001', 'BEARING_FAILURE', etc.)
            
        Returns:
            Dict with 'success' and 'message'
        """
        if not self.enabled:
            return {
                'success': False,
                'message': 'n8n webhook not configured',
                'triggered': False
            }
        
        # Only trigger if risk is high
        if risk_score < 75:
            return {
                'success': True,
                'message': f'Risk ({risk_score}%) below threshold (75%)',
                'triggered': False
            }
        
        try:
            # Determine error code if not provided
            if error_code is None:
                # Auto-generate error code based on sensor readings
                error_code = determine_error_code(sensor_data, risk_score)
            
            # Ensure error_code is a valid string
            if not error_code or error_code is None:
                error_code = ErrorCodes.UNKNOWN
            error_code = str(error_code).strip()
            
            # Prepare payload - error_code is included at top level
            payload = {
                'error_code': error_code,  # Error code at top level
                'error_description': ErrorCodes.DESCRIPTIONS.get(error_code, 'Unknown error'),
                'error_severity': ErrorCodes.SEVERITY.get(error_code, 'UNKNOWN'),
                'risk_score': risk_score,
                'alert_type': 'high_downtime_risk',
                'timestamp': sensor_data.get('timestamp', datetime.now().isoformat()) if isinstance(sensor_data.get('timestamp'), (str, type(None))) else datetime.now().isoformat(),
                'sensor_data': sensor_data,
                'explanation': explanation or 'High downtime risk detected'
            }
            
            # Send webhook request
            # Increased timeout to 30 seconds to accommodate Gemini API calls in n8n workflow
            response = requests.post(
                self.webhook_url,
                json=payload,
                timeout=30,  # Increased from 5 to 30 seconds for Gemini processing
                headers={'Content-Type': 'application/json'}
            )
            
            # Capture full response information
            full_response_text = response.text
            response_headers = dict(response.headers)
            
            # Try to parse JSON response
            try:
                response_data = response.json()
            except:
                response_data = {'raw_response': full_response_text}
            
            if response.status_code in [200, 201, 202]:
                return {
                    'success': True,
                    'message': 'Maintenance alert triggered successfully',
                    'triggered': True,
                    'response': full_response_text,  # Full response text
                    'response_data': response_data,  # Parsed JSON response
                    'status_code': response.status_code,
                    'response_headers': response_headers,  # Response headers
                    'url': self.webhook_url  # Webhook URL used
                }
            else:
                return {
                    'success': False,
                    'message': f'Webhook returned status {response.status_code}',
                    'triggered': False,
                    'response': full_response_text,
                    'response_data': response_data,
                    'status_code': response.status_code,
                    'response_headers': response_headers,
                    'url': self.webhook_url
                }
                
        except requests.exceptions.Timeout:
            return {
                'success': False,
                'message': 'Webhook request timed out after 30 seconds. The n8n workflow may be taking longer than expected (possibly due to Gemini API processing). Try checking your workflow execution time in n8n.',
                'triggered': False,
                'timeout': True
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'message': f'Webhook request failed: {str(e)}',
                'triggered': False
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Unexpected error: {str(e)}',
                'triggered': False
            }
    
    
    def is_configured(self):
        """Check if automation is configured"""
        return self.enabled
