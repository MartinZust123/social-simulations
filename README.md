# Social Simulations

A professional, interactive web application for simulating Axelrod's model of cultural dissemination. Built with React and Vite.

## Overview

This project demonstrates how local interactions between individuals can lead to complex global patterns of cultural unity or polarization. The simulation is based on Axelrod's influential model of cultural dynamics, where agents influence each other through probabilistic interactions.

## Features

- **Interactive Simulation**: Real-time visualization of cultural evolution on a customizable grid
- **Configurable Parameters**:
  - Grid size (3×3 to 20×20)
  - F: Number of cultural features (1-20)
  - q: Number of possible states per feature (2-20)
  - Adjustable simulation speed
- **RGB Color Mapping**: Each agent's cultural features are visualized using dynamic RGB colors
- **Educational Content**: Comprehensive "Math Behind" section explaining the model with interactive demos
- **Mobile Optimized**: Fully responsive design for all screen sizes
- **Absorbing State Detection**: Simulation automatically stops when cultural equilibrium is reached

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd social-simulations
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
social-simulations/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── SimulationPage.jsx   # Main simulation interface
│   │   ├── ParametersPanel.jsx  # Parameter controls
│   │   ├── SimulationGrid.jsx   # Grid visualization
│   │   ├── MathPage.jsx         # Educational content
│   │   └── RGBDemo.jsx          # Interactive RGB demo
│   ├── App.jsx                  # Main application logic
│   ├── App.css                  # Global styles
│   └── main.jsx                 # Entry point
├── public/
│   └── favicon.svg              # Custom grid icon
└── index.html
```

## How It Works

### Axelrod's Model

Each agent has F cultural features, where each feature can take one of q possible values. In each simulation step:

1. A random agent is selected
2. A random neighbor is chosen (von Neumann neighborhood: up, down, left, right)
3. Cultural similarity is calculated as the proportion of shared features
4. Interaction occurs with probability equal to similarity
5. If interaction occurs, one agent adopts one feature from the other

### Absorbing States

The simulation reaches an absorbing state when no more interactions are possible, resulting in either:
- **Cultural Unity**: All neighboring agents are identical
- **Cultural Polarization**: All neighboring agents are completely different

## Technologies Used

- **React 18**: Modern UI library with hooks
- **Vite**: Fast build tool and development server
- **CSS3**: Custom styling with gradient effects and responsive design
- **ESLint**: Code quality and consistency

## License

MIT

## Acknowledgments

Based on Robert Axelrod's seminal work: "The Dissemination of Culture: A Model with Local Convergence and Global Polarization" (Journal of Conflict Resolution, 1997)
