import { Link } from 'react-router-dom';
import './CaseStudiesPage.css';

function GridSizeCaseStudy() {
  return (
    <main className="math-content">
      <div className="math-section">
        <Link to="/case-studies" className="back-to-case-studies">
          ← Back to Case Studies
        </Link>
        <h2 className="math-heading">Population Size and Consensus: Does a Bigger Parliament Debate Longer?</h2>
        <p className="math-text" style={{fontSize: '1.1rem', color: '#3b82f6', fontWeight: '600', fontStyle: 'italic', marginBottom: '2rem', marginTop: '0.5rem'}}>
          By Martin Žust
        </p>

        <h3 className="math-subheading">The Question</h3>
        <p className="math-text">
          Imagine a parliament with different numbers of representatives. Will increasing the number of representatives increase the probability of consensus? And how much longer will it take a bigger parliament to come to a final stable distribution of opinions compared to a smaller one?
        </p>
        <p className="math-text">
          Before you continue reading, try to answer these two questions:
        </p>
        <div className="math-formula" style={{padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0'}}>
          <ol style={{marginLeft: '1.5rem'}}>
            <li style={{marginBottom: '1rem'}}><strong>Will increasing the number of people in the parliament increase the probability of consensus?</strong></li>
            <li><strong>Will a bigger parliament need longer to finish debating? And with what magnitude will time increase: linear, quadratic, cubic, or even exponential?</strong></li>
          </ol>
        </div>

        <h3 className="math-subheading">Theoretical Analysis</h3>

        <p className="math-text">
          <strong>Probability of Consensus:</strong>
        </p>
        <p className="math-text">
          Let's first think about the probability of consensus. In our case study about the influence of F and q on achieving consensus, we discussed that the only thing preventing consensus is when any two neighbors have no common feature—in other words, nothing to talk about. If we have more agents on the grid, we have a higher probability that there are still two agents with at least one feature in common, bringing us one step closer to consensus.
        </p>
        <p className="math-text">
          From this analysis, it seems that increasing grid size would result in a higher probability of consensus. But on the other hand, it's counterintuitive—smaller communities are often more aligned. Which view is correct? We'll get an answer to these contradictory perspectives in the results section.
        </p>

        <p className="math-text">
          <strong>Time to Convergence:</strong>
        </p>
        <p className="math-text">
          What about time to convergence? Everyone's intuition says that time increases with growing dimensions. But what is the magnitude of this growth?
        </p>
        <p className="math-text">
          Let's think about it systematically. With grid size, the number of agents grows quadratically (N×N), and the number of connections between agents grows similarly—every agent has approximately 4 connections (only a small minority at the edges have 3 or 2, and this percentage decreases with grid size). Since reaching an absorbing state requires each pair of neighbors to reach either consensus or complete disagreement, we might assume that convergence time also grows quadratically.
        </p>
        <p className="math-text">
          But is this assumption correct? Let's find out.
        </p>

        <h3 className="math-subheading">Simulation Methodology</h3>
        <p className="math-text">
          To test these theoretical predictions empirically, we conducted a systematic exploration of population size effects while keeping cultural complexity constant.
        </p>
        <p className="math-text">
          <strong>Parameters:</strong>
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li><strong>Fixed Parameters:</strong> F = 5 features, q = 15 states per feature (constant across all simulations)</li>
          <li><strong>Variable:</strong> Grid sizes from 5×5 to 25×25 (5, 10, 15, 20, 25)</li>
          <li><strong>Population Range:</strong> 25 to 625 agents</li>
          <li><strong>Simulations per Grid Size:</strong> 100 independent runs</li>
          <li><strong>Total Simulations:</strong> 500 runs</li>
        </ul>

        <p className="math-text">
          Each simulation started with randomly initialized cultural configurations and ran until reaching an absorbing state—a configuration where no more cultural change is possible because neighboring agents either share all features or share no features.
        </p>

        <p className="math-text">
          <strong>Metrics Collected:</strong>
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li><strong>Steps to Convergence:</strong> How many interaction steps until no more change is possible</li>
          <li><strong>Probability of Global Consensus:</strong> The fraction of runs that ended with all agents sharing identical cultures</li>
          <li><strong>Number of Unique Cultures:</strong> How many distinct cultural profiles exist at equilibrium</li>
          <li><strong>Largest Domain Size:</strong> The size of the dominant cultural cluster</li>
        </ul>

        <h3 className="math-subheading">Results: Probability of Consensus</h3>
        <p className="math-text">
          Our theoretical analysis suggested that larger grids should have higher consensus probability, and the data confirms this intuition decisively.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/grid-size/bar_global_consensus.png" alt="Bar chart showing probability of global consensus vs grid size" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          The probability of global consensus was only 0.29 (29%) for a 5×5 grid (25 agents) but grew rapidly, reaching 0.90 (90%) by 15×15 (225 agents). The growth then slows but continues increasing, with 20×20 (400 agents) achieving 0.94 (94%) consensus probability, and 25×25 (625 agents) reaching 0.96 (96%).
        </p>
        <p className="math-text">
          Why does this happen? The key insight is that in larger populations, there are more opportunities for cultural bridges to form. Even if many agents start with incompatible cultures, the sheer number of agents increases the likelihood that adjacent pairs will find common ground. These initial agreements then cascade through the network, eventually pulling the entire population toward consensus.
        </p>
        <p className="math-text">
          This finding challenges the common intuition that "smaller communities are more cohesive." While small groups may align faster, they're also more vulnerable to permanent fragmentation. A single incompatible pairing in a small grid can create an insurmountable barrier. In larger populations, there are more pathways around such obstacles.
        </p>

        <h3 className="math-subheading">Results: Convergence Time</h3>
        <p className="math-text">
          As expected, convergence time increases with grid size. But more interestingly, the variability also increases dramatically.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/grid-size/line_convergence_time.png" alt="Line plot showing convergence time vs grid size with error bars" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          The graph shows not only that mean convergence time increases with population size, but that the standard deviation grows dramatically. Small grids (5×5) converge relatively quickly and predictably. Large grids (25×25) take much longer on average, but with enormous variation—some runs converge quickly while others take vastly longer.
        </p>
        <p className="math-text">
          This variability reveals something important: larger populations have more complex dynamics. The path to consensus (or fragmentation) becomes increasingly contingent on the specific initial configuration and the sequence of interactions. Small populations have fewer possible trajectories; large populations have a vast space of possibilities.
        </p>

        <h3 className="math-subheading">Results: Scaling Analysis</h3>
        <p className="math-text">
          Now for the crucial question: <strong>How does convergence time scale with population size?</strong>
        </p>
        <p className="math-text">
          We hypothesized quadratic scaling, reasoning that the number of connections grows as N². But let's see what the data actually shows.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/grid-size/scaling_approximations.png" alt="Comparison of linear, quadratic, cubic and exponential approximations" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          The results are striking: <strong>convergence time scales cubically</strong>, not quadratically! The cubic model (purple dotted line) fits the data nearly perfectly, with an R² value extremely close to 1. Both the quadratic and exponential models fit poorly by comparison, and the linear model is completely inadequate.
        </p>
        <p className="math-text">
          Why cubic scaling? Our initial reasoning only considered direct neighbor-to-neighbor interactions. But cultural influence doesn't stop at immediate neighbors. When agent A influences agent B, and agent B later influences agent C, there's an indirect path of influence from A to C. In a grid, the number of such indirect paths grows faster than the number of direct connections.
        </p>
        <p className="math-text">
          Think of it this way: in a N×N grid, there are N² agents. Each agent can influence its ~4 neighbors directly. But over multiple steps, influence can propagate across the entire grid. The number of possible influence pathways scales approximately as N³, which aligns with our observed cubic convergence time.
        </p>
        <p className="math-text">
          This has important practical implications. If you double the size of your deliberative body (say, from 10×10 to 20×20), you don't just double or quadruple the deliberation time—you increase it by a factor of roughly 8 (2³). Scaling up decision-making bodies is much more expensive than linear intuition would suggest.
        </p>

        <h3 className="math-subheading">Summary Statistics</h3>
        <p className="math-text">
          The following table provides a comprehensive numerical summary of all our findings:
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/grid-size/summary_table.png" alt="Summary statistics table for all grid sizes" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <h3 className="math-subheading">Discussion</h3>
        <p className="math-text">
          Our systematic exploration of population size effects reveals several important insights:
        </p>

        <p className="math-text">
          <strong>1. Larger Populations Favor Consensus</strong>
        </p>
        <p className="math-text">
          Contrary to the intuition that "small groups align better," larger populations are significantly more likely to reach global consensus. This happens because larger grids provide more opportunities for cultural bridges to form, creating multiple pathways around potential deadlocks. The probability of consensus increases from 29% (5×5) to 96% (25×25)—a dramatic improvement.
        </p>

        <p className="math-text">
          <strong>2. Cubic Time Scaling</strong>
        </p>
        <p className="math-text">
          Convergence time scales cubically with grid size, not quadratically as we initially hypothesized. This reflects the importance of indirect influence pathways—culture spreads not just between neighbors, but through chains of interactions across the entire network. This cubic scaling means that doubling population size increases convergence time by a factor of 8.
        </p>

        <p className="math-text">
          <strong>3. Increasing Unpredictability</strong>
        </p>
        <p className="math-text">
          Larger populations show dramatically increased variability in convergence time. While small grids behave predictably, large grids can converge quickly or slowly depending on initial conditions and interaction sequences. This unpredictability makes large-scale consensus-building inherently harder to manage and predict.
        </p>

        <p className="math-text">
          <strong>Real-World Implications:</strong>
        </p>
        <p className="math-text">
          These findings have important implications for the design of deliberative institutions. If you want to maximize the probability of reaching agreement, larger bodies are better—but be prepared to wait. The time cost grows cubically, and outcomes become harder to predict. This suggests a fundamental trade-off in institutional design:
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li><strong>Small deliberative bodies:</strong> Fast, predictable, but prone to permanent deadlock</li>
          <li><strong>Large deliberative bodies:</strong> More likely to reach consensus, but much slower and less predictable</li>
        </ul>
        <p className="math-text">
          Perhaps this explains why effective legislatures often use committee systems—small groups for fast deliberation, with mechanisms to escalate to larger bodies when necessary. The committee does the quick exploration; the full body provides the resilience against deadlock.
        </p>

        <h3 className="math-subheading">Conclusions</h3>
        <p className="math-text">
          Our investigation of population size effects in Axelrod's model reveals fundamental insights about how the scale of social interactions affects cultural dynamics:
        </p>

        <p className="math-text">
          <strong>Consensus favors scale:</strong> Larger populations are substantially more likely to reach global consensus. The probability increases from below 30% in small populations (25 agents) to over 95% in large ones (625 agents). This happens because larger populations provide more opportunities for cultural bridges to form, creating multiple pathways around potential deadlocks.
        </p>

        <p className="math-text">
          <strong>Time costs scale cubically:</strong> The time required to reach equilibrium grows as the cube of the grid dimension (N³). This cubic scaling—rather than the quadratic (N²) scaling we initially hypothesized—reflects the importance of indirect influence pathways. Cultural change propagates not just between neighbors, but through chains of interactions spanning the entire network. This means doubling the population size roughly octuples the convergence time.
        </p>

        <p className="math-text">
          <strong>Predictability decreases with scale:</strong> Larger populations show dramatically increased variability in convergence time. While small populations behave relatively predictably, large populations can take vastly different amounts of time to converge depending on initial conditions and interaction sequences. This inherent unpredictability makes large-scale consensus-building harder to manage and forecast.
        </p>

        <p className="math-text">
          <strong>The fundamental trade-off:</strong> These findings reveal a fundamental tension in the design of deliberative institutions and communities. Larger groups are more resilient against permanent fragmentation and more likely to eventually agree, but they require patience and tolerance for uncertainty. Smaller groups are faster and more predictable, but more vulnerable to insurmountable divisions.
        </p>

        <p className="math-text">
          Understanding this trade-off helps explain many real-world institutional designs—from the committee structures of legislatures to the team sizes in organizations to the structure of online communities. The optimal scale depends on your priorities: if you need quick decisions and can tolerate some risk of deadlock, keep groups small. If consensus is paramount and you can afford to wait, scale up.
        </p>

        <p className="math-text">
          Perhaps most importantly, the cubic scaling law suggests that there may be a "sweet spot" for deliberative body size—large enough to avoid easy deadlocks, but not so large that convergence becomes prohibitively slow. Finding this balance is one of the eternal challenges of institutional design.
        </p>
      </div>
    </main>
  );
}

export default GridSizeCaseStudy;
