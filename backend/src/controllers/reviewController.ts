import { Response } from 'express';
import db from '../config/database.js';
import { AuthRequest } from '../middlewares/auth.js';

export const createReview = async (req: AuthRequest, res: Response) => {
  const { bookingId, tutorId, rating, comment } = req.body;
  const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';
  
  try {
    if (usePostgres) {
      await db.prepare('INSERT INTO reviews (booking_id, student_id, tutor_id, rating, comment) VALUES ($1, $2, $3, $4, $5)').run(
        bookingId, req.user!.id, tutorId, rating, comment
      );
      
      // Update tutor average rating
      const stats: any = await db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE tutor_id = $1').get(tutorId);
      await db.prepare('UPDATE tutor_profiles SET rating = $1, review_count = $2 WHERE user_id = $3').run(
        stats.avg, stats.count, tutorId
      );
    } else {
      await db.prepare('INSERT INTO reviews (booking_id, student_id, tutor_id, rating, comment) VALUES (?, ?, ?, ?, ?)').run(
        bookingId, req.user!.id, tutorId, rating, comment
      );
      
      // Update tutor average rating
      const stats: any = await db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE tutor_id = ?').get(tutorId);
      await db.prepare('UPDATE tutor_profiles SET rating = ?, review_count = ? WHERE user_id = ?').run(
        stats.avg, stats.count, tutorId
      );
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getTutorReviews = async (req: AuthRequest, res: Response) => {
  const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';
  const placeholder = usePostgres ? '$1' : '?';
  
  const reviews = await db.prepare(`
    SELECT r.*, u.name as student_name 
    FROM reviews r 
    JOIN users u ON r.student_id = u.id 
    WHERE r.tutor_id = ${placeholder}
    ORDER BY r.created_at DESC
  `).all(req.user!.id);
  
  res.json(reviews);
};

export const getAllReviews = async (req: AuthRequest, res: Response) => {
  const reviews = await db.prepare(`
    SELECT r.*, 
      s.name as student_name,
      t.name as tutor_name
    FROM reviews r 
    JOIN users s ON r.student_id = s.id 
    JOIN users t ON r.tutor_id = t.id
    ORDER BY r.created_at DESC
  `).all();
  
  res.json(reviews);
};
