"""
Interpretable Axelrod cultural dissemination model with correlated features
Based on the web app implementation in App.jsx
"""
import numpy as np
import random


class AxelrodInterpretableModel:
    """
    Implementation of Axelrod's model with interpretable features and correlations
    Supports ordered (spectrum) features with one-step transitions
    """

    def __init__(self, grid_size, interpretable_features, correlation, max_steps=1000000):
        """
        Initialize the interpretable Axelrod model

        Args:
            grid_size: Size of the square grid (grid_size x grid_size)
            interpretable_features: List of feature dictionaries with structure:
                {
                    'name': str,
                    'states': [{'name': str, 'color': str}, ...],
                    'hasOrder': bool
                }
            correlation: Correlation coefficient to apply between all feature pairs (-1 to 1)
            max_steps: Maximum number of simulation steps
        """
        self.grid_size = grid_size
        self.interpretable_features = interpretable_features
        self.num_features = len(interpretable_features)
        self.correlation = correlation
        self.max_steps = max_steps
        self.step_count = 0
        self.failed_interactions = 0  # Track consecutive failed interactions

        # Initialize grid with correlated random features
        # Shape: (grid_size, grid_size, num_features)
        self.grid = self._initialize_grid_with_correlations()

    def _index_to_r(self, index, total_states):
        """
        Convert state index to r value (0 to 1) for correlation calculation

        Args:
            index: State index
            total_states: Total number of states for this feature

        Returns:
            r value between 0 and 1
        """
        if total_states == 1:
            return 0
        return index / (total_states - 1)

    def _initialize_grid_with_correlations(self):
        """
        Initialize grid with random features applying correlations
        Implements the randomization logic from App.jsx (lines 48-131)

        Returns:
            numpy array of shape (grid_size, grid_size, num_features)
        """
        grid = np.zeros((self.grid_size, self.grid_size, self.num_features), dtype=int)
        total_nodes = self.grid_size * self.grid_size

        for node_id in range(total_nodes):
            i = node_id // self.grid_size
            j = node_id % self.grid_size

            # Separate features by type
            non_spectrum_features = []
            spectrum_features = []

            for idx, feature in enumerate(self.interpretable_features):
                if feature['hasOrder']:
                    spectrum_features.append((idx, feature))
                else:
                    non_spectrum_features.append((idx, feature))

            # Step 1: Randomly choose non-spectrum features
            for idx, feature in non_spectrum_features:
                random_state = random.randint(0, len(feature['states']) - 1)
                grid[i, j, idx] = random_state

            # Step 2: Randomly select anchor spectrum feature and its state
            if len(spectrum_features) > 0:
                anchor_idx_in_list = random.randint(0, len(spectrum_features) - 1)
                anchor_feature_idx, anchor_feature = spectrum_features[anchor_idx_in_list]
                anchor_state = random.randint(0, len(anchor_feature['states']) - 1)
                grid[i, j, anchor_feature_idx] = anchor_state

                anchor_r = self._index_to_r(anchor_state, len(anchor_feature['states']))

                # Step 3: For other spectrum features, calculate correlated probabilities
                for feat_idx_in_list, (feature_idx, feature) in enumerate(spectrum_features):
                    if feat_idx_in_list == anchor_idx_in_list:
                        continue  # Skip anchor

                    num_states = len(feature['states'])

                    # Calculate P for each state using correlation
                    probabilities = []
                    for state_idx in range(num_states):
                        state_r = self._index_to_r(state_idx, num_states)
                        distance = abs(anchor_r - state_r)
                        # Correlation formula from App.jsx (line 100)
                        P = (1 - distance) * (1 + self.correlation) + distance * (1 - self.correlation)
                        probabilities.append(P)

                    # Normalize probabilities
                    sum_p = sum(probabilities)
                    if sum_p > 0:
                        normalized_probs = [p / sum_p for p in probabilities]
                    else:
                        normalized_probs = [1 / num_states] * num_states  # Fallback to uniform

                    # Choose state based on probability
                    rand = random.random()
                    cumulative = 0
                    chosen_state = 0
                    for state_idx in range(num_states):
                        cumulative += normalized_probs[state_idx]
                        if rand <= cumulative:
                            chosen_state = state_idx
                            break

                    grid[i, j, feature_idx] = chosen_state

        return grid

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
            Number of shared features (0 to num_features)
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
        return (0 < shared < self.num_features), shared

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
        Perform one simulation step with interpretable feature logic
        Implements one-step transitions for ordered features (App.jsx lines 386-410)

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
            if self.failed_interactions >= self.grid_size * self.grid_size:
                if self.is_absorbing_state():
                    return False  # Absorbing state confirmed
                else:
                    self.failed_interactions = 0  # Reset counter

            return True  # Continue simulation

        # Interaction occurred - reset failed counter
        self.failed_interactions = 0

        # Find differing features
        differing_features = np.where(agent != neighbor)[0]

        # Select random differing feature
        feature_idx = random.choice(differing_features)

        # Randomly select dominator (50/50 chance)
        dominator_is_agent = random.random() < 0.5

        if dominator_is_agent:
            dominator_features = agent
            receiver_i, receiver_j = ni, nj
        else:
            dominator_features = neighbor
            receiver_i, receiver_j = i, j

        # Get the feature definition
        feature = self.interpretable_features[feature_idx]

        # Apply transition based on feature type
        if feature['hasOrder']:
            # Ordered feature: move one step toward dominator (App.jsx lines 390-401)
            dominator_state = dominator_features[feature_idx]
            receiver_state = self.grid[receiver_i, receiver_j, feature_idx]

            if dominator_state > receiver_state:
                # Move up one step
                self.grid[receiver_i, receiver_j, feature_idx] = receiver_state + 1
            elif dominator_state < receiver_state:
                # Move down one step
                self.grid[receiver_i, receiver_j, feature_idx] = receiver_state - 1
            # If equal, no change (shouldn't happen since they differ)
        else:
            # Non-ordered feature: adopt completely (App.jsx lines 404-405)
            self.grid[receiver_i, receiver_j, feature_idx] = dominator_features[feature_idx]

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
            numpy array of shape (grid_size, grid_size, num_features)
        """
        return self.grid.copy()
