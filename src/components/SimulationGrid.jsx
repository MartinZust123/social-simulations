import { useState } from 'react';

function SimulationGrid({ gridSize, gridConfig, nodeFeatures, getNodeColor }) {
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
          <div className="tooltip-title">Node {hoveredNode}</div>
          <div className="tooltip-features">
            {Object.entries(nodeFeatures[hoveredNode]).map(([feature, value]) => (
              <div key={feature} className="tooltip-feature">
                <span className="tooltip-feature-name">{feature}:</span>
                <span className="tooltip-feature-value">{value.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SimulationGrid;
