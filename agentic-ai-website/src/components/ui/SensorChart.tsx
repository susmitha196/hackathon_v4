import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { SensorReading } from '../../lib/factoryCopilotApi';

interface SensorChartProps {
  sensorHistory: SensorReading[];
  title?: string;
}

export function SensorChart({ sensorHistory, title = 'Sensor Trends' }: SensorChartProps) {
  const chartData = useMemo(() => {
    if (sensorHistory.length === 0) return null;

    // Sort by timestamp
    const sorted = [...sensorHistory].sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });

    const timestamps = sorted.map((r) => 
      r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString()
    );
    const temperatures = sorted.map((r) => r.temperature);
    const vibrations = sorted.map((r) => r.vibration);
    const cycleTimes = sorted.map((r) => r.cycle_time);
    const errorCounts = sorted.map((r) => r.error_count);

    return {
      timestamps,
      temperatures,
      vibrations,
      cycleTimes,
      errorCounts,
    };
  }, [sensorHistory]);

  if (!chartData) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center h-[500px]">
        <div className="text-muted-foreground">No data available for chart</div>
      </div>
    );
  }

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: title,
      font: { size: 18, color: '#ffffff' },
    },
    xaxis: {
      title: 'Time',
      showgrid: true,
      gridwidth: 1,
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      showline: true,
      linewidth: 1,
      linecolor: 'rgba(255, 255, 255, 0.2)',
      color: '#a3a3a3',
    },
    yaxis: {
      title: 'Temperature (°C)',
      side: 'left',
      showgrid: true,
      gridwidth: 1,
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      showline: true,
      color: '#FF6B6B',
      titlefont: { color: '#FF6B6B' },
      tickfont: { color: '#FF6B6B' },
    },
    yaxis2: {
      title: 'Vibration (mm/s)',
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      showline: true,
      color: '#4ECDC4',
      titlefont: { color: '#4ECDC4' },
      tickfont: { color: '#4ECDC4' },
      position: 0.95,
    },
    yaxis3: {
      title: 'Cycle Time (s)',
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      showline: true,
      color: '#95E1D3',
      titlefont: { color: '#95E1D3' },
      tickfont: { color: '#95E1D3' },
      position: 0.85,
    },
    yaxis4: {
      title: 'Error Count',
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      showline: true,
      color: '#F38181',
      titlefont: { color: '#F38181' },
      tickfont: { color: '#F38181' },
      position: 0.75,
    },
    height: 500,
    hovermode: 'x unified' as const,
    legend: {
      yanchor: 'top',
      y: 0.99,
      xanchor: 'left',
      x: 0.01,
      bgcolor: 'rgba(18, 18, 18, 0.9)',
      bordercolor: 'rgba(255, 255, 255, 0.2)',
      borderwidth: 1,
      font: { color: '#ffffff' },
    },
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    font: { family: 'var(--font-sans)', size: 12, color: '#ffffff' },
    margin: { l: 60, r: 80, t: 60, b: 60 },
  };

  const data: Plotly.Data[] = [
    {
      x: chartData.timestamps,
      y: chartData.temperatures,
      name: 'Temperature (°C)',
      type: 'scatter',
      mode: 'lines',
      line: {
        color: '#FF6B6B',
        width: 2.5,
        shape: 'spline' as const,
        smoothing: 1.3,
      },
      yaxis: 'y',
      hovertemplate: '<b>Temperature</b><br>%{y:.1f}°C<br>%{x}<extra></extra>',
    },
    {
      x: chartData.timestamps,
      y: chartData.vibrations.map((v) => v * 10), // Scale for visibility
      name: 'Vibration (mm/s × 10)',
      type: 'scatter',
      mode: 'lines',
      line: {
        color: '#4ECDC4',
        width: 2.5,
        shape: 'spline' as const,
        smoothing: 1.3,
      },
      yaxis: 'y2',
      hovertemplate: '<b>Vibration</b><br>%{y:.1f} (scaled)<br>%{x}<extra></extra>',
    },
    {
      x: chartData.timestamps,
      y: chartData.cycleTimes,
      name: 'Cycle Time (s)',
      type: 'scatter',
      mode: 'lines',
      line: {
        color: '#95E1D3',
        width: 2.5,
        shape: 'spline' as const,
        smoothing: 1.3,
      },
      yaxis: 'y3',
      hovertemplate: '<b>Cycle Time</b><br>%{y:.1f}s<br>%{x}<extra></extra>',
    },
    {
      x: chartData.timestamps,
      y: chartData.errorCounts.map((e) => e * 5), // Scale for visibility
      name: 'Error Count (× 5)',
      type: 'scatter',
      mode: 'lines',
      line: {
        color: '#F38181',
        width: 2.5,
        shape: 'spline' as const,
        smoothing: 1.3,
      },
      yaxis: 'y4',
      hovertemplate: '<b>Error Count</b><br>%{y:.1f} (scaled)<br>%{x}<extra></extra>',
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <Plot
        data={data}
        layout={layout}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          toImageButtonOptions: {
            format: 'png',
            filename: 'sensor-chart',
            height: 500,
            width: 1200,
            scale: 2,
          },
          responsive: true,
        }}
        style={{ width: '100%', height: '500px' }}
        useResizeHandler={true}
      />
      <div className="mt-4 text-sm text-muted-foreground">
        📊 Showing {sensorHistory.length} data points | Hover to see values | Click legend to toggle traces
      </div>
    </div>
  );
}
