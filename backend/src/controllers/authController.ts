import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { config } from '../config/index.js';
import { AuthRequest } from '../middlewares/auth.js';

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  
  try {
    const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let result;
    if (usePostgres) {
      result = await db.prepare('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)').run(
        name, email, hashedPassword, role
      );
      
      if (role === 'tutor') {
        await db.prepare('INSERT INTO tutor_profiles (user_id) VALUES ($1)').run(result.lastInsertRowid);
      }
    } else {
      result = await db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
        name, email, hashedPassword, role
      );
      
      if (role === 'tutor') {
        await db.prepare('INSERT INTO tutor_profiles (user_id) VALUES (?)').run(result.lastInsertRowid);
      }
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
  const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';
  const placeholder = usePostgres ? '$1' : '?';
  
  const user: any = await db.prepare(`SELECT * FROM users WHERE email = ${placeholder}`).get(email);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret);
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url, created_at: user.created_at } });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';
  const placeholder = usePostgres ? '$1' : '?';
  
  const user: any = await db.prepare(`SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ${placeholder}`).get(req.user!.id);
  res.json({ user });
};

export const logout = (req: AuthRequest, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true });
};
