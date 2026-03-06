import pkg from 'pg';
const { Pool } = pkg;

// Parse connection string manually to handle special characters
const connectionString = process.env.DATABASE_URL || '';

// Only create pool if DATABASE_URL is provided
let pool: any = null;

if (connectionString && connectionString.trim() !== '') {
  const url = new URL(connectionString);

  pool = new Pool({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    ssl: connectionString.includes('sslmode=require') ? {
      rejectUnauthorized: false
    } : false
  });
}

export default pool;
