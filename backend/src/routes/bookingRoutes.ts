import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getBookings);
router.patch('/:id/status', authenticate, bookingController.updateBookingStatus);

export default router;
