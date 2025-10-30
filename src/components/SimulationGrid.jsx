function SimulationGrid({ gridSize, gridConfig, nodeFeatures, getNodeColor }) {
  return (
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
          ></div>
        </div>
      ))}
    </div>
  );
}

export default SimulationGrid;
