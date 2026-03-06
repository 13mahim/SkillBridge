import { Request, Response } from 'express';
import db from '../config/database.ts';

export const getAllCategories = (req: Request, res: Response) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  res.json(categories);
};

export const createCategory = (req: Request, res: Response) => {
  const { name, slug } = req.body;
  
  try {
    const result = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
    res.json({ id: result.lastInsertRowid, name, slug });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
