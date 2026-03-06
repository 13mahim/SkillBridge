import { initPostgresDb } from './postgres-schema';

export function initDb() {
  return initPostgresDb();
}

export default initDb;
