import { Request, Response } from 'express';
import db from '../config/database.js';

const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';

export const getHeroContent = async (req: Request, res: Response) => {
  try {
    if (usePostgres) {
      const result = await db.query('SELECT * FROM hero_content WHERE is_active = true ORDER BY created_at DESC LIMIT 1');
      res.json(result.rows[0] || null);
    } else {
      const hero = db.prepare('SELECT * FROM hero_content WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1').get();
      res.json(hero || null);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hero content' });
  }
};

export const updateHeroContent = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, image_url, button_text, button_link } = req.body;

    if (usePostgres) {
      // Deactivate all existing hero content
      await db.query('UPDATE hero_content SET is_active = false');
      
      // Insert new hero content
      const result = await db.query(
        `INSERT INTO hero_content (title, subtitle, image_url, button_text, button_link, is_active, updated_at)
         VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP)
         RETURNING *`,
        [title, subtitle, image_url, button_text || 'Find a Tutor', button_link || '/tutors']
      );
      res.json(result.rows[0]);
    } else {
      // Deactivate all existing hero content
      db.prepare('UPDATE hero_content SET is_active = 0').run();
      
      // Insert new hero content
      const result = db.prepare(`
        INSERT INTO hero_content (title, subtitle, image_url, button_text, button_link, is_active, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      `).run(title, subtitle, image_url, button_text || 'Find a Tutor', button_link || '/tutors');
      
      const newHero = db.prepare('SELECT * FROM hero_content WHERE id = ?').get(result.lastInsertRowid);
      res.json(newHero);
    }
  } catch (error) {
    console.error('Error updating hero content:', error);
    res.status(500).json({ error: 'Failed to update hero content' });
  }
};

export const deleteHeroContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (usePostgres) {
      await db.query('DELETE FROM hero_content WHERE id = $1', [id]);
    } else {
      db.prepare('DELETE FROM hero_content WHERE id = ?').run(id);
    }

    res.json({ message: 'Hero content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hero content' });
  }
};
