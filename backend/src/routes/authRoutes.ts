import { Router } from 'express';
import * as authController from '../controllers/authController.ts';
import { authenticate } from '../middlewares/auth.ts';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authController.logout);

export default router;
