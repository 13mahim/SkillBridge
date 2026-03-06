import { Response } from 'express';
import db from '../config/database.js';
import { AuthRequest } from '../middlewares/auth.js';

export const createReview = async (req: AuthRequest, res: Response) => {
  const { bookingId, tutorId, rating, comment } = req.body;
  
  try {
    await db.prepare('INSERT INTO reviews (booking_id, student_id, tutor_id, rating, comment) VALUES ($1, $2, $3, $4, $5)').run(
      bookingId, req.user!.id, tutorId, rating, comment
    );
    
    // Update tutor average rating
    const stats: any = await db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE tutor_id = $1').get(tutorId);
    await db.prepare('UPDATE tutor_profiles SET rating = $1, review_count = $2 WHERE user_id = $3').run(
      stats.avg, stats.count, tutorId
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
