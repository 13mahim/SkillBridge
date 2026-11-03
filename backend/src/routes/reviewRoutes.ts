import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { authenticate, isAdmin } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, reviewController.createReview);
router.get('/my-reviews', authenticate, reviewController.getTutorReviews);
router.get('/all', authenticate, isAdmin, reviewController.getAllReviews);

export default router;
