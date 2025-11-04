import { useState } from 'react';

function ParametersPanel({ gridSize, setGridSize, stepTime, setStepTime, q, setQ, F, setF, featureNames, setFeatureNames, valueNames, setValueNames, simulationMode, interpretableFeatures, setInterpretableFeatures }) {
  const [showNaming, setShowNaming] = useState(false);

  const addFeature = () => {
    setInterpretableFeatures([...interpretableFeatures, { name: '', states: [''] }]);
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
    updated[featureIndex].states.push('');
    setInterpretableFeatures(updated);
  };

  const removeState = (featureIndex, stateIndex) => {
    const updated = [...interpretableFeatures];
    updated[featureIndex].states = updated[featureIndex].states.filter((_, idx) => idx !== stateIndex);
    setInterpretableFeatures(updated);
  };

  const updateStateName = (featureIndex, stateIndex, name) => {
    const updated = [...interpretableFeatures];
    updated[featureIndex].states[stateIndex] = name;
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
              <div className="interpretable-states-list">
                {feature.states.map((state, stateIdx) => (
                  <div key={stateIdx} className="interpretable-state-item">
                    <input
                      type="text"
                      className="interpretable-state-input"
                      placeholder="State name"
                      value={state}
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
