import { useState, useMemo, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('simulate');
  const [gridSize, setGridSize] = useState(10);
  const [nodeFeatures, setNodeFeatures] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepTime, setStepTime] = useState(0.001); // Step time in seconds
  const [showParameters, setShowParameters] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [q, setQ] = useState(6); // Number of possible values (0 to q-1)
  const [F, setF] = useState(3); // Number of cultural features
  const intervalRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  // Randomize cultural features for all nodes
  const randomizeFeatures = () => {
    const features = {};
    for (let i = 0; i < gridSize * gridSize; i++) {
      features[i] = Array.from({ length: F }, () => Math.floor(Math.random() * q));
    }
    setNodeFeatures(features);
  };

  // Randomize on initial render
  useEffect(() => {
    randomizeFeatures();
  }, []);

  // Get RGB color from node features
  const getNodeColor = (nodeId) => {
    const features = nodeFeatures[nodeId];
    if (!features) return '#3b82f6'; // Default blue if not initialized

    let r, g, b;

    if (F === 1) {
      // Only 1 feature: use it for R, set G and B to middle value
      r = Math.floor((features[0] / (q - 1)) * 255);
      g = 128; // 0.5 * 255 ≈ 128
      b = 128;
    } else if (F === 2) {
      // 2 features: use for R and G, set B to middle value
      r = Math.floor((features[0] / (q - 1)) * 255);
      g = Math.floor((features[1] / (q - 1)) * 255);
      b = 128;
    } else {
      // F >= 3: average features by modulo 3
      const avgR = features.filter((_, i) => i % 3 === 0).reduce((sum, val) => sum + val, 0) / features.filter((_, i) => i % 3 === 0).length;
      const avgG = features.filter((_, i) => i % 3 === 1).reduce((sum, val) => sum + val, 0) / features.filter((_, i) => i % 3 === 1).length;
      const avgB = features.filter((_, i) => i % 3 === 2).reduce((sum, val) => sum + val, 0) / features.filter((_, i) => i % 3 === 2).length;

      r = Math.floor((avgR / (q - 1)) * 255);
      g = Math.floor((avgG / (q - 1)) * 255);
      b = Math.floor((avgB / (q - 1)) * 255);
    }

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Get neighbors of a node (up, down, left, right)
  const getNeighbors = (nodeId) => {
    const row = Math.floor(nodeId / gridSize);
    const col = nodeId % gridSize;
    const neighbors = [];

    // Up
    if (row > 0) neighbors.push(nodeId - gridSize);
    // Down
    if (row < gridSize - 1) neighbors.push(nodeId + gridSize);
    // Left
    if (col > 0) neighbors.push(nodeId - 1);
    // Right
    if (col < gridSize - 1) neighbors.push(nodeId + 1);

    return neighbors;
  };

  // Check if two nodes can interact (have 1 to F-1 common features)
  const canInteract = (features1, features2) => {
    let commonCount = 0;
    for (let i = 0; i < F; i++) {
      if (features1[i] === features2[i]) commonCount++;
    }
    // Can interact if they have 1 or 2 common features (not 0 or 3)
    return commonCount > 0 && commonCount < F;
  };

  // Check if simulation has reached absorbing state
  const checkAbsorbingState = (features) => {
    const totalNodes = gridSize * gridSize;

    // Check all neighbor pairs
    for (let nodeId = 0; nodeId < totalNodes; nodeId++) {
      const neighbors = getNeighbors(nodeId);
      const nodeFeats = features[nodeId];

      for (const neighborId of neighbors) {
        const neighborFeats = features[neighborId];

        // Check if this pair can still interact
        if (canInteract(nodeFeats, neighborFeats)) {
          return false; // Found a pair that can interact, not absorbing
        }
      }
    }

    return true; // No pairs can interact, absorbing state reached
  };

  // Perform one simulation step
  const simulationStep = () => {
    setNodeFeatures((prevFeatures) => {
      // If no features initialized, do nothing
      if (Object.keys(prevFeatures).length === 0) return prevFeatures;

      // Check if already in absorbing state
      if (checkAbsorbingState(prevFeatures)) {
        setIsSimulating(false);
        return prevFeatures;
      }

      // 1. Select random node
      const totalNodes = gridSize * gridSize;
      const randomNode = Math.floor(Math.random() * totalNodes);

      // 2. Get neighbors and select one randomly
      const neighbors = getNeighbors(randomNode);
      if (neighbors.length === 0) return prevFeatures;
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

      const node1Features = prevFeatures[randomNode];
      const node2Features = prevFeatures[randomNeighbor];

      // 3. Compare features - find differences
      const differences = [];
      let commonCount = 0;
      for (let i = 0; i < F; i++) {
        if (node1Features[i] === node2Features[i]) {
          commonCount++;
        } else {
          differences.push(i);
        }
      }

      // If all same or all different, do nothing
      if (differences.length === 0 || differences.length === F) {
        return prevFeatures;
      }

      // 4. Decide interaction based on probability
      const interactionProbability = commonCount / F;
      if (Math.random() > interactionProbability) {
        return prevFeatures; // No interaction
      }

      // 5. Interaction occurs - select random different feature
      const selectedFeatureIndex = differences[Math.floor(Math.random() * differences.length)];

      // Randomly select dominator (50/50)
      const dominator = Math.random() < 0.5 ? randomNode : randomNeighbor;
      const receiver = dominator === randomNode ? randomNeighbor : randomNode;

      // Update receiver's feature to match dominator
      const newFeatures = { ...prevFeatures };
      newFeatures[receiver] = [...prevFeatures[receiver]];
      newFeatures[receiver][selectedFeatureIndex] = prevFeatures[dominator][selectedFeatureIndex];

      return newFeatures;
    });
  };

  // Toggle simulation
  const toggleSimulation = () => {
    if (!isSimulating) {
      // Starting simulation - close parameters
      setShowParameters(false);
    }
    setIsSimulating(!isSimulating);
  };

  // Handle parameters toggle with simulation check
  const handleParametersToggle = () => {
    if (isSimulating) {
      // Show tooltip for 5 seconds
      setShowTooltip(true);

      // Clear existing timeout if any
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }

      // Hide tooltip after 5 seconds
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return;
    }
    setShowParameters(!showParameters);
  };

  // Effect to handle simulation interval
  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(() => {
        simulationStep();
      }, stepTime * 1000); // Convert seconds to milliseconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulating, gridSize, stepTime]);

  // Memoize all calculations to prevent partial renders
  const gridConfig = useMemo(() => {
    const nodes = Array.from({ length: gridSize * gridSize }, (_, i) => i);

    // Calculate based on viewport - desktop gets 600px, mobile gets smaller
    const isMobile = window.innerWidth <= 640;
    const isSmallMobile = window.innerWidth <= 400;

    let baseContainerSize = 400;
    let paddingTotal = 64; // 2rem * 2 = 64px

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
          <div className="parameters-toggle-wrapper">
            {showTooltip && (
              <div className="parameter-tooltip">
                Parameters cannot be changed during simulation
              </div>
            )}
            <button
              className={`parameters-toggle ${isSimulating ? 'disabled' : ''}`}
              onClick={handleParametersToggle}
            >
              Parameters
              <svg className="toggle-icon" width="12" height="8" viewBox="0 0 12 8" fill="none">
                {showParameters ? (
                  <path d="M1 7L6 2L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </button>
          </div>

          {showParameters && (
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
          )}

          <div className="button-group">
            <button className="randomize-button" onClick={randomizeFeatures}>
              Randomize
            </button>
            <button className="simulate-button" onClick={toggleSimulation}>
              {isSimulating ? 'Stop' : 'Simulate'}
            </button>
          </div>
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
                  height: `${gridConfig.nodeSize}px`,
                  background: getNodeColor(node)
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
