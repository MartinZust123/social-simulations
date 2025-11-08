"""
Main orchestrator script for Ordered vs. Unordered Features Ratio Case Study

Run this file to execute the entire simulation pipeline:
1. Data collection (run all simulations)
2. Data aggregation
3. Visualization generation

Usage:
    python run_simulation.py
"""
import sys
import time
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import config
from data_collection import collect_all_data, save_raw_data, aggregate_data, save_aggregated_data
from visualization import generate_all_visualizations


def print_banner(text):
    """Print a formatted banner"""
    print("\n" + "="*60)
    print(text.center(60))
    print("="*60 + "\n")


def main():
    """Main execution function"""
    start_time = time.time()

    print_banner("ORDERED VS. UNORDERED FEATURES RATIO CASE STUDY")

    print("Configuration:")
    print(f"  Grid Size: {config.GRID_SIZE}x{config.GRID_SIZE}")
    print(f"  Total Features: {config.TOTAL_FEATURES}")
    print(f"  States per Feature: {config.STATES_PER_FEATURE}")
    print(f"  Ratio Configurations: {len(config.RATIO_CONFIGS)}")
    print(f"  Runs per configuration: {config.RUNS_PER_RATIO}")
    print(f"  Total simulations: {len(config.RATIO_CONFIGS) * config.RUNS_PER_RATIO}")
    print(f"  Random seed: {config.RANDOM_SEED}")
    print(f"  Max steps per simulation: {config.MAX_STEPS}")
    print()

    print("Ratio Configurations:")
    for ordered, unordered in config.RATIO_CONFIGS:
        ratio = (ordered / config.TOTAL_FEATURES * 100)
        print(f"  - {ratio:.0f}% ordered: {ordered} ordered, {unordered} unordered features")
    print()

    # Step 1: Data Collection
    print_banner("STEP 1: DATA COLLECTION")

    # Check if raw data already exists
    if os.path.exists(config.RAW_DATA_FILE):
        print(f"Found existing raw data file: {config.RAW_DATA_FILE}")
        response = input("Do you want to use existing data? (y/n): ").lower().strip()

        if response == 'y':
            print("Using existing raw data. Skipping data collection.")
            all_results = None  # Will load from file later
        else:
            print("Collecting new data...")
            all_results = collect_all_data()
            save_raw_data(all_results)
    else:
        print("No existing raw data found. Starting data collection...")
        all_results = collect_all_data()
        save_raw_data(all_results)

    collection_time = time.time() - start_time

    # Step 2: Data Aggregation
    print_banner("STEP 2: DATA AGGREGATION")

    if all_results is None:
        # Load raw data from file
        import pandas as pd
        print(f"Loading raw data from {config.RAW_DATA_FILE}...")
        raw_df = pd.read_csv(config.RAW_DATA_FILE)
        all_results = raw_df.to_dict('records')
        print(f"Loaded {len(all_results)} simulation results")

    print("Aggregating results by ratio configuration...")
    aggregated_results = aggregate_data(all_results)
    save_aggregated_data(aggregated_results)

    aggregation_time = time.time() - start_time - collection_time

    # Step 3: Visualization
    print_banner("STEP 3: VISUALIZATION")

    generate_all_visualizations()

    visualization_time = time.time() - start_time - collection_time - aggregation_time

    # Summary
    print_banner("EXECUTION SUMMARY")

    total_time = time.time() - start_time

    print(f"Data Collection:  {collection_time:.1f} seconds ({collection_time/60:.1f} minutes)")
    print(f"Data Aggregation: {aggregation_time:.1f} seconds")
    print(f"Visualization:    {visualization_time:.1f} seconds")
    print(f"Total Time:       {total_time:.1f} seconds ({total_time/60:.1f} minutes)")
    print()
    print(f"Raw data saved to:        {config.RAW_DATA_FILE}")
    print(f"Aggregated data saved to: {config.AGGREGATED_DATA_FILE}")
    print(f"Plots saved to:           {config.PLOTS_DIR}/")
    print()

    print_banner("SIMULATION COMPLETE!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nSimulation interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError occurred: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
