import pool from './postgres.js';

class DatabaseAdapter {
  async exec(sql: string) {
    const client = await pool.connect();
    try {
      await client.query(sql);
    } finally {
      client.release();
    }
  }

  prepare(sql: string) {
    return {
      get: async (...params: any[]) => {
        const client = await pool.connect();
        try {
          let paramIndex = 1;
          const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
          const result = await client.query(pgSql, params.length ? params : undefined);
          return result.rows[0] || null;
        } finally {
          client.release();
        }
      },
      all: async (...params: any[]) => {
        const client = await pool.connect();
        try {
          let paramIndex = 1;
          const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
          const result = await client.query(pgSql, params.length ? params : undefined);
          return result.rows;
        } finally {
          client.release();
        }
      },
      run: async (...params: any[]) => {
        const client = await pool.connect();
        try {
          let paramIndex = 1;
          const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

          let finalSql = pgSql;
          if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
            finalSql = pgSql + ' RETURNING id';
          }

          const result = await client.query(finalSql, params.length ? params : undefined);

          return {
            lastInsertRowid: result.rows[0]?.id || null,
            changes: result.rowCount || 0
          };
        } finally {
          client.release();
        }
      }
    };
  }
}

const db = new DatabaseAdapter();
export default db;
