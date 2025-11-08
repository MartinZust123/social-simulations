# OrderedRatio Simulation Updates

## Changes Made

### 1. Increased States per Feature: 4 → 6

**Rationale**:
- With only 4 states, the maximum possible unique cultures was limited
- 6 states allows for greater cultural diversity in the final equilibrium
- This will make the impact of ordered vs unordered features more visible in the "number of unique cultures" metric

**Impact**:
- Maximum theoretical unique cultures: 4^5 = 1,024 → 6^5 = 7,776
- More granular spectrum for ordered features (A → B → C → D → E → F)
- More options for categorical features (Type A through Type F)

### 2. Enhanced Visualizations

All visualizations have been redesigned for better clarity and presentation:

#### Bar Plot: Convergence Time
- Larger figure size (12×7)
- Professional gradient colors (blue spectrum)
- Cleaner grid and styling
- Better value labels with comma formatting
- Title: "Convergence Speed: Ordered vs Unordered Features"

#### Bar Plot: Unique Cultures
- Larger figure size (12×7)
- Gradient colors (green to orange spectrum)
- Enhanced visual hierarchy
- Title: "Cultural Diversity: Impact of Ordered Features"

#### Line Plot: Cultural Distance
- Larger figure size (12×7)
- Professional purple theme
- Enhanced markers with white edges
- Clearer error bands
- Better legend styling
- Title: "Cultural Homogeneity: Ordered vs Unordered Features"

### 3. General Improvements

- All plots use consistent professional styling
- Increased font sizes for better readability
- White backgrounds with cleaner grids
- Better color schemes that are publication-ready
- Higher contrast for clearer visualization
- Consistent figure sizing across all plots

## Expected Results

With 6 states instead of 4:

1. **More Cultural Diversity**: The average number of unique cultures should increase across all ratios
2. **Clearer Differences**: The impact of ordered vs unordered features should be more pronounced
3. **Longer Convergence**: More states mean more intermediate positions, potentially increasing convergence time for ordered features
4. **Better Data**: The increased state space should reveal more nuanced patterns in cultural dynamics

## Running the Updated Simulation

Simply run:
```bash
python run_simulation.py
```

The script will automatically use the new configuration with 6 states per feature.

## Notes

- All existing data files will be overwritten
- The simulation may take slightly longer due to increased state space
- Visualizations will be cleaner and more professional
- Results should show more dramatic differences between ordered and unordered feature dynamics
