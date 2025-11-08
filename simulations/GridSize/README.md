# Grid Size Impact Analysis Case Study

This case study investigates how **grid size (N×N)** affects cultural convergence patterns in Axelrod's model of cultural dissemination, while keeping feature complexity (F) and state diversity (q) constant.

## Overview

- **Research Question**: How does the size of the population (grid size) affect equilibrium outcomes, convergence time, and cultural diversity?
- **Fixed Parameters**: F=5, q=15
- **Grid Sizes Tested**: 5×5, 10×10, 15×15, 20×20, 25×25
- **Total Grid Sizes**: 5 different configurations
- **Simulations per Grid Size**: 100 runs
- **Total Simulations**: 500

## File Structure

```
GridSize/
├── run_simulation.py          # Main script - run this to execute everything
├── config.py                   # Configuration parameters
├── axelrod_model.py            # Core Axelrod model implementation
├── metrics.py                  # Metrics calculation functions
├── data_collection.py          # Batch simulation runner
├── visualization.py            # Plot generation
├── results/                    # Output directory
│   ├── raw_data.csv           # All 500 simulation results
│   ├── aggregated_data.csv    # Statistics per grid size
│   └── plots/                 # Generated visualizations
└── README.md                   # This file
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
1. Run all 500 simulations (progress bar shown)
2. Save raw data to CSV
3. Aggregate results by grid size
4. Generate line plots, bar charts, and scatter plots

### Resume Interrupted Runs

If the simulation is interrupted, you can resume by running `run_simulation.py` again. The script will detect existing raw data and offer to use it instead of re-running simulations.

## Metrics Collected

For each simulation, we track:

1. **Steps to Convergence**: Number of simulation steps until absorbing state
2. **Unique Cultures**: Number of distinct cultural profiles at equilibrium
   - 1 = global consensus (monoculture)
   - N×N = complete polarization (every agent unique)
3. **Largest Domain Size**: Size and percentage of the largest cultural cluster
4. **Average Cultural Distance**: Mean difference between neighboring agents
   - 0 = identical neighbors
   - 1 = completely different neighbors

## Visualizations Generated

The script generates the following plots in `results/plots/`:

### Line Plots (with error bars)
1. **line_convergence_time.png** - Grid size vs. average steps to convergence
   - Shows how simulation time scales with population size
   - Error bars indicate variability across runs

2. **line_unique_cultures.png** - Grid size vs. average unique cultures at equilibrium
   - Shows how cultural diversity changes with population size
   - Reveals whether larger populations maintain more cultural diversity

3. **line_largest_domain.png** - Grid size vs. largest domain percentage
   - Shows the relative size of the dominant culture
   - Helps understand cultural homogenization patterns

### Bar Plot
4. **bar_global_consensus.png** - Probability of global consensus per grid size
   - Shows the fraction of runs reaching monoculture (1 unique culture)
   - Color-coded: blue (high probability) vs. purple (low probability)
   - Values labeled on each bar

### Scatter Plot
5. **scatter_convergence_vs_cultures.png** - Convergence time vs. unique cultures
   - Each grid size shown in different color
   - Reveals relationship between simulation duration and final diversity
   - Helps identify different convergence patterns

### Summary Table
6. **summary_table.png** - Complete statistical summary table
   - All key metrics in one view
   - Formatted for presentations and reports

## Expected Runtime

### With Parallelization (default)
- **Per simulation**: ~5-15 seconds (varies by grid size)
  - 5×5: ~2-5 seconds
  - 10×10: ~5-10 seconds
  - 15×15: ~10-20 seconds
  - 20×20: ~20-40 seconds
  - 25×25: ~30-60 seconds
- **Parallel speedup**: ~4-8x (depending on CPU cores)
- **Estimated total time**: ~30-90 minutes for all 500 simulations on an 8-core CPU
- **Recommendation**: Can run during a meeting or lunch break

### Without Parallelization
- **Total time**: ~4-12 hours for all 500 simulations
- Set `USE_PARALLEL = False` in `config.py` to disable

## Configuration

All parameters can be modified in `config.py`:

- `F`: Number of features (default: 5)
- `Q`: Number of states per feature (default: 15)
- `GRID_SIZES`: List of grid sizes to test (default: [5, 10, 15, 20, 25])
- `RUNS_PER_SIZE`: Number of runs per grid size (default: 100)
- `MAX_STEPS`: Safety limit to prevent infinite loops (default: 1,000,000)
- `RANDOM_SEED`: For reproducibility (default: 42)
- `USE_PARALLEL`: Enable parallel processing (default: True)

## Data Format

### Raw Data (raw_data.csv)

Each row represents one simulation run:

| Column | Description |
|--------|-------------|
| grid_size | Size of grid (5, 10, 15, 20, or 25) |
| F | Number of features (always 5) |
| q | Number of states per feature (always 15) |
| run_id | Run index (0-99) |
| steps_to_convergence | Steps until absorbing state |
| unique_cultures | Number of distinct cultures |
| largest_domain_size | Size of largest cluster |
| largest_domain_percentage | Percentage of grid |
| avg_cultural_distance | Mean neighbor distance |

### Aggregated Data (aggregated_data.csv)

Each row represents statistics for one grid size:

| Column | Description |
|--------|-------------|
| grid_size | Size of grid (5, 10, 15, 20, or 25) |
| total_nodes | Total number of agents (N×N) |
| F | Number of features (always 5) |
| q | Number of states per feature (always 15) |
| num_runs | Number of runs (should be 100) |
| steps_mean, steps_std, steps_min, steps_max | Convergence time statistics |
| unique_cultures_mean, unique_cultures_std, unique_cultures_min, unique_cultures_max | Cultural diversity statistics |
| largest_domain_mean, largest_domain_std | Domain size statistics |
| avg_distance_mean, avg_distance_std | Cultural distance statistics |
| prob_global_consensus | Fraction of runs reaching global consensus |

## Research Questions

This case study helps answer:

1. **Scalability**: How does convergence time scale with population size?
   - Linear, quadratic, or exponential growth?
   - Can we predict runtime for larger grids?

2. **Cultural Diversity**: Do larger populations maintain more distinct cultures?
   - Is diversity proportional to grid size?
   - Does diversity saturate at some population size?

3. **Global Consensus**: Are small or large populations more likely to achieve monoculture?
   - Is there a critical population size for consensus?
   - How does probability change with grid size?

4. **Dominant Culture Size**: Does the largest culture occupy the same percentage regardless of grid size?
   - Or do larger grids allow for more fragmentation?

5. **Convergence Patterns**: Do different grid sizes exhibit different convergence behaviors?
   - Fast consensus vs. slow polarization?
   - Correlation between convergence time and final diversity?

## Expected Findings

Based on theoretical considerations and previous research:

1. **Convergence Time**: Expected to increase with grid size
   - More agents = more interactions needed
   - Likely quadratic or greater scaling

2. **Cultural Diversity**: Expected to increase with grid size
   - Larger populations can sustain more distinct cultures
   - Spatial structure allows local clusters to persist

3. **Global Consensus Probability**: Expected to decrease with grid size
   - Harder to achieve complete consensus in larger populations
   - Initial diversity increases with grid size

4. **Largest Domain**: Percentage may decrease with grid size
   - More room for competing cultures
   - Spatial constraints matter more

## Theoretical Background

### Axelrod's Model

The model simulates cultural dissemination through local interactions:
- Agents arranged on a grid with N×N nodes
- Each agent has F cultural features, each with q possible values
- Neighboring agents interact with probability = cultural similarity
- When interacting, one agent adopts a feature value from the other
- Simulation continues until no more interactions possible (absorbing state)

### Grid Size Effects

Grid size affects:
1. **Total population**: N×N agents
2. **Initial diversity**: More agents = more distinct initial cultures
3. **Interaction opportunities**: More neighbors = more potential interactions
4. **Spatial clustering**: Larger grids allow larger homogeneous regions

## Citation

This implementation is based on:

> Axelrod, R. (1997). The dissemination of culture: A model with local convergence and global polarization. *Journal of Conflict Resolution, 41*(2), 203-226.

## Related Case Studies

- **FvsQ**: Investigates phase diagram of feature complexity (F) vs. state diversity (q)
- This study complements FvsQ by examining population size effects

## Author

Generated as part of the Social Simulations Made Simple project.

## License

MIT License
