# Quick Start Guide - Correlation Strength Sweep

## Installation

First, ensure all dependencies are installed:

```bash
cd simulations/CorrelationSweep
pip install -r ../requirements.txt
```

If `requirements.txt` doesn't include all packages, install manually:

```bash
pip install numpy pandas matplotlib seaborn tqdm
```

## Running the Study

### Option 1: Run Complete Study (Recommended)

Execute the full simulation pipeline:

```bash
python run_simulation.py
```

This will:
- Run 450 simulations (9 correlation values × 50 runs each)
- Save results to `results/raw_data.csv` and `results/aggregated_data.csv`
- Generate 6 visualization plots in `results/plots/`
- Display progress bars and timing information

**Expected runtime**: 15-30 minutes with parallelization enabled

### Option 2: Test the Model First

Run a quick test to verify everything works:

```bash
python test_model.py
```

This runs a small test with 3 correlation values on a 5×5 grid.

### Option 3: Use Existing Data

If you've already run simulations and want to regenerate visualizations only:

1. Run `python run_simulation.py`
2. When prompted "Do you want to use existing data? (y/n):", type `y`
3. Visualizations will be regenerated without re-running simulations

## Configuration

Edit `config.py` to customize:

```python
# Change grid size (default: 10×10)
GRID_SIZE = 10

# Change correlation values to test
CORRELATION_VALUES = [-1.0, -0.5, 0, 0.5, 1.0]  # Fewer values = faster

# Change number of runs per correlation
RUNS_PER_CORRELATION = 50  # Reduce for faster testing (e.g., 10)

# Enable/disable parallelization
USE_PARALLEL = True  # Set False if you have issues

# Change random seed for different results
RANDOM_SEED = 42
```

## Output Files

After running, you'll find:

```
results/
├── raw_data.csv              # Individual simulation results (450 rows)
├── aggregated_data.csv       # Statistics per correlation value (9 rows)
└── plots/
    ├── line_convergence_time.png          # How correlation affects speed
    ├── line_unique_cultures.png           # How correlation affects diversity
    ├── line_cultural_distance.png         # Cultural distance at equilibrium
    ├── scatter_convergence_vs_cultures.png # Relationships colored by ρ
    ├── bar_global_consensus.png           # Probability of full consensus
    └── combined_overview.png              # All metrics in one figure
```

## Understanding the Results

### Key Metrics

1. **Steps to Convergence**: How long until no more interactions possible
2. **Unique Cultures**: Number of distinct cultural profiles at end
3. **Cultural Distance**: Average difference between neighbors (0-1 scale)
4. **Global Consensus Probability**: Fraction of runs reaching total uniformity

### Interpreting Correlation Values

- **ρ = -1.0**: Perfect negative correlation (opposite features)
- **ρ = -0.5**: Moderate negative correlation
- **ρ = 0.0**: No correlation (standard Axelrod model)
- **ρ = 0.5**: Moderate positive correlation
- **ρ = 1.0**: Perfect positive correlation (aligned features)

## Troubleshooting

### "ModuleNotFoundError: No module named 'seaborn'"

Install missing packages:
```bash
pip install seaborn
```

### Simulations run very slowly

1. Check that `USE_PARALLEL = True` in `config.py`
2. Reduce `RUNS_PER_CORRELATION` for testing (e.g., from 50 to 10)
3. Reduce grid size temporarily (e.g., from 10 to 8)

### Memory issues

Reduce `RUNS_PER_CORRELATION` or `GRID_SIZE` in `config.py`

### Process hangs during data collection

Some combinations may take very long to converge. The model has a safety limit of `MAX_STEPS = 1000000`. You can reduce this in `config.py` if needed.

## Comparing with FvsQ Study

This study (CorrelationSweep) differs from FvsQ in several ways:

| Aspect | FvsQ | CorrelationSweep |
|--------|------|------------------|
| **Variable** | F (features) & q (states) | Correlation coefficient (ρ) |
| **Features** | Abstract numeric | Interpretable (Politics, Culture, Economics) |
| **Feature Type** | All non-ordered | All ordered/spectrum |
| **Transitions** | Immediate adoption | One-step gradual change |
| **Initialization** | Independent random | Correlated random |
| **Visualization** | Heat maps (2D) | Line plots, scatter plots, bars (1D) |

## Next Steps

1. **Run the study** with default parameters
2. **Examine visualizations** in `results/plots/`
3. **Read full README.md** for theoretical background
4. **Experiment with parameters** in `config.py`
5. **Extend the model** (see README.md "Extending the Study" section)

## Questions?

- Check the full **README.md** for detailed documentation
- Examine **config.py** for all configurable parameters
- Look at **axelrod_interpretable_model.py** for implementation details
- Review **App.jsx** (web app) to see the original JS implementation

---

**Happy simulating!**
