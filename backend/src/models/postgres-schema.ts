import pool from '../config/postgres.ts';

export async function initPostgresDb() {
  const client = await pool.connect();
  
  try {
    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) CHECK(role IN ('student', 'tutor', 'admin')) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Tutor Profiles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tutor_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT,
        hourly_rate DECIMAL(10, 2),
        subjects TEXT,
        rating DECIMAL(3, 2) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        availability TEXT
      )
    `);

    // Bookings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tutor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(50) CHECK(status IN ('confirmed', 'completed', 'cancelled')) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reviews Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tutor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed Categories if empty
    const categoriesResult = await client.query('SELECT COUNT(*) as count FROM categories');
    if (parseInt(categoriesResult.rows[0].count) === 0) {
      const defaultCategories = [
        ['Mathematics', 'mathematics'],
        ['Science', 'science'],
        ['Languages', 'languages'],
        ['Computer Science', 'computer-science'],
        ['Arts & Humanities', 'arts-humanities'],
        ['Business', 'business']
      ];
      
      for (const [name, slug] of defaultCategories) {
        await client.query('INSERT INTO categories (name, slug) VALUES ($1, $2)', [name, slug]);
      }
      console.log('✅ Categories seeded');
    }

    console.log('✅ PostgreSQL database initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export { pool };
