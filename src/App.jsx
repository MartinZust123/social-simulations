import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('simulate');
  const gridSize = 4;
  const nodes = Array.from({ length: gridSize * gridSize }, (_, i) => i);

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
        <div className="grid-container">
          {nodes.map((node) => (
            <div key={node} className="node-wrapper">
              <div className="node"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
