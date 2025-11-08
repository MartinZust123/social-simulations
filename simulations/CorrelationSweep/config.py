"""
Configuration file for Correlation Strength Sweep Case Study
"""

# Grid parameters
GRID_SIZE = 10  # 10x10 grid = 100 nodes (fast simulations)

# 3-feature template for good balance between complexity and speed
INTERPRETABLE_FEATURES = [
    {
        'name': 'Political Ideology',
        'states': [
            {'name': 'Far Left', 'color': '#e63946'},
            {'name': 'Left', 'color': '#f77f8e'},
            {'name': 'Center', 'color': '#ccc5b9'},
            {'name': 'Right', 'color': '#6a9bd8'},
            {'name': 'Far Right', 'color': '#1d3557'}
        ],
        'hasOrder': True
    },
    {
        'name': 'Economic Policy',
        'states': [
            {'name': 'Socialist', 'color': '#d62828'},
            {'name': 'Mixed Left', 'color': '#f77f00'},
            {'name': 'Centrist', 'color': '#fcbf49'},
            {'name': 'Mixed Right', 'color': '#06a77d'},
            {'name': 'Capitalist', 'color': '#005f73'}
        ],
        'hasOrder': True
    },
    {
        'name': 'Cultural Values',
        'states': [
            {'name': 'Very Traditional', 'color': '#8b5a3c'},
            {'name': 'Traditional', 'color': '#b8956a'},
            {'name': 'Moderate', 'color': '#dda15e'},
            {'name': 'Progressive', 'color': '#bc6c25'},
            {'name': 'Very Progressive', 'color': '#7f5539'}
        ],
        'hasOrder': True
    }
]

# Number of features (3 for good balance)
NUM_FEATURES = len(INTERPRETABLE_FEATURES)

# Granular correlation values (17 values for smooth patterns)
CORRELATION_VALUES = [
    -1.0, -0.9, -0.75, -0.6, -0.5, -0.4, -0.25, -0.1, 0.0,
    0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1.0
]

# MAXIMUM runs per correlation for ultra-strong statistical significance
RUNS_PER_CORRELATION = 500

# Maximum simulation steps (safety limit to prevent infinite loops)
MAX_STEPS = 1000000

# Output paths
RESULTS_DIR = "results"
RAW_DATA_FILE = "results/raw_data.csv"
AGGREGATED_DATA_FILE = "results/aggregated_data.csv"
PLOTS_DIR = "results/plots"

# Random seed for reproducibility
RANDOM_SEED = 42

# Progress tracking
SHOW_PROGRESS_BAR = True
SAVE_INTERVAL = 3  # Save results every N correlation values

# Parallelization
USE_PARALLEL = True  # Enable parallel processing for faster execution
# NUM_WORKERS will be automatically set to min(cpu_count(), RUNS_PER_CORRELATION)
