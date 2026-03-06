import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.ts';
import { authenticate } from '../middlewares/auth.ts';

const router = Router();

router.post('/', authenticate, reviewController.createReview);

export default router;
