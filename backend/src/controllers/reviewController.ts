import { Response } from 'express';
import db from '../config/database.ts';
import { AuthRequest } from '../middlewares/auth.ts';

export const createReview = (req: AuthRequest, res: Response) => {
  const { bookingId, tutorId, rating, comment } = req.body;
  
  try {
    db.prepare('INSERT INTO reviews (booking_id, student_id, tutor_id, rating, comment) VALUES (?, ?, ?, ?, ?)').run(
      bookingId, req.user!.id, tutorId, rating, comment
    );
    
    // Update tutor average rating
    const stats: any = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE tutor_id = ?').get(tutorId);
    db.prepare('UPDATE tutor_profiles SET rating = ?, review_count = ? WHERE user_id = ?').run(
      stats.avg, stats.count, tutorId
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
