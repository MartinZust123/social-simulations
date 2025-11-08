"""
Visualization module for generating plots and heat maps
"""
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os
import config


def load_aggregated_data(filename=None):
    """
    Load aggregated data from CSV

    Args:
        filename: CSV filename (default: config.AGGREGATED_DATA_FILE)

    Returns:
        pandas DataFrame
    """
    if filename is None:
        filename = config.AGGREGATED_DATA_FILE

    return pd.read_csv(filename)


def create_heatmap(data, x_col, y_col, value_col, title, filename, cmap='viridis', fmt='.2f'):
    """
    Create a heat map visualization

    Args:
        data: pandas DataFrame
        x_col: Column name for x-axis
        y_col: Column name for y-axis
        value_col: Column name for cell values
        title: Plot title
        filename: Output filename
        cmap: Color map (default: 'viridis')
        fmt: Format string for annotations (default: '.2f')
    """
    # Pivot data for heatmap
    pivot_table = data.pivot(index=y_col, columns=x_col, values=value_col)

    # Create figure
    plt.figure(figsize=(14, 10))

    # Create heatmap
    sns.heatmap(
        pivot_table,
        annot=True,
        fmt=fmt,
        cmap=cmap,
        cbar_kws={'label': value_col.replace('_', ' ').title()},
        linewidths=0.5
    )

    plt.title(title, fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('q (State Diversity)', fontsize=14, fontweight='bold')
    plt.ylabel('F (Feature Complexity)', fontsize=14, fontweight='bold')
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, filename)
    os.makedirs(config.PLOTS_DIR, exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved heatmap: {output_path}")


def create_all_heatmaps(data):
    """
    Create all heat map visualizations

    Args:
        data: pandas DataFrame with aggregated results
    """
    print("\nGenerating heat maps...")

    # 1. Average Unique Cultures
    create_heatmap(
        data,
        x_col='q',
        y_col='F',
        value_col='unique_cultures_mean',
        title='F vs q Phase Diagram: Average Number of Unique Cultures at Equilibrium',
        filename='heatmap_unique_cultures.png',
        cmap='RdYlGn_r',
        fmt='.1f'
    )

    # 2. Average Steps to Convergence
    create_heatmap(
        data,
        x_col='q',
        y_col='F',
        value_col='steps_mean',
        title='F vs q Phase Diagram: Average Steps to Convergence',
        filename='heatmap_convergence_time.png',
        cmap='plasma',
        fmt='.0f'
    )

    # 3. Probability of Global Consensus
    create_heatmap(
        data,
        x_col='q',
        y_col='F',
        value_col='prob_global_consensus',
        title='F vs q Phase Diagram: Probability of Global Consensus',
        filename='heatmap_global_consensus.png',
        cmap='RdYlGn',
        fmt='.2f'
    )

    # 4. Average Largest Domain Percentage
    create_heatmap(
        data,
        x_col='q',
        y_col='F',
        value_col='largest_domain_mean',
        title='F vs q Phase Diagram: Average Largest Domain Size (%)',
        filename='heatmap_largest_domain.png',
        cmap='YlOrRd',
        fmt='.1f'
    )

    # 5. Average Cultural Distance
    create_heatmap(
        data,
        x_col='q',
        y_col='F',
        value_col='avg_distance_mean',
        title='F vs q Phase Diagram: Average Cultural Distance at Equilibrium',
        filename='heatmap_cultural_distance.png',
        cmap='coolwarm',
        fmt='.3f'
    )


def create_scatter_plots(raw_data_file=None):
    """
    Create scatter plots for interesting (F, q) combinations

    Args:
        raw_data_file: Path to raw data CSV (default: config.RAW_DATA_FILE)
    """
    if raw_data_file is None:
        raw_data_file = config.RAW_DATA_FILE

    print("\nGenerating scatter plots...")

    # Load raw data
    data = pd.read_csv(raw_data_file)

    # Select interesting combinations to visualize
    interesting_combos = [
        (2, 5),   # Low F, low q
        (5, 10),  # Medium F, medium q
        (10, 20), # High F, high q
        (2, 20),  # Low F, high q
        (10, 5)   # High F, low q
    ]

    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    axes = axes.flatten()

    for idx, (F, q) in enumerate(interesting_combos):
        if idx >= len(axes):
            break

        # Filter data for this combination
        combo_data = data[(data['F'] == F) & (data['q'] == q)]

        if len(combo_data) == 0:
            continue

        ax = axes[idx]

        # Scatter plot: convergence time vs final diversity
        ax.scatter(
            combo_data['steps_to_convergence'],
            combo_data['unique_cultures'],
            alpha=0.6,
            s=50
        )

        ax.set_xlabel('Steps to Convergence', fontsize=12)
        ax.set_ylabel('Unique Cultures', fontsize=12)
        ax.set_title(f'F={F}, q={q}', fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)

    # Remove unused subplot
    if len(interesting_combos) < len(axes):
        fig.delaxes(axes[-1])

    plt.suptitle('Convergence Time vs. Cultural Diversity for Selected (F, q) Combinations',
                 fontsize=16, fontweight='bold', y=1.00)
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'scatter_convergence_vs_diversity.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved scatter plot: {output_path}")


def create_distribution_plots(data):
    """
    Create distribution plots showing variability

    Args:
        data: pandas DataFrame with aggregated results
    """
    print("\nGenerating distribution plots...")

    # Plot: Unique cultures distribution across q for different F values
    fig, axes = plt.subplots(3, 3, figsize=(18, 15))
    axes = axes.flatten()

    for idx, F in enumerate(config.F_VALUES):
        if idx >= len(axes):
            break

        ax = axes[idx]
        f_data = data[data['F'] == F]

        ax.errorbar(
            f_data['q'],
            f_data['unique_cultures_mean'],
            yerr=f_data['unique_cultures_std'],
            marker='o',
            linestyle='-',
            capsize=5,
            linewidth=2,
            markersize=8
        )

        ax.set_xlabel('q (State Diversity)', fontsize=11)
        ax.set_ylabel('Unique Cultures (Mean ± SD)', fontsize=11)
        ax.set_title(f'F = {F}', fontsize=13, fontweight='bold')
        ax.grid(True, alpha=0.3)
        ax.set_ylim(bottom=0)

    plt.suptitle('Cultural Diversity vs. State Diversity for Different Feature Complexities',
                 fontsize=16, fontweight='bold')
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'distribution_unique_cultures.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved distribution plot: {output_path}")


def generate_all_visualizations():
    """
    Generate all visualizations from aggregated and raw data
    """
    print("\n" + "="*60)
    print("GENERATING VISUALIZATIONS")
    print("="*60)

    # Load aggregated data
    agg_data = load_aggregated_data()

    # Create all heat maps
    create_all_heatmaps(agg_data)

    # Create scatter plots
    create_scatter_plots()

    # Create distribution plots
    create_distribution_plots(agg_data)

    print("\n" + "="*60)
    print("VISUALIZATION COMPLETE")
    print("="*60)
    print(f"\nAll plots saved to: {config.PLOTS_DIR}")
