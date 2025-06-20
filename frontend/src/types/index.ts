// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

// Booking related types
export interface Booking {
  id: string;
  userId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  location: string;
  type: 'portrait' | 'wedding' | 'event' | 'commercial' | 'other';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 