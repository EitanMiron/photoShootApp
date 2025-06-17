import { Request, Response } from 'express';
import Booking from '../models/Booking';

// Create a new booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get all bookings
export const getBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
};
// Delete a booking
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};