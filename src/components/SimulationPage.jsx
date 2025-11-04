import { useState, useEffect, useRef } from 'react';
import ParametersPanel from './ParametersPanel';
import SimulationGrid from './SimulationGrid';
import MetricsDisplay from './MetricsDisplay';

function SimulationPage({
  gridSize,
  setGridSize,
  stepTime,
  setStepTime,
  q,
  setQ,
  F,
  setF,
  nodeFeatures,
  setNodeFeatures,
  isSimulating,
  setIsSimulating,
  getNodeColor,
  gridConfig,
  randomizeFeatures,
  metrics
}) {
  const [showParameters, setShowParameters] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef(null);

  const handleParametersToggle = () => {
    if (isSimulating) {
      setShowTooltip(true);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      return;
    }
    setShowParameters(!showParameters);
  };

  const toggleSimulation = () => {
    if (!isSimulating) {
      setShowParameters(false);
    }
    setIsSimulating(!isSimulating);
  };

  return (
    <main className="main-content">
      <div className="controls">
        <div className="parameters-toggle-wrapper">
          {showTooltip && (
            <div className="parameter-tooltip">
              Parameters cannot be changed during simulation
            </div>
          )}
          <button
            className={`parameters-toggle ${isSimulating ? 'disabled' : ''}`}
            onClick={handleParametersToggle}
          >
            Parameters
            <svg className="toggle-icon" width="12" height="8" viewBox="0 0 12 8" fill="none">
              {showParameters ? (
                <path d="M1 7L6 2L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>

        {showParameters && (
          <ParametersPanel
            gridSize={gridSize}
            setGridSize={setGridSize}
            stepTime={stepTime}
            setStepTime={setStepTime}
            q={q}
            setQ={setQ}
            F={F}
            setF={setF}
          />
        )}

        <div className="button-group">
          <button className="randomize-button" onClick={randomizeFeatures}>
            Randomize
          </button>
          <button className="simulate-button" onClick={toggleSimulation}>
            {isSimulating ? 'Stop' : 'Simulate'}
          </button>
        </div>
      </div>

      <SimulationGrid
        gridSize={gridSize}
        gridConfig={gridConfig}
        nodeFeatures={nodeFeatures}
        getNodeColor={getNodeColor}
      />

      <MetricsDisplay
        metrics={metrics}
        simulationParams={{ gridSize, F, q, stepTime }}
      />
    </main>
  );
}

export default SimulationPage;
