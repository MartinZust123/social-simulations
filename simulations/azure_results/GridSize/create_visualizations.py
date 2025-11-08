"""
Standalone script to create visualizations from GridSize results
Can be run from anywhere
"""
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os
from pathlib import Path

# Get script directory
SCRIPT_DIR = Path(__file__).parent
DATA_FILE = SCRIPT_DIR / "raw_data.csv"
PLOTS_DIR = SCRIPT_DIR / "plots"

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.facecolor'] = 'white'

# Create plots directory
os.makedirs(PLOTS_DIR, exist_ok=True)

print("="*60)
print("GRID SIZE IMPACT - VISUALIZATION GENERATION")
print("="*60)

# Load raw data
print(f"\nLoading data from {DATA_FILE}...")
raw_data = pd.read_csv(DATA_FILE)

# Aggregate data
print("Aggregating statistics...")
agg_data = raw_data.groupby('grid_size').agg({
    'steps_to_convergence': ['mean', 'std'],
    'unique_cultures': ['mean', 'std'],
    'largest_domain_percentage': ['mean', 'std']
}).reset_index()

# Flatten column names
agg_data.columns = ['grid_size', 'steps_mean', 'steps_std',
                    'unique_cultures_mean', 'unique_cultures_std',
                    'largest_domain_mean', 'largest_domain_std']

# Calculate probability of global consensus (unique_cultures == 1)
consensus_prob = raw_data.groupby('grid_size').apply(
    lambda x: (x['unique_cultures'] == 1).sum() / len(x)
).reset_index(name='prob_global_consensus')
agg_data = agg_data.merge(consensus_prob, on='grid_size')

print(f"\nData loaded: {len(raw_data)} simulations across {len(agg_data)} grid sizes")
print(f"Grid sizes: {sorted(raw_data['grid_size'].unique())}")

# ============================================================
# PLOT 1: Convergence Time
# ============================================================
print("\n[1/6] Creating convergence time plot...")
plt.figure(figsize=(10, 6))

plt.errorbar(
    agg_data['grid_size'],
    agg_data['steps_mean'],
    yerr=agg_data['steps_std'],
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
plt.savefig(os.path.join(PLOTS_DIR, 'convergence_time.png'), dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ Saved: plots/convergence_time.png")

# ============================================================
# PLOT 2: Unique Cultures
# ============================================================
print("[2/6] Creating unique cultures plot...")
plt.figure(figsize=(10, 6))

plt.errorbar(
    agg_data['grid_size'],
    agg_data['unique_cultures_mean'],
    yerr=agg_data['unique_cultures_std'],
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
plt.savefig(os.path.join(PLOTS_DIR, 'unique_cultures.png'), dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ Saved: plots/unique_cultures.png")

# ============================================================
# PLOT 3: Largest Domain Size
# ============================================================
print("[3/6] Creating largest domain plot...")
plt.figure(figsize=(10, 6))

plt.errorbar(
    agg_data['grid_size'],
    agg_data['largest_domain_mean'],
    yerr=agg_data['largest_domain_std'],
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
plt.savefig(os.path.join(PLOTS_DIR, 'largest_domain.png'), dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ Saved: plots/largest_domain.png")

# ============================================================
# PLOT 4: Global Consensus Probability
# ============================================================
print("[4/6] Creating consensus probability plot...")
plt.figure(figsize=(10, 6))

colors = ['#2E86AB' if p > 0.5 else '#A23B72' for p in agg_data['prob_global_consensus']]

bars = plt.bar(
    agg_data['grid_size'].astype(str),
    agg_data['prob_global_consensus'],
    color=colors,
    edgecolor='black',
    linewidth=1.5,
    alpha=0.8
)

# Add value labels
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
plt.title('Impact of Grid Size on Global Consensus', fontsize=16, fontweight='bold', pad=20)
plt.ylim(0, 1.1)
plt.grid(True, alpha=0.3, linestyle='--', axis='y')
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'global_consensus.png'), dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ Saved: plots/global_consensus.png")

# ============================================================
# PLOT 5: Scatter Plot
# ============================================================
print("[5/6] Creating scatter plot...")
plt.figure(figsize=(12, 8))

grid_sizes = sorted(raw_data['grid_size'].unique())
colors_scatter = plt.cm.viridis(np.linspace(0, 1, len(grid_sizes)))

for idx, grid_size in enumerate(grid_sizes):
    size_data = raw_data[raw_data['grid_size'] == grid_size]

    plt.scatter(
        size_data['steps_to_convergence'],
        size_data['unique_cultures'],
        alpha=0.6,
        s=50,
        color=colors_scatter[idx],
        label=f'{grid_size}×{grid_size}',
        edgecolors='black',
        linewidth=0.5
    )

plt.xlabel('Steps to Convergence', fontsize=14, fontweight='bold')
plt.ylabel('Unique Cultures at Equilibrium', fontsize=14, fontweight='bold')
plt.title('Convergence Time vs. Cultural Diversity', fontsize=16, fontweight='bold', pad=20)
plt.legend(title='Grid Size', fontsize=11, title_fontsize=12, loc='best', framealpha=0.9)
plt.grid(True, alpha=0.3, linestyle='--')
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'scatter_convergence_vs_cultures.png'), dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ Saved: plots/scatter_convergence_vs_cultures.png")

# ============================================================
# PLOT 6: Summary Table
# ============================================================
print("[6/6] Creating summary table...")
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

for _, row in agg_data.iterrows():
    table_data.append([
        f"{row['grid_size']}×{row['grid_size']}",
        f"{int(row['grid_size']**2)}",
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

plt.title('Grid Size Impact Analysis - Summary Statistics', fontsize=16, fontweight='bold', pad=20)
plt.savefig(os.path.join(PLOTS_DIR, 'summary_table.png'), dpi=300, bbox_inches='tight')
plt.close()
print("  ✓ Saved: plots/summary_table.png")

# ============================================================
# Summary
# ============================================================
print("\n" + "="*60)
print("VISUALIZATION COMPLETE!")
print("="*60)
print(f"\nAll 6 plots saved to: {os.path.abspath(PLOTS_DIR)}/")
print("\nPlots created:")
print("  1. convergence_time.png")
print("  2. unique_cultures.png")
print("  3. largest_domain.png")
print("  4. global_consensus.png")
print("  5. scatter_convergence_vs_cultures.png")
print("  6. summary_table.png")
