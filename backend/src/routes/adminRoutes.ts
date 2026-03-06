import { Router } from 'express';
import * as adminController from '../controllers/adminController.ts';
import { authenticate, isAdmin } from '../middlewares/auth.ts';

const router = Router();

router.get('/users', authenticate, isAdmin, adminController.getAllUsers);
router.patch('/users/:id/status', authenticate, isAdmin, adminController.updateUserStatus);
router.delete('/users/:id', authenticate, isAdmin, adminController.deleteUser);
router.patch('/profile', authenticate, adminController.updateProfile);

export default router;
