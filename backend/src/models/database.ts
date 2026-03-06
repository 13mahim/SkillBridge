import { initPostgresDb } from './postgres-schema.js';

export function initDb() {
  return initPostgresDb();
}

export default initDb;
