"""
AI Explainer using LangChain and OpenAI
Provides root cause analysis and recommended actions for downtime predictions
"""
import os
from dotenv import load_dotenv

load_dotenv()

try:
    from langchain_openai import ChatOpenAI
    from langchain.prompts import ChatPromptTemplate
    LANGCHAIN_AVAILABLE = True
except ImportError:
    try:
        # Fallback for older langchain versions
        from langchain.chat_models import ChatOpenAI
        from langchain.prompts import ChatPromptTemplate
        LANGCHAIN_AVAILABLE = True
    except ImportError:
        LANGCHAIN_AVAILABLE = False

class AIExplainer:
    """Generate AI-powered explanations for downtime predictions"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY")
        self.llm = None
        
        if LANGCHAIN_AVAILABLE and self.openai_api_key:
            try:
                # Try new langchain-openai format first
                try:
                    self.llm = ChatOpenAI(
                        model="gpt-3.5-turbo",
                        api_key=self.openai_api_key,
                        temperature=0.7
                    )
                except:
                    # Fallback to older format
                    self.llm = ChatOpenAI(
                        model_name="gpt-3.5-turbo",
                        openai_api_key=self.openai_api_key,
                        temperature=0.7
                    )
            except Exception as e:
                print(f"Warning: Could not initialize OpenAI: {e}")
                self.llm = None
    
    def explain(self, prediction_result, sensor_data):
        """
        Generate AI explanation for downtime prediction
        
        Args:
            prediction_result: Dict with 'risk' and 'feature_importance'
            sensor_data: Dict with sensor readings
            
        Returns:
            Dict with 'root_cause' and 'recommended_action'
        """
        if not self.llm:
            # Return dummy explanation if OpenAI not configured
            return self._dummy_explanation(prediction_result, sensor_data)
        
        try:
            risk = prediction_result.get('risk', 0)
            importance = prediction_result.get('feature_importance', {})
            
            # Build prompt
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an expert industrial maintenance engineer analyzing machine sensor data."),
                ("human", """Analyze this machine downtime risk prediction:

Risk Score: {risk}%
Sensor Readings:
- Temperature: {temp}°C
- Vibration: {vib} mm/s
- Cycle Time: {cycle}s
- Error Count: {errors}

Key Contributing Factors:
{factors}

Provide:
1. Root Cause Analysis: What is likely causing the high downtime risk?
2. Recommended Action: What should the operator do immediately?

Keep responses concise (2-3 sentences each) and actionable.""")
            ])
            
            # Format factors
            factors_str = "\n".join([f"- {k}: {v:.1%}" for k, v in sorted(importance.items(), key=lambda x: x[1], reverse=True)[:3]])
            
            # Invoke LLM
            chain = prompt | self.llm
            response = chain.invoke({
                "risk": risk,
                "temp": sensor_data.get('temperature', 0),
                "vib": sensor_data.get('vibration', 0),
                "cycle": sensor_data.get('cycle_time', 0),
                "errors": sensor_data.get('error_count', 0),
                "factors": factors_str
            })
            
            # Parse response
            content = response.content if hasattr(response, 'content') else str(response)
            
            # Simple parsing (assumes format: Root Cause: ... Recommended Action: ...)
            parts = content.split("Recommended Action:")
            root_cause = parts[0].replace("Root Cause:", "").replace("Root Cause Analysis:", "").strip()
            recommended_action = parts[1].strip() if len(parts) > 1 else "Monitor sensor readings and schedule maintenance."
            
            return {
                'root_cause': root_cause,
                'recommended_action': recommended_action
            }
            
        except Exception as e:
            print(f"Error generating AI explanation: {e}")
            return self._dummy_explanation(prediction_result, sensor_data)
    
    def _dummy_explanation(self, prediction_result, sensor_data):
        """Fallback dummy explanation"""
        risk = prediction_result.get('risk', 0)
        importance = prediction_result.get('feature_importance', {})
        
        if importance:
            top_feature = max(importance.items(), key=lambda x: x[1])
            root_cause = f"High risk ({risk}%) detected. Primary concern: {top_feature[0]} is outside normal range. Temperature and vibration patterns suggest potential bearing wear or mechanical stress."
            recommended_action = f"Inspect {top_feature[0]} immediately. Consider reducing machine load or scheduling preventive maintenance."
        else:
            root_cause = f"Downtime risk is {risk}%. Monitor sensor readings closely."
            recommended_action = "Review sensor trends and schedule maintenance if risk continues to increase."
        
        return {
            'root_cause': root_cause,
            'recommended_action': recommended_action
        }
