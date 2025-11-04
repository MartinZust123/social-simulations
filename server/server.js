import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { saveSimulation } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Save simulation endpoint
app.post('/api/simulations', async (req, res) => {
  try {
    const {
      gridSize,
      F,
      q,
      stepTime,
      totalSteps,
      uniqueCultures,
      largestDomainSize,
      avgCulturalDistance
    } = req.body;

    // Validate required fields
    if (!gridSize || !F || !q || stepTime === undefined || !totalSteps ||
        !uniqueCultures || !largestDomainSize || avgCulturalDistance === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await saveSimulation({
      gridSize,
      F,
      q,
      stepTime,
      totalSteps,
      uniqueCultures,
      largestDomainSize,
      avgCulturalDistance
    });

    res.json(result);
  } catch (error) {
    console.error('Error saving simulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save simulation',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/simulations`);
});
