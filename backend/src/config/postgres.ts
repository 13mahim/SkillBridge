import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || '';

let pool: any = null;

if (connectionString && connectionString.trim() !== '') {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });
}

export default pool;
