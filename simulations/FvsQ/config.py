"""
Configuration file for F vs q Phase Diagram Case Study
"""

# Grid parameters
GRID_SIZE = 10  # 10x10 grid = 100 nodes

# Feature complexity (F) - number of cultural features per agent
F_VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10]

# State diversity (q) - number of possible values per feature
Q_VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

# Number of simulation runs per (F, q) combination
RUNS_PER_COMBINATION = 100

# Maximum simulation steps (safety limit to prevent infinite loops)
MAX_STEPS = 1000000

# Output paths
RESULTS_DIR = "results"
RAW_DATA_FILE = "results/raw_data.csv"
AGGREGATED_DATA_FILE = "results/aggregated_data.csv"
PLOTS_DIR = "results/plots"

# Random seed for reproducibility (None = random)
RANDOM_SEED = 42

# Progress tracking
SHOW_PROGRESS_BAR = True
SAVE_INTERVAL = 10  # Save results every N combinations

# Parallelization
USE_PARALLEL = True  # Enable parallel processing for faster execution
# NUM_WORKERS will be automatically set to min(cpu_count(), RUNS_PER_COMBINATION)
