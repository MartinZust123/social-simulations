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
    Create line plot: Grid size vs. average convergence time (with error bars)

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(10, 6))

    plt.errorbar(
        data['grid_size'],
        data['steps_mean'],
        yerr=data['steps_std'],
        marker='o',
        markersize=10,
        linewidth=2.5,
        capsize=8,
        capthick=2,
        color='#2E86AB',
        ecolor='#A23B72',
        label='Mean ± SD'
    )

    plt.xlabel('Grid Size (N×N)', fontsize=14, fontweight='bold')
    plt.ylabel('Average Steps to Convergence', fontsize=14, fontweight='bold')
    plt.title('Impact of Grid Size on Convergence Time', fontsize=16, fontweight='bold', pad=20)
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
    Create line plot: Grid size vs. average unique cultures (with error bars)

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(10, 6))

    plt.errorbar(
        data['grid_size'],
        data['unique_cultures_mean'],
        yerr=data['unique_cultures_std'],
        marker='s',
        markersize=10,
        linewidth=2.5,
        capsize=8,
        capthick=2,
        color='#F18F01',
        ecolor='#C73E1D',
        label='Mean ± SD'
    )

    plt.xlabel('Grid Size (N×N)', fontsize=14, fontweight='bold')
    plt.ylabel('Average Unique Cultures', fontsize=14, fontweight='bold')
    plt.title('Impact of Grid Size on Cultural Diversity', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.legend(fontsize=12)
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'line_unique_cultures.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_largest_domain_plot(data):
    """
    Create line plot: Grid size vs. largest domain percentage (with error bars)

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(10, 6))

    plt.errorbar(
        data['grid_size'],
        data['largest_domain_mean'],
        yerr=data['largest_domain_std'],
        marker='D',
        markersize=10,
        linewidth=2.5,
        capsize=8,
        capthick=2,
        color='#06A77D',
        ecolor='#005F60',
        label='Mean ± SD'
    )

    plt.xlabel('Grid Size (N×N)', fontsize=14, fontweight='bold')
    plt.ylabel('Largest Domain Size (%)', fontsize=14, fontweight='bold')
    plt.title('Impact of Grid Size on Dominant Culture Size', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.legend(fontsize=12)
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'line_largest_domain.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_global_consensus_plot(data):
    """
    Create bar plot: Probability of global consensus per grid size

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(10, 6))

    colors = ['#2E86AB' if p > 0.5 else '#A23B72' for p in data['prob_global_consensus']]

    bars = plt.bar(
        data['grid_size'].astype(str),
        data['prob_global_consensus'],
        color=colors,
        edgecolor='black',
        linewidth=1.5,
        alpha=0.8
    )

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2.,
            height,
            f'{height:.2f}',
            ha='center',
            va='bottom',
            fontsize=11,
            fontweight='bold'
        )

    plt.xlabel('Grid Size (N×N)', fontsize=14, fontweight='bold')
    plt.ylabel('Probability of Global Consensus', fontsize=14, fontweight='bold')
    plt.title('Impact of Grid Size on Global Consensus Probability', fontsize=16, fontweight='bold', pad=20)
    plt.ylim(0, 1.1)
    plt.grid(True, alpha=0.3, linestyle='--', axis='y')
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'bar_global_consensus.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_scatter_plot(raw_data):
    """
    Create scatter plot: Convergence time vs. unique cultures for each grid size

    Args:
        raw_data: pandas DataFrame with raw simulation results
    """
    plt.figure(figsize=(12, 8))

    # Define colors for each grid size
    grid_sizes = sorted(raw_data['grid_size'].unique())
    colors = plt.cm.viridis(np.linspace(0, 1, len(grid_sizes)))

    for idx, grid_size in enumerate(grid_sizes):
        size_data = raw_data[raw_data['grid_size'] == grid_size]

        plt.scatter(
            size_data['steps_to_convergence'],
            size_data['unique_cultures'],
            alpha=0.6,
            s=50,
            color=colors[idx],
            label=f'{grid_size}×{grid_size}',
            edgecolors='black',
            linewidth=0.5
        )

    plt.xlabel('Steps to Convergence', fontsize=14, fontweight='bold')
    plt.ylabel('Unique Cultures at Equilibrium', fontsize=14, fontweight='bold')
    plt.title('Convergence Time vs. Cultural Diversity Across Grid Sizes',
              fontsize=16, fontweight='bold', pad=20)
    plt.legend(title='Grid Size', fontsize=11, title_fontsize=12, loc='best', framealpha=0.9)
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'scatter_convergence_vs_cultures.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved plot: {output_path}")


def create_summary_table(data):
    """
    Create a summary table visualization

    Args:
        data: pandas DataFrame with aggregated results
    """
    fig, ax = plt.subplots(figsize=(14, 6))
    ax.axis('tight')
    ax.axis('off')

    # Prepare table data
    table_data = []
    headers = [
        'Grid Size',
        'Total Nodes',
        'Avg Steps',
        'Avg Cultures',
        'Largest Domain (%)',
        'P(Consensus)'
    ]

    for _, row in data.iterrows():
        table_data.append([
            f"{row['grid_size']}×{row['grid_size']}",
            f"{int(row['total_nodes'])}",
            f"{row['steps_mean']:.0f} ± {row['steps_std']:.0f}",
            f"{row['unique_cultures_mean']:.1f} ± {row['unique_cultures_std']:.1f}",
            f"{row['largest_domain_mean']:.1f} ± {row['largest_domain_std']:.1f}",
            f"{row['prob_global_consensus']:.2f}"
        ])

    table = ax.table(
        cellText=table_data,
        colLabels=headers,
        cellLoc='center',
        loc='center',
        colWidths=[0.12, 0.12, 0.2, 0.2, 0.2, 0.16]
    )

    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1, 2)

    # Style header
    for i in range(len(headers)):
        table[(0, i)].set_facecolor('#2E86AB')
        table[(0, i)].set_text_props(weight='bold', color='white')

    # Alternate row colors
    for i in range(1, len(table_data) + 1):
        for j in range(len(headers)):
            if i % 2 == 0:
                table[(i, j)].set_facecolor('#E8F4F8')
            else:
                table[(i, j)].set_facecolor('#FFFFFF')

    plt.title('Grid Size Impact Analysis - Summary Statistics',
              fontsize=16, fontweight='bold', pad=20)

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, 'summary_table.png')
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

    # Load aggregated data
    agg_data = load_aggregated_data()

    # Load raw data
    raw_data = load_raw_data()

    # Create all plots
    print("\nGenerating plots...")
    create_convergence_time_plot(agg_data)
    create_unique_cultures_plot(agg_data)
    create_largest_domain_plot(agg_data)
    create_global_consensus_plot(agg_data)
    create_scatter_plot(raw_data)
    create_summary_table(agg_data)

    print("\n" + "="*60)
    print("VISUALIZATION COMPLETE")
    print("="*60)
    print(f"\nAll plots saved to: {config.PLOTS_DIR}")
