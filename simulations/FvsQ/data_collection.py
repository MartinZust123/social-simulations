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
        args: Tuple of (F, q, grid_size, max_steps, run_id)

    Returns:
        Dictionary with parameters and metrics
    """
    F, q, grid_size, max_steps, run_id = args

    # Create and run model
    model = AxelrodModel(grid_size, F, q, max_steps)
    steps = model.run()
    final_grid = model.get_grid()

    # Calculate metrics
    metrics = calculate_all_metrics(final_grid, steps)

    # Combine parameters and metrics
    result = {
        'F': F,
        'q': q,
        'grid_size': grid_size,
        'run_id': run_id,
        **metrics
    }

    return result


def run_parameter_combination(F, q, num_runs, grid_size, max_steps, use_parallel=True):
    """
    Run multiple simulations for a single (F, q) combination using parallelization

    Args:
        F: Number of features
        q: Number of states per feature
        num_runs: Number of simulation runs
        grid_size: Size of square grid
        max_steps: Maximum simulation steps
        use_parallel: Whether to use parallel processing (default: True)

    Returns:
        List of result dictionaries
    """
    # Prepare arguments for all runs
    args_list = [(F, q, grid_size, max_steps, run_idx) for run_idx in range(num_runs)]

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
    Run all simulations for all (F, q) combinations

    Returns:
        List of all simulation results
    """
    # Set random seed
    set_random_seed(config.RANDOM_SEED)

    all_results = []
    total_combinations = len(config.F_VALUES) * len(config.Q_VALUES)

    print(f"Starting data collection...")
    print(f"Total combinations: {total_combinations}")
    print(f"Runs per combination: {config.RUNS_PER_COMBINATION}")
    print(f"Total simulations: {total_combinations * config.RUNS_PER_COMBINATION}")
    print(f"Grid size: {config.GRID_SIZE}x{config.GRID_SIZE}")
    print(f"Parallel processing: {'Enabled' if config.USE_PARALLEL else 'Disabled'}")
    if config.USE_PARALLEL:
        print(f"CPU cores available: {cpu_count()}")
    print()

    # Create progress bar for combinations
    combinations = [(F, q) for F in config.F_VALUES for q in config.Q_VALUES]

    if config.SHOW_PROGRESS_BAR:
        pbar = tqdm(combinations, desc="Processing combinations", unit="combo")
    else:
        pbar = combinations

    for combo_idx, (F, q) in enumerate(pbar):
        # Update progress bar description
        if config.SHOW_PROGRESS_BAR:
            pbar.set_description(f"F={F}, q={q}")

        # Run simulations for this combination
        results = run_parameter_combination(
            F, q,
            config.RUNS_PER_COMBINATION,
            config.GRID_SIZE,
            config.MAX_STEPS,
            use_parallel=config.USE_PARALLEL
        )

        all_results.extend(results)

        # Periodic save
        if (combo_idx + 1) % config.SAVE_INTERVAL == 0:
            save_raw_data(all_results)
            if not config.SHOW_PROGRESS_BAR:
                print(f"Saved progress: {combo_idx + 1}/{total_combinations} combinations")

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
    Aggregate results by (F, q) combination

    Args:
        results: List of raw simulation results

    Returns:
        List of aggregated statistics per (F, q) combination
    """
    # Group by (F, q)
    groups = {}

    for result in results:
        key = (result['F'], result['q'])
        if key not in groups:
            groups[key] = []
        groups[key].append(result)

    # Calculate aggregate statistics
    aggregated = []

    for (F, q), group_results in groups.items():
        # Extract metric values
        steps = [r['steps_to_convergence'] for r in group_results]
        unique_cultures = [r['unique_cultures'] for r in group_results]
        largest_domain = [r['largest_domain_percentage'] for r in group_results]
        avg_distance = [r['avg_cultural_distance'] for r in group_results]

        # Calculate statistics
        agg_result = {
            'F': F,
            'q': q,
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
