import { z } from 'zod';

export const bookingSchema = z.object({
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date format'
  ),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(30, 'Duration must be at least 30 minutes').max(480, 'Duration cannot exceed 8 hours'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['portrait', 'wedding', 'event', 'commercial', 'other']),
  notes: z.string().optional()
});
