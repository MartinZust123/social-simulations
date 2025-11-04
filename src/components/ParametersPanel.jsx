import { useState } from 'react';

function ParametersPanel({ gridSize, setGridSize, stepTime, setStepTime, q, setQ, F, setF, featureNames, setFeatureNames, valueNames, setValueNames }) {
  const [showNaming, setShowNaming] = useState(false);

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
    </div>
  );
}

export default ParametersPanel;
