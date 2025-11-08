"""
Configuration file for Ordered vs. Unordered Features Ratio Case Study
"""

# Grid parameters
GRID_SIZE = 10  # 10x10 grid = 100 nodes

# Feature parameters (constant total features)
TOTAL_FEATURES = 5
STATES_PER_FEATURE = 4

# Ordered ratio configurations to test
# Each configuration specifies (ordered_features, unordered_features)
RATIO_CONFIGS = [
    (5, 0),  # 100% ordered (5 ordered, 0 unordered)
    (4, 1),  # 75% ordered (4 ordered, 1 unordered)
    (3, 2),  # 50% ordered (3 ordered, 2 unordered)
    (1, 4),  # 25% ordered (1 ordered, 4 unordered)
    (0, 5),  # 0% ordered (0 ordered, 5 unordered)
]

# Number of simulation runs per ratio configuration
RUNS_PER_RATIO = 200

# Maximum simulation steps (safety limit to prevent infinite loops)
MAX_STEPS = 1000000

# Correlation matrix - all zeros (no correlations)
# This will be a 5x5 matrix of zeros
CORRELATIONS = [[0.0 for _ in range(TOTAL_FEATURES)] for _ in range(TOTAL_FEATURES)]

# Output paths
RESULTS_DIR = "results"
RAW_DATA_FILE = "results/raw_data.csv"
AGGREGATED_DATA_FILE = "results/aggregated_data.csv"
PLOTS_DIR = "results/plots"

# Random seed for reproducibility
RANDOM_SEED = 42

# Progress tracking
SHOW_PROGRESS_BAR = True
SAVE_INTERVAL = 1  # Save results after each ratio configuration

# Parallelization
USE_PARALLEL = True  # Enable parallel processing for faster execution
# NUM_WORKERS will be automatically set to min(cpu_count(), RUNS_PER_RATIO)

# Feature naming conventions
def get_feature_configs(ordered_count, unordered_count):
    """
    Generate feature configurations with proper naming

    Args:
        ordered_count: Number of ordered features
        unordered_count: Number of unordered features

    Returns:
        List of feature dictionaries with name, hasOrder, and states
    """
    features = []

    # Add ordered features
    for i in range(ordered_count):
        features.append({
            'name': f'Spectrum Feature {i + 1}',
            'hasOrder': True,
            'states': [
                {'name': 'State A', 'color': '#FF6B6B'},
                {'name': 'State B', 'color': '#4ECDC4'},
                {'name': 'State C', 'color': '#45B7D1'},
                {'name': 'State D', 'color': '#FFA07A'}
            ]
        })

    # Add unordered features
    for i in range(unordered_count):
        features.append({
            'name': f'Category Feature {i + 1}',
            'hasOrder': False,
            'states': [
                {'name': 'Type A', 'color': '#96CEB4'},
                {'name': 'Type B', 'color': '#FFEAA7'},
                {'name': 'Type C', 'color': '#DFE6E9'},
                {'name': 'Type D', 'color': '#74B9FF'}
            ]
        })

    return features
