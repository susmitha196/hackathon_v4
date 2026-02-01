import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import { 
  Activity, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Zap,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Upload,
  FileJson
} from 'lucide-react';
import {
  factoryCopilotAPI,
  type SensorReading,
  type CompleteAnalysis,
  type TrendAnalysis,
  type AutomationResult,
} from '../lib/factoryCopilotApi';
import { SensorChart } from '../components/ui/SensorChart';

export function FactoryCopilotDashboard() {
  const [sensorData, setSensorData] = useState<SensorReading | null>(null);
  const [sensorHistory, setSensorHistory] = useState<SensorReading[]>([]);
  const [analysis, setAnalysis] = useState<CompleteAnalysis | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [automationResult, setAutomationResult] = useState<AutomationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(1000); // 1 second
  const [failureMode, setFailureMode] = useState(false);
  const [failureProgress, setFailureProgress] = useState(0.0);
  const [dataSource, setDataSource] = useState<'live' | 'json'>('live');
  const [jsonData, setJsonData] = useState<SensorReading[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track reading count that keeps incrementing (not limited to 50)
  const readingCounterRef = useRef(0);

  // Handle JSON file upload
  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Handle array of readings
        let readings: SensorReading[] = [];
        if (Array.isArray(data)) {
          readings = data.map((item: any) => ({
            timestamp: item.timestamp || new Date().toISOString(),
            temperature: item.temperature || 0,
            vibration: item.vibration || 0,
            cycle_time: item.cycle_time || 0,
            error_count: item.error_count || 0,
            pressure: item.pressure,
            humidity: item.humidity,
            power: item.power || item.power_consumption,
            production: item.production || item.production_rate,
          }));
        } else {
          setError('JSON file must contain an array of sensor readings');
          return;
        }

        if (readings.length === 0) {
          setError('JSON file is empty or invalid');
          return;
        }

        setJsonData(readings);
        setSensorHistory(readings.slice(-50)); // Keep last 50 for chart
        setSensorData(readings[readings.length - 1]); // Set current to last reading
        
        // Analyze the last reading
        const lastReading = readings[readings.length - 1];
        const completeAnalysis = await factoryCopilotAPI.getCompleteAnalysis({
          temperature: lastReading.temperature,
          vibration: lastReading.vibration,
          cycle_time: lastReading.cycle_time,
          error_count: lastReading.error_count,
        });
        setAnalysis(completeAnalysis);

        // Analyze trends if enough data
        if (readings.length >= 10) {
          const trends = await factoryCopilotAPI.analyzeTrends(readings.slice(-50));
          setTrendAnalysis(trends);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Generate sensor reading
  const generateReading = useCallback(async () => {
    if (dataSource === 'json') return; // Don't generate if using JSON data
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Increment counter for cyclical patterns (not limited by history length)
      readingCounterRef.current += 1;
      const patternCounter = readingCounterRef.current;
      
      const reading = await factoryCopilotAPI.generateSensorReading(
        failureMode ? 'failure' : 'normal',
        failureProgress,
        patternCounter // Use counter that keeps incrementing
      );

      setSensorData(reading);
      
      // Add to history (keep last 50 for display, but continue generating)
      const newHistory = [...sensorHistory, reading].slice(-50);
      setSensorHistory(newHistory);

      // Get complete analysis
      const completeAnalysis = await factoryCopilotAPI.getCompleteAnalysis({
        temperature: reading.temperature,
        vibration: reading.vibration,
        cycle_time: reading.cycle_time,
        error_count: reading.error_count,
      });
      
      setAnalysis(completeAnalysis);

      // Update failure progress
      if (failureMode) {
        setFailureProgress(Math.min(1.0, failureProgress + 0.012));
      } else {
        setFailureProgress(0.0);
      }

      // Trigger automation if risk is high
      if (completeAnalysis.prediction.risk > 75) {
        const autoResult = await factoryCopilotAPI.triggerAutomation(
          completeAnalysis.prediction.risk,
          {
            temperature: reading.temperature,
            vibration: reading.vibration,
            cycle_time: reading.cycle_time,
            error_count: reading.error_count,
          },
          completeAnalysis.explanation,
          completeAnalysis.error_code.code
        );
        setAutomationResult(autoResult);
      } else {
        setAutomationResult(null);
      }

      // Analyze trends if we have enough data
      if (newHistory.length >= 10) {
        const trends = await factoryCopilotAPI.analyzeTrends(newHistory);
        setTrendAnalysis(trends);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error generating reading:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sensorHistory, failureMode, failureProgress, dataSource]);

  // Auto-refresh effect (only for live data)
  useEffect(() => {
    if (!isAutoRefresh || dataSource !== 'live') return;

    generateReading(); // Initial call
    
    const interval = setInterval(() => {
      generateReading();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isAutoRefresh, refreshInterval, generateReading, dataSource]);

  // Initial load (only for live data)
  useEffect(() => {
    if (dataSource === 'live') {
      generateReading();
    }
  }, [dataSource]);

  const riskColor = analysis?.prediction.risk
    ? analysis.prediction.risk > 75
      ? 'text-red-500'
      : analysis.prediction.risk > 50
      ? 'text-yellow-500'
      : 'text-green-500'
    : 'text-muted-foreground';

  const riskBg = analysis?.prediction.risk
    ? analysis.prediction.risk > 75
      ? 'bg-red-500/20 border-red-500/30'
      : analysis.prediction.risk > 50
      ? 'bg-yellow-500/20 border-yellow-500/30'
      : 'bg-green-500/20 border-green-500/30'
    : 'bg-muted border-border';

  // Determine which data to use for chart
  const chartData = dataSource === 'json' && jsonData.length > 0 ? jsonData : sensorHistory;
  const chartCount = dataSource === 'json' && jsonData.length > 0 ? jsonData.length : sensorHistory.length;

  return (
    <>
      <BackgroundEffects />
      <Header />
      <main id="main" className="min-h-screen">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/services/factory-orchestrator"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Factory Orchestrator
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Activity className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                  Factory Copilot Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Real-time Machine Health Monitoring & Downtime Prediction
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 p-4 rounded-xl border border-border bg-card">
            <div className="space-y-4">
              {/* Data Source Selection */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Data Source:</span>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dataSource"
                    checked={dataSource === 'live'}
                    onChange={() => {
                      setDataSource('live');
                      setIsAutoRefresh(false);
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-muted-foreground">Live Generation</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dataSource"
                    checked={dataSource === 'json'}
                    onChange={() => {
                      setDataSource('json');
                      setIsAutoRefresh(false);
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-muted-foreground">JSON File</span>
                </label>
                
                {dataSource === 'json' && (
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Upload JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleJsonUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Live Data Controls */}
              {dataSource === 'live' && (
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isAutoRefresh
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {isAutoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isAutoRefresh ? 'Pause' : 'Start'} Auto-Refresh
                  </button>

                  <button
                    onClick={generateReading}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 font-medium transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Now
                  </button>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={failureMode}
                      onChange={(e) => {
                        setFailureMode(e.target.checked);
                        if (!e.target.checked) setFailureProgress(0.0);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-muted-foreground">Simulate Failure</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="500"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(Number(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">
                      {(refreshInterval / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>
              )}

              {/* JSON Data Info */}
              {dataSource === 'json' && jsonData.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileJson className="h-4 w-4" />
                  <span>Loaded {jsonData.length} readings from JSON file</span>
                  <button
                    onClick={() => {
                      setJsonData([]);
                      setSensorHistory([]);
                      setSensorData(null);
                      setAnalysis(null);
                      setTrendAnalysis(null);
                    }}
                    className="ml-2 text-red-500 hover:text-red-400 text-sm"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Sensor Data & Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Sensor Readings */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display font-bold text-xl text-foreground mb-4">
                  Current Sensor Readings
                </h2>
                {sensorData ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground mb-1">Temperature</div>
                      <div className="text-2xl font-bold text-foreground">
                        {sensorData.temperature.toFixed(1)}°C
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground mb-1">Vibration</div>
                      <div className="text-2xl font-bold text-foreground">
                        {sensorData.vibration.toFixed(2)} mm/s
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground mb-1">Cycle Time</div>
                      <div className="text-2xl font-bold text-foreground">
                        {sensorData.cycle_time.toFixed(1)}s
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground mb-1">Error Count</div>
                      <div className="text-2xl font-bold text-foreground">
                        {sensorData.error_count.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Loading sensor data...</div>
                )}
              </div>

              {/* Interactive Sensor Chart */}
              {chartData.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground mb-4">
                    📈 IoT 4.0 Sensor Trends
                  </h2>
                  <SensorChart
                    sensorHistory={chartData}
                    title={`Multi-Sensor Timeline - IoT 4.0 Data (${chartCount} readings)`}
                  />
                </div>
              )}

              {/* Risk Score */}
              {analysis && (
                <div className={`rounded-xl border p-6 ${riskBg}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold text-xl text-foreground">
                      Downtime Risk Score
                    </h2>
                    <span className={`text-4xl font-bold ${riskColor}`}>
                      {analysis.prediction.risk}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        analysis.prediction.risk > 75
                          ? 'bg-red-500'
                          : analysis.prediction.risk > 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${analysis.prediction.risk}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Key Factors:</div>
                    {Object.entries(analysis.prediction.feature_importance)
                      .sort(([, a], [, b]) => b - a)
                      .map(([feature, importance]) => (
                        <div key={feature} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{feature}:</span>
                          <span className="text-foreground font-medium">
                            {(importance * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* AI Explanation */}
              {analysis && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    AI Analysis
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Root Cause:
                      </div>
                      <div className="p-3 rounded-lg bg-muted text-foreground">
                        {analysis.explanation.root_cause}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Recommended Action:
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-foreground">
                        {analysis.explanation.recommended_action}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trend Analysis */}
              {trendAnalysis && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Trend Analysis (Gemini)
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted text-foreground">
                      {trendAnalysis.summary}
                    </div>
                    {trendAnalysis.anomalies.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Anomalies Detected:
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                          {trendAnalysis.anomalies.map((anomaly, idx) => (
                            <li key={idx} className="text-sm text-foreground">
                              {anomaly}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Error Code & Automation */}
            <div className="space-y-6">
              {/* Error Code */}
              {analysis && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-4">
                    Error Code
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Code</div>
                      <div className="text-2xl font-bold text-foreground">
                        {analysis.error_code.code}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Description</div>
                      <div className="text-foreground font-medium">
                        {analysis.error_code.description}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Severity</div>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          analysis.error_code.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-500'
                            : analysis.error_code.severity === 'HIGH'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-green-500/20 text-green-500'
                        }`}
                      >
                        {analysis.error_code.severity}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Automation Status */}
              {automationResult && automationResult.triggered && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h2 className="font-display font-bold text-xl text-red-500">
                      Alarm Triggered
                    </h2>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-red-500 font-medium">{automationResult.message}</div>
                    {automationResult.response_data && (
                      <div className="mt-3 p-2 rounded bg-muted text-xs font-mono overflow-auto">
                        {JSON.stringify(automationResult.response_data, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display font-bold text-xl text-foreground mb-4">
                  System Status
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">API Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">
                      {chartCount} Readings {dataSource === 'json' ? 'Loaded' : 'Collected'}
                    </span>
                  </div>
                  {isAutoRefresh && dataSource === 'live' && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">Auto-Refresh Active</span>
                    </div>
                  )}
                  {dataSource === 'json' && (
                    <div className="flex items-center gap-2">
                      <FileJson className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">JSON File Mode</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
