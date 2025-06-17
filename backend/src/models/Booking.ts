// src/models/Booking.ts
import mongoose, { Schema, Document} from 'mongoose';


export interface IBooking extends Document {
  name: string
  email: string
  phone: string
  date: string
  location: string
  notes?: string
}

const BookingSchema: Schema = new Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    notes: {
      type: String
    }

  },

  {
    timestamps: true
  }
);

const Booking = mongoose.model<IBooking>('Booking', BookingSchema)

export default Booking;





