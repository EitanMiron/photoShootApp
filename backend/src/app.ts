// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';
// import bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));
