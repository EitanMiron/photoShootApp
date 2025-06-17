import express from 'express';
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController';
import { validate } from '../middleware/validateRequest';
import { bookingSchema } from '../validation/bookingSchema';

const router = express.Router();

router.post('/', validate(bookingSchema), createBooking);
router.get('/', getBookings);
router.put('/:id', validate(bookingSchema), updateBooking);
router.delete('/:id', deleteBooking);

export default router;
