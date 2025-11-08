# F vs q Phase Diagram Case Study

This case study investigates how **feature complexity (F)** and **state diversity (q)** affect cultural convergence patterns in Axelrod's model of cultural dissemination.

## Overview

- **Research Question**: How do the number of cultural features (F) and the number of possible states per feature (q) affect equilibrium outcomes?
- **Grid Size**: 10×10 (100 agents)
- **Parameter Ranges**:
  - F: 2, 3, 4, 5, 6, 7, 8, 9, 10 (9 values)
  - q: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 (19 values)
- **Total Combinations**: 171 (F, q) pairs
- **Simulations per Combination**: 100 runs
- **Total Simulations**: 17,100

## File Structure

```
FvsQ/
├── run_simulation.py          # Main script - run this to execute everything
├── config.py                   # Configuration parameters
├── axelrod_model.py            # Core Axelrod model implementation
├── metrics.py                  # Metrics calculation functions
├── data_collection.py          # Batch simulation runner
├── visualization.py            # Plot generation
├── results/                    # Output directory
│   ├── raw_data.csv           # All 17,100 simulation results
│   ├── aggregated_data.csv    # Statistics per (F, q) combination
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
1. Run all 17,100 simulations (progress bar shown)
2. Save raw data to CSV
3. Aggregate results by (F, q) combination
4. Generate heat maps and scatter plots

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

### Heat Maps (F × q grids)
1. **heatmap_unique_cultures.png** - Average number of unique cultures at equilibrium
2. **heatmap_convergence_time.png** - Average steps to convergence
3. **heatmap_global_consensus.png** - Probability of reaching global consensus
4. **heatmap_largest_domain.png** - Average largest domain size (%)
5. **heatmap_cultural_distance.png** - Average cultural distance at equilibrium

### Additional Plots
6. **scatter_convergence_vs_diversity.png** - Convergence time vs. cultural diversity for selected (F, q) pairs
7. **distribution_unique_cultures.png** - Cultural diversity trends across q for each F value (with error bars)

## Expected Runtime

### With Parallelization (default)
- **Per simulation**: ~5-10 seconds (varies by F and q)
- **Parallel speedup**: ~4-8x (depending on CPU cores)
- **Estimated total time**: ~4-9 hours for all 17,100 simulations on an 8-core CPU
- **Recommendation**: Can run during the day or overnight

### Without Parallelization
- **Total time**: ~35 hours for all 17,100 simulations
- Set `USE_PARALLEL = False` in `config.py` to disable

## Configuration

All parameters can be modified in `config.py`:

- `GRID_SIZE`: Grid dimensions (default: 10)
- `F_VALUES`: List of F values to test
- `Q_VALUES`: List of q values to test
- `RUNS_PER_COMBINATION`: Number of runs per (F, q) pair (default: 100)
- `MAX_STEPS`: Safety limit to prevent infinite loops (default: 1,000,000)
- `RANDOM_SEED`: For reproducibility (default: 42)
- `USE_PARALLEL`: Enable parallel processing (default: True)

## Data Format

### Raw Data (raw_data.csv)

Each row represents one simulation run:

| Column | Description |
|--------|-------------|
| F | Number of features |
| q | Number of states per feature |
| grid_size | Grid size used |
| run_id | Run index (0-99) |
| steps_to_convergence | Steps until absorbing state |
| unique_cultures | Number of distinct cultures |
| largest_domain_size | Size of largest cluster |
| largest_domain_percentage | Percentage of grid |
| avg_cultural_distance | Mean neighbor distance |

### Aggregated Data (aggregated_data.csv)

Each row represents statistics for one (F, q) combination:

| Column | Description |
|--------|-------------|
| F | Number of features |
| q | Number of states per feature |
| num_runs | Number of runs (should be 100) |
| steps_mean, steps_std, steps_min, steps_max | Convergence time statistics |
| unique_cultures_mean, unique_cultures_std, unique_cultures_min, unique_cultures_max | Cultural diversity statistics |
| largest_domain_mean, largest_domain_std | Domain size statistics |
| avg_distance_mean, avg_distance_std | Cultural distance statistics |
| prob_global_consensus | Fraction of runs reaching global consensus |

## Expected Findings

Based on Axelrod's original research, we expect to observe:

1. **Low F, Low q**: High probability of global consensus (all agents converge to same culture)
2. **High F, High q**: Cultural polarization (multiple stable cultures persist)
3. **Phase Transition**: Critical threshold where behavior shifts from unity to diversity
4. **Convergence Time**: Increases with both F and q

## Citation

This implementation is based on:

> Axelrod, R. (1997). The dissemination of culture: A model with local convergence and global polarization. *Journal of Conflict Resolution, 41*(2), 203-226.

## Author

Generated as part of the Social Simulations Made Simple project.

## License

MIT License
