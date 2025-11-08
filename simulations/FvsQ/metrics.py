"""
Metrics calculation for Axelrod model simulations
"""
import numpy as np


def get_unique_cultures(grid):
    """
    Count the number of unique cultural profiles in the grid

    Args:
        grid: numpy array of shape (grid_size, grid_size, F)

    Returns:
        Number of unique cultures
    """
    # Reshape grid to (N, F) where N = grid_size^2
    grid_size = grid.shape[0]
    F = grid.shape[2]
    reshaped = grid.reshape(grid_size * grid_size, F)

    # Convert each row to tuple for uniqueness check
    unique_cultures = set(tuple(row) for row in reshaped)

    return len(unique_cultures)


def get_largest_domain(grid):
    """
    Find the size of the largest cultural domain (connected region of identical agents)

    Args:
        grid: numpy array of shape (grid_size, grid_size, F)

    Returns:
        Tuple (largest_domain_size, largest_domain_percentage)
    """
    grid_size = grid.shape[0]
    total_nodes = grid_size * grid_size

    # Flatten grid for easier comparison
    F = grid.shape[2]
    flat_grid = grid.reshape(total_nodes, F)

    # Count frequency of each culture
    culture_counts = {}
    for culture in flat_grid:
        culture_tuple = tuple(culture)
        culture_counts[culture_tuple] = culture_counts.get(culture_tuple, 0) + 1

    # Find largest domain
    largest_domain_size = max(culture_counts.values()) if culture_counts else 0
    largest_domain_percentage = (largest_domain_size / total_nodes) * 100

    return largest_domain_size, largest_domain_percentage


def get_average_cultural_distance(grid):
    """
    Calculate average cultural distance between all neighboring pairs

    Args:
        grid: numpy array of shape (grid_size, grid_size, F)

    Returns:
        Average cultural distance (0 to 1)
    """
    grid_size = grid.shape[0]
    F = grid.shape[2]

    total_distance = 0
    total_pairs = 0

    # Calculate distance for all neighboring pairs
    for i in range(grid_size):
        for j in range(grid_size):
            agent = grid[i, j]

            # Check right neighbor
            if j < grid_size - 1:
                neighbor = grid[i, j + 1]
                # Distance = fraction of differing features
                distance = np.sum(agent != neighbor) / F
                total_distance += distance
                total_pairs += 1

            # Check down neighbor
            if i < grid_size - 1:
                neighbor = grid[i + 1, j]
                distance = np.sum(agent != neighbor) / F
                total_distance += distance
                total_pairs += 1

    if total_pairs == 0:
        return 0.0

    return total_distance / total_pairs


def calculate_all_metrics(grid, steps_to_convergence):
    """
    Calculate all metrics for a simulation run

    Args:
        grid: Final grid state (numpy array)
        steps_to_convergence: Number of steps taken

    Returns:
        Dictionary with all metrics
    """
    unique_cultures = get_unique_cultures(grid)
    largest_domain_size, largest_domain_percentage = get_largest_domain(grid)
    avg_cultural_distance = get_average_cultural_distance(grid)

    return {
        'steps_to_convergence': steps_to_convergence,
        'unique_cultures': unique_cultures,
        'largest_domain_size': largest_domain_size,
        'largest_domain_percentage': largest_domain_percentage,
        'avg_cultural_distance': avg_cultural_distance
    }
