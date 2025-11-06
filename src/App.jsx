import { useState, useMemo, useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import SimulationPage from './components/SimulationPage'
import MathPage from './components/MathPage'

function App() {
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

  // Clear metrics when switching simulation modes to prevent duplicate saves
  useEffect(() => {
    setMetrics(null);
  }, [simulationMode]);

  // Helper: Convert state index to r value (0 to 1)
  const indexToR = (index, totalStates) => {
    if (totalStates === 1) return 0;
    return index / (totalStates - 1);
  };

  // Helper: Parse hex color to RGB array
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [59, 130, 246]; // Default blue
  };

  // Randomize for Interpretable mode
  const randomizeInterpretableFeatures = () => {
    const features = {};
    const numNodes = gridSize * gridSize;

    for (let nodeId = 0; nodeId < numNodes; nodeId++) {
      const nodeStates = [];

      // Separate features by type
      const nonSpectrumFeatures = interpretableFeatures
        .map((f, idx) => ({ feature: f, index: idx }))
        .filter(({ feature }) => !feature.hasOrder);

      const spectrumFeatures = interpretableFeatures
        .map((f, idx) => ({ feature: f, index: idx }))
        .filter(({ feature }) => feature.hasOrder);

      // Initialize nodeStates array
      for (let i = 0; i < interpretableFeatures.length; i++) {
        nodeStates.push(null);
      }

      // Step 1: Randomly choose non-spectrum features
      nonSpectrumFeatures.forEach(({ feature, index }) => {
        const randomStateIndex = Math.floor(Math.random() * feature.states.length);
        nodeStates[index] = randomStateIndex;
      });

      // Step 2: Randomly select anchor spectrum feature and its state
      if (spectrumFeatures.length > 0) {
        const anchorIdx = Math.floor(Math.random() * spectrumFeatures.length);
        const anchorFeature = spectrumFeatures[anchorIdx];
        const anchorStateIndex = Math.floor(Math.random() * anchorFeature.feature.states.length);
        nodeStates[anchorFeature.index] = anchorStateIndex;

        const anchorR = indexToR(anchorStateIndex, anchorFeature.feature.states.length);

        // Step 3: For other spectrum features, calculate correlated probabilities
        spectrumFeatures.forEach(({ feature, index }, idx) => {
          if (idx === anchorIdx) return; // Skip anchor

          const numStates = feature.states.length;
          const correlationKey = anchorFeature.index < index
            ? `${anchorFeature.index}-${index}`
            : `${index}-${anchorFeature.index}`;
          const correlation = featureCorrelations[correlationKey] ?? 0;

          // Calculate P for each state
          const probabilities = [];
          for (let stateIdx = 0; stateIdx < numStates; stateIdx++) {
            const stateR = indexToR(stateIdx, numStates);
            const distance = Math.abs(anchorR - stateR);
            const P = (1 - distance) * (1 + correlation) + distance * (1 - correlation);
            probabilities.push(P);
          }

          // Normalize probabilities
          const sumP = probabilities.reduce((sum, p) => sum + p, 0);
          const normalizedProbs = sumP > 0
            ? probabilities.map(p => p / sumP)
            : probabilities.map(() => 1 / numStates); // Fallback to uniform

          // Choose state based on probability
          const rand = Math.random();
          let cumulative = 0;
          let chosenState = 0;
          for (let stateIdx = 0; stateIdx < numStates; stateIdx++) {
            cumulative += normalizedProbs[stateIdx];
            if (rand <= cumulative) {
              chosenState = stateIdx;
              break;
            }
          }
          nodeStates[index] = chosenState;
        });
      }

      features[nodeId] = nodeStates;
    }

    setNodeFeatures(features);
    setStepCount(0);
    setMetrics(null);
  };

  // Randomize cultural features for all nodes (Basic mode)
  const randomizeFeatures = () => {
    if (simulationMode === 'interpretable') {
      randomizeInterpretableFeatures();
      return;
    }

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

    // Interpretable mode: average RGB of chosen state colors
    if (simulationMode === 'interpretable') {
      const rgbValues = [];

      features.forEach((stateIndex, featureIdx) => {
        if (stateIndex !== null && interpretableFeatures[featureIdx]) {
          const state = interpretableFeatures[featureIdx].states[stateIndex];
          if (state && state.color) {
            rgbValues.push(hexToRgb(state.color));
          }
        }
      });

      if (rgbValues.length === 0) return '#3b82f6';

      // Average RGB components
      const avgR = Math.floor(rgbValues.reduce((sum, rgb) => sum + rgb[0], 0) / rgbValues.length);
      const avgG = Math.floor(rgbValues.reduce((sum, rgb) => sum + rgb[1], 0) / rgbValues.length);
      const avgB = Math.floor(rgbValues.reduce((sum, rgb) => sum + rgb[2], 0) / rgbValues.length);

      return `rgb(${avgR}, ${avgG}, ${avgB})`;
    }

    // Basic mode: existing logic
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
    const numFeatures = simulationMode === 'interpretable' ? interpretableFeatures.length : F;
    let commonCount = 0;
    for (let i = 0; i < numFeatures; i++) {
      if (features1[i] === features2[i]) commonCount++;
    }
    return commonCount > 0 && commonCount < numFeatures;
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

    const numFeatures = simulationMode === 'interpretable' ? interpretableFeatures.length : F;

    for (let nodeId = 0; nodeId < totalNodes; nodeId++) {
      const neighbors = getNeighbors(nodeId);
      const nodeFeats = features[nodeId];

      for (const neighborId of neighbors) {
        if (neighborId > nodeId) { // Count each pair only once
          const neighborFeats = features[neighborId];
          let differences = 0;
          for (let i = 0; i < numFeatures; i++) {
            if (nodeFeats[i] !== neighborFeats[i]) {
              differences++;
            }
          }
          totalDistance += differences / numFeatures; // Normalize to 0-1
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

      const numFeatures = simulationMode === 'interpretable' ? interpretableFeatures.length : F;

      const differences = [];
      let commonCount = 0;
      for (let i = 0; i < numFeatures; i++) {
        if (node1Features[i] === node2Features[i]) {
          commonCount++;
        } else {
          differences.push(i);
        }
      }

      if (differences.length === 0 || differences.length === numFeatures) {
        return prevFeatures;
      }

      const interactionProbability = commonCount / numFeatures;
      if (Math.random() > interactionProbability) {
        return prevFeatures;
      }

      const selectedFeatureIndex = differences[Math.floor(Math.random() * differences.length)];

      const dominator = Math.random() < 0.5 ? randomNode : randomNeighbor;
      const receiver = dominator === randomNode ? randomNeighbor : randomNode;

      const newFeatures = { ...prevFeatures };
      newFeatures[receiver] = [...prevFeatures[receiver]];

      // Interpretable mode: handle ordered features with one-step transition
      if (simulationMode === 'interpretable') {
        const feature = interpretableFeatures[selectedFeatureIndex];

        if (feature.hasOrder) {
          // Ordered feature: move one step toward dominator
          const dominatorState = prevFeatures[dominator][selectedFeatureIndex];
          const receiverState = prevFeatures[receiver][selectedFeatureIndex];

          if (dominatorState > receiverState) {
            // Move up one step
            newFeatures[receiver][selectedFeatureIndex] = receiverState + 1;
          } else if (dominatorState < receiverState) {
            // Move down one step
            newFeatures[receiver][selectedFeatureIndex] = receiverState - 1;
          }
          // If equal, no change (shouldn't happen since they differ)
        } else {
          // Non-ordered feature: adopt completely
          newFeatures[receiver][selectedFeatureIndex] = prevFeatures[dominator][selectedFeatureIndex];
        }
      } else {
        // Basic mode: adopt completely
        newFeatures[receiver][selectedFeatureIndex] = prevFeatures[dominator][selectedFeatureIndex];
      }

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
      <Navbar />

      <header className="header">
        <h1 className="title">Social Simulations Made Simple</h1>
        <p className="subtitle">Inspired by Axelrod's model of social dynamics</p>
      </header>

      <Routes>
        <Route path="/" element={
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
        } />
        <Route path="/math-behind" element={<MathPage />} />
        <Route path="/case-studies" element={<MathPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
