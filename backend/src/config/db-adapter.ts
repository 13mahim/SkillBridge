import pool from './postgres';

class DatabaseAdapter {
  // Execute SQL query
  async exec(sql: string) {
    const client = await pool.connect();
    try {
      await client.query(sql);
    } finally {
      client.release();
    }
  }

  // Prepare statement for SELECT queries
  prepare(sql: string) {
    return {
      get: async (...params: any[]) => {
        const client = await pool.connect();
        try {
          // Convert SQLite ? placeholders to PostgreSQL $1, $2, etc.
          let paramIndex = 1;
          const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
          const result = await client.query(pgSql, params);
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
          const result = await client.query(pgSql, params);
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
          
          // Handle RETURNING clause for INSERT/UPDATE
          let finalSql = pgSql;
          if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
            finalSql = pgSql + ' RETURNING id';
          }
          
          const result = await client.query(finalSql, params);
          
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
