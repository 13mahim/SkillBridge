import { Router } from 'express';
import * as tutorController from '../controllers/tutorController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', tutorController.getAllTutors);
router.get('/:id', tutorController.getTutorById);
router.put('/profile', authenticate, tutorController.updateTutorProfile);

export default router;
