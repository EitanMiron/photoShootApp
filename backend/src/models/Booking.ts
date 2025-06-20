// src/models/Booking.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'portrait' | 'wedding' | 'event' | 'commercial' | 'other';
  date: string;
  time: string;
  duration: number;
  location: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const BookingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['portrait', 'wedding', 'event', 'commercial', 'other'],
      required: true
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 30,
      max: 480
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);





