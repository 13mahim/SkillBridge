import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || '';

let pool: any = null;

if (connectionString && connectionString.trim() !== '') {
  const url = new URL(connectionString);

  pool = new Pool({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    ssl: {
      rejectUnauthorized: false
    },
    // Serverless-friendly settings
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });
}

export default pool;
