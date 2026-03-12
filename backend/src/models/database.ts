import { initPostgresDb } from './postgres-schema.js';
import db from '../config/database.js';

export async function initDb() {
  const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';
  
  if (usePostgres) {
    return initPostgresDb();
  } else {
    // SQLite initialization
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'tutor', 'admin')),
        avatar_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tutor_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        bio TEXT,
        hourly_rate REAL NOT NULL,
        subjects TEXT NOT NULL,
        rating REAL DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        tutor_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        duration INTEGER NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        total_price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        tutor_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT
      );

      CREATE TABLE IF NOT EXISTS hero_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        image_url TEXT NOT NULL,
        button_text TEXT DEFAULT 'Find a Tutor',
        button_link TEXT DEFAULT '/tutors',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default hero content if empty
    const heroCheck = db.prepare('SELECT COUNT(*) as count FROM hero_content').get() as { count: number };
    if (heroCheck.count === 0) {
      db.prepare(`
        INSERT INTO hero_content (title, subtitle, image_url, button_text, button_link, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        'Unlock Your Potential with Expert Tutors',
        'Connect with verified experts across 50+ subjects. Personalized learning that fits your schedule and budget.',
        'https://picsum.photos/seed/learning/800/800',
        'Find a Tutor',
        '/tutors',
        1
      );
      console.log('✅ Default hero content seeded');
    }
    
    console.log('✅ SQLite database initialized');
  }
}

export default initDb;
