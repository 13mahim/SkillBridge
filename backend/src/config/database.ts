import pgAdapter from './db-adapter.js';

// Always use PostgreSQL adapter (DATABASE_URL is required in production)
// SQLite is not supported on Vercel serverless
const db = pgAdapter;

export default db;
