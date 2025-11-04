import { useState } from 'react';

function SimulationGrid({ gridSize, gridConfig, nodeFeatures, getNodeColor, featureNames, valueNames, simulationMode, interpretableFeatures }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleNodeHover = (node, event) => {
    setHoveredNode(node);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  return (
    <>
      <div
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: `${gridConfig.gapSize}px`
        }}
      >
        {gridConfig.nodes.map((node) => (
          <div key={node} className="node-wrapper">
            <div
              className="node"
              style={{
                width: `${gridConfig.nodeSize}px`,
                height: `${gridConfig.nodeSize}px`,
                background: getNodeColor(node)
              }}
              onMouseEnter={(e) => handleNodeHover(node, e)}
              onMouseLeave={handleNodeLeave}
            ></div>
          </div>
        ))}
      </div>

      {hoveredNode !== null && nodeFeatures[hoveredNode] && (
        <div
          className="node-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
          }}
        >
          <div className="tooltip-title">Person {hoveredNode}</div>
          <div className="tooltip-features">
            {simulationMode === 'interpretable' ? (
              // Interpretable mode: Show feature names, state names, and colors
              nodeFeatures[hoveredNode].map((stateIndex, featureIdx) => {
                if (!interpretableFeatures[featureIdx]) return null;

                const feature = interpretableFeatures[featureIdx];
                const state = feature.states[stateIndex];
                const featureName = feature.name || `Feature ${featureIdx + 1}`;
                const stateName = state?.name || `State ${stateIndex}`;
                const stateColor = state?.color || '#3b82f6';

                return (
                  <div key={featureIdx} className="tooltip-feature">
                    <span className="tooltip-feature-name">{featureName}:</span>
                    <div className="tooltip-feature-value-with-color">
                      <div
                        className="tooltip-state-color"
                        style={{ backgroundColor: stateColor }}
                      ></div>
                      <span className="tooltip-feature-value">{stateName}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              // Basic mode: Show existing format
              nodeFeatures[hoveredNode].map((value, featureIdx) => {
                const featureName = featureNames[featureIdx] || `Feature ${featureIdx}`;
                const valueName = valueNames[featureIdx]?.[value];
                const displayValue = valueName ? `${value} (${valueName})` : value;

                return (
                  <div key={featureIdx} className="tooltip-feature">
                    <span className="tooltip-feature-name">{featureName}:</span>
                    <span className="tooltip-feature-value">{displayValue}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SimulationGrid;
