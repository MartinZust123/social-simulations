import { Link } from 'react-router-dom';
import './CaseStudiesPage.css';

function OrderedRatioCaseStudy() {
  return (
    <main className="math-content">
      <div className="math-section">
        <Link to="/case-studies" className="back-to-case-studies">
          ← Back to Case Studies
        </Link>
        <h2 className="math-heading">Ordered vs Unordered Features: How Cultural Traits Change</h2>

        <h3 className="math-subheading">The Question</h3>
        <p className="math-text">
          Imagine two neighbors discussing politics. One starts as slightly left-leaning, the other as moderately right-leaning. Over time, they talk and influence each other. How does their political ideology change? Does it shift gradually along the political spectrum, moving one step at a time? Or does one suddenly "convert" and completely adopt the other's views?
        </p>
        <p className="math-text">
          Now imagine the same neighbors discussing which smartphone operating system they prefer: iOS or Android. When one influences the other, does the change happen gradually through intermediate states? Or is it an all-or-nothing switch?
        </p>
        <p className="math-text">
          These two scenarios reveal a fundamental difference in how cultural traits spread:
        </p>
        <ul className="math-text" style={{marginLeft: '2rem', marginTop: '0.5rem'}}>
          <li><strong>Spectrum features</strong> (like political ideology, religiosity, or environmental concern) change gradually through intermediate positions</li>
          <li><strong>Categorical features</strong> (like language, nationality, or technology choice) change completely in one step</li>
        </ul>
        <p className="math-text">
          What happens when some cultural features change gradually while others change instantly? How does the ratio of these two types of features affect whether a society reaches consensus or fragments into isolated groups?
        </p>

        <h3 className="math-subheading">The Puzzle: Ordered vs Unordered</h3>
        <p className="math-text">
          We can classify cultural features into two types:
        </p>
        <div className="math-formula" style={{padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0'}}>
          <div style={{marginBottom: '1rem'}}>
            <strong>1. Ordered (Spectrum) Features:</strong><br/>
            Political ideology: far-left → center-left → centrist → center-right → far-right
          </div>
          <div>
            <strong>2. Unordered (Categorical) Features:</strong><br/>
            Language: Spanish → English (no intermediate)
          </div>
        </div>
        <p className="math-text">
          <strong>The puzzle:</strong> Which configuration leads to faster consensus?
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li>100% ordered features (everything changes gradually)?</li>
          <li>0% ordered features (everything changes instantly)?</li>
          <li>Or somewhere in between?</li>
        </ul>

        <h3 className="math-subheading">Theoretical Intuition</h3>
        <p className="math-text">
          Before looking at the empirical results, let's consider what we might expect:
        </p>
        <p className="math-text">
          <strong>For Ordered Features (Gradual Change):</strong>
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li><strong>Pros:</strong> Creates "cultural bridges" through intermediate states</li>
          <li><strong>Cons:</strong> Takes many steps to fully align (must go A→B→C→D→E→F→G)</li>
          <li><strong>Prediction:</strong> Slower convergence but more persistent diversity?</li>
        </ul>
        <p className="math-text">
          <strong>For Unordered Features (Instant Change):</strong>
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li><strong>Pros:</strong> Quick alignment when influence occurs</li>
          <li><strong>Cons:</strong> All-or-nothing dynamics, no middle ground</li>
          <li><strong>Prediction:</strong> Faster convergence but possible deadlock?</li>
        </ul>

        <h3 className="math-subheading">Simulation Methodology</h3>
        <p className="math-text">
          To test these predictions empirically, we conducted a comprehensive series of simulations using an interpretable variant of Axelrod's model.
        </p>
        <p className="math-text">
          <strong>Parameters:</strong>
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li><strong>Grid Size:</strong> 10×10 (100 agents)</li>
          <li><strong>Total Features:</strong> 5 (constant across all configurations)</li>
          <li><strong>States per Feature:</strong> 7 (State A through State G)</li>
          <li><strong>Ratio Configurations:</strong> 6 configurations testing different mixes
            <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem'}}>
              <li>100% ordered (5 ordered, 0 unordered)</li>
              <li>80% ordered (4 ordered, 1 unordered)</li>
              <li>60% ordered (3 ordered, 2 unordered)</li>
              <li>40% ordered (2 ordered, 3 unordered)</li>
              <li>20% ordered (1 ordered, 4 unordered)</li>
              <li>0% ordered (0 ordered, 5 unordered)</li>
            </ul>
          </li>
          <li><strong>Simulations per Configuration:</strong> 200 runs</li>
          <li><strong>Total Simulations:</strong> 1,200 runs</li>
        </ul>

        <p className="math-text">
          <strong>Key Innovation - Different Adoption Rules:</strong>
        </p>
        <p className="math-text">
          When two neighboring agents interact:
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li><strong>Ordered features:</strong> Receiver moves ONE STEP toward dominator
            <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem'}}>
              <li>Example: If dominator has State E and receiver has State B, receiver moves to State C</li>
            </ul>
          </li>
          <li><strong>Unordered features:</strong> Receiver COMPLETELY adopts dominator's state
            <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem'}}>
              <li>Example: If dominator has Type E and receiver has Type B, receiver jumps to Type E</li>
            </ul>
          </li>
        </ul>

        <p className="math-text">
          <strong>Metrics Collected:</strong>
        </p>
        <ul className="math-text" style={{marginLeft: '2rem'}}>
          <li><strong>Steps to Convergence:</strong> How many interaction steps until no more change is possible</li>
          <li><strong>Number of Unique Cultures:</strong> How many distinct cultural profiles exist at equilibrium (1 = complete consensus, 100 = maximum diversity)</li>
        </ul>

        <h3 className="math-subheading">Results: Convergence Speed</h3>
        <p className="math-text">
          Let's first examine how the ratio of ordered to unordered features affects the speed at which the system reaches equilibrium.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/line_convergence_time.png" alt="Line plot showing convergence time vs ordered features ratio" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          <strong>Does ordered or unordered converge faster?</strong> Surprisingly, we see that the more ordered features we have, the faster the convergence happens. This is counterintuitive at first glance, since ordered features require multiple steps to fully align (going from State A to State G requires six intermediate changes).
        </p>
        <p className="math-text">
          However, the key insight lies in the stability of gradual change. When a neighbor tries to influence someone with an ordered feature, the change is incremental. If another neighbor later tries to pull them in a different direction, they also move back slowly. This creates a kind of "cultural inertia" that, paradoxically, leads to faster overall convergence.
        </p>
        <p className="math-text">
          Think of it like this: people who are somewhat skeptical and change their opinions gradually may take more conversations to shift their views, but once they do change, those new positions are more stable. This stability ultimately speeds up the convergence process across the entire society.
        </p>

        <h3 className="math-subheading">Results: Cultural Diversity</h3>
        <p className="math-text">
          Now let's examine how the ratio affects the number of distinct cultures that persist at equilibrium.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/bar_unique_cultures.png" alt="Bar chart showing unique cultures vs ordered features ratio" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          <strong>Which ratio produces most diversity?</strong> The results show that 100% ordered features produce a slight spike in cultural diversity, while all other ratios produce similar amounts of diversity. This is an intriguing pattern that warrants closer examination.
        </p>
        <p className="math-text">
          <strong>Does gradual change preserve more intermediate cultures?</strong> Yes, it does, but the difference is not dramatic. When all features change gradually, the intermediate states along the spectrum (like "center-left" or "moderate conservative") persist longer and are more likely to survive until equilibrium. This creates slightly more distinct cultural profiles in the final state.
        </p>
        <p className="math-text">
          However, the similarity across most ratios (20% through 80% ordered) suggests that the dynamics are surprisingly robust. Whether you have mostly gradual change or mostly instant change, the final cultural diversity is comparable. It's only at the extreme of 100% gradual change that we see notably more diversity preserved.
        </p>

        <h3 className="math-subheading">Discussion</h3>
        <p className="math-text">
          Our systematic exploration of ordered versus unordered features reveals several key findings:
        </p>

        <p className="math-text">
          <strong>1. Gradual Change Accelerates Convergence</strong>
        </p>
        <p className="math-text">
          Contrary to initial intuition, having more ordered (gradually-changing) features leads to faster convergence. The mechanism appears to be stability: gradual changes create more stable intermediate positions that resist being pulled in multiple directions. This "cultural inertia" paradoxically speeds up the overall convergence process by reducing oscillations and flip-flopping between states.
        </p>

        <p className="math-text">
          <strong>2. Modest Impact on Cultural Diversity</strong>
        </p>
        <p className="math-text">
          While 100% ordered features do preserve slightly more diverse cultures, the effect is surprisingly modest. This suggests that the binary distinction between gradual and instant change matters less for final diversity than we might expect. The intermediate states created by gradual change do persist, but not dramatically more than in mixed configurations.
        </p>

        <p className="math-text">
          <strong>Real-World Implications:</strong>
        </p>
        <p className="math-text">
          These findings have important implications for understanding real societies. Consider modern political discourse: issues like climate change policy, healthcare reform, and economic regulation can be viewed as spectrum features (with many intermediate positions), while issues like constitutional amendments or binary policy choices (e.g., Brexit: leave or remain) function as categorical features.
        </p>
        <p className="math-text">
          Our results suggest that societies with more "spectrum-like" cultural traits may actually reach consensus faster, not slower. The gradual nature of change creates stability that facilitates convergence. However, this convergence doesn't necessarily mean uniformity—the 100% ordered configuration preserves slightly more cultural diversity, suggesting that gradual change allows for a richer tapestry of intermediate positions.
        </p>
        <p className="math-text">
          This also has implications for understanding polarization. When we force complex spectrum issues into binary choices (effectively converting ordered features into unordered ones), we may not only lose nuance but also potentially slow down social consensus-building. The all-or-nothing dynamics of categorical features can create deadlocks where neither side budges.
        </p>

        <h3 className="math-subheading">Conclusions</h3>
        <p className="math-text">
          Our simulations reveal the nuanced role that different types of cultural change play in social dynamics:
        </p>

        <p className="math-text">
          <strong>The role of gradual change:</strong> Ordered features that change through intermediate steps create stability and, counterintuitively, accelerate convergence. They also preserve slightly more cultural diversity by allowing intermediate positions to persist. Gradual change acts as a stabilizing force that facilitates consensus while maintaining some variation.
        </p>

        <p className="math-text">
          <strong>The role of instant change:</strong> Unordered features that change completely in one step create more volatile dynamics. While they allow for rapid individual-level changes, the all-or-nothing nature can create instabilities that slow overall convergence. They also tend to eliminate intermediate positions, leading to slightly more homogeneous outcomes.
        </p>

        <p className="math-text">
          <strong>The optimal mix:</strong> The answer depends on your societal goals. If the goal is rapid consensus with some preserved diversity, configurations with high proportions of ordered features (60-100%) appear optimal. If the goal is complete homogeneity, the ratio matters less—most configurations eventually produce similar levels of diversity, with only pure gradual change (100% ordered) showing a notable difference.
        </p>

        <p className="math-text">
          Understanding that cultural features change through different mechanisms—some gradually, some instantly—provides a more nuanced view of how societies evolve. The ratio between these two types of features may be a critical but often overlooked factor in predicting whether groups will converge or remain divided. Rather than simply asking "will they agree?", we should ask "how do their cultural traits change, and what does that mean for the pace and nature of convergence?"
        </p>

        <p className="math-text">
          Perhaps most importantly, these findings suggest that preserving the "spectrum nature" of complex cultural issues—rather than forcing them into binary choices—may not only maintain nuance but also facilitate faster and more stable social consensus. In an age of increasing polarization, this insight could inform how we frame debates, structure discourse, and build bridges across divides.
        </p>
      </div>
    </main>
  );
}

export default OrderedRatioCaseStudy;
