# Correlation Strength Sweep Case Study

## Overview

This case study explores how **feature correlation strength** affects cultural convergence dynamics in Axelrod's model of cultural dissemination. Unlike basic Axelrod models where features are initialized independently, this study implements the interpretable model with correlated feature initialization, reflecting real-world scenarios where cultural attributes tend to be correlated.

## Research Question

**How does the strength of correlation between cultural features affect the emergence and stability of cultural regions?**

This study investigates whether stronger positive or negative correlations between features lead to faster convergence, higher cultural diversity, or different equilibrium states.

## Theoretical Background

In real-world social systems, cultural features are rarely independent. For example:
- **Political ideology** often correlates with **economic policy preferences**
- **Religious beliefs** may correlate with **social values**
- **Educational background** correlates with **cultural consumption patterns**

This study implements a correlation mechanism where:
- **Positive correlation** (ρ > 0): Features tend to align (e.g., progressive politics with progressive cultural values)
- **Negative correlation** (ρ < 0): Features tend to oppose (e.g., traditional values with progressive economics)
- **Zero correlation** (ρ = 0): Features are independent (standard Axelrod model)

## Study Design

### Fixed Parameters

- **Grid Size**: 10×10 (100 agents)
- **Number of Features**: 3 (all ordered/spectrum features)
- **Feature Template**: Political-Cultural
  1. **Political Ideology** (5 states): Far Left → Left → Center → Right → Far Right
  2. **Cultural Values** (5 states): Very Traditional → Traditional → Moderate → Progressive → Very Progressive
  3. **Economic Policy** (5 states): Socialist → Mixed Left → Centrist → Mixed Right → Capitalist

### Variable Parameter

- **Correlation Coefficient (ρ)**: 9 values tested
  - `-1.0, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1.0`
  - **Same correlation applied between ALL feature pairs** (uniform correlation structure)

### Simulation Settings

- **Runs per correlation value**: 50
- **Total simulations**: 9 × 50 = 450
- **Random seed**: 42 (for reproducibility)
- **Parallelization**: Enabled (multi-core processing)

## Key Features of the Interpretable Model

### 1. Correlated Initialization

Unlike standard Axelrod models, agents' features are initialized with correlations:

1. **Anchor Selection**: A random "anchor" feature is chosen first
2. **Correlated Sampling**: Other features are sampled based on their correlation with the anchor
3. **Probability Formula**: For each state, the probability is:
   ```
   P(state) = (1 - distance) × (1 + ρ) + distance × (1 - ρ)
   ```
   where `distance = |r_anchor - r_state|` and `r` values range from 0 to 1

### 2. One-Step Transitions for Ordered Features

All features in this study are **ordered/spectrum** features. During cultural influence:
- Agents don't immediately adopt the dominator's state
- Instead, they move **one step** toward the dominator's position
- Example: If agent has "Left" and neighbor has "Far Right", agent moves to "Center" (not all the way)

This creates more gradual and realistic cultural shifts.

### 3. Interaction Rules

