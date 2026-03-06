import { Request, Response } from 'express';
import db from '../config/database.js';
import { AuthRequest } from '../middlewares/auth.js';

export const getAllTutors = async (req: Request, res: Response) => {
  const { category, search } = req.query;
  let query = `
    SELECT u.id, u.name, u.avatar_url, tp.bio, tp.hourly_rate, tp.subjects, tp.rating, tp.review_count
    FROM users u
    JOIN tutor_profiles tp ON u.id = tp.user_id
    WHERE u.role = 'tutor' AND u.status = 'active'
  `;
  const params: any[] = [];

  if (category) {
    query += ` AND tp.subjects LIKE $${params.length + 1}`;
    params.push(`%${category}%`);
  }
  if (search) {
    query += ` AND (u.name LIKE $${params.length + 1} OR tp.bio LIKE $${params.length + 2})`;
    params.push(`%${search}%`, `%${search}%`);
  }

  const tutors = await db.prepare(query).all(...params);
  res.json(tutors);
};

export const getTutorById = async (req: Request, res: Response) => {
  const tutor: any = await db.prepare(`
    SELECT u.id, u.name, u.avatar_url, tp.bio, tp.hourly_rate, tp.subjects, tp.rating, tp.review_count, tp.availability
    FROM users u
    JOIN tutor_profiles tp ON u.id = tp.user_id
    WHERE u.id = $1 AND u.role = 'tutor'
  `).get(req.params.id);
  
  if (!tutor) return res.status(404).json({ error: 'Tutor not found' });
  
  const reviews = await db.prepare(`
    SELECT r.*, u.name as student_name
    FROM reviews r
    JOIN users u ON r.student_id = u.id
    WHERE r.tutor_id = $1
    ORDER BY r.created_at DESC
  `).all(req.params.id);

  res.json({ ...tutor, reviews });
};

export const updateTutorProfile = async (req: AuthRequest, res: Response) => {
  if (req.user!.role !== 'tutor') {
    return res.status(403).json({ error: 'Only tutors can update profile' });
  }
  
  const { bio, hourly_rate, subjects, availability } = req.body;
  await db.prepare(`
    UPDATE tutor_profiles 
    SET bio = $1, hourly_rate = $2, subjects = $3, availability = $4
    WHERE user_id = $5
  `).run(bio, hourly_rate, subjects, availability, req.user!.id);
  
  res.json({ success: true });
};
