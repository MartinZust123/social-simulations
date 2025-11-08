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


def create_bar_plot_convergence_time(data, filename='bar_convergence_time.png'):
    """
    Bar plot: Ordered ratio (%) vs. average convergence time

    Args:
        data: pandas DataFrame with aggregated results
        filename: Output filename
    """
    plt.figure(figsize=(10, 6))

    # Create bar plot
    bars = plt.bar(
        data['ordered_ratio'],
        data['steps_mean'],
        yerr=data['steps_std'],
        capsize=5,
        color='#4ECDC4',
        edgecolor='black',
        linewidth=1.5,
        alpha=0.8
    )

    plt.xlabel('Ordered Features Ratio (%)', fontsize=14, fontweight='bold')
    plt.ylabel('Average Convergence Time (steps)', fontsize=14, fontweight='bold')
    plt.title('Effect of Ordered Features Ratio on Convergence Time', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3, axis='y')
    plt.xticks(data['ordered_ratio'], fontsize=12)
    plt.yticks(fontsize=12)

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.0f}',
                ha='center', va='bottom', fontsize=10, fontweight='bold')

    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, filename)
    os.makedirs(config.PLOTS_DIR, exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved bar plot: {output_path}")


def create_bar_plot_unique_cultures(data, filename='bar_unique_cultures.png'):
    """
    Bar plot: Ordered ratio (%) vs. average unique cultures

    Args:
        data: pandas DataFrame with aggregated results
        filename: Output filename
    """
    plt.figure(figsize=(10, 6))

    # Create bar plot
    bars = plt.bar(
        data['ordered_ratio'],
        data['unique_cultures_mean'],
        yerr=data['unique_cultures_std'],
        capsize=5,
        color='#FF6B6B',
        edgecolor='black',
        linewidth=1.5,
        alpha=0.8
    )

    plt.xlabel('Ordered Features Ratio (%)', fontsize=14, fontweight='bold')
    plt.ylabel('Average Unique Cultures', fontsize=14, fontweight='bold')
    plt.title('Effect of Ordered Features Ratio on Cultural Diversity', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3, axis='y')
    plt.xticks(data['ordered_ratio'], fontsize=12)
    plt.yticks(fontsize=12)

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.1f}',
                ha='center', va='bottom', fontsize=10, fontweight='bold')

    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, filename)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved bar plot: {output_path}")


def create_line_plot_cultural_distance(data, filename='line_cultural_distance.png'):
    """
    Line plot: Ordered ratio (%) vs. average cultural distance

    Args:
        data: pandas DataFrame with aggregated results
        filename: Output filename
    """
    plt.figure(figsize=(10, 6))

    # Create line plot with error bands
    plt.plot(
        data['ordered_ratio'],
        data['avg_distance_mean'],
        marker='o',
        markersize=10,
        linewidth=3,
        color='#45B7D1',
        label='Mean Cultural Distance'
    )

    # Add error bands
    plt.fill_between(
        data['ordered_ratio'],
        data['avg_distance_mean'] - data['avg_distance_std'],
        data['avg_distance_mean'] + data['avg_distance_std'],
        alpha=0.3,
        color='#45B7D1'
    )

    plt.xlabel('Ordered Features Ratio (%)', fontsize=14, fontweight='bold')
    plt.ylabel('Average Cultural Distance', fontsize=14, fontweight='bold')
    plt.title('Effect of Ordered Features Ratio on Cultural Distance', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3)
    plt.xticks(data['ordered_ratio'], fontsize=12)
    plt.yticks(fontsize=12)
    plt.legend(fontsize=12, loc='best')

    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, filename)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved line plot: {output_path}")


def create_box_plot_convergence_distribution(raw_data, filename='box_convergence_distribution.png'):
    """
    Box plot: Distribution of convergence times for each ratio

    Args:
        raw_data: pandas DataFrame with raw simulation results
        filename: Output filename
    """
    plt.figure(figsize=(12, 7))

    # Prepare data for box plot
    # Group by ordered_ratio
    box_data = []
    labels = []
    positions = []

    for ratio in sorted(raw_data['ordered_ratio'].unique(), reverse=True):
        ratio_data = raw_data[raw_data['ordered_ratio'] == ratio]['steps_to_convergence']
        box_data.append(ratio_data)
        labels.append(f'{ratio:.0f}%')
        positions.append(ratio)

    # Create box plot
    bp = plt.boxplot(
        box_data,
        positions=positions,
        widths=8,
        patch_artist=True,
        notch=True,
        showmeans=True,
        meanprops=dict(marker='D', markerfacecolor='red', markersize=8)
    )

    # Color the boxes
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#96CEB4']
    for patch, color in zip(bp['boxes'], colors):
        patch.set_facecolor(color)
        patch.set_alpha(0.7)

    plt.xlabel('Ordered Features Ratio (%)', fontsize=14, fontweight='bold')
    plt.ylabel('Convergence Time (steps)', fontsize=14, fontweight='bold')
    plt.title('Distribution of Convergence Times by Ordered Features Ratio', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3, axis='y')
    plt.xticks(positions, labels, fontsize=12)
    plt.yticks(fontsize=12)

    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, filename)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved box plot: {output_path}")


