import { Request, Response } from 'express';
import db from '../config/database';
import { AuthRequest } from '../middlewares/auth';

export const getAllTutors = async (req: Request, res: Response) => {
  try {
    const { category, search, limit } = req.query;
    let query = `
      SELECT u.id, u.name, u.avatar_url, tp.bio, tp.hourly_rate, tp.subjects, tp.rating, tp.review_count
      FROM users u
      JOIN tutor_profiles tp ON u.id = tp.user_id
      WHERE u.role = 'tutor' AND u.status = 'active'
    `;
    const params: any[] = [];

    if (category) {
      params.push(`%${category}%`);
      query += ` AND tp.subjects ILIKE $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`, `%${search}%`);
      query += ` AND (u.name ILIKE $${params.length - 1} OR tp.bio ILIKE $${params.length})`;
    }
    if (limit) {
      params.push(parseInt(limit as string));
      query += ` LIMIT $${params.length}`;
    }

    const tutors = await db.prepare(query).all(...params);
    res.json(tutors);
  } catch (error: any) {
    console.error('getAllTutors error:', error);
    res.status(500).json({ error: 'Failed to fetch tutors', details: error.message });
  }
};

export const getTutorById = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    console.error('getTutorById error:', error);
    res.status(500).json({ error: 'Failed to fetch tutor', details: error.message });
  }
};

export const updateTutorProfile = async (req: AuthRequest, res: Response) => {
  try {
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
  } catch (error: any) {
    console.error('updateTutorProfile error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};
