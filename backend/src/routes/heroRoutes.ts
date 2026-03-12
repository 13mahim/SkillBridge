import express from 'express';
import { getHeroContent, updateHeroContent, deleteHeroContent } from '../controllers/heroController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getHeroContent);
router.put('/', authenticate, isAdmin, updateHeroContent);
router.delete('/:id', authenticate, isAdmin, deleteHeroContent);

export default router;
