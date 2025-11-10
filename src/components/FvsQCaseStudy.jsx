import { Link } from 'react-router-dom';
import './CaseStudiesPage.css';

function FvsQCaseStudy() {
  return (
    <main className="math-content">
      <div className="math-section">
        <Link to="/case-studies" className="back-to-case-studies">
          ← Back to Case Studies
        </Link>
        <h2 className="math-heading">F vs. q on 10×10 Grid</h2>
        <p className="math-text" style={{fontSize: '1.1rem', color: '#3b82f6', fontWeight: '600', fontStyle: 'italic', marginBottom: '2rem', marginTop: '0.5rem'}}>
          By Martin Žust
        </p>

        <h3 className="math-subheading">The Question</h3>
        <p className="math-text">
          Imagine you have 100 people and you want to choose Axelrod's parameters so that they would almost certainly disagree and divide into more than one group. What would you do? Would you choose small F and big q? Or maybe big F and big q?
        </p>
        <p className="math-text">
          This experiment helped us understand how this dynamic works. But before we look at the empirical results of the simulation, let's try to understand it on an intuitive level.
        </p>

        <h3 className="math-subheading">The Puzzle</h3>
        <p className="math-text">
          Consider the following puzzle: Make 2 ticks in the table below, one in each column, so that you almost guarantee that people will be divided into two or more groups in the absorbing state.
        </p>

        <div className="math-formula" style={{padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0'}}>
          <table style={{width: '100%', maxWidth: '400px', margin: '0 auto', borderCollapse: 'collapse'}}>
            <thead>
              <tr>
                <th style={{padding: '0.75rem', borderBottom: '2px solid #dee2e6', textAlign: 'left'}}></th>
                <th style={{padding: '0.75rem', borderBottom: '2px solid #dee2e6', textAlign: 'center'}}>F (number of features)</th>
                <th style={{padding: '0.75rem', borderBottom: '2px solid #dee2e6', textAlign: 'center'}}>q (number of states per feature)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: '0.75rem', borderBottom: '1px solid #dee2e6', fontWeight: 'bold'}}>SMALL</td>
                <td style={{padding: '0.75rem', borderBottom: '1px solid #dee2e6', textAlign: 'center'}}>☐</td>
                <td style={{padding: '0.75rem', borderBottom: '1px solid #dee2e6', textAlign: 'center'}}>☐</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', fontWeight: 'bold'}}>BIG</td>
                <td style={{padding: '0.75rem', textAlign: 'center'}}>☐</td>
                <td style={{padding: '0.75rem', textAlign: 'center'}}>☐</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="math-subheading">Theoretical Analysis</h3>
        <p className="math-text">
          We must first agree that reaching final consensus is very positively correlated with the probability that two random people will find a reason to communicate and exchange their opinion. By design of Axelrod's model, two people will communicate with probability calculated by dividing the number of features they have in common by the number of all features. The only thing that matters here is that they have at least one feature in common—even if the probability of communication on the first attempt is small, we will continue iterating until they decide to talk.
        </p>
        <p className="math-text">
          So, we need to calculate how probable it is that two random people have nothing in common, and then maximize this probability by picking the right F and q. Let's assume that these two people have completely random states for all features (which is true at the beginning of the simulation).
        </p>
        <p className="math-text">
          Now, let's calculate the probability that they have different first feature. There are q possible states. Let's assume that the first person is in state i; then the second person has q−1 other options to not be in the same state. So, the probability of persons not being in the same state in feature one is (q−1)/q.
        </p>
        <p className="math-text">
          Because all features are independent and we can apply the same thinking to other features, we get the following probability that these two persons will not have anything in common and therefore be unable to communicate:
        </p>

        <div className="math-formula">
          P = ((q−1)/q)<sup>F</sup>
        </div>

        <p className="math-text">
          Because (q−1)/q is smaller than one, P gets smaller with increasing F. And because (x−1)/x is an increasing function for x &gt; 0, we conclude that the solution to the provided puzzle is:
        </p>

        <div className="math-formula" style={{padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0'}}>
          <table style={{width: '100%', maxWidth: '400px', margin: '0 auto', borderCollapse: 'collapse'}}>
            <thead>
              <tr>
                <th style={{padding: '0.75rem', borderBottom: '2px solid #dee2e6', textAlign: 'left'}}></th>
                <th style={{padding: '0.75rem', borderBottom: '2px solid #dee2e6', textAlign: 'center'}}>F (number of features)</th>
                <th style={{padding: '0.75rem', borderBottom: '2px solid #dee2e6', textAlign: 'center'}}>q (number of states per feature)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: '0.75rem', borderBottom: '1px solid #dee2e6', fontWeight: 'bold'}}>SMALL</td>
                <td style={{padding: '0.75rem', borderBottom: '1px solid #dee2e6', textAlign: 'center'}}>☑</td>
                <td style={{padding: '0.75rem', borderBottom: '1px solid #dee2e6', textAlign: 'center'}}>☐</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', fontWeight: 'bold'}}>BIG</td>
                <td style={{padding: '0.75rem', textAlign: 'center'}}>☐</td>
                <td style={{padding: '0.75rem', textAlign: 'center'}}>☑</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="math-text">
          We can also interpret this on an intuitive level. If we restrict people's identities to just one or two features, conflicts occur much easier. We see this everywhere in politics, where we are either left or right, religious or atheist, or even in shows like Squid Game, where players were labeled with sign "O" if they wanted to stay in the game and sign "X" if they wanted to leave.
        </p>

        <h3 className="math-subheading">Simulation Methodology</h3>
        <p className="math-text">
          To test these theoretical predictions empirically, we conducted a comprehensive series of simulations on a 10×10 grid (100 agents). We systematically varied both F (number of features) and q (number of trait values per feature) across a range of values, running multiple simulations for each combination of parameters.
        </p>
        <p className="math-text">
          Specifically, we tested F values from 2 to 10 (9 values) and q values from 2 to 20 (19 values), creating 171 unique parameter combinations. For each combination, we ran 100 independent simulations with randomly initialized cultural configurations, totaling 17,100 simulation runs. Each simulation was allowed to run until reaching an absorbing state—a configuration where no further cultural change is possible because neighboring agents either share all features (and thus have no cultural influence on each other) or share no features (and thus cannot interact).
        </p>
        <p className="math-text">
          We collected four key metrics from each simulation:
        </p>
        <ul className="math-text" style={{marginLeft: '2rem', marginTop: '0.5rem'}}>
          <li><strong>Steps to convergence:</strong> The number of interaction steps required to reach the absorbing state</li>
          <li><strong>Number of unique cultures:</strong> The count of distinct cultural configurations in the final absorbing state (1 = global consensus, 100 = complete polarization)</li>
          <li><strong>Largest domain size:</strong> The size and percentage of the largest cultural cluster</li>
          <li><strong>Average cultural distance:</strong> The mean difference between neighboring agents (0 = identical, 1 = completely different)</li>
        </ul>

        <h3 className="math-subheading">Results: Probability of Consensus</h3>
        <p className="math-text">
          Now, let's take a look at the first graph from the simulation. It shows a heatmap of how likely it is for a specific combination of F and q to reach consensus.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/heatmap_global_consensus.png" alt="Heatmap showing probability of global consensus for different F and q combinations" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          We don't only see the behavior described above—that for small F and big q consensus is nearly impossible and vice versa—but also that consensus behavior is unpredictable only for a small number of combinations on the diagonal where q and F are almost the same. For these values we can't surely say whether consensus is reached or not, whereas for all other combinations, the probability of consensus is either 0 or 1.
        </p>
        <p className="math-text">
          This sharp phase transition is remarkable. It suggests that Axelrod's model exhibits a kind of cultural "tipping point"—small changes in parameters can push a society from guaranteed fragmentation to guaranteed homogeneity.
        </p>

        <h3 className="math-subheading">Convergence Time Analysis</h3>
        <p className="math-text">
          But what if we want to have consensus? We already know that if we have as many features as possible and as few states as possible, then consensus is guaranteed. However, the following graph shows interesting behavior regarding the speed of convergence that we can also understand on an intuitive level.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/heatmap_convergence_time.png" alt="Heatmap showing convergence time for different F and q combinations" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          We see that even though the probability of consensus increases with increasing F for fixed q, so does the time of convergence (look at a single column). Because neighbors have more points on which they can agree, they also have more on which they disagree.
        </p>
        <p className="math-text">
          We can understand this through the example of long democratic discussions that are extremely inefficient because they try not to exclude any point of view. So, if we want to have consensus, we may also want to balance it with reasonable efficiency and not pick F to be too large.
        </p>

        <h3 className="math-subheading">Cultural Diversity</h3>
        <p className="math-text">
          Let's take a look at two more graphs derived from the simulation that can give us even more context. First, let's examine how the number of unique cultures increases with increasing q for fixed F.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/distribution_unique_cultures.png" alt="Distribution of unique cultures for varying q values" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          And now, let's look at the heatmap showing the average number of unique cultures for different combinations of F and q.
        </p>

        <div className="math-formula" style={{padding: '1rem', background: '#f8f9fa', borderRadius: '8px', margin: '1.5rem 0', textAlign: 'center'}}>
          <img src="/case-studies/heatmap_unique_cultures.png" alt="Heatmap showing number of unique cultures for different F and q combinations" style={{maxWidth: '100%', height: 'auto', borderRadius: '4px'}} />
        </div>

        <p className="math-text">
          These visualizations reveal that cultural diversity in the final state is maximized when F is small and q is large—exactly the conditions that prevent consensus. This makes intuitive sense: with many possible trait values but few features, there are many possible cultural configurations, but agents are unlikely to share even a single trait and thus cannot interact.
        </p>

        <h3 className="math-subheading">Conclusions</h3>
        <p className="math-text">
          Our systematic exploration of the F-q parameter space on a 10×10 grid has revealed several important insights about cultural dynamics in Axelrod's model:
        </p>
        <ul className="math-text" style={{marginLeft: '2rem', marginTop: '0.5rem'}}>
          <li><strong>Sharp phase transitions:</strong> The model exhibits all-or-nothing behavior for most parameter combinations, with consensus probability either near 0 or near 1.</li>
          <li><strong>The fragmentation recipe:</strong> To guarantee cultural fragmentation, use few features (small F) and many trait values (large q). This maximizes the probability that random individuals share nothing in common.</li>
          <li><strong>The consensus recipe:</strong> To guarantee cultural homogeneity, use many features (large F) and few trait values (small q). This ensures individuals almost always find common ground.</li>
          <li><strong>The efficiency trade-off:</strong> While increasing F promotes consensus, it also dramatically increases convergence time. There's a practical trade-off between cultural homogeneity and the speed at which it's achieved.</li>
          <li><strong>Critical zone:</strong> The diagonal region where F ≈ q represents a "critical zone" of unpredictability where small random fluctuations determine whether consensus or fragmentation occurs.</li>
        </ul>
        <p className="math-text">
          Perhaps most strikingly, we've learned how to "divide and conquer" in cultural dynamics. By limiting the dimensionality of cultural identity (small F) while expanding the options within each dimension (large q), we create conditions where diverse, isolated cultural groups inevitably emerge. This finding has profound implications for understanding polarization in real societies, where reducing complex issues to binary choices (essentially reducing F) can drive populations apart, even when many nuanced positions exist (large q).
        </p>
        <p className="math-text">
          The simulation results confirm our theoretical analysis while revealing unexpected phenomena like sharp phase transitions and the efficiency-consensus trade-off. These findings suggest that Axelrod's simple model captures fundamental dynamics of cultural evolution that may help explain patterns of consensus and fragmentation in real human societies.
        </p>
      </div>
    </main>
  );
}

export default FvsQCaseStudy;
