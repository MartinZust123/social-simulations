"""
Data collection module for running batches of simulations
"""
import csv
import os
import random
import numpy as np
from tqdm import tqdm
from multiprocessing import Pool, cpu_count
import config
from axelrod_interpretable_model import InterpretableAxelrodModel
from metrics import calculate_all_metrics


def set_random_seed(seed):
    """Set random seed for reproducibility"""
    if seed is not None:
        random.seed(seed)
        np.random.seed(seed)


def run_single_simulation(args):
    """
    Run a single simulation with given parameters

    This function signature is designed for multiprocessing.Pool.map()

    Args:
        args: Tuple of (ordered_count, unordered_count, grid_size, max_steps, run_id)

    Returns:
        Dictionary with parameters and metrics
    """
    ordered_count, unordered_count, grid_size, max_steps, run_id = args

    # Get feature configurations
    feature_configs = config.get_feature_configs(ordered_count, unordered_count)

    # Create and run model
    model = InterpretableAxelrodModel(grid_size, feature_configs, max_steps)
    steps = model.run()
    final_grid = model.get_grid()

    # Calculate metrics
    metrics = calculate_all_metrics(final_grid, steps)

    # Calculate ordered ratio percentage
    total_features = ordered_count + unordered_count
    ordered_ratio = (ordered_count / total_features * 100) if total_features > 0 else 0

    # Combine parameters and metrics
    result = {
        'ordered_features': ordered_count,
        'unordered_features': unordered_count,
        'ordered_ratio': ordered_ratio,
        'total_features': total_features,
        'grid_size': grid_size,
        'run_id': run_id,
        **metrics
    }

    return result


def run_ratio_configuration(ordered_count, unordered_count, num_runs, grid_size, max_steps, use_parallel=True):
    """
    Run multiple simulations for a single ratio configuration using parallelization

    Args:
        ordered_count: Number of ordered features
        unordered_count: Number of unordered features
        num_runs: Number of simulation runs
        grid_size: Size of square grid
        max_steps: Maximum simulation steps
        use_parallel: Whether to use parallel processing (default: True)

    Returns:
        List of result dictionaries
    """
    # Prepare arguments for all runs
    args_list = [(ordered_count, unordered_count, grid_size, max_steps, run_idx) for run_idx in range(num_runs)]

    if use_parallel and num_runs > 1:
        # Use parallel processing
        num_workers = min(cpu_count(), num_runs)
        with Pool(processes=num_workers) as pool:
            results = pool.map(run_single_simulation, args_list)
    else:
        # Sequential processing (fallback)
        results = [run_single_simulation(args) for args in args_list]

    return results


def collect_all_data():
    """
    Run all simulations for all ratio configurations

    Returns:
        List of all simulation results
    """
    # Set random seed
    set_random_seed(config.RANDOM_SEED)

    all_results = []
    total_configs = len(config.RATIO_CONFIGS)

    print(f"Starting data collection...")
    print(f"Total ratio configurations: {total_configs}")
    print(f"Runs per configuration: {config.RUNS_PER_RATIO}")
    print(f"Total simulations: {total_configs * config.RUNS_PER_RATIO}")
    print(f"Grid size: {config.GRID_SIZE}x{config.GRID_SIZE}")
    print(f"Total features: {config.TOTAL_FEATURES}")
    print(f"States per feature: {config.STATES_PER_FEATURE}")
    print(f"Parallel processing: {'Enabled' if config.USE_PARALLEL else 'Disabled'}")
    if config.USE_PARALLEL:
        print(f"CPU cores available: {cpu_count()}")
    print()

    # Create progress bar for configurations
    if config.SHOW_PROGRESS_BAR:
        pbar = tqdm(config.RATIO_CONFIGS, desc="Processing configurations", unit="config")
    else:
        pbar = config.RATIO_CONFIGS

    for config_idx, (ordered_count, unordered_count) in enumerate(pbar):
        # Calculate ordered ratio percentage
        ordered_ratio = (ordered_count / config.TOTAL_FEATURES * 100)

        # Update progress bar description
        if config.SHOW_PROGRESS_BAR:
            pbar.set_description(f"Ordered={ordered_count}, Unordered={unordered_count} ({ordered_ratio:.0f}%)")

        # Run simulations for this configuration
        results = run_ratio_configuration(
            ordered_count,
            unordered_count,
            config.RUNS_PER_RATIO,
            config.GRID_SIZE,
            config.MAX_STEPS,
            use_parallel=config.USE_PARALLEL
        )

        all_results.extend(results)

        # Periodic save
        if (config_idx + 1) % config.SAVE_INTERVAL == 0:
            save_raw_data(all_results)
            if not config.SHOW_PROGRESS_BAR:
                print(f"Saved progress: {config_idx + 1}/{total_configs} configurations")

    print("\nData collection complete!")
    return all_results


