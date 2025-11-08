"""
Quick test script to verify the interpretable model works correctly
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import config
from axelrod_interpretable_model import AxelrodInterpretableModel
from metrics import calculate_all_metrics


def test_model():
    """Test the interpretable model with different correlation values"""
    print("Testing Interpretable Axelrod Model")
    print("=" * 60)

    # Test with a few correlation values
    test_correlations = [-1.0, 0.0, 1.0]

    for correlation in test_correlations:
        print(f"\nTesting correlation = {correlation}")
        print("-" * 40)

        # Create model
        model = AxelrodInterpretableModel(
            grid_size=5,  # Smaller grid for quick testing
            interpretable_features=config.INTERPRETABLE_FEATURES,
            correlation=correlation,
            max_steps=10000
        )

        # Check initial grid
        initial_grid = model.get_grid()
        print(f"Initial grid shape: {initial_grid.shape}")
        print(f"Grid size: {model.grid_size}x{model.grid_size}")
        print(f"Number of features: {model.num_features}")

        # Run a few steps
        for step in range(5):
            continue_sim = model.simulation_step()
            if not continue_sim:
                print(f"Reached absorbing state at step {step + 1}")
                break

        # Check if model is functioning
        print(f"Model step count: {model.step_count}")
        print(f"Current failed interactions: {model.failed_interactions}")

        # Calculate metrics on current state
        current_grid = model.get_grid()
        metrics = calculate_all_metrics(current_grid, model.step_count)
        print(f"Current unique cultures: {metrics['unique_cultures']}")
        print(f"Current avg distance: {metrics['avg_cultural_distance']:.3f}")

    print("\n" + "=" * 60)
    print("All tests completed successfully!")


if __name__ == "__main__":
    test_model()
