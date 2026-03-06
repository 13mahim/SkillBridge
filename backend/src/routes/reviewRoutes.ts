import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, reviewController.createReview);

export default router;