def save_raw_data(results, filename=None):
    """
    Save raw simulation results to CSV

    Args:
        results: List of result dictionaries
        filename: Output filename (default: config.RAW_DATA_FILE)
    """
    if filename is None:
        filename = config.RAW_DATA_FILE

    # Ensure results directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    if not results:
        print("No results to save")
        return

    # Write to CSV
    fieldnames = results[0].keys()

    with open(filename, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print(f"Saved {len(results)} results to {filename}")


def aggregate_data(results):
    """
    Aggregate results by ratio configuration

    Args:
        results: List of raw simulation results

    Returns:
        List of aggregated statistics per configuration
    """
    # Check if data has required columns
    if not results:
        print("Error: No results to aggregate")
        return []

    if 'ordered_features' not in results[0]:
        print("\nError: Old data format detected!")
        print("The existing CSV file is from a previous version and is incompatible.")
        print("Please either:")
        print("  1. Delete the results/raw_data.csv file and run new simulations")
        print("  2. Answer 'n' when asked to use existing data")
        raise ValueError("Incompatible data format: missing 'ordered_features' column")

    # Group by (ordered_features, unordered_features)
    groups = {}

    for result in results:
        key = (result['ordered_features'], result['unordered_features'])
        if key not in groups:
            groups[key] = []
        groups[key].append(result)

    # Calculate aggregate statistics
    aggregated = []

    for (ordered_count, unordered_count), group_results in groups.items():
        # Extract metric values
        steps = [r['steps_to_convergence'] for r in group_results]
        unique_cultures = [r['unique_cultures'] for r in group_results]
        largest_domain = [r['largest_domain_percentage'] for r in group_results]
        avg_distance = [r['avg_cultural_distance'] for r in group_results]

        # Calculate ordered ratio percentage
        ordered_ratio = (ordered_count / config.TOTAL_FEATURES * 100)

        # Calculate statistics
        agg_result = {
            'ordered_features': ordered_count,
            'unordered_features': unordered_count,
            'ordered_ratio': ordered_ratio,
            'total_features': config.TOTAL_FEATURES,
            'num_runs': len(group_results),

            # Steps to convergence
            'steps_mean': np.mean(steps),
            'steps_std': np.std(steps),
            'steps_min': np.min(steps),
            'steps_max': np.max(steps),

            # Unique cultures
            'unique_cultures_mean': np.mean(unique_cultures),
            'unique_cultures_std': np.std(unique_cultures),
            'unique_cultures_min': np.min(unique_cultures),
            'unique_cultures_max': np.max(unique_cultures),

            # Largest domain percentage
            'largest_domain_mean': np.mean(largest_domain),
            'largest_domain_std': np.std(largest_domain),

            # Average cultural distance
            'avg_distance_mean': np.mean(avg_distance),
            'avg_distance_std': np.std(avg_distance),

            # Probability of global consensus
            'prob_global_consensus': sum(1 for uc in unique_cultures if uc == 1) / len(unique_cultures)
        }

        aggregated.append(agg_result)

    # Sort by ordered ratio for consistent ordering
    aggregated.sort(key=lambda x: x['ordered_ratio'], reverse=True)

    return aggregated


def save_aggregated_data(aggregated_results, filename=None):
    """
    Save aggregated statistics to CSV

    Args:
        aggregated_results: List of aggregated result dictionaries
        filename: Output filename (default: config.AGGREGATED_DATA_FILE)
    """
    if filename is None:
        filename = config.AGGREGATED_DATA_FILE

    # Ensure results directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    if not aggregated_results:
        print("No aggregated results to save")
        return

    # Write to CSV
    fieldnames = aggregated_results[0].keys()

    with open(filename, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(aggregated_results)

    print(f"Saved aggregated results to {filename}")
