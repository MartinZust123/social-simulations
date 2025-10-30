function ParametersPanel({ gridSize, setGridSize, stepTime, setStepTime, q, setQ, F, setF }) {
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
    </div>
  );
}

export default ParametersPanel;
