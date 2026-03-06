import db from '../config/database.ts';

export function initDb() {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('student', 'tutor', 'admin')) NOT NULL,
      status TEXT DEFAULT 'active',
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Categories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `);

  // Tutor Profiles Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tutor_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      bio TEXT,
      hourly_rate REAL,
      subjects TEXT, -- Comma separated or JSON
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      availability TEXT, -- JSON string of availability slots
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Bookings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      tutor_id INTEGER NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      status TEXT CHECK(status IN ('confirmed', 'completed', 'cancelled')) DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Reviews Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER UNIQUE NOT NULL,
      student_id INTEGER NOT NULL,
      tutor_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Seed Categories if empty
  const categoriesCount = db.prepare('SELECT count(*) as count FROM categories').get() as { count: number };
  if (categoriesCount.count === 0) {
    const insertCategory = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
    const defaultCategories = [
      ['Mathematics', 'mathematics'],
      ['Science', 'science'],
      ['Languages', 'languages'],
      ['Computer Science', 'computer-science'],
      ['Arts & Humanities', 'arts-humanities'],
      ['Business', 'business']
    ];
    defaultCategories.forEach(cat => insertCategory.run(cat[0], cat[1]));
  }

  // Seed Admin if empty (password: admin123)
  // In a real app, we'd use bcrypt here, but for seeding we can do it in the server init
}

export default db;
