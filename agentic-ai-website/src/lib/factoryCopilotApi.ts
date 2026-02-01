/**
 * Factory Copilot API Client
 * Connects to the Factory Copilot backend API
 */

const API_BASE_URL = import.meta.env.VITE_FACTORY_COPILOT_API_URL || 'http://localhost:8000';

export interface SensorData {
  temperature: number;
  vibration: number;
  cycle_time: number;
  error_count: number;
}

export interface SensorReading extends SensorData {
  timestamp?: string;
  pressure?: number;
  humidity?: number;
  power?: number;
  production?: number;
}

export interface PredictionResponse {
  risk: number;
  feature_importance: Record<string, number>;
}

export interface AIExplanation {
  root_cause: string;
  recommended_action: string;
}

export interface TrendAnalysis {
  summary: string;
  anomalies: string[];
  status: string;
}

export interface ErrorCodeInfo {
  code: string;
  description: string;
  severity: string;
  causes?: string[];
  recommended_actions?: string[];
}

export interface CompleteAnalysis {
  prediction: PredictionResponse;
  explanation: AIExplanation;
  error_code: ErrorCodeInfo;
  timestamp: string;
}

export interface AutomationResult {
  success: boolean;
  message: string;
  triggered: boolean;
  response_data?: any;
  status_code?: number;
  error_code?: string;
}

class FactoryCopilotAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get downtime risk prediction from sensor data
   */
  async predict(sensorData: SensorData): Promise<PredictionResponse> {
    return this.request<PredictionResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(sensorData),
    });
  }

  /**
   * Get complete analysis (prediction + AI explanation + error code)
   */
  async getCompleteAnalysis(sensorData: SensorData): Promise<CompleteAnalysis> {
    return this.request<CompleteAnalysis>('/complete-analysis', {
      method: 'POST',
      body: JSON.stringify(sensorData),
    });
  }

  /**
   * Get AI explanation for downtime prediction
   */
  async getAIExplanation(
    prediction: PredictionResponse,
    sensorData: SensorData
  ): Promise<AIExplanation> {
    return this.request<AIExplanation>('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({
        prediction,
        sensor_data: sensorData,
      }),
    });
  }

  /**
   * Analyze sensor trends using Gemini AI
   */
  async analyzeTrends(sensorHistory: SensorReading[]): Promise<TrendAnalysis> {
    return this.request<TrendAnalysis>('/ai/trends', {
      method: 'POST',
      body: JSON.stringify(sensorHistory),
    });
  }

  /**
   * Generate live sensor reading
   */
  async generateSensorReading(
    mode: 'normal' | 'failure' = 'normal',
    failureProgress: number = 0.0,
    historyLength: number = 0
  ): Promise<SensorReading> {
    return this.request<SensorReading>('/sensor/generate', {
      method: 'POST',
      body: JSON.stringify({
        mode,
        failure_progress: failureProgress,
        history_length: historyLength,
      }),
    });
  }

  /**
   * Trigger n8n automation workflow
   */
  async triggerAutomation(
    riskScore: number,
    sensorData: SensorData,
    explanation?: AIExplanation,
    errorCode?: string
  ): Promise<AutomationResult> {
    return this.request<AutomationResult>('/automation/trigger', {
      method: 'POST',
      body: JSON.stringify({
        risk_score: riskScore,
        sensor_data: sensorData,
        explanation,
        error_code: errorCode,
      }),
    });
  }

  /**
   * Get all available error codes
   */
  async getErrorCodes(): Promise<Record<string, ErrorCodeInfo>> {
    const response = await this.request<{ error_codes: Record<string, any> }>('/error-codes');
    return response.error_codes;
  }

  /**
   * Determine error code from sensor data and risk score
   */
  async determineErrorCode(
    sensorData: SensorData,
    riskScore: number
  ): Promise<ErrorCodeInfo> {
    return this.request<ErrorCodeInfo>('/error-codes/determine', {
      method: 'POST',
      body: JSON.stringify({
        sensor_data: sensorData,
        risk_score: riskScore,
      }),
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; model_trained: boolean }> {
    return this.request('/health');
  }
}

export const factoryCopilotAPI = new FactoryCopilotAPI();
