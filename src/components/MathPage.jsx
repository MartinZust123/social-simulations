import { useState, useEffect } from 'react';
import RGBDemo from './RGBDemo';

function MathPage() {
  const [mathMode, setMathMode] = useState('basic');

  return (
    <main className="math-content">
      <div className="mode-selector" style={{ marginBottom: '2rem' }}>
        <button
          className={`mode-button ${mathMode === 'basic' ? 'active' : ''}`}
          onClick={() => setMathMode('basic')}
        >
          Basic
        </button>
        <button
          className={`mode-button ${mathMode === 'interpretable' ? 'active' : ''}`}
          onClick={() => setMathMode('interpretable')}
        >
          Interpretable
        </button>
      </div>

      {mathMode === 'basic' && (
        <>
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
        </>
      )}

      {mathMode === 'interpretable' && (
        <>
          <div className="math-section">
            <h2 className="math-heading">Introduction</h2>
            <p className="math-text">
              The Interpretable mode adapts Axelrod's cultural dissemination model to work with meaningful,
              human-understandable features like political ideology, environmental concern, or cultural openness.
              Instead of abstract numerical features, each dimension represents a real-world characteristic with
              named states and visual color representations.
            </p>
            <p className="math-text">
              This mode introduces <strong>correlations between features</strong> and <strong>ordered vs. unordered features</strong>,
              making the model more realistic for studying how interconnected cultural traits evolve together.
            </p>
          </div>

          <div className="math-section">
            <h2 className="math-heading">Feature Types</h2>
            <div className="parameter-list">
              <div className="parameter-item">
                <strong>Ordered Features (Spectrum):</strong> Features with a natural progression or intensity
                (e.g., "Low" → "Medium" → "High"). These features support gradual transitions and correlations.
              </div>
              <div className="parameter-item">
                <strong>Unordered Features (Categorical):</strong> Features with distinct categories without inherent order
                (e.g., "Western", "Eastern", "African"). These are adopted completely during interaction.
              </div>
            </div>
          </div>

          <div className="math-section">
            <h2 className="math-heading">Randomization with Correlations</h2>
            <p className="math-text">
              When initializing the grid, feature values are assigned based on correlations:
            </p>
            <div className="rule-steps">
              <div className="rule-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Unordered Features:</strong> Each state is selected with uniform probability.
                </div>
              </div>
              <div className="rule-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Anchor Feature:</strong> One ordered feature is randomly selected as the "anchor"
                  and assigned a uniformly random state.
                </div>
              </div>
              <div className="rule-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Correlated Features:</strong> For other ordered features, state probabilities depend
                  on the correlation coefficient (-1 to +1):
                  <div className="formula">
                    r<sub>i</sub> = i / (q - 1) &nbsp;&nbsp;(normalize state index to 0-1 range)
                  </div>
                  <div className="formula">
                    distance = |r<sub>anchor</sub> - r<sub>i</sub>|
                  </div>
                  <div className="formula">
                    P(state<sub>i</sub>) = (1 - distance) × (1 + corr) + distance × (1 - corr)
                  </div>
                  <p className="math-text" style={{ marginTop: '0.5rem' }}>
                    Positive correlation (+1): States align with anchor. Negative correlation (-1): States oppose anchor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="math-section">
            <h2 className="math-heading">Simulation Dynamics</h2>
            <p className="math-text">
              The simulation follows these steps at each iteration:
            </p>
            <div className="rule-steps">
              <div className="rule-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Agent Selection:</strong> A random agent and one of its neighbors are selected.
                </div>
              </div>
              <div className="rule-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Interaction Check:</strong> Agents only interact if they share some but not all features.
                </div>
              </div>
              <div className="rule-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Feature Update:</strong> One differing feature is randomly selected, and one agent
                  (the "dominator") influences the other:
                  <ul>
                    <li><strong>Ordered features:</strong> Receiver moves one step (±1) toward dominator's state</li>
                    <li><strong>Unordered features:</strong> Receiver completely adopts dominator's state</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="math-section">
            <h2 className="math-heading">Node Color Representation</h2>
            <p className="math-text">
              Each node's color is determined by <strong>averaging the RGB values</strong> of all its selected feature states:
            </p>
            <div className="formula" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              Node Color = Average(Color<sub>feature1</sub>, Color<sub>feature2</sub>, ..., Color<sub>featureN</sub>)
            </div>
            <p className="math-text">
              For example, if a node has:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Environmental Concern = "High Priority" (RGB: 144, 224, 239)</li>
              <li>Economic Policy = "Mixed Economy" (RGB: 114, 9, 183)</li>
              <li>Cultural Tradition = "Western" (RGB: 67, 97, 238)</li>
            </ul>
            <p className="math-text">
              The node color would be: RGB((144+114+67)/3, (224+9+97)/3, (239+183+238)/3) = RGB(108, 110, 220)
            </p>
            <p className="math-text" style={{ marginTop: '1rem' }}>
              This creates a unique visual signature for each cultural combination, making patterns and clusters
              easily visible in the grid.
            </p>
          </div>

          <div className="math-section">
            <h2 className="math-heading">Absorbing States</h2>
            <p className="math-text">
              Similar to Basic mode, the simulation reaches an absorbing state when no more interactions are possible:
            </p>
            <div className="absorbing-states">
              <div className="state-card">
                <h3>Cultural Convergence</h3>
                <p>Neighboring agents share all features, creating homogeneous cultural regions with similar colors.</p>
              </div>
              <div className="state-card">
                <h3>Cultural Boundaries</h3>
                <p>Neighboring agents differ on all features, forming stable borders between distinct cultural groups with contrasting colors.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default MathPage;
