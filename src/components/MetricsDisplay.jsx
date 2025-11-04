import { useEffect } from 'react';

function MetricsDisplay({ metrics, simulationParams }) {
  useEffect(() => {
    if (!metrics || !simulationParams) return;

    // Automatically save to database when metrics are available
    const saveToDatabase = async () => {
      try {
        // Use relative URL - works for both local dev and production
        const apiUrl = import.meta.env.DEV
          ? 'http://localhost:3001/api/simulations'
          : '/api/simulations';

        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gridSize: simulationParams.gridSize,
            F: simulationParams.F,
            q: simulationParams.q,
            stepTime: simulationParams.stepTime,
            totalSteps: metrics.totalSteps,
            uniqueCultures: metrics.uniqueCultures,
            largestDomainSize: metrics.largestDomainSize,
            avgCulturalDistance: metrics.avgCulturalDistance
          }),
        });
      } catch (error) {
        console.error('Error saving to database:', error);
      }
    };

    saveToDatabase();
  }, [metrics, simulationParams]);

  if (!metrics) return null;

  return (
    <div className="metrics-container">
      <h3 className="metrics-title">Simulation Results</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Steps</div>
          <div className="metric-value">{metrics.totalSteps.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Unique Cultures</div>
          <div className="metric-value">{metrics.uniqueCultures}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Largest Domain</div>
          <div className="metric-value">
            {metrics.largestDomainSize}
            <span className="metric-subvalue">({metrics.largestDomainPercentage}%)</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Cultural Distance</div>
          <div className="metric-value">{metrics.avgCulturalDistance}</div>
        </div>
      </div>
    </div>
  );
}

export default MetricsDisplay;
