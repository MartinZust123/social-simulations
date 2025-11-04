import { useState, useMemo, useEffect, useRef } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import SimulationPage from './components/SimulationPage'
import MathPage from './components/MathPage'

function App() {
  const [activeTab, setActiveTab] = useState('simulate');
  const [gridSize, setGridSize] = useState(10);
  const [nodeFeatures, setNodeFeatures] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepTime, setStepTime] = useState(0.001);
  const [q, setQ] = useState(6);
  const [F, setF] = useState(3);
  const intervalRef = useRef(null);
  const [stepCount, setStepCount] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [featureNames, setFeatureNames] = useState({});
  const [valueNames, setValueNames] = useState({});
  const [simulationMode, setSimulationMode] = useState('basic'); // 'basic' or 'interpretable'
  const [interpretableFeatures, setInterpretableFeatures] = useState([
    { name: '', states: [{ name: '', color: '#3b82f6' }], hasOrder: false }
  ]); // For interpretable mode
  const [featureCorrelations, setFeatureCorrelations] = useState({}); // For interpretable mode correlations

  // Randomize cultural features for all nodes
  const randomizeFeatures = () => {
    const features = {};
    for (let i = 0; i < gridSize * gridSize; i++) {
      features[i] = Array.from({ length: F }, () => Math.floor(Math.random() * q));
    }
    setNodeFeatures(features);
    setStepCount(0);
    setMetrics(null);
  };

  // Randomize on initial render
  useEffect(() => {
    randomizeFeatures();
  }, []);

  // Get RGB color from node features
  const getNodeColor = (nodeId) => {
    const features = nodeFeatures[nodeId];
    if (!features) return '#3b82f6';

    let r, g, b;

    if (F === 1) {
      r = Math.floor((features[0] / (q - 1)) * 255);
      g = 128;
      b = 128;
    } else if (F === 2) {
      r = Math.floor((features[0] / (q - 1)) * 255);
      g = Math.floor((features[1] / (q - 1)) * 255);
      b = 128;
    } else {
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

    if (row > 0) neighbors.push(nodeId - gridSize);
    if (row < gridSize - 1) neighbors.push(nodeId + gridSize);
    if (col > 0) neighbors.push(nodeId - 1);
    if (col < gridSize - 1) neighbors.push(nodeId + 1);

    return neighbors;
  };

  // Check if two nodes can interact
  const canInteract = (features1, features2) => {
    let commonCount = 0;
    for (let i = 0; i < F; i++) {
      if (features1[i] === features2[i]) commonCount++;
    }
    return commonCount > 0 && commonCount < F;
  };

  // Check if simulation has reached absorbing state
  const checkAbsorbingState = (features) => {
    const totalNodes = gridSize * gridSize;

    for (let nodeId = 0; nodeId < totalNodes; nodeId++) {
      const neighbors = getNeighbors(nodeId);
      const nodeFeats = features[nodeId];

      for (const neighborId of neighbors) {
        const neighborFeats = features[neighborId];
        if (canInteract(nodeFeats, neighborFeats)) {
          return false;
        }
      }
    }

    return true;
  };

  // Calculate metrics when simulation ends
  const calculateMetrics = (features, currentSteps) => {
    const totalNodes = gridSize * gridSize;

    // 1. Count unique cultures
    const cultureSet = new Set();
    Object.values(features).forEach(feats => {
      cultureSet.add(JSON.stringify(feats));
    });
    const uniqueCultures = cultureSet.size;

    // 2. Find largest domain size
    const visited = new Set();
    let largestDomainSize = 0;

    const bfs = (startNode) => {
      const queue = [startNode];
      visited.add(startNode);
      let domainSize = 1;
      const startFeatures = JSON.stringify(features[startNode]);

      while (queue.length > 0) {
        const node = queue.shift();
        const neighbors = getNeighbors(node);

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && JSON.stringify(features[neighbor]) === startFeatures) {
            visited.add(neighbor);
            queue.push(neighbor);
            domainSize++;
          }
        }
      }

      return domainSize;
    };

    for (let nodeId = 0; nodeId < totalNodes; nodeId++) {
      if (!visited.has(nodeId)) {
        const domainSize = bfs(nodeId);
        largestDomainSize = Math.max(largestDomainSize, domainSize);
      }
    }

    // 3. Calculate average cultural distance
    let totalDistance = 0;
    let neighborPairCount = 0;

    for (let nodeId = 0; nodeId < totalNodes; nodeId++) {
      const neighbors = getNeighbors(nodeId);
      const nodeFeats = features[nodeId];

      for (const neighborId of neighbors) {
        if (neighborId > nodeId) { // Count each pair only once
          const neighborFeats = features[neighborId];
          let differences = 0;
          for (let i = 0; i < F; i++) {
            if (nodeFeats[i] !== neighborFeats[i]) {
              differences++;
            }
          }
          totalDistance += differences / F; // Normalize to 0-1
          neighborPairCount++;
        }
      }
    }

    const avgCulturalDistance = neighborPairCount > 0 ? totalDistance / neighborPairCount : 0;

    return {
      totalSteps: currentSteps,
      uniqueCultures,
      largestDomainSize,
      largestDomainPercentage: ((largestDomainSize / totalNodes) * 100).toFixed(1),
      avgCulturalDistance: avgCulturalDistance.toFixed(3)
    };
  };

  // Perform one simulation step
  const simulationStep = () => {
    setNodeFeatures((prevFeatures) => {
      if (Object.keys(prevFeatures).length === 0) return prevFeatures;

      if (checkAbsorbingState(prevFeatures)) {
        setIsSimulating(false);
        // Use callback to get the latest stepCount
        setStepCount(currentSteps => {
          const finalMetrics = calculateMetrics(prevFeatures, currentSteps);
          setMetrics(finalMetrics);
          return currentSteps;
        });
        return prevFeatures;
      }

      setStepCount(prev => prev + 1);

      const totalNodes = gridSize * gridSize;
      const randomNode = Math.floor(Math.random() * totalNodes);

      const neighbors = getNeighbors(randomNode);
      if (neighbors.length === 0) return prevFeatures;
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

      const node1Features = prevFeatures[randomNode];
      const node2Features = prevFeatures[randomNeighbor];

      const differences = [];
      let commonCount = 0;
      for (let i = 0; i < F; i++) {
        if (node1Features[i] === node2Features[i]) {
          commonCount++;
        } else {
          differences.push(i);
        }
      }

      if (differences.length === 0 || differences.length === F) {
        return prevFeatures;
      }

      const interactionProbability = commonCount / F;
      if (Math.random() > interactionProbability) {
        return prevFeatures;
      }

      const selectedFeatureIndex = differences[Math.floor(Math.random() * differences.length)];

      const dominator = Math.random() < 0.5 ? randomNode : randomNeighbor;
      const receiver = dominator === randomNode ? randomNeighbor : randomNode;

      const newFeatures = { ...prevFeatures };
      newFeatures[receiver] = [...prevFeatures[receiver]];
      newFeatures[receiver][selectedFeatureIndex] = prevFeatures[dominator][selectedFeatureIndex];

      return newFeatures;
    });
  };

  // Effect to handle simulation interval
  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(() => {
        simulationStep();
      }, stepTime * 1000);
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

  // Memoize grid configuration
  const gridConfig = useMemo(() => {
    const nodes = Array.from({ length: gridSize * gridSize }, (_, i) => i);

    const isMobile = window.innerWidth <= 640;
    const isSmallMobile = window.innerWidth <= 400;

    let baseContainerSize = 400;
    let paddingTotal = 64;

    if (isSmallMobile) {
      baseContainerSize = Math.min(window.innerWidth * 0.85, 350);
      paddingTotal = 32;
    } else if (isMobile) {
      baseContainerSize = Math.min(window.innerWidth * 0.9, 400);
      paddingTotal = 48;
    }

    const containerSize = baseContainerSize - paddingTotal;

    const cellSize = containerSize / gridSize;
    const gapSize = Math.max(4, Math.min(cellSize * 0.15, 24));
    const totalGapSpace = gapSize * (gridSize - 1);
    const availableSpace = containerSize - totalGapSpace;
    const nodeSize = Math.floor(availableSpace / gridSize);

    return { nodes, gapSize, nodeSize };
  }, [gridSize]);

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <header className="header">
        <h1 className="title">Social Simulations Made Simple</h1>
        <p className="subtitle">Inspired by Axelrod's model of social dynamics</p>
      </header>

      {activeTab === 'simulate' && (
        <SimulationPage
          gridSize={gridSize}
          setGridSize={setGridSize}
          stepTime={stepTime}
          setStepTime={setStepTime}
          q={q}
          setQ={setQ}
          F={F}
          setF={setF}
          nodeFeatures={nodeFeatures}
          setNodeFeatures={setNodeFeatures}
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
          getNodeColor={getNodeColor}
          gridConfig={gridConfig}
          randomizeFeatures={randomizeFeatures}
          metrics={metrics}
          featureNames={featureNames}
          setFeatureNames={setFeatureNames}
          valueNames={valueNames}
          setValueNames={setValueNames}
          simulationMode={simulationMode}
          setSimulationMode={setSimulationMode}
          interpretableFeatures={interpretableFeatures}
          setInterpretableFeatures={setInterpretableFeatures}
          featureCorrelations={featureCorrelations}
          setFeatureCorrelations={setFeatureCorrelations}
        />
      )}

      {activeTab === 'math' && <MathPage />}
    </div>
  )
}

export default App
