# Ordered vs. Unordered Features Ratio Case Study

This case study investigates how the **ratio of ordered to unordered features** affects cultural convergence patterns in an interpretable variant of Axelrod's model of cultural dissemination.

## Overview

- **Research Question**: How does the proportion of ordered (spectrum-based) vs. unordered (categorical) features affect equilibrium outcomes in cultural dissemination?
- **Grid Size**: 10×10 (100 agents)
- **Total Features**: 5 (constant across all configurations)
- **States per Feature**: 7
- **Ratio Configurations**:
  1. 100% ordered: 5 ordered, 0 unordered features
  2. 80% ordered: 4 ordered, 1 unordered feature
  3. 60% ordered: 3 ordered, 2 unordered features
  4. 40% ordered: 2 ordered, 3 unordered features
  5. 20% ordered: 1 ordered, 4 unordered features
  6. 0% ordered: 0 ordered, 5 unordered features
- **Simulations per Configuration**: 200 runs
- **Total Simulations**: 1,200 (6 configurations × 200 runs)
- **Correlations**: All set to 0 (no feature correlations)

## Key Innovation: Interpretable Model

This study uses an **interpretable variant** of the Axelrod model that treats ordered and unordered features differently:

### Ordered Features (Spectrum-based)
- **Naming**: "Spectrum Feature 1", "Spectrum Feature 2", etc.
- **States**: "State A", "State B", "State C", "State D", "State E", "State F", "State G"
- **Adoption Rule**: **One-step transitions** toward the dominator
  - If dominator has a higher state, receiver moves up one step
  - If dominator has a lower state, receiver moves down one step
  - Example: State A → State B → State C → State D → State E → State F → State G (gradual change)

### Unordered Features (Categorical)
- **Naming**: "Category Feature 1", "Category Feature 2", etc.
- **States**: "Type A", "Type B", "Type C", "Type D", "Type E", "Type F", "Type G"
- **Adoption Rule**: **Complete adoption** from the dominator
  - Receiver immediately adopts dominator's state
  - Example: Type A → Type G (instant change)

This mirrors real-world cultural traits where some features (like political ideology, religiosity) change gradually along a spectrum, while others (like language, nationality) change completely.

## File Structure

```
OrderedRatio/
├── run_simulation.py              # Main script - run this to execute everything
├── config.py                       # Configuration parameters
├── axelrod_interpretable_model.py  # Interpretable Axelrod model with ordered features
├── metrics.py                      # Metrics calculation functions
├── data_collection.py              # Batch simulation runner
├── visualization.py                # Plot generation
├── results/                        # Output directory
│   ├── raw_data.csv               # All 1,000 simulation results
│   ├── aggregated_data.csv        # Statistics per ratio configuration
│   └── plots/                     # Generated visualizations
└── README.md                       # This file
```

## How to Run

### Prerequisites

Install required Python packages:

```bash
pip install numpy pandas matplotlib seaborn tqdm
```

### Execution

Simply run:

```bash
python run_simulation.py
```

The script will:
1. Run all 1,000 simulations (progress bar shown)
2. Save raw data to CSV
3. Aggregate results by ratio configuration
4. Generate all visualizations

### Resume Interrupted Runs

If the simulation is interrupted, you can resume by running `run_simulation.py` again. The script will detect existing raw data and offer to use it instead of re-running simulations.

## Metrics Collected

For each simulation, we track:

1. **Steps to Convergence**: Number of simulation steps until absorbing state
2. **Unique Cultures**: Number of distinct cultural profiles at equilibrium (1 = global consensus, 100 = complete polarization)
3. **Largest Domain Size**: Size and percentage of the largest cultural cluster
4. **Average Cultural Distance**: Mean difference between neighboring agents (0 = identical, 1 = completely different)

## Visualizations Generated

The script generates the following plots in `results/plots/`:

1. **line_convergence_time.png** - Line plot with error bars showing ordered ratio vs. average convergence time
2. **bar_unique_cultures.png** - Bar chart showing ordered ratio vs. average unique cultures
3. **area_cultural_distance.png** - Area plot with filled region showing ordered ratio vs. average cultural distance
4. **box_convergence_distribution.png** - Box plot showing distribution of convergence times for each ratio
5. **scatter_convergence_vs_cultures.png** - Scatter plot of convergence time vs. unique cultures, colored by ratio
6. **summary_table.png** - Summary statistics table for all configurations

## Expected Runtime

