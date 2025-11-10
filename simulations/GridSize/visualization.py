"""
Visualization module for generating plots
"""
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os
import config
from scipy.optimize import curve_fit


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


def exp_model(x, a, b):
    """Exponential model: y = a * exp(b * x)"""
    return a * np.exp(b * x)


def r_squared(y_true, y_pred):
    """Calculate R² goodness-of-fit"""
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    return 1 - ss_res / (ss_tot + 1e-12)


def create_approximations_plot(data):
    """
    Create single plot with all approximations (linear, quadratic, cubic, exponential) for comparison

    Args:
        data: pandas DataFrame with aggregated results
    """
    plt.figure(figsize=(14, 8))

    x_data = data['grid_size'].values
    y_data = data['steps_mean'].values

    # Generate fine grid for smooth curves
    x_fine = np.linspace(x_data[0], x_data[-1], 400)

    models = []

    # Linear fit: y = ax + b
    coeffs_lin = np.polyfit(x_data, y_data, 1)
    y_lin = np.polyval(coeffs_lin, x_fine)
    y_lin_data = np.polyval(coeffs_lin, x_data)
    r2_lin = r_squared(y_data, y_lin_data)
    models.append(('Linear', r2_lin))

    # Quadratic fit: y = ax² + bx + c
    coeffs_quad = np.polyfit(x_data, y_data, 2)
    y_quad = np.polyval(coeffs_quad, x_fine)
    y_quad_data = np.polyval(coeffs_quad, x_data)
    r2_quad = r_squared(y_data, y_quad_data)
    models.append(('Quadratic', r2_quad))

    # Cubic fit: y = ax³ + bx² + cx + d
    coeffs_cubic = np.polyfit(x_data, y_data, 3)
    y_cubic = np.polyval(coeffs_cubic, x_fine)
    y_cubic_data = np.polyval(coeffs_cubic, x_data)
    r2_cubic = r_squared(y_data, y_cubic_data)
    models.append(('Cubic', r2_cubic))

    # Exponential fit: y = a * exp(b * x)
    exp_fitted = False
    try:
        p0 = [y_data[0], 0.01]
        popt, _ = curve_fit(exp_model, x_data, y_data, p0=p0, maxfev=10000)
        y_exp = exp_model(x_fine, *popt)
        y_exp_data = exp_model(x_data, *popt)
        r2_exp = r_squared(y_data, y_exp_data)
        exp_fitted = True
        models.append(('Exponential', r2_exp))
    except Exception as e:
        print(f"  Warning: Exponential fit failed: {e}")

    # Plot data points
    plt.scatter(x_data, y_data, color='black', s=120, zorder=5, label='Data points',
                edgecolors='white', linewidth=2.5)

    # Plot approximations with different styles
    plt.plot(x_fine, y_lin, color='blue', linewidth=3, linestyle='-',
             label=f'Linear (R²={r2_lin:.4f})', alpha=0.8)
    plt.plot(x_fine, y_quad, color='green', linewidth=3, linestyle='--',
             label=f'Quadratic (R²={r2_quad:.4f})', alpha=0.8)
    plt.plot(x_fine, y_cubic, color='purple', linewidth=3, linestyle=':',
             label=f'Cubic (R²={r2_cubic:.4f})', alpha=0.8)
    if exp_fitted:
        plt.plot(x_fine, y_exp, color='red', linewidth=3, linestyle='-.',
                 label=f'Exponential (R²={r2_exp:.4f})', alpha=0.8)

    plt.xlabel('Grid Size (N×N)', fontsize=16, fontweight='bold')
    plt.ylabel('Average Steps to Convergence', fontsize=16, fontweight='bold')
    plt.title('Convergence Time Scaling: Model Comparison',
              fontsize=18, fontweight='bold', pad=20)
    plt.legend(fontsize=13, loc='best', framealpha=0.95, edgecolor='gray')
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.tight_layout()

    # Save
    output_path = os.path.join(config.PLOTS_DIR, 'scaling_approximations.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()

    print(f"Saved plot: {output_path}")
    print("\n=== Model Comparison ===")
    print(f"Linear:      R² = {r2_lin:.5f}")
    print(f"Quadratic:   R² = {r2_quad:.5f}")
    print(f"Cubic:       R² = {r2_cubic:.5f}")
    if exp_fitted:
        print(f"Exponential: R² = {r2_exp:.5f}")

    # Find best model
    best_model = max(models, key=lambda x: x[1])
    print(f"\n✓ Best fit: {best_model[0]} (R² = {best_model[1]:.5f})")


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

    print("\nGenerating scaling approximation plot...")
    create_approximations_plot(agg_data)

    print("\n" + "="*60)
    print("VISUALIZATION COMPLETE")
    print("="*60)
    print(f"\nAll plots saved to: {config.PLOTS_DIR}")


if __name__ == "__main__":
    """
    Run this script directly to regenerate visualizations from existing data
    """
    print("GridSize Visualization Generator")
    print("=" * 60)
    print("\nChecking for existing data files...")

    import os
    if not os.path.exists(config.AGGREGATED_DATA_FILE):
        print(f"\nError: Aggregated data file not found at {config.AGGREGATED_DATA_FILE}")
        print("Please run 'python run_simulation.py' first to generate data.")
        exit(1)

    if not os.path.exists(config.RAW_DATA_FILE):
        print(f"\nError: Raw data file not found at {config.RAW_DATA_FILE}")
        print("Please run 'python run_simulation.py' first to generate data.")
        exit(1)

    print("Data files found. Generating visualizations...")
    generate_all_visualizations()
