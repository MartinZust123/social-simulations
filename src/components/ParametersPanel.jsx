import { useState, useEffect } from 'react';

// Template definitions
const TEMPLATES = {
  'political-cultural': {
    name: 'Political-Cultural',
    features: [
      {
        name: 'Political Ideology',
        hasOrder: true,
        states: [
          { name: 'Far Left', color: '#e63946' },
          { name: 'Center Left', color: '#f4a261' },
          { name: 'Center', color: '#e9c46a' },
          { name: 'Center Right', color: '#8ecae6' },
          { name: 'Far Right', color: '#023047' }
        ]
      },
      {
        name: 'Religious Practice',
        hasOrder: true,
        states: [
          { name: 'Secular', color: '#2a9d8f' },
          { name: 'Occasionally Religious', color: '#8ab17d' },
          { name: 'Moderately Religious', color: '#f4a261' },
          { name: 'Very Religious', color: '#e76f51' }
        ]
      },
      {
        name: 'Language Family',
        hasOrder: false,
        states: [
          { name: 'Romance', color: '#d62828' },
          { name: 'Germanic', color: '#003049' },
          { name: 'Slavic', color: '#fcbf49' },
          { name: 'Asian', color: '#06a77d' }
        ]
      }
    ],
    correlations: {
      '0-1': -0.40
    }
  },
  'social-values': {
    name: 'Social Values',
    features: [
      {
        name: 'Environmental Concern',
        hasOrder: true,
        states: [
          { name: 'Low Priority', color: '#8d99ae' },
          { name: 'Some Concern', color: '#edf2f4' },
          { name: 'High Priority', color: '#90e0ef' },
          { name: 'Climate Activist', color: '#06d6a0' }
        ]
      },
      {
        name: 'Economic Policy',
        hasOrder: true,
        states: [
          { name: 'Free Market', color: '#f72585' },
          { name: 'Mixed Economy', color: '#7209b7' },
          { name: 'Planned Economy', color: '#3a0ca3' }
        ]
      },
      {
        name: 'Cultural Tradition',
        hasOrder: false,
        states: [
          { name: 'Western', color: '#4361ee' },
          { name: 'Eastern', color: '#f72585' },
          { name: 'African', color: '#ffbe0b' },
          { name: 'Indigenous', color: '#06a77d' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.35
    }
  },
  'technology-adoption': {
    name: 'Technology Adoption',
    features: [
      {
        name: 'Tech Adoption Rate',
        hasOrder: true,
        states: [
          { name: 'Late Majority', color: '#8d99ae' },
          { name: 'Early Majority', color: '#48cae4' },
          { name: 'Early Adopter', color: '#0096c7' },
          { name: 'Innovator', color: '#023e8a' }
        ]
      },
      {
        name: 'Privacy Awareness',
        hasOrder: true,
        states: [
          { name: 'Unaware', color: '#f4f1de' },
          { name: 'Somewhat Aware', color: '#e07a5f' },
          { name: 'Privacy Conscious', color: '#81b29a' },
          { name: 'Privacy Advocate', color: '#3d405b' }
        ]
      },
      {
        name: 'Platform Preference',
        hasOrder: false,
        states: [
          { name: 'Open Source', color: '#06a77d' },
          { name: 'Proprietary', color: '#d62828' },
          { name: 'Hybrid', color: '#f77f00' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.50
    }
  },
  'urban-rural': {
    name: 'Urban-Rural Divide',
    features: [
      {
        name: 'Population Density',
        hasOrder: true,
        states: [
          { name: 'Rural', color: '#8b4513' },
          { name: 'Suburban', color: '#d2691e' },
          { name: 'Urban', color: '#696969' },
          { name: 'Metropolitan', color: '#2f4f4f' }
        ]
      },
      {
        name: 'Digital Infrastructure',
        hasOrder: true,
        states: [
          { name: 'Limited', color: '#1a1a1a' },
          { name: 'Basic', color: '#4a4a4a' },
          { name: 'Good', color: '#808080' },
          { name: 'Advanced', color: '#c0c0c0' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.4
    }
  },
  'education-income': {
    name: 'Education-Income',
    features: [
      {
        name: 'Education Level',
        hasOrder: true,
        states: [
          { name: 'No Degree', color: '#1c1c1c' },
          { name: 'High School', color: '#4d4d4d' },
          { name: "Bachelor's", color: '#808080' },
          { name: 'Advanced', color: '#b3b3b3' }
        ]
      },
      {
        name: 'Income Level',
        hasOrder: true,
        states: [
          { name: 'Low', color: '#6a994e' },
          { name: 'Lower-Middle', color: '#a7c957' },
          { name: 'Upper-Middle', color: '#f2e8cf' },
          { name: 'High', color: '#bc6c25' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.4
    }
  },
  'tradition-innovation': {
    name: 'Tradition-Innovation',
    features: [
      {
        name: 'Cultural Openness',
        hasOrder: true,
        states: [
          { name: 'Traditional', color: '#0a0a0a' },
          { name: 'Conservative', color: '#404040' },
          { name: 'Moderate', color: '#808080' },
          { name: 'Progressive', color: '#d3d3d3' }
        ]
      },
      {
        name: 'Innovation Acceptance',
        hasOrder: true,
        states: [
          { name: 'Resistant', color: '#8b0000' },
          { name: 'Cautious', color: '#dc143c' },
          { name: 'Open', color: '#ff6347' },
          { name: 'Enthusiastic', color: '#ffa07a' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.55
    }
  }
};

function ParametersPanel({ gridSize, setGridSize, stepTime, setStepTime, q, setQ, F, setF, featureNames, setFeatureNames, valueNames, setValueNames, simulationMode, interpretableFeatures, setInterpretableFeatures, featureCorrelations, setFeatureCorrelations }) {
  const [showNaming, setShowNaming] = useState(false);

  // Calculate feature pairs dynamically when features change - only for ordered features
  useEffect(() => {
    if (simulationMode === 'interpretable' && interpretableFeatures.length >= 2) {
      const newCorrelations = {};
      for (let i = 0; i < interpretableFeatures.length; i++) {
        for (let j = i + 1; j < interpretableFeatures.length; j++) {
          // Only create correlation if both features have order
          if (interpretableFeatures[i].hasOrder && interpretableFeatures[j].hasOrder) {
            const key = `${i}-${j}`;
            // Keep existing value or default to 0
            newCorrelations[key] = featureCorrelations[key] ?? 0;
          }
        }
      }
      setFeatureCorrelations(newCorrelations);
    } else if (simulationMode === 'interpretable' && interpretableFeatures.length < 2) {
      setFeatureCorrelations({});
    }
  }, [interpretableFeatures.length, simulationMode, interpretableFeatures.map(f => f.hasOrder).join(',')]);

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

  const loadTemplate = (templateKey) => {
    const template = TEMPLATES[templateKey];
    if (template) {
      setInterpretableFeatures(template.features);
      setFeatureCorrelations(template.correlations);
    }
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
            <div className="parameter-with-info">
              <div className="info-button-wrapper">
                <button
                  className="info-button"
                  type="button"
                >
                  i
                </button>
                <div className="info-tooltip">
                  Number of possible states (traits) each cultural feature can have. Higher values create more diversity.
                </div>
              </div>
              <label className="control-label">
                q (Possible States): <span className="grid-size-value">{q}</span>
              </label>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={q}
              onChange={(e) => setQ(Number(e.target.value))}
              className="slider"
            />
            <div className="parameter-with-info">
              <div className="info-button-wrapper">
                <button
                  className="info-button"
                  type="button"
                >
                  i
                </button>
                <div className="info-tooltip">
                  Number of independent cultural features (dimensions) each person has. Examples: language, religion, customs.
                </div>
              </div>
              <label className="control-label">
                F (Cultural Features): <span className="grid-size-value">{F}</span>
              </label>
            </div>
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
          <div className="templates-section">
            <h3 className="templates-title">Load Template</h3>
            <div className="template-buttons">
              <button
                className="template-button"
                onClick={() => loadTemplate('political-cultural')}
              >
                Political-Cultural
              </button>
              <button
                className="template-button"
                onClick={() => loadTemplate('social-values')}
              >
                Social Values
              </button>
              <button
                className="template-button"
                onClick={() => loadTemplate('technology-adoption')}
              >
                Technology Adoption
              </button>
              <button
                className="template-button"
                onClick={() => loadTemplate('urban-rural')}
              >
                Urban-Rural Divide
              </button>
              <button
                className="template-button"
                onClick={() => loadTemplate('education-income')}
              >
                Education-Income
              </button>
              <button
                className="template-button"
                onClick={() => loadTemplate('tradition-innovation')}
              >
                Tradition-Innovation
              </button>
            </div>
          </div>

          <div className="features-info-section">
            <div className="info-button-wrapper">
              <button
                className="info-button"
                type="button"
              >
                i
              </button>
              <div className="info-tooltip">
                <strong>Feature:</strong> A dimension that defines characteristics (e.g., Religion, Language). <strong>State:</strong> A specific value a feature can take (e.g., for Religion: Christian, Muslim, Hindu).
              </div>
            </div>
            <span className="features-info-label">Define Features & States</span>
          </div>

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

          {interpretableFeatures.length >= 2 && Object.keys(featureCorrelations).length > 0 && (
            <div className="correlations-section">
              <div className="correlations-title-wrapper">
                <h3 className="correlations-title">Feature Correlations</h3>
                <div className="info-button-wrapper">
                  <button className="info-button" type="button">i</button>
                  <div className="info-tooltip">
                    Correlations define how features influence each other during randomization. Values range from -1 (negative correlation) to +1 (positive correlation). 0 means no correlation.
                  </div>
                </div>
              </div>
              {interpretableFeatures.map((feature1, i) =>
                interpretableFeatures.slice(i + 1).map((feature2, j) => {
                  const actualJ = i + j + 1;
                  const key = `${i}-${actualJ}`;

                  // Only show if both features have order
                  if (!feature1.hasOrder || !feature2.hasOrder) {
                    return null;
                  }

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