Standard Axelrod rules apply:
- **Interaction probability** = (# shared features) / (# total features)
- Agents must share **some but not all** features to interact
- Random feature selection among differing features
- Random dominator selection (50/50)

## Metrics Tracked

For each simulation run, we measure:

1. **Steps to Convergence**: Number of interaction attempts until absorbing state
2. **Unique Cultures**: Count of distinct cultural profiles at equilibrium
3. **Largest Domain Size**: Size of the largest connected region with identical culture
4. **Average Cultural Distance**: Mean difference between neighboring agents (0-1 scale)
5. **Global Consensus Probability**: Fraction of runs reaching complete cultural uniformity

## File Structure

```
CorrelationSweep/
├── config.py                          # Configuration parameters
├── axelrod_interpretable_model.py     # Core model with correlations & ordered features
├── metrics.py                         # Metric calculation functions
├── data_collection.py                 # Simulation orchestration & data collection
├── visualization.py                   # Plot generation
├── run_simulation.py                  # Main entry point
├── README.md                          # This file
└── results/                           # Output directory (created at runtime)
    ├── raw_data.csv                   # Individual simulation results
    ├── aggregated_data.csv            # Statistics per correlation value
    └── plots/                         # Generated visualizations
        ├── line_convergence_time.png
        ├── line_unique_cultures.png
        ├── line_cultural_distance.png
        ├── scatter_convergence_vs_cultures.png
        ├── bar_global_consensus.png
        └── combined_overview.png
```

## Usage

### Prerequisites

Ensure you have the required Python packages installed:

```bash
pip install numpy pandas matplotlib seaborn tqdm
```

### Running the Study

Execute the main script:

```bash
python run_simulation.py
```

The script will:
1. Run 450 simulations (9 correlation values × 50 runs each)
2. Save raw results to CSV
3. Aggregate statistics by correlation value
4. Generate all visualizations

### Execution Time

- **With parallelization**: ~10-30 minutes (depending on CPU cores)
- **Without parallelization**: ~1-2 hours

## Visualizations Generated

### 1. Line Plot: Convergence Time vs. Correlation
Shows how correlation strength affects the speed of convergence.

**Expected Patterns**:
- High positive correlation may speed up convergence (aligned features)
- Negative correlation may slow down convergence (conflicting features)

### 2. Line Plot: Unique Cultures vs. Correlation
Shows how correlation affects final cultural diversity.

**Expected Patterns**:
- Stronger correlations (positive or negative) may reduce diversity
- Zero correlation may allow maximum diversity

### 3. Line Plot: Cultural Distance vs. Correlation
Shows how correlation affects the "distance" between neighboring cultures.

**Expected Patterns**:
- Higher diversity → higher average distance
- Global consensus → zero distance

### 4. Scatter Plot: Convergence Time vs. Unique Cultures (by Correlation)
Reveals relationships between convergence speed and final diversity for each correlation value.

**Insights**:
- Identifies correlation values leading to fast convergence with low diversity
- Shows variability within each correlation condition

### 5. Bar Plot: Global Consensus Probability
Shows the probability of reaching complete cultural uniformity for each correlation value.

**Expected Patterns**:
- Strong correlations may increase consensus probability
- Weak/zero correlation may decrease consensus probability

### 6. Combined Overview (2×2 Subplot)
Provides a comprehensive dashboard of all key metrics in one figure.

## Expected Findings

### Hypothesis 1: Positive Correlation Accelerates Convergence
When features are positively correlated, agents start with more aligned profiles, potentially leading to faster consensus.

### Hypothesis 2: Strong Correlations Reduce Diversity
Both strong positive and strong negative correlations constrain the initial state space, potentially reducing final diversity.

### Hypothesis 3: Negative Correlation Creates Bistability
Negative correlations may create "opposing camps" (e.g., far-left economics with far-right politics), leading to stable diversity.

### Hypothesis 4: Zero Correlation Matches Standard Axelrod
The ρ = 0 condition should replicate standard Axelrod model behavior.

## Scientific Significance

This study bridges theoretical physics approaches (correlation in spin systems) with social simulation:

1. **Realism**: Models real-world feature correlations in social systems
2. **Interpretability**: Uses meaningful features (politics, culture, economics)
3. **Gradual Change**: Implements realistic one-step transitions for ordered features
4. **Parameter Space**: Systematically explores correlation strength from -1 to +1

## Extending the Study

Potential extensions:

1. **Asymmetric Correlations**: Different correlation coefficients between different feature pairs
2. **Mixed Feature Types**: Combine ordered and non-ordered features
3. **Dynamic Correlations**: Correlation strength that changes over time
4. **Network Topologies**: Test on scale-free or small-world networks instead of grids
5. **More Features**: Increase to 5-10 features to study high-dimensional effects

## References

1. Axelrod, R. (1997). *The Dissemination of Culture: A Model with Local Convergence and Global Polarization*. Journal of Conflict Resolution, 41(2), 203-226.

2. Klemm, K., Eguíluz, V. M., Toral, R., & San Miguel, M. (2003). *Role of dimensionality in Axelrod's model for the dissemination of culture*. Physica A, 327(1-2), 1-5.

3. Castellano, C., Fortunato, S., & Loreto, V. (2009). *Statistical physics of social dynamics*. Reviews of Modern Physics, 81(2), 591.

## Citation

If you use this case study in your research, please cite:

```
Social Simulations - Correlation Strength Sweep Case Study
InPerson Project, 2025
https://github.com/yourusername/social-simulations
```

## License

This case study is part of the InPerson project and follows the same license terms.

## Contact

For questions or suggestions about this case study, please open an issue in the repository.

---

**Last Updated**: November 2025
