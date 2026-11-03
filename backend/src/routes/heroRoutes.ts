import express from 'express';
import { getHeroContent, updateHeroContent, deleteHeroContent } from '../controllers/heroController';
import { authenticate, isAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/', getHeroContent);
router.put('/', authenticate, isAdmin, updateHeroContent);
router.delete('/:id', authenticate, isAdmin, deleteHeroContent);

export default router;
