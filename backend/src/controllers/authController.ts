import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.ts';
import { config } from '../config/index.ts';
import { AuthRequest } from '../middlewares/auth.ts';

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      name, email, hashedPassword, role
    );
    
    if (role === 'tutor') {
      db.prepare('INSERT INTO tutor_profiles (user_id) VALUES (?)').run(result.lastInsertRowid);
    }

    const token = jwt.sign({ id: result.lastInsertRowid, email, role }, config.jwtSecret);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: result.lastInsertRowid, name, email, role } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret);
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url, created_at: user.created_at } });
};

export const getMe = (req: AuthRequest, res: Response) => {
  const user: any = db.prepare('SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?').get(req.user!.id);
  res.json({ user });
};

export const logout = (req: AuthRequest, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true });
};
