import { Router } from 'express';
import * as tutorController from '../controllers/tutorController.ts';
import { authenticate } from '../middlewares/auth.ts';

const router = Router();

router.get('/', tutorController.getAllTutors);
router.get('/:id', tutorController.getTutorById);
router.put('/profile', authenticate, tutorController.updateTutorProfile);

export default router;
