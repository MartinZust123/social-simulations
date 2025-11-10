"""
Configuration file for Grid Size Impact Analysis Case Study
"""

# Fixed parameters
F = 5  # Number of cultural features per agent
Q = 8  # Number of possible values per feature

# Grid sizes to test
GRID_SIZES = [4, 6, 8, 10, 12, 14, 16, 18, 20]

# Number of simulation runs per grid size
RUNS_PER_SIZE = 500

# Maximum simulation steps (safety limit to prevent infinite loops)
MAX_STEPS = 2000000

# Output paths
RESULTS_DIR = "results"
RAW_DATA_FILE = "results/raw_data.csv"
AGGREGATED_DATA_FILE = "results/aggregated_data.csv"
PLOTS_DIR = "results/plots"

# Random seed for reproducibility (None = random)
RANDOM_SEED = 42

# Progress tracking
SHOW_PROGRESS_BAR = True
SAVE_INTERVAL = 1  # Save results every N grid sizes

# Parallelization
USE_PARALLEL = True  # Enable parallel processing for faster execution
# NUM_WORKERS will be automatically set to min(cpu_count(), RUNS_PER_SIZE)
