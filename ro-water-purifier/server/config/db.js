const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

const createPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'ro_water',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
};

const pool = new Pool(createPoolConfig());

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL client error:', error);
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeSchema = async (client) => {
  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);
    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('⚠️ Schema initialization warning:', error.message);
    // Don't throw - tables might already exist
  }
};

const connectDB = async () => {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      
      // Initialize schema on first successful connection
      await initializeSchema(client);
      
      client.release();
      console.log('✅ PostgreSQL connected and initialized');
      return;
    } catch (error) {
      attempt += 1;
      console.error(`PostgreSQL connection attempt ${attempt} failed:`, error.message);
      if (attempt >= MAX_RETRIES) {
        console.error('❌ Unable to connect to PostgreSQL after multiple attempts.');
        throw error;
      }
      await wait(RETRY_DELAY_MS);
    }
  }
};

const closeDB = async () => {
  try {
    await pool.end();
    console.log('PostgreSQL pool has been closed.');
  } catch (error) {
    console.error('Error closing PostgreSQL pool:', error.message);
  }
};

const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const shutdownHandler = async (signal) => {
  console.log(`Received ${signal}. Shutting down PostgreSQL pool.`);
  await closeDB();
  process.exit(0);
};

process.on('SIGINT', () => shutdownHandler('SIGINT'));
process.on('SIGTERM', () => shutdownHandler('SIGTERM'));

module.exports = { pool, connectDB, closeDB, withTransaction };
