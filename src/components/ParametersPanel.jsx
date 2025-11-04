import { useState, useEffect } from 'react';

function ParametersPanel({ gridSize, setGridSize, stepTime, setStepTime, q, setQ, F, setF, featureNames, setFeatureNames, valueNames, setValueNames, simulationMode, interpretableFeatures, setInterpretableFeatures, featureCorrelations, setFeatureCorrelations }) {
  const [showNaming, setShowNaming] = useState(false);

  // Calculate feature pairs dynamically when features change
  useEffect(() => {
    if (simulationMode === 'interpretable' && interpretableFeatures.length >= 2) {
      const newCorrelations = {};
      for (let i = 0; i < interpretableFeatures.length; i++) {
        for (let j = i + 1; j < interpretableFeatures.length; j++) {
          const key = `${i}-${j}`;
          // Keep existing value or default to 0
          newCorrelations[key] = featureCorrelations[key] ?? 0;
        }
      }
      setFeatureCorrelations(newCorrelations);
    } else if (simulationMode === 'interpretable' && interpretableFeatures.length < 2) {
      setFeatureCorrelations({});
    }
  }, [interpretableFeatures.length, simulationMode]);

  const updateCorrelation = (i, j, value) => {
    const key = `${i}-${j}`;
    setFeatureCorrelations(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }));
  };

  const addFeature = () => {
    setInterpretableFeatures([...interpretableFeatures, { name: '', states: [{ name: '', color: '#3b82f6' }], hasOrder: false }]);
  };

  const removeFeature = (featureIndex) => {
    setInterpretableFeatures(interpretableFeatures.filter((_, idx) => idx !== featureIndex));
  };

  const updateFeatureName = (featureIndex, name) => {
    const updated = [...interpretableFeatures];
    updated[featureIndex].name = name;
    setInterpretableFeatures(updated);
  };

  const addState = (featureIndex) => {
    const updated = [...interpretableFeatures];
    updated[featureIndex].states.push({ name: '', color: '#3b82f6' });
    setInterpretableFeatures(updated);
  };

  const removeState = (featureIndex, stateIndex) => {
    const updated = [...interpretableFeatures];
    updated[featureIndex].states = updated[featureIndex].states.filter((_, idx) => idx !== stateIndex);
    setInterpretableFeatures(updated);
  };

  const updateStateName = (featureIndex, stateIndex, name) => {
    const updated = [...interpretableFeatures];
    updated[featureIndex].states[stateIndex].name = name;
    setInterpretableFeatures(updated);
  };

  const updateStateColor = (featureIndex, stateIndex, color) => {
    const updated = [...interpretableFeatures];
    updated[featureIndex].states[stateIndex].color = color;
    setInterpretableFeatures(updated);
  };

  const toggleFeatureOrder = (featureIndex) => {
    const updated = [...interpretableFeatures];
    updated[featureIndex].hasOrder = !updated[featureIndex].hasOrder;
    setInterpretableFeatures(updated);
  };

  const handleFeatureNameChange = (featureIndex, name) => {
    setFeatureNames(prev => ({
      ...prev,
      [featureIndex]: name
    }));
  };

  const handleValueNameChange = (featureIndex, valueIndex, name) => {
    setValueNames(prev => ({
      ...prev,
      [featureIndex]: {
        ...(prev[featureIndex] || {}),
        [valueIndex]: name
      }
    }));
  };

  return (
    <>
      <div className="parameters-panel">
        <label className="control-label">
          Grid Size: <span className="grid-size-value">{gridSize} × {gridSize}</span>
        </label>
        <input
          type="range"
          min="3"
          max="20"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="slider"
        />
        <label className="control-label">
          Step Time: <span className="grid-size-value">{stepTime.toFixed(5)}s</span>
        </label>
        <input
          type="range"
          min="0.00001"
          max="0.1"
          step="0.00001"
          value={stepTime}
          onChange={(e) => setStepTime(Number(e.target.value))}
          className="slider"
        />
        {simulationMode === 'basic' && (
          <>
            <label className="control-label">
              q (Possible States): <span className="grid-size-value">{q}</span>
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={q}
              onChange={(e) => setQ(Number(e.target.value))}
              className="slider"
            />
            <label className="control-label">
              F (Cultural Features): <span className="grid-size-value">{F}</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={F}
              onChange={(e) => setF(Number(e.target.value))}
              className="slider"
            />
          </>
        )}
      </div>

      {simulationMode === 'interpretable' && (
        <div className="interpretable-features-section">
          {interpretableFeatures.map((feature, featureIdx) => (
            <div key={featureIdx} className="interpretable-feature-card">
              <div className="interpretable-feature-header">
                <input
                  type="text"
                  className="interpretable-feature-name-input"
                  placeholder="Feature name (e.g., Religion)"
                  value={feature.name}
                  onChange={(e) => updateFeatureName(featureIdx, e.target.value)}
                />
                {interpretableFeatures.length > 1 && (
                  <button
                    className="remove-feature-button"
                    onClick={() => removeFeature(featureIdx)}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="feature-order-toggle">
                <label className="order-toggle-label">
                  <input
                    type="checkbox"
                    checked={feature.hasOrder}
                    onChange={() => toggleFeatureOrder(featureIdx)}
                    className="order-checkbox"
                  />
                  <span className="order-label-text">
                    States have order (spectrum)
                  </span>
                </label>
              </div>
              <div className="interpretable-states-list">
                {feature.states.map((state, stateIdx) => (
                  <div key={stateIdx} className="interpretable-state-item">
                    <input
                      type="color"
                      className="state-color-picker"
                      value={state.color}
                      onChange={(e) => updateStateColor(featureIdx, stateIdx, e.target.value)}
                      title="Choose color"
                    />
                    <input
                      type="text"
                      className="interpretable-state-input"
                      placeholder="State name"
                      value={state.name}
                      onChange={(e) => updateStateName(featureIdx, stateIdx, e.target.value)}
                    />
                    {feature.states.length > 1 && (
                      <button
                        className="remove-state-button"
                        onClick={() => removeState(featureIdx, stateIdx)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <div className="add-state-button-wrapper">
                  <button
                    className="add-state-button"
                    onClick={() => addState(featureIdx)}
                  >
                    + Add State
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="add-feature-button" onClick={addFeature}>
            + Add Feature
          </button>

          {interpretableFeatures.length >= 2 && (
            <div className="correlations-section">
              <h3 className="correlations-title">Feature Correlations</h3>
              {interpretableFeatures.map((feature1, i) =>
                interpretableFeatures.slice(i + 1).map((feature2, j) => {
                  const actualJ = i + j + 1;
                  const key = `${i}-${actualJ}`;
                  const feature1Name = feature1.name || `Feature ${i + 1}`;
                  const feature2Name = feature2.name || `Feature ${actualJ + 1}`;
                  const correlationValue = featureCorrelations[key] ?? 0;

                  return (
                    <div key={key} className="correlation-item">
                      <label className="correlation-label">
                        Correlation - {feature1Name} and {feature2Name}: <span className="correlation-value">{correlationValue.toFixed(2)}</span>
                      </label>
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.01"
                        value={correlationValue}
                        onChange={(e) => updateCorrelation(i, actualJ, e.target.value)}
                        className="slider"
                      />
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {simulationMode === 'basic' && (
        <div className="naming-section">
        <button
          className="naming-toggle-button"
          onClick={() => setShowNaming(!showNaming)}
        >
          {showNaming ? 'Hide' : 'Show'} Feature Names
          <svg className="naming-toggle-icon" width="12" height="8" viewBox="0 0 12 8" fill="none">
            {showNaming ? (
              <path d="M1 7L6 2L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </button>

        {showNaming && (
          <div className="naming-content">
            <p className="naming-description">
              Customize names for features and their values to make results more interpretable
            </p>
            {Array.from({ length: F }, (_, featureIdx) => (
              <div key={featureIdx} className="feature-naming-group">
                <div className="feature-naming-header">
                  <label className="feature-naming-label">
                    Feature {featureIdx}
                  </label>
                  <input
                    type="text"
                    className="feature-name-input"
                    placeholder={`e.g., Religion, Language, etc.`}
                    value={featureNames[featureIdx] || ''}
                    onChange={(e) => handleFeatureNameChange(featureIdx, e.target.value)}
                  />
                </div>
                <div className="value-naming-grid">
                  {Array.from({ length: q }, (_, valueIdx) => (
                    <div key={valueIdx} className="value-naming-item">
                      <span className="value-index">{valueIdx}</span>
                      <input
                        type="text"
                        className="value-name-input"
                        placeholder="Value name"
                        value={valueNames[featureIdx]?.[valueIdx] || ''}
                        onChange={(e) => handleValueNameChange(featureIdx, valueIdx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}
    </>
  );
}

export default ParametersPanel;
