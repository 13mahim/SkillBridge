import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/database.js';

const router = Router();

router.post('/seed-tutors', async (req: Request, res: Response) => {
  try {
    const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';
    const placeholder = usePostgres ? '$1' : '?';
    const force = req.query.force === 'true';
    
    // Check if tutors already exist
    const tutorCount = await db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = ${placeholder}`).get('tutor');
    
    if (!force && tutorCount && tutorCount.count > 0) {
      return res.json({ message: 'Tutors already exist', count: tutorCount.count, hint: 'Use ?force=true to seed anyway' });
    }

    const tutorPassword = await bcrypt.hash('tutor123', 10);
    
    const tutors = [
      { name: 'Dr. Sarah Johnson', email: 'sarah.johnson@skillbridge.com', bio: 'PhD in Mathematics with 15 years of teaching experience.', hourly_rate: 50, subjects: 'Mathematics, Calculus, Algebra', rating: 4.9, review_count: 127 },
      { name: 'Prof. Michael Chen', email: 'michael.chen@skillbridge.com', bio: 'Computer Science professor and software engineer.', hourly_rate: 60, subjects: 'Computer Science, Python, JavaScript', rating: 4.8, review_count: 98 },
      { name: 'Emma Williams', email: 'emma.williams@skillbridge.com', bio: 'Native English speaker with TEFL certification.', hourly_rate: 40, subjects: 'English, IELTS, Business English', rating: 4.7, review_count: 156 },
      { name: 'Dr. James Rodriguez', email: 'james.rodriguez@skillbridge.com', bio: 'Physics PhD with a passion for making complex concepts simple.', hourly_rate: 55, subjects: 'Physics, Mechanics, Electromagnetism', rating: 4.9, review_count: 89 },
      { name: 'Lisa Anderson', email: 'lisa.anderson@skillbridge.com', bio: 'Professional artist and art history teacher.', hourly_rate: 45, subjects: 'Art, Drawing, Painting', rating: 4.6, review_count: 73 },
      { name: 'David Kim', email: 'david.kim@skillbridge.com', bio: 'MBA graduate and business consultant.', hourly_rate: 65, subjects: 'Business, Economics, Finance', rating: 4.8, review_count: 112 }
    ];
    
    let created = 0;
    let skipped = 0;
    for (const tutor of tutors) {
      try {
        let result;
        if (usePostgres) {
          result = await db.prepare('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)').run(
            tutor.name, tutor.email, tutorPassword, 'tutor'
          );
          await db.prepare('INSERT INTO tutor_profiles (user_id, bio, hourly_rate, subjects, rating, review_count) VALUES ($1, $2, $3, $4, $5, $6)').run(
            result.lastInsertRowid, tutor.bio, tutor.hourly_rate, tutor.subjects, tutor.rating, tutor.review_count
          );
        } else {
          result = await db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
            tutor.name, tutor.email, tutorPassword, 'tutor'
          );
          await db.prepare('INSERT INTO tutor_profiles (user_id, bio, hourly_rate, subjects, rating, review_count) VALUES (?, ?, ?, ?, ?, ?)').run(
            result.lastInsertRowid, tutor.bio, tutor.hourly_rate, tutor.subjects, tutor.rating, tutor.review_count
          );
        }
        created++;
      } catch (err: any) {
        if (err.message && err.message.includes('UNIQUE')) {
          skipped++;
        } else {
          throw err;
        }
      }
    }
    
    res.json({ success: true, message: `${created} tutors created, ${skipped} skipped (already exist)`, password: 'tutor123' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
