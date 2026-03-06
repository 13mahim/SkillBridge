import db, { initDb } from './src/models/database.ts';
import bcrypt from 'bcryptjs';

async function seedTutors() {
  initDb();

  const tutors = [
    {
      name: 'Dr. Sarah Ahmed',
      email: 'sarah.ahmed@example.com',
      password: 'tutor123',
      bio: 'PhD in Mathematics with 10+ years of teaching experience. Specialized in Calculus, Algebra, and Statistics.',
      hourly_rate: 50,
      subjects: 'Mathematics, Calculus, Algebra, Statistics',
      availability: JSON.stringify({
        monday: ['09:00-12:00', '14:00-17:00'],
        wednesday: ['09:00-12:00', '14:00-17:00'],
        friday: ['09:00-12:00', '14:00-17:00']
      })
    },
    {
      name: 'Prof. Karim Rahman',
      email: 'karim.rahman@example.com',
      password: 'tutor123',
      bio: 'Computer Science professor with expertise in Python, JavaScript, and Web Development. Love teaching programming!',
      hourly_rate: 60,
      subjects: 'Computer Science, Python, JavaScript, Web Development',
      availability: JSON.stringify({
        tuesday: ['10:00-13:00', '15:00-18:00'],
        thursday: ['10:00-13:00', '15:00-18:00'],
        saturday: ['10:00-16:00']
      })
    },
    {
      name: 'Ms. Fatima Khan',
      email: 'fatima.khan@example.com',
      password: 'tutor123',
      bio: 'Physics and Chemistry expert. Making science fun and easy to understand for students of all levels.',
      hourly_rate: 45,
      subjects: 'Science, Physics, Chemistry',
      availability: JSON.stringify({
        monday: ['13:00-17:00'],
        wednesday: ['13:00-17:00'],
        friday: ['13:00-17:00']
      })
    },
    {
      name: 'Mr. Rahim Hossain',
      email: 'rahim.hossain@example.com',
      password: 'tutor123',
      bio: 'English Language specialist. IELTS and TOEFL preparation expert with 8 years experience.',
      hourly_rate: 40,
      subjects: 'Languages, English, IELTS, TOEFL',
      availability: JSON.stringify({
        monday: ['09:00-12:00'],
        tuesday: ['09:00-12:00'],
        wednesday: ['09:00-12:00'],
        thursday: ['09:00-12:00'],
        friday: ['09:00-12:00']
      })
    },
    {
      name: 'Dr. Nadia Islam',
      email: 'nadia.islam@example.com',
      password: 'tutor123',
      bio: 'Business and Economics teacher. MBA from top university. Helping students excel in business studies.',
      hourly_rate: 55,
      subjects: 'Business, Economics, Accounting, Finance',
      availability: JSON.stringify({
        tuesday: ['14:00-18:00'],
        thursday: ['14:00-18:00'],
        saturday: ['09:00-15:00']
      })
    },
    {
      name: 'Mr. Tanvir Ahmed',
      email: 'tanvir.ahmed@example.com',
      password: 'tutor123',
      bio: 'History and Social Studies expert. Making history come alive through engaging storytelling.',
      hourly_rate: 35,
      subjects: 'Arts & Humanities, History, Social Studies',
      availability: JSON.stringify({
        monday: ['15:00-19:00'],
        wednesday: ['15:00-19:00'],
        friday: ['15:00-19:00']
      })
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
      'INSERT INTO tutor_profiles (user_id, bio, hourly_rate, subjects, availability) VALUES (?, ?, ?, ?, ?)'
    ).run(result.lastInsertRowid, tutor.bio, tutor.hourly_rate, tutor.subjects, tutor.availability);

    console.log(`✓ Added tutor: ${tutor.name}`);
  }

  console.log('\n✅ Seeding completed!');
  console.log('All tutors have password: tutor123');
}

seedTutors().catch(console.error);
