import { Request, Response } from 'express';
import { Booking } from '../models/Booking';

// Create a new booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from the authenticated user (will be set by auth middleware)
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) {
      res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
      return;
    }
    const bookingData = {
      ...req.body,
      userId,
      status: 'pending' // Default status for new bookings
    };
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();
    res.status(201).json({
      success: true,
      data: savedBooking
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create booking',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

// Get all bookings for the authenticated user
export const getBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) {
      res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
      return;
    }
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch bookings',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) {
      res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
      return;
    }
    const updated = await Booking.findOneAndUpdate(
      { _id: id, userId }, // Only update if booking belongs to user
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!updated) {
      res.status(404).json({ 
        success: false,
        error: 'Booking not found' 
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update booking' 
    });
  }
};

// Delete a booking
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) {
      res.status(401).json({ 
        success: false,
        error: 'User not authenticated' 
      });
      return;
    }
    const deleted = await Booking.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      res.status(404).json({ 
        success: false,
        error: 'Booking not found' 
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    console.error('Delete booking error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete booking' 
    });
  }
};