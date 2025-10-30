import { useState, useMemo } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('simulate');
  const [gridSize, setGridSize] = useState(4);

  // Memoize all calculations to prevent partial renders
  const gridConfig = useMemo(() => {
    const nodes = Array.from({ length: gridSize * gridSize }, (_, i) => i);

    // Calculate node size and gap dynamically
    const containerSize = 600 - 96; // 600px - 3rem padding on both sides (3rem * 2 = 96px)

    // Use 15% of available space per cell for gaps, rest for nodes
    const cellSize = containerSize / gridSize;
    const gapSize = Math.max(8, Math.min(cellSize * 0.15, 24)); // Gap between 8px and 24px
    const totalGapSpace = gapSize * (gridSize - 1);
    const availableSpace = containerSize - totalGapSpace;
    const nodeSize = Math.floor(availableSpace / gridSize);

    return { nodes, gapSize, nodeSize };
  }, [gridSize]);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-logo">Social Simulations</div>
          <div className="nav-buttons">
            <button
              className={`nav-button ${activeTab === 'simulate' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulate')}
            >
              Simulate
            </button>
            <button
              className={`nav-button ${activeTab === 'math' ? 'active' : ''}`}
              onClick={() => setActiveTab('math')}
            >
              Math Behind
            </button>
            <button
              className={`nav-button ${activeTab === 'cases' ? 'active' : ''}`}
              onClick={() => setActiveTab('cases')}
            >
              Case Studies
            </button>
          </div>
        </div>
      </nav>

      <header className="header">
        <h1 className="title">Social Simulations Made Simple</h1>
        <p className="subtitle">Inspired by Axelrod's model of social dynamics</p>
      </header>

      <main className="main-content">
        <div className="controls">
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
        </div>

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
                  height: `${gridConfig.nodeSize}px`
                }}
              ></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
