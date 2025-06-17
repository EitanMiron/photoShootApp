import { z } from 'zod';

export const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date format'
  ),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional()
});
