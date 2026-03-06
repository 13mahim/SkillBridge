import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/users', authenticate, isAdmin, adminController.getAllUsers);
router.patch('/users/:id/status', authenticate, isAdmin, adminController.updateUserStatus);
router.delete('/users/:id', authenticate, isAdmin, adminController.deleteUser);
router.delete('/bookings/:id', authenticate, isAdmin, adminController.deleteBooking);
router.patch('/profile', authenticate, adminController.updateProfile);

export default router;
