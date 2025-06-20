import express from 'express';
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController';
import { validate } from '../middleware/validateRequest';
import { authenticateToken } from '../middleware/auth';
import { bookingSchema } from '../validation/bookingSchema';

const router = express.Router();

// Re-enable authentication middleware
router.use(authenticateToken);

router.post('/', validate(bookingSchema), createBooking);
router.get('/', getBookings);
router.put('/:id', validate(bookingSchema), updateBooking);
router.delete('/:id', deleteBooking);

export default router;
