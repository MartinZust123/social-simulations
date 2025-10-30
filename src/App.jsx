import { useState, useMemo } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('simulate');
  const [gridSize, setGridSize] = useState(10);

  // Memoize all calculations to prevent partial renders
  const gridConfig = useMemo(() => {
    const nodes = Array.from({ length: gridSize * gridSize }, (_, i) => i);

    // Calculate based on viewport - desktop gets 600px, mobile gets smaller
    const isMobile = window.innerWidth <= 640;
    const isSmallMobile = window.innerWidth <= 400;

    let baseContainerSize = 600;
    let paddingTotal = 96; // 3rem * 2 = 96px

    if (isSmallMobile) {
      baseContainerSize = Math.min(window.innerWidth * 0.85, 350);
      paddingTotal = 32; // 1rem * 2
    } else if (isMobile) {
      baseContainerSize = Math.min(window.innerWidth * 0.9, 400);
      paddingTotal = 48; // 1.5rem * 2
    }

    const containerSize = baseContainerSize - paddingTotal;

    // Use 15% of available space per cell for gaps, rest for nodes
    const cellSize = containerSize / gridSize;
    const gapSize = Math.max(4, Math.min(cellSize * 0.15, 24)); // Gap between 4px and 24px
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
