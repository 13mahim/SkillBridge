// Use PostgreSQL adapter if DATABASE_URL is set, otherwise use SQLite
const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';

let db: any;

if (usePostgres) {
  // Dynamically import PostgreSQL adapter
  const { default: pgAdapter } = await import('./db-adapter.js');
  db = pgAdapter;
  console.log('📊 Using PostgreSQL database');
} else {
  // Dynamically import SQLite (only available locally, not on Vercel)
  try {
    const Database = (await import('better-sqlite3')).default;
    const dbInstance = new (Database as any)('./db/skillbridge.db');
    db = dbInstance;
    console.log('📊 Using SQLite database');
  } catch (err) {
    console.error('❌ SQLite not available. Set DATABASE_URL for PostgreSQL.');
    throw err;
  }
}

export default db;
