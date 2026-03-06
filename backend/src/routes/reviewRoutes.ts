import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, reviewController.createReview);

export default router;
