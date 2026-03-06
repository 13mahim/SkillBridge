import { initPostgresDb } from './postgres-schema.ts';

export function initDb() {
  return initPostgresDb();
}

export default initDb;