def create_scatter_plot_convergence_vs_cultures(raw_data, filename='scatter_convergence_vs_cultures.png'):
    """
    Scatter plot: Convergence time vs. unique cultures colored by ratio

    Args:
        raw_data: pandas DataFrame with raw simulation results
        filename: Output filename
    """
    plt.figure(figsize=(12, 8))

    # Define colors for each ratio
    ratio_colors = {
        100.0: '#FF6B6B',  # 100% ordered
        75.0: '#4ECDC4',   # 75% ordered
        50.0: '#45B7D1',   # 50% ordered
        25.0: '#FFA07A',   # 25% ordered
        0.0: '#96CEB4'     # 0% ordered
    }

    # Plot each ratio with different color
    for ratio in sorted(raw_data['ordered_ratio'].unique(), reverse=True):
        ratio_data = raw_data[raw_data['ordered_ratio'] == ratio]
        plt.scatter(
            ratio_data['steps_to_convergence'],
            ratio_data['unique_cultures'],
            c=ratio_colors.get(ratio, '#888888'),
            label=f'{ratio:.0f}% ordered',
            alpha=0.6,
            s=50,
            edgecolors='black',
            linewidth=0.5
        )

    plt.xlabel('Convergence Time (steps)', fontsize=14, fontweight='bold')
    plt.ylabel('Unique Cultures at Equilibrium', fontsize=14, fontweight='bold')
    plt.title('Convergence Time vs. Cultural Diversity by Ordered Features Ratio', fontsize=16, fontweight='bold', pad=20)
    plt.grid(True, alpha=0.3)
    plt.legend(fontsize=11, loc='best', framealpha=0.9)
    plt.xticks(fontsize=12)
    plt.yticks(fontsize=12)

    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, filename)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved scatter plot: {output_path}")


def create_summary_table(data, filename='summary_table.png'):
    """
    Create a summary table visualization

    Args:
        data: pandas DataFrame with aggregated results
        filename: Output filename
    """
    fig, ax = plt.subplots(figsize=(14, 6))
    ax.axis('tight')
    ax.axis('off')

    # Prepare table data
    table_data = []
    headers = ['Ordered\nRatio', 'Ordered\nFeatures', 'Unordered\nFeatures',
               'Avg Convergence\nTime', 'Avg Unique\nCultures',
               'Avg Cultural\nDistance', 'Prob Global\nConsensus']

    for _, row in data.iterrows():
        table_data.append([
            f"{row['ordered_ratio']:.0f}%",
            f"{row['ordered_features']:.0f}",
            f"{row['unordered_features']:.0f}",
            f"{row['steps_mean']:.0f} ± {row['steps_std']:.0f}",
            f"{row['unique_cultures_mean']:.2f} ± {row['unique_cultures_std']:.2f}",
            f"{row['avg_distance_mean']:.3f} ± {row['avg_distance_std']:.3f}",
            f"{row['prob_global_consensus']:.2%}"
        ])

    table = ax.table(
        cellText=table_data,
        colLabels=headers,
        cellLoc='center',
        loc='center',
        bbox=[0, 0, 1, 1]
    )

    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1, 2)

    # Style header row
    for i in range(len(headers)):
        table[(0, i)].set_facecolor('#4ECDC4')
        table[(0, i)].set_text_props(weight='bold', color='white')

    # Alternate row colors
    for i in range(1, len(table_data) + 1):
        for j in range(len(headers)):
            if i % 2 == 0:
                table[(i, j)].set_facecolor('#F0F0F0')
            else:
                table[(i, j)].set_facecolor('white')

    plt.title('Summary Statistics by Ordered Features Ratio',
              fontsize=16, fontweight='bold', pad=20)

    plt.tight_layout()

    # Save figure
    output_path = os.path.join(config.PLOTS_DIR, filename)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    print(f"Saved summary table: {output_path}")


def generate_all_visualizations():
    """
    Generate all visualizations from aggregated and raw data
    """
    print("\n" + "="*60)
    print("GENERATING VISUALIZATIONS")
    print("="*60)

    # Load data
    agg_data = load_aggregated_data()
    raw_data = load_raw_data()

    print("\nGenerating plots...")

    # 1. Bar plot: Convergence time
    create_bar_plot_convergence_time(agg_data)

    # 2. Bar plot: Unique cultures
    create_bar_plot_unique_cultures(agg_data)

    # 3. Line plot: Cultural distance
    create_line_plot_cultural_distance(agg_data)

    # 4. Box plot: Convergence distribution
    create_box_plot_convergence_distribution(raw_data)

    # 5. Scatter plot: Convergence vs cultures
    create_scatter_plot_convergence_vs_cultures(raw_data)

    # 6. Summary table
    create_summary_table(agg_data)

    print("\n" + "="*60)
    print("VISUALIZATION COMPLETE")
    print("="*60)
    print(f"\nAll plots saved to: {config.PLOTS_DIR}")
