"""
Visualization module for generating plots
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


def load_raw_data(filename=None):
    """
    Load raw data from CSV

    Args:
        filename: CSV filename (default: config.RAW_DATA_FILE)

    Returns:
        pandas DataFrame
    """
    if filename is None:
        filename = config.RAW_DATA_FILE

    return pd.read_csv(filename)


def create_convergence_time_plot(data):
    """
    Create line plot: Correlation vs. average convergence time

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(12, 7))

    # Plot with error bars
    plt.errorbar(
        data['correlation'],
        data['steps_mean'],
        yerr=data['steps_std'],
        marker='o',
        linestyle='-',
        linewidth=2.5,
        markersize=10,
        capsize=6,
        capthick=2,
        color='#2E86AB',
        ecolor='#A23B72',
        label='Mean ± Std Dev'
    )

    plt.xlabel('Correlation Coefficient', fontsize=14, fontweight='bold')
    plt.ylabel('Average Convergence Time (steps)', fontsize=14, fontweight='bold')
    plt.title('Impact of Feature Correlation on Convergence Time', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.legend(fontsize=12)
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'line_convergence_time.png')
    os.makedirs(config.PLOTS_DIR, exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_unique_cultures_plot(data):
    """
    Create line plot: Correlation vs. average unique cultures

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(12, 7))

    # Plot with error bars
    plt.errorbar(
        data['correlation'],
        data['unique_cultures_mean'],
        yerr=data['unique_cultures_std'],
        marker='s',
        linestyle='-',
        linewidth=2.5,
        markersize=10,
        capsize=6,
        capthick=2,
        color='#F18F01',
        ecolor='#C73E1D',
        label='Mean ± Std Dev'
    )

    plt.xlabel('Correlation Coefficient', fontsize=14, fontweight='bold')
    plt.ylabel('Average Unique Cultures', fontsize=14, fontweight='bold')
    plt.title('Impact of Feature Correlation on Cultural Diversity', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.legend(fontsize=12)
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'line_unique_cultures.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_cultural_distance_plot(data):
    """
    Create line plot: Correlation vs. average cultural distance

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(12, 7))

    # Plot with error bars
    plt.errorbar(
        data['correlation'],
        data['avg_distance_mean'],
        yerr=data['avg_distance_std'],
        marker='D',
        linestyle='-',
        linewidth=2.5,
        markersize=10,
        capsize=6,
        capthick=2,
        color='#06A77D',
        ecolor='#005F73',
        label='Mean ± Std Dev'
    )

    plt.xlabel('Correlation Coefficient', fontsize=14, fontweight='bold')
    plt.ylabel('Average Cultural Distance', fontsize=14, fontweight='bold')
    plt.title('Impact of Feature Correlation on Cultural Distance at Equilibrium', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.legend(fontsize=12)
    plt.ylim(bottom=0)
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'line_cultural_distance.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_scatter_convergence_vs_cultures(raw_data):
    """
    Create scatter plot: Convergence time vs. unique cultures colored by correlation value

    Args:
        raw_data: pandas DataFrame with raw simulation results
    """
    plt.figure(figsize=(14, 9))

    # Create color map for correlation values
    correlation_values = sorted(raw_data['correlation'].unique())
    colors = plt.cm.RdYlBu(np.linspace(0, 1, len(correlation_values)))
    color_map = {corr: colors[i] for i, corr in enumerate(correlation_values)}

    # Plot each correlation value with different color
    for corr in correlation_values:
        corr_data = raw_data[raw_data['correlation'] == corr]
        plt.scatter(
            corr_data['steps_to_convergence'],
            corr_data['unique_cultures'],
            c=[color_map[corr]],
            label=f'ρ = {corr:.2f}',
            alpha=0.6,
            s=60,
            edgecolors='black',
            linewidth=0.5
        )

    plt.xlabel('Steps to Convergence', fontsize=14, fontweight='bold')
    plt.ylabel('Unique Cultures at Equilibrium', fontsize=14, fontweight='bold')
    plt.title('Convergence Time vs. Cultural Diversity by Correlation Strength', fontsize=16, fontweight='bold', pad=20)
    plt.legend(title='Correlation (ρ)', fontsize=10, title_fontsize=12, loc='best', ncol=2)
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'scatter_convergence_vs_cultures.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_global_consensus_bar_plot(data):
    """
    Create bar plot: Probability of global consensus per correlation value

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(12, 7))

    # Create color gradient for bars
    colors = plt.cm.viridis(np.linspace(0.2, 0.9, len(data)))

    bars = plt.bar(
        data['correlation'],
        data['prob_global_consensus'],
        width=0.15,
        color=colors,
        edgecolor='black',
        linewidth=1.5,
        alpha=0.85
    )

    # Add value labels on top of bars
    for bar in bars:
        height = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2.,
            height,
            f'{height:.2f}',
            ha='center',
            va='bottom',
            fontsize=10,
            fontweight='bold'
        )

    plt.xlabel('Correlation Coefficient', fontsize=14, fontweight='bold')
    plt.ylabel('Probability of Global Consensus', fontsize=14, fontweight='bold')
    plt.title('Impact of Feature Correlation on Global Consensus Probability', fontsize=16, fontweight='bold', pad=20)
    plt.ylim(0, max(data['prob_global_consensus']) * 1.15)  # Add space for labels
    plt.grid(True, alpha=0.3, linestyle='--', axis='y')
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'bar_global_consensus.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_combined_overview_plot(data):
    """
    Create a combined 2x2 subplot overview of key metrics

    Args:
        data: pandas DataFrame with aggregated results
    """
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('Correlation Strength Sweep: Overview of Key Metrics', fontsize=18, fontweight='bold', y=0.995)

    # Plot 1: Convergence Time
    ax1 = axes[0, 0]
    ax1.plot(data['correlation'], data['steps_mean'], marker='o', linewidth=2.5, markersize=8, color='#2E86AB')
    ax1.fill_between(
        data['correlation'],
        data['steps_mean'] - data['steps_std'],
        data['steps_mean'] + data['steps_std'],
        alpha=0.3,
        color='#2E86AB'
    )
    ax1.set_xlabel('Correlation Coefficient', fontsize=12, fontweight='bold')
    ax1.set_ylabel('Convergence Time (steps)', fontsize=12, fontweight='bold')
    ax1.set_title('Convergence Time', fontsize=14, fontweight='bold')
    ax1.grid(True, alpha=0.3)

    # Plot 2: Unique Cultures
    ax2 = axes[0, 1]
    ax2.plot(data['correlation'], data['unique_cultures_mean'], marker='s', linewidth=2.5, markersize=8, color='#F18F01')
    ax2.fill_between(
        data['correlation'],
        data['unique_cultures_mean'] - data['unique_cultures_std'],
        data['unique_cultures_mean'] + data['unique_cultures_std'],
        alpha=0.3,
        color='#F18F01'
    )
    ax2.set_xlabel('Correlation Coefficient', fontsize=12, fontweight='bold')
    ax2.set_ylabel('Unique Cultures', fontsize=12, fontweight='bold')
    ax2.set_title('Cultural Diversity', fontsize=14, fontweight='bold')
    ax2.grid(True, alpha=0.3)

    # Plot 3: Cultural Distance
    ax3 = axes[1, 0]
    ax3.plot(data['correlation'], data['avg_distance_mean'], marker='D', linewidth=2.5, markersize=8, color='#06A77D')
    ax3.fill_between(
        data['correlation'],
        data['avg_distance_mean'] - data['avg_distance_std'],
        data['avg_distance_mean'] + data['avg_distance_std'],
        alpha=0.3,
        color='#06A77D'
    )
    ax3.set_xlabel('Correlation Coefficient', fontsize=12, fontweight='bold')
    ax3.set_ylabel('Cultural Distance', fontsize=12, fontweight='bold')
    ax3.set_title('Average Cultural Distance', fontsize=14, fontweight='bold')
    ax3.grid(True, alpha=0.3)
    ax3.set_ylim(bottom=0)

    # Plot 4: Global Consensus Probability
    ax4 = axes[1, 1]
    colors = plt.cm.viridis(np.linspace(0.2, 0.9, len(data)))
    bars = ax4.bar(data['correlation'], data['prob_global_consensus'], width=0.15, color=colors, edgecolor='black', linewidth=1.5)
    ax4.set_xlabel('Correlation Coefficient', fontsize=12, fontweight='bold')
    ax4.set_ylabel('Probability', fontsize=12, fontweight='bold')
    ax4.set_title('Global Consensus Probability', fontsize=14, fontweight='bold')
    ax4.grid(True, alpha=0.3, axis='y')
    ax4.set_ylim(0, max(data['prob_global_consensus']) * 1.1)

    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'combined_overview.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def generate_all_visualizations():
    """
    Generate all visualizations from aggregated and raw data
    """
    print("\n" + "="*60)
    print("GENERATING VISUALIZATIONS")
    print("="*60)

    # Load data
    print("\nLoading data...")
    agg_data = load_aggregated_data()
    raw_data = load_raw_data()

    # Create individual plots
    print("\nGenerating individual plots...")
    create_convergence_time_plot(agg_data)
    create_unique_cultures_plot(agg_data)
    create_cultural_distance_plot(agg_data)
    create_scatter_convergence_vs_cultures(raw_data)
    create_global_consensus_bar_plot(agg_data)

    # Create combined overview
    print("\nGenerating combined overview...")
    create_combined_overview_plot(agg_data)

    print("\n" + "="*60)
    print("VISUALIZATION COMPLETE")
    print("="*60)
    print(f"\nAll plots saved to: {config.PLOTS_DIR}")
