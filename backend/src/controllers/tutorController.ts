import { Request, Response } from 'express';
import db from '../config/database.ts';
import { AuthRequest } from '../middlewares/auth.ts';

export const getAllTutors = (req: Request, res: Response) => {
  const { category, search } = req.query;
  let query = `
    SELECT u.id, u.name, u.avatar_url, tp.bio, tp.hourly_rate, tp.subjects, tp.rating, tp.review_count
    FROM users u
    JOIN tutor_profiles tp ON u.id = tp.user_id
    WHERE u.role = 'tutor' AND u.status = 'active'
  `;
  const params: any[] = [];

  if (category) {
    query += ` AND tp.subjects LIKE ?`;
    params.push(`%${category}%`);
  }
  if (search) {
    query += ` AND (u.name LIKE ? OR tp.bio LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  const tutors = db.prepare(query).all(...params);
  res.json(tutors);
};

export const getTutorById = (req: Request, res: Response) => {
  const tutor: any = db.prepare(`
    SELECT u.id, u.name, u.avatar_url, tp.bio, tp.hourly_rate, tp.subjects, tp.rating, tp.review_count, tp.availability
    FROM users u
    JOIN tutor_profiles tp ON u.id = tp.user_id
    WHERE u.id = ? AND u.role = 'tutor'
  `).get(req.params.id);
  
  if (!tutor) return res.status(404).json({ error: 'Tutor not found' });
  
  const reviews = db.prepare(`
    SELECT r.*, u.name as student_name
    FROM reviews r
    JOIN users u ON r.student_id = u.id
    WHERE r.tutor_id = ?
    ORDER BY r.created_at DESC
  `).all(req.params.id);

  res.json({ ...tutor, reviews });
};

export const updateTutorProfile = (req: AuthRequest, res: Response) => {
  if (req.user!.role !== 'tutor') {
    return res.status(403).json({ error: 'Only tutors can update profile' });
  }
  
  const { bio, hourly_rate, subjects, availability } = req.body;
  db.prepare(`
    UPDATE tutor_profiles 
    SET bio = ?, hourly_rate = ?, subjects = ?, availability = ?
    WHERE user_id = ?
  `).run(bio, hourly_rate, subjects, availability, req.user!.id);
  
  res.json({ success: true });
};
