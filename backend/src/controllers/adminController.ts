import { Request, Response } from 'express';
import db from '../config/database.ts';

export const getAllUsers = (req: Request, res: Response) => {
  const users = db.prepare('SELECT id, name, email, role, status, avatar_url, created_at FROM users').all();
  res.json(users);
};

export const updateUserStatus = (req: Request, res: Response) => {
  const { status } = req.body;
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
};

export const deleteUser = (req: Request, res: Response) => {
  const userId = req.params.id;
  
  // Check if trying to delete admin
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as any;
  if (user?.role === 'admin') {
    return res.status(403).json({ error: 'Cannot delete admin user' });
  }

  // Delete related data first
  db.prepare('DELETE FROM bookings WHERE student_id = ? OR tutor_id = ?').run(userId, userId);
  db.prepare('DELETE FROM reviews WHERE student_id = ? OR tutor_id = ?').run(userId, userId);
  db.prepare('DELETE FROM tutor_profiles WHERE user_id = ?').run(userId);
  
  // Delete user
  db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  
  res.json({ success: true });
};

export const updateProfile = (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { name, email, avatar_url } = req.body;

  // Check if email already exists for another user
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, userId) as any;
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  // Update user with avatar_url if provided
  if (avatar_url !== undefined) {
    db.prepare('UPDATE users SET name = ?, email = ?, avatar_url = ? WHERE id = ?').run(name, email, avatar_url, userId);
  } else {
    db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email, userId);
  }
  
  const updatedUser = db.prepare('SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?').get(userId);
  res.json(updatedUser);
};
