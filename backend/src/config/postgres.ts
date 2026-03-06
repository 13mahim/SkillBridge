import pkg from 'pg';
const { Pool } = pkg;

// Parse connection string manually to handle special characters
const connectionString = process.env.DATABASE_URL || '';
const url = new URL(connectionString);

const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  database: url.pathname.slice(1),
  user: url.username,
  password: url.password,
  ssl: connectionString.includes('sslmode=require') ? {
    rejectUnauthorized: false
  } : false
});

export default pool;
