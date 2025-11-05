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
  metrics,
  featureNames,
  setFeatureNames,
  valueNames,
  setValueNames,
  simulationMode,
  setSimulationMode,
  interpretableFeatures,
  setInterpretableFeatures,
  featureCorrelations,
  setFeatureCorrelations
}) {
  const [showParameters, setShowParameters] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isGridInitialized, setIsGridInitialized] = useState(false);
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

  const handleRandomize = () => {
    randomizeFeatures();
    if (simulationMode === 'interpretable') {
      setIsGridInitialized(true);
    }
  };

  return (
    <main className="main-content">
      <div className="controls">
        <div className="mode-selector">
          <button
            className={`mode-button ${simulationMode === 'basic' ? 'active' : ''}`}
            onClick={() => setSimulationMode('basic')}
          >
            Basic
          </button>
          <button
            className={`mode-button ${simulationMode === 'interpretable' ? 'active' : ''}`}
            onClick={() => setSimulationMode('interpretable')}
          >
            Interpretable
          </button>
        </div>

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
            featureNames={featureNames}
            setFeatureNames={setFeatureNames}
            valueNames={valueNames}
            setValueNames={setValueNames}
            simulationMode={simulationMode}
            interpretableFeatures={interpretableFeatures}
            setInterpretableFeatures={setInterpretableFeatures}
            featureCorrelations={featureCorrelations}
            setFeatureCorrelations={setFeatureCorrelations}
          />
        )}

        {simulationMode === 'basic' && (
          <div className="button-group">
            <button className="randomize-button" onClick={handleRandomize}>
              Randomize
            </button>
            <button className="simulate-button" onClick={toggleSimulation}>
              {isSimulating ? 'Stop' : 'Simulate'}
            </button>
          </div>
        )}

        {simulationMode === 'interpretable' && (
          <div className="button-group">
            <button className="randomize-button" onClick={handleRandomize}>
              Randomize
            </button>
            {isGridInitialized && (
              <button className="simulate-button" onClick={toggleSimulation}>
                {isSimulating ? 'Stop' : 'Simulate'}
              </button>
            )}
          </div>
        )}
      </div>

      {simulationMode === 'basic' && (
        <>
          <SimulationGrid
            gridSize={gridSize}
            gridConfig={gridConfig}
            nodeFeatures={nodeFeatures}
            getNodeColor={getNodeColor}
            featureNames={featureNames}
            valueNames={valueNames}
            simulationMode={simulationMode}
            interpretableFeatures={interpretableFeatures}
          />

          <MetricsDisplay
            metrics={metrics}
            simulationParams={{ gridSize, F, q, stepTime }}
            simulationMode={simulationMode}
            interpretableFeatures={interpretableFeatures}
            featureCorrelations={featureCorrelations}
          />
        </>
      )}

      {simulationMode === 'interpretable' && (
        <>
          <SimulationGrid
            gridSize={gridSize}
            gridConfig={gridConfig}
            nodeFeatures={nodeFeatures}
            getNodeColor={getNodeColor}
            featureNames={featureNames}
            valueNames={valueNames}
            simulationMode={simulationMode}
            interpretableFeatures={interpretableFeatures}
          />

          <MetricsDisplay
            metrics={metrics}
            simulationParams={{ gridSize, F: interpretableFeatures.length, q: Math.max(...interpretableFeatures.map(f => f.states.length)), stepTime }}
            simulationMode={simulationMode}
            interpretableFeatures={interpretableFeatures}
            featureCorrelations={featureCorrelations}
          />
        </>
      )}
    </main>
  );
}

export default SimulationPage;
