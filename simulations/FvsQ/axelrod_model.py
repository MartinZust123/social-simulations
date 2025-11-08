"""
Core Axelrod cultural dissemination model implementation
"""
import numpy as np
import random


class AxelrodModel:
    """
    Implementation of Axelrod's model of cultural dissemination
    """

    def __init__(self, grid_size, F, q, max_steps=1000000):
        """
        Initialize the Axelrod model

        Args:
            grid_size: Size of the square grid (grid_size x grid_size)
            F: Number of cultural features per agent
            q: Number of possible states per feature
            max_steps: Maximum number of simulation steps
        """
        self.grid_size = grid_size
        self.F = F
        self.q = q
        self.max_steps = max_steps
        self.step_count = 0
        self.failed_interactions = 0  # Track consecutive failed interactions

        # Initialize grid with random features
        # Shape: (grid_size, grid_size, F)
        self.grid = np.random.randint(0, q, size=(grid_size, grid_size, F))

    def get_neighbors(self, i, j):
        """
        Get von Neumann neighbors (up, down, left, right) for position (i, j)

        Returns:
            List of (row, col) tuples for valid neighbors
        """
        neighbors = []

        # Up
        if i > 0:
            neighbors.append((i - 1, j))
        # Down
        if i < self.grid_size - 1:
            neighbors.append((i + 1, j))
        # Left
        if j > 0:
            neighbors.append((i, j - 1))
        # Right
        if j < self.grid_size - 1:
            neighbors.append((i, j + 1))

        return neighbors

    def cultural_similarity(self, agent1_features, agent2_features):
        """
        Calculate cultural similarity between two agents

        Returns:
            Number of shared features (0 to F)
        """
        return np.sum(agent1_features == agent2_features)

    def can_interact(self, agent1_features, agent2_features):
        """
        Check if two agents can interact (share some but not all features)

        Returns:
            Tuple (can_interact: bool, shared_features: int)
        """
        shared = self.cultural_similarity(agent1_features, agent2_features)
        # Can interact if they share some features but are not identical
        return (0 < shared < self.F), shared

    def is_absorbing_state(self):
        """
        Check if the system has reached an absorbing state
        (no more interactions possible)

        Returns:
            True if absorbing state reached, False otherwise
        """
        for i in range(self.grid_size):
            for j in range(self.grid_size):
                agent = self.grid[i, j]
                neighbors = self.get_neighbors(i, j)

                for ni, nj in neighbors:
                    neighbor = self.grid[ni, nj]
                    can_interact, _ = self.can_interact(agent, neighbor)

                    if can_interact:
                        return False  # Found at least one possible interaction

        return True  # No interactions possible

    def simulation_step(self):
        """
        Perform one simulation step

        Returns:
            True if simulation should continue, False if absorbing state reached
        """
        # Select random agent
        i = random.randint(0, self.grid_size - 1)
        j = random.randint(0, self.grid_size - 1)

        # Select random neighbor
        neighbors = self.get_neighbors(i, j)
        ni, nj = random.choice(neighbors)

        agent = self.grid[i, j]
        neighbor = self.grid[ni, nj]

        # Check if they can interact
        can_interact, shared = self.can_interact(agent, neighbor)

        if not can_interact:
            # Increment failed interaction counter
            self.failed_interactions += 1

            # Only check for absorbing state after many failed attempts
            # This is much more efficient than checking every time
            if self.failed_interactions >= self.grid_size * self.grid_size:
                if self.is_absorbing_state():
                    return False  # Absorbing state confirmed
                else:
                    self.failed_interactions = 0  # Reset counter, interactions still possible

            return True  # Continue simulation

        # Interaction occurred - reset failed counter
        self.failed_interactions = 0

        # Find differing features
        differing_features = np.where(agent != neighbor)[0]

        # Select random differing feature
        feature_idx = random.choice(differing_features)

        # Randomly select dominator (50/50 chance)
        if random.random() < 0.5:
            # Agent adopts from neighbor
            self.grid[i, j, feature_idx] = neighbor[feature_idx]
        else:
            # Neighbor adopts from agent
            self.grid[ni, nj, feature_idx] = agent[feature_idx]

        return True

    def run(self):
        """
        Run the simulation until absorbing state or max steps reached

        Returns:
            Number of steps taken to reach absorbing state
        """
        self.step_count = 0

        while self.step_count < self.max_steps:
            self.step_count += 1

            # Perform simulation step
            continue_simulation = self.simulation_step()

            if not continue_simulation:
                break

        return self.step_count

    def get_grid(self):
        """
        Get the current grid state

        Returns:
            numpy array of shape (grid_size, grid_size, F)
        """
        return self.grid.copy()
