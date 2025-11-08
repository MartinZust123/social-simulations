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
from axelrod_model import AxelrodModel
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
        args: Tuple of (grid_size, F, q, max_steps, run_id)

    Returns:
        Dictionary with parameters and metrics
    """
    grid_size, F, q, max_steps, run_id = args

    # Create and run model
    model = AxelrodModel(grid_size, F, q, max_steps)
    steps = model.run()
    final_grid = model.get_grid()

    # Calculate metrics
    metrics = calculate_all_metrics(final_grid, steps)

    # Combine parameters and metrics
    result = {
        'grid_size': grid_size,
        'F': F,
        'q': q,
        'run_id': run_id,
        **metrics
    }

    return result


def run_grid_size(grid_size, num_runs, F, q, max_steps, use_parallel=True):
    """
    Run multiple simulations for a single grid size using parallelization

    Args:
        grid_size: Size of square grid
        num_runs: Number of simulation runs
        F: Number of features
        q: Number of states per feature
        max_steps: Maximum simulation steps
        use_parallel: Whether to use parallel processing (default: True)

    Returns:
        List of result dictionaries
    """
    # Prepare arguments for all runs
    args_list = [(grid_size, F, q, max_steps, run_idx) for run_idx in range(num_runs)]

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
    Run all simulations for all grid sizes

    Returns:
        List of all simulation results
    """
    # Set random seed
    set_random_seed(config.RANDOM_SEED)

    all_results = []
    total_grid_sizes = len(config.GRID_SIZES)

    print(f"Starting data collection...")
    print(f"Grid sizes to test: {config.GRID_SIZES}")
    print(f"Runs per grid size: {config.RUNS_PER_SIZE}")
    print(f"Total simulations: {total_grid_sizes * config.RUNS_PER_SIZE}")
    print(f"Fixed parameters: F={config.F}, q={config.Q}")
    print(f"Parallel processing: {'Enabled' if config.USE_PARALLEL else 'Disabled'}")
    if config.USE_PARALLEL:
        print(f"CPU cores available: {cpu_count()}")
    print()

    # Create progress bar for grid sizes
    if config.SHOW_PROGRESS_BAR:
        pbar = tqdm(config.GRID_SIZES, desc="Processing grid sizes", unit="size")
    else:
        pbar = config.GRID_SIZES

    for size_idx, grid_size in enumerate(pbar):
        # Update progress bar description
        if config.SHOW_PROGRESS_BAR:
            pbar.set_description(f"Grid size={grid_size}x{grid_size}")

        # Run simulations for this grid size
        results = run_grid_size(
            grid_size,
            config.RUNS_PER_SIZE,
            config.F,
            config.Q,
            config.MAX_STEPS,
            use_parallel=config.USE_PARALLEL
        )

        all_results.extend(results)

        # Periodic save
        if (size_idx + 1) % config.SAVE_INTERVAL == 0:
            save_raw_data(all_results)
            if not config.SHOW_PROGRESS_BAR:
                print(f"Saved progress: {size_idx + 1}/{total_grid_sizes} grid sizes")

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
    Aggregate results by grid size

    Args:
        results: List of raw simulation results

    Returns:
        List of aggregated statistics per grid size
    """
    # Group by grid_size
    groups = {}

    for result in results:
        key = result['grid_size']
        if key not in groups:
            groups[key] = []
        groups[key].append(result)

    # Calculate aggregate statistics
    aggregated = []

    for grid_size, group_results in sorted(groups.items()):
        # Extract metric values
        steps = [r['steps_to_convergence'] for r in group_results]
        unique_cultures = [r['unique_cultures'] for r in group_results]
        largest_domain = [r['largest_domain_percentage'] for r in group_results]
        avg_distance = [r['avg_cultural_distance'] for r in group_results]

        # Calculate statistics
        agg_result = {
            'grid_size': grid_size,
            'total_nodes': grid_size * grid_size,
            'F': config.F,
            'q': config.Q,
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
