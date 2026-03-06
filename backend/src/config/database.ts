// Use PostgreSQL adapter if DATABASE_URL is set, otherwise use SQLite
const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';

let db: any;

if (usePostgres) {
  const { default: pgAdapter } = await import('./db-adapter.js');
  db = pgAdapter;
  console.log('📊 Using PostgreSQL database');
} else {
  const Database = (await import('better-sqlite3')).default;
  const dbInstance = new Database('./db/skillbridge.db');
  db = dbInstance;
  console.log('📊 Using SQLite database');
}

export default db;
