import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { initPostgresDb } from './src/models/postgres-schema.js';
import pool from './src/config/postgres.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database
    await initPostgresDb();
    
    const client = await pool.connect();
    
    try {
      // Check if admin exists
      const adminCheck = await client.query('SELECT * FROM users WHERE role = $1', ['admin']);
      
      if (adminCheck.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await client.query(
          'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
          ['System Admin', 'admin@skillbridge.com', hashedPassword, 'admin']
        );
        console.log('✅ Admin user created');
      }
      
      // Check if tutors exist
      const tutorCheck = await client.query('SELECT COUNT(*) FROM users WHERE role = $1', ['tutor']);
      
      if (parseInt(tutorCheck.rows[0].count) === 0) {
        const tutorPassword = await bcrypt.hash('tutor123', 10);
        
        const tutors = [
          {
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@skillbridge.com',
            bio: 'PhD in Mathematics with 15 years of teaching experience. Specialized in calculus, algebra, and statistics.',
            hourly_rate: 50,
            subjects: 'Mathematics, Calculus, Algebra, Statistics',
            rating: 4.9,
            review_count: 127
          },
          {
            name: 'Prof. Michael Chen',
            email: 'michael.chen@skillbridge.com',
            bio: 'Computer Science professor and software engineer. Expert in Python, JavaScript, and web development.',
            hourly_rate: 60,
            subjects: 'Computer Science, Python, JavaScript, Web Development',
            rating: 4.8,
            review_count: 98
          },
          {
            name: 'Emma Williams',
            email: 'emma.williams@skillbridge.com',
            bio: 'Native English speaker with TEFL certification. Specializing in business English and IELTS preparation.',
            hourly_rate: 40,
            subjects: 'English, IELTS, Business English, Grammar',
            rating: 4.7,
            review_count: 156
          },
          {
            name: 'Dr. James Rodriguez',
            email: 'james.rodriguez@skillbridge.com',
            bio: 'Physics PhD with a passion for making complex concepts simple. Expert in mechanics and electromagnetism.',
            hourly_rate: 55,
            subjects: 'Physics, Mechanics, Electromagnetism, Thermodynamics',
            rating: 4.9,
            review_count: 89
          },
          {
            name: 'Lisa Anderson',
            email: 'lisa.anderson@skillbridge.com',
            bio: 'Professional artist and art history teacher. Helping students develop their creative skills.',
            hourly_rate: 45,
            subjects: 'Art, Drawing, Painting, Art History',
            rating: 4.6,
            review_count: 73
          },
          {
            name: 'David Kim',
            email: 'david.kim@skillbridge.com',
            bio: 'MBA graduate and business consultant. Teaching economics, finance, and business strategy.',
            hourly_rate: 65,
            subjects: 'Business, Economics, Finance, Marketing',
            rating: 4.8,
            review_count: 112
          }
        ];
        
        for (const tutor of tutors) {
          const userResult = await client.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
            [tutor.name, tutor.email, tutorPassword, 'tutor']
          );
          
          const userId = userResult.rows[0].id;
          
          await client.query(
            'INSERT INTO tutor_profiles (user_id, bio, hourly_rate, subjects, rating, review_count) VALUES ($1, $2, $3, $4, $5, $6)',
            [userId, tutor.bio, tutor.hourly_rate, tutor.subjects, tutor.rating, tutor.review_count]
          );
          
          console.log(`✅ Created tutor: ${tutor.name}`);
        }
      }
      
      console.log('🎉 Database seeding completed!');
      console.log('\n📝 Login credentials:');
      console.log('Admin: admin@skillbridge.com / admin123');
      console.log('Tutors: [tutor-email] / tutor123');
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedDatabase();
