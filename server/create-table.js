import { getConnection } from './db.js';

async function createTable() {
  try {
    const pool = await getConnection();
    console.log('✅ Connected to database...');

    const createTableSQL = `
      CREATE TABLE interpretable_simulations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        grid_size INT NOT NULL,
        step_time FLOAT NOT NULL,
        timestamp DATETIME DEFAULT GETDATE(),
        total_steps INT NOT NULL,
        unique_cultures INT NOT NULL,
        largest_domain_size INT NOT NULL,
        avg_cultural_distance FLOAT NOT NULL,
        features NVARCHAR(MAX) NOT NULL,
        correlations NVARCHAR(MAX) NOT NULL,
        template_name VARCHAR(100) NULL
      );
    `;

    await pool.request().query(createTableSQL);
    console.log('✅ Table interpretable_simulations created successfully!');

    const createIndexSQL1 = `CREATE INDEX idx_timestamp ON interpretable_simulations(timestamp);`;
    await pool.request().query(createIndexSQL1);
    console.log('✅ Index idx_timestamp created successfully!');

    const createIndexSQL2 = `CREATE INDEX idx_template_name ON interpretable_simulations(template_name);`;
    await pool.request().query(createIndexSQL2);
    console.log('✅ Index idx_template_name created successfully!');

    console.log('\n🎉 All done! Table and indexes created.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit(0);
}

createTable();
