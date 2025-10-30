import { useState, useEffect } from 'react';
import RGBDemo from './RGBDemo';

function MathPage() {
  return (
    <main className="math-content">
      <div className="math-section">
        <h2 className="math-heading">Introduction</h2>
        <p className="math-text">
          Axelrod's model of cultural dissemination explores how cultures evolve and spread through social interactions.
          This simulation demonstrates how simple local interactions between neighbors can lead to complex global patterns
          of cultural unity or polarization.
        </p>
        <p className="math-text">
          Understanding these dynamics helps explain real-world phenomena like the formation of cultural regions,
          political polarization, and the persistence of cultural diversity even in highly connected societies.
        </p>
      </div>

      <div className="math-section">
        <h2 className="math-heading">Model Parameters</h2>
        <div className="parameter-list">
          <div className="parameter-item">
            <strong>Grid Size (N×N):</strong> The number of agents (people) in the simulation, arranged in a square grid.
          </div>
          <div className="parameter-item">
            <strong>F (Cultural Features):</strong> The number of independent cultural traits each agent possesses
            (e.g., language, religion, customs, values).
          </div>
          <div className="parameter-item">
            <strong>q (Possible States):</strong> The number of different values each cultural feature can take,
            representing cultural variety (values from 0 to q-1).
          </div>
          <div className="parameter-item">
            <strong>Step Time:</strong> The speed at which simulation iterations occur, controlling how fast the simulation runs.
          </div>
        </div>
      </div>

      <div className="math-section">
        <h2 className="math-heading">Simulation Steps</h2>
        <p className="math-text">
          Each iteration of the simulation consists of the following steps:
        </p>
        <div className="rule-steps">
          <div className="rule-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Random Agent Selection:</strong> A random agent i is selected from the grid with uniform probability.
            </div>
          </div>
          <div className="rule-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Random Neighbor Selection:</strong> A random neighbor j is selected from agent i's von Neumann neighborhood
              (up, down, left, right - if they exist).
            </div>
          </div>
          <div className="rule-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Cultural Similarity Calculation:</strong> Count the number of shared features between agents i and j.
              <div className="formula">similarity = (number of shared features) / F</div>
            </div>
          </div>
          <div className="rule-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>Interaction Condition:</strong> Agents only interact if they share some but not all features
              (0 &lt; differences &lt; F).
              <div className="formula">P(interaction) = similarity</div>
            </div>
          </div>
          <div className="rule-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <strong>Feature Adoption:</strong> If interaction occurs:
              <ul>
                <li>Randomly select one of the differing features</li>
                <li>Randomly select a "dominator" agent (50/50 chance)</li>
                <li>Copy the dominator's feature value to the other agent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="math-section">
        <h2 className="math-heading">Absorbing States</h2>
        <p className="math-text">
          The simulation reaches an <strong>absorbing state</strong> when no more interactions are possible.
          This occurs when all neighboring pairs are either:
        </p>
        <div className="absorbing-states">
          <div className="state-card">
            <h3>Cultural Unity</h3>
            <p>All neighbors are identical (all F features match). The entire grid or regions converge to homogeneous cultures.</p>
          </div>
          <div className="state-card">
            <h3>Cultural Polarization</h3>
            <p>All neighbors are completely different (all F features differ). Stable cultural boundaries form between distinct groups.</p>
          </div>
        </div>
      </div>

      <RGBDemo />
    </main>
  );
}

export default MathPage;
