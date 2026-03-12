import { Request, Response } from 'express';
import dbAdapter from '../config/db-adapter.js';

export const getHeroContent = async (req: Request, res: Response) => {
  try {
    const hero = await dbAdapter.prepare('SELECT * FROM hero_content WHERE is_active = ? ORDER BY created_at DESC LIMIT 1').get(true);
    res.json(hero || null);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({ error: 'Failed to fetch hero content' });
  }
};

export const updateHeroContent = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, image_url, button_text, button_link } = req.body;

    // Deactivate all existing hero content
    await dbAdapter.prepare('UPDATE hero_content SET is_active = ?').run(false);
    
    // Insert new hero content
    await dbAdapter.prepare(
      `INSERT INTO hero_content (title, subtitle, image_url, button_text, button_link, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(title, subtitle, image_url, button_text || 'Find a Tutor', button_link || '/tutors', true);
    
    // Get the newly inserted hero content
    const newHero = await dbAdapter.prepare('SELECT * FROM hero_content WHERE is_active = ? ORDER BY created_at DESC LIMIT 1').get(true);
    res.json(newHero);
  } catch (error) {
    console.error('Error updating hero content:', error);
    res.status(500).json({ error: 'Failed to update hero content' });
  }
};

export const deleteHeroContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await dbAdapter.prepare('DELETE FROM hero_content WHERE id = ?').run(id);
    res.json({ message: 'Hero content deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero content:', error);
    res.status(500).json({ error: 'Failed to delete hero content' });
  }
};
