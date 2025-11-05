import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

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

export async function getConnection() {
  try {
    if (pool) {
      return pool;
    }
    pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

export async function saveSimulation(data) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('grid_size', sql.Int, data.gridSize)
      .input('f_features', sql.Int, data.F)
      .input('q_states', sql.Int, data.q)
      .input('step_time', sql.Float, data.stepTime)
      .input('total_steps', sql.Int, data.totalSteps)
      .input('unique_cultures', sql.Int, data.uniqueCultures)
      .input('largest_domain_size', sql.Int, data.largestDomainSize)
      .input('avg_cultural_distance', sql.Float, parseFloat(data.avgCulturalDistance))
      .query(`
        INSERT INTO simulations (
          grid_size, f_features, q_states, step_time,
          total_steps, unique_cultures, largest_domain_size, avg_cultural_distance
        )
        VALUES (
          @grid_size, @f_features, @q_states, @step_time,
          @total_steps, @unique_cultures, @largest_domain_size, @avg_cultural_distance
        );
        SELECT SCOPE_IDENTITY() AS id;
      `);

    return { success: true, id: result.recordset[0].id };
  } catch (err) {
    console.error('Error saving simulation:', err);
    throw err;
  }
}

export async function saveInterpretableSimulation(data) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('grid_size', sql.Int, data.gridSize)
      .input('step_time', sql.Float, data.stepTime)
      .input('total_steps', sql.Int, data.totalSteps)
      .input('unique_cultures', sql.Int, data.uniqueCultures)
      .input('largest_domain_size', sql.Int, data.largestDomainSize)
      .input('avg_cultural_distance', sql.Float, parseFloat(data.avgCulturalDistance))
      .input('features', sql.NVarChar(sql.MAX), JSON.stringify(data.features))
      .input('correlations', sql.NVarChar(sql.MAX), JSON.stringify(data.correlations))
      .input('template_name', sql.VarChar(100), data.templateName || null)
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

    return { success: true, id: result.recordset[0].id };
  } catch (err) {
    console.error('Error saving interpretable simulation:', err);
    throw err;
  }
}

export { sql };
