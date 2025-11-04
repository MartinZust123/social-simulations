import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

console.log('Testing connection to Azure SQL Database...');
console.log(`Server: ${config.server}`);
console.log(`Database: ${config.database}`);
console.log(`User: ${config.user}`);

async function testConnection() {
  try {
    console.log('\nAttempting connection...');
    const pool = await sql.connect(config);
    console.log('✅ Successfully connected to database!');

    const result = await pool.request().query('SELECT @@VERSION as version');
    console.log('\nDatabase version:', result.recordset[0].version);

    await pool.close();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', err.message);

    if (err.code === 'ESOCKET') {
      console.log('\n🔥 FIREWALL ISSUE DETECTED!');
      console.log('Solution:');
      console.log('1. Go to Azure Portal (portal.azure.com)');
      console.log('2. Navigate to your SQL Server: socialsimulation');
      console.log('3. Click "Networking" or "Firewall settings"');
      console.log('4. Click "Add your client IP"');
      console.log('5. Save the changes and try again');
    }

    process.exit(1);
  }
}

testConnection();
