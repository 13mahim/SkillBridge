import { Request, Response } from 'express';
import db from '../config/database';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await db.prepare('SELECT id, name, email, role, status, avatar_url, created_at FROM users').all();
  res.json(users);
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  await db.prepare('UPDATE users SET status = $1 WHERE id = $2').run(status, req.params.id);
  res.json({ success: true });
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  
  // Check if trying to delete admin
  const user = await db.prepare('SELECT role FROM users WHERE id = $1').get(userId) as any;
  if (user?.role === 'admin') {
    return res.status(403).json({ error: 'Cannot delete admin user' });
  }

  // Delete related data first
  await db.prepare('DELETE FROM bookings WHERE student_id = $1 OR tutor_id = $1').run(userId);
  await db.prepare('DELETE FROM reviews WHERE student_id = $1 OR tutor_id = $1').run(userId);
  await db.prepare('DELETE FROM tutor_profiles WHERE user_id = $1').run(userId);
  
  // Delete user
  await db.prepare('DELETE FROM users WHERE id = $1').run(userId);
  
  res.json({ success: true });
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { name, email, avatar_url } = req.body;

  // Check if email already exists for another user
  const existingUser = await db.prepare('SELECT id FROM users WHERE email = $1 AND id != $2').get(email, userId) as any;
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  // Update user with avatar_url if provided
  if (avatar_url !== undefined) {
    await db.prepare('UPDATE users SET name = $1, email = $2, avatar_url = $3 WHERE id = $4').run(name, email, avatar_url, userId);
  } else {
    await db.prepare('UPDATE users SET name = $1, email = $2 WHERE id = $3').run(name, email, userId);
  }
  
  const updatedUser = await db.prepare('SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1').get(userId);
  res.json(updatedUser);
};
