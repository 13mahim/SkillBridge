import { initDb } from './src/models/database.js';
import db from './src/config/database.js';
import bcrypt from 'bcryptjs';

async function seedTutors() {
  await initDb();

  const tutors = [
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@skillbridge.com',
      password: 'tutor123',
      bio: 'PhD in Mathematics with 15 years of teaching experience.',
      hourly_rate: 50,
      subjects: 'Mathematics, Calculus, Algebra',
      rating: 4.9,
      review_count: 127
    },
    {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@skillbridge.com',
      password: 'tutor123',
      bio: 'Computer Science professor and software engineer.',
      hourly_rate: 60,
      subjects: 'Computer Science, Python, JavaScript',
      rating: 4.8,
      review_count: 98
    },
    {
      name: 'Emma Williams',
      email: 'emma.williams@skillbridge.com',
      password: 'tutor123',
      bio: 'Native English speaker with TEFL certification.',
      hourly_rate: 40,
      subjects: 'English, IELTS, Business English',
      rating: 4.7,
      review_count: 156
    },
    {
      name: 'Dr. James Rodriguez',
      email: 'james.rodriguez@skillbridge.com',
      password: 'tutor123',
      bio: 'Physics PhD with a passion for making complex concepts simple.',
      hourly_rate: 55,
      subjects: 'Physics, Mechanics, Electromagnetism',
      rating: 4.9,
      review_count: 89
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@skillbridge.com',
      password: 'tutor123',
      bio: 'Professional artist and art history teacher.',
      hourly_rate: 45,
      subjects: 'Art, Drawing, Painting',
      rating: 4.6,
      review_count: 73
    },
    {
      name: 'David Kim',
      email: 'david.kim@skillbridge.com',
      password: 'tutor123',
      bio: 'MBA graduate and business consultant.',
      hourly_rate: 65,
      subjects: 'Business, Economics, Finance',
      rating: 4.8,
      review_count: 112
    }
  ];

  for (const tutor of tutors) {
    // Check if tutor already exists
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(tutor.email);
    if (existing) {
      console.log(`Tutor ${tutor.email} already exists, skipping...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(tutor.password, 10);
    
    const result = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(tutor.name, tutor.email, hashedPassword, 'tutor');

    db.prepare(
      'INSERT INTO tutor_profiles (user_id, bio, hourly_rate, subjects, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(result.lastInsertRowid, tutor.bio, tutor.hourly_rate, tutor.subjects, tutor.rating, tutor.review_count);

    console.log(`✓ Added tutor: ${tutor.name}`);
  }

  console.log('\n✅ Seeding completed!');
  console.log('All tutors have password: tutor123');
}

seedTutors().catch(console.error);