### With Parallelization (default)
- **Per simulation**: ~5-15 seconds (varies by configuration)
- **Parallel speedup**: ~4-8x (depending on CPU cores)
- **Estimated total time**: ~20-45 minutes for all 1,000 simulations on an 8-core CPU
- **Recommendation**: Can run in a single session

### Without Parallelization
- **Total time**: ~2-4 hours for all 1,000 simulations
- Set `USE_PARALLEL = False` in `config.py` to disable

## Configuration

All parameters can be modified in `config.py`:

- `GRID_SIZE`: Grid dimensions (default: 10)
- `TOTAL_FEATURES`: Number of cultural features (default: 5)
- `STATES_PER_FEATURE`: Number of possible states per feature (default: 4)
- `RATIO_CONFIGS`: List of (ordered, unordered) feature configurations to test
- `RUNS_PER_RATIO`: Number of runs per configuration (default: 200)
- `MAX_STEPS`: Safety limit to prevent infinite loops (default: 1,000,000)
- `RANDOM_SEED`: For reproducibility (default: 42)
- `USE_PARALLEL`: Enable parallel processing (default: True)
- `CORRELATIONS`: Feature correlation matrix (default: all zeros)

## Data Format

### Raw Data (raw_data.csv)

Each row represents one simulation run:

| Column | Description |
|--------|-------------|
| ordered_features | Number of ordered features |
| unordered_features | Number of unordered features |
| ordered_ratio | Percentage of ordered features (0-100) |
| total_features | Total number of features (always 5) |
| grid_size | Grid size used |
| run_id | Run index (0-199) |
| steps_to_convergence | Steps until absorbing state |
| unique_cultures | Number of distinct cultures |
| largest_domain_size | Size of largest cluster |
| largest_domain_percentage | Percentage of grid |
| avg_cultural_distance | Mean neighbor distance |

### Aggregated Data (aggregated_data.csv)

Each row represents statistics for one ratio configuration:

| Column | Description |
|--------|-------------|
| ordered_features | Number of ordered features |
| unordered_features | Number of unordered features |
| ordered_ratio | Percentage of ordered features |
| total_features | Total number of features |
| num_runs | Number of runs (should be 200) |
| steps_mean, steps_std, steps_min, steps_max | Convergence time statistics |
| unique_cultures_mean, unique_cultures_std, unique_cultures_min, unique_cultures_max | Cultural diversity statistics |
| largest_domain_mean, largest_domain_std | Domain size statistics |
| avg_distance_mean, avg_distance_std | Cultural distance statistics |
| prob_global_consensus | Fraction of runs reaching global consensus |

## Expected Findings

Based on the interpretable model's mechanics, we hypothesize:

1. **100% Ordered Features**: Slower convergence due to gradual one-step transitions, potentially higher cultural diversity as intermediate states persist longer

2. **0% Ordered Features**: Faster convergence due to complete adoption, potentially lower cultural diversity as agents can quickly align

3. **Mixed Configurations**: Intermediate behaviors, with the dynamics influenced by the interaction between gradual and complete adoption mechanisms

4. **Cultural Distance**: May be lower with more unordered features due to faster alignment, and higher with more ordered features due to persistent intermediate states

## Implementation Details

### Interaction Probability

Like the standard Axelrod model, the probability of interaction is proportional to cultural similarity:

```
P(interaction) = (number of shared features) / (total features)
```

Agents with more cultural overlap are more likely to interact.

### Adoption Mechanics

When interaction occurs, a differing feature is randomly selected:

- **If ordered**: Receiver moves one step toward dominator
  ```python
  if dominator_state > receiver_state:
      new_state = receiver_state + 1
  elif dominator_state < receiver_state:
      new_state = receiver_state - 1
  ```

- **If unordered**: Receiver adopts dominator's state completely
  ```python
  new_state = dominator_state
  ```

### Absorbing State Detection

The simulation continues until no more interactions are possible (absorbing state). This occurs when all neighboring agents either:
- Share all features (identical), OR
- Share no features (completely different)

## Citation

This implementation extends:

> Axelrod, R. (1997). The dissemination of culture: A model with local convergence and global polarization. *Journal of Conflict Resolution, 41*(2), 203-226.

With interpretable features inspired by:

> The "Social Simulations Made Simple" project's implementation of ordered vs. unordered cultural features.

## Author

Generated as part of the Social Simulations Made Simple project.

## License

MIT License
