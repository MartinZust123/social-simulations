import sql from 'mssql';

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

async function getConnection() {
  if (pool) {
    return pool;
  }
  pool = await sql.connect(config);
  return pool;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Interpretable Simulations API is running' });
  }

  if (req.method === 'POST') {
    try {
      const {
        gridSize,
        stepTime,
        totalSteps,
        uniqueCultures,
        largestDomainSize,
        avgCulturalDistance,
        features,
        correlations,
        templateName
      } = req.body;

      // Validate required fields
      if (!gridSize || stepTime === undefined || !totalSteps ||
          !uniqueCultures || !largestDomainSize || avgCulturalDistance === undefined ||
          !features || !correlations) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const pool = await getConnection();
      const result = await pool.request()
        .input('grid_size', sql.Int, gridSize)
        .input('step_time', sql.Float, stepTime)
        .input('total_steps', sql.Int, totalSteps)
        .input('unique_cultures', sql.Int, uniqueCultures)
        .input('largest_domain_size', sql.Int, largestDomainSize)
        .input('avg_cultural_distance', sql.Float, parseFloat(avgCulturalDistance))
        .input('features', sql.NVarChar(sql.MAX), JSON.stringify(features))
        .input('correlations', sql.NVarChar(sql.MAX), JSON.stringify(correlations))
        .input('template_name', sql.VarChar(100), templateName || null)
        .query(`
          INSERT INTO interpretable_simulations (
            grid_size, step_time, total_steps, unique_cultures,
            largest_domain_size, avg_cultural_distance,
            features, correlations, template_name
          )
          VALUES (
            @grid_size, @step_time, @total_steps, @unique_cultures,
            @largest_domain_size, @avg_cultural_distance,
            @features, @correlations, @template_name
          );
          SELECT SCOPE_IDENTITY() AS id;
        `);

      res.status(200).json({ success: true, id: result.recordset[0].id });
    } catch (error) {
      console.error('Error saving interpretable simulation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save interpretable simulation',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
