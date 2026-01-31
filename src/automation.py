"""
Automation Module for n8n Webhook Integration
Triggers automated workflows when downtime risk exceeds thresholds
"""
import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class AutomationTrigger:
    """Trigger automated workflows via n8n webhooks"""
    
    def __init__(self):
        self.webhook_url = os.getenv("N8N_WEBHOOK_URL")
        self.enabled = bool(self.webhook_url)
    
    def trigger_maintenance_alert(self, risk_score, sensor_data, explanation=None):
        """
        Trigger maintenance alert via n8n webhook
        
        Args:
            risk_score: Downtime risk percentage (0-100)
            sensor_data: Current sensor readings
            explanation: Optional AI explanation
            
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
            # Prepare payload
            payload = {
                'risk_score': risk_score,
                'sensor_data': sensor_data,
                'timestamp': sensor_data.get('timestamp', datetime.now().isoformat()),
                'alert_type': 'high_downtime_risk',
                'explanation': explanation or 'High downtime risk detected'
            }
            
            # Send webhook request
            response = requests.post(
                self.webhook_url,
                json=payload,
                timeout=5,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code in [200, 201, 202]:
                return {
                    'success': True,
                    'message': 'Maintenance alert triggered successfully',
                    'triggered': True,
                    'response': response.text[:100]  # First 100 chars of response
                }
            else:
                return {
                    'success': False,
                    'message': f'Webhook returned status {response.status_code}',
                    'triggered': False,
                    'response': response.text[:100]
                }
                
        except requests.exceptions.Timeout:
            return {
                'success': False,
                'message': 'Webhook request timed out',
                'triggered': False
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
