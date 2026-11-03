import { Request, Response } from 'express';
import db from '../config/database';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
  } catch (error: any) {
    console.error('getAllCategories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;
  try {
    const result = await db.prepare('INSERT INTO categories (name, slug) VALUES ($1, $2)').run(name, slug);
    res.json({ id: result.lastInsertRowid, name, slug });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await db.prepare('DELETE FROM categories WHERE id = $1').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
