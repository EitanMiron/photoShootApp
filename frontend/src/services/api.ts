import type { ApiResponse, User, Booking } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Authentication types
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        // Return the error from the backend if available
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }
      
      return data;
    } catch (error) {
      // Handle network errors (like connection refused)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Unable to connect to server. Please check if the backend is running.',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // Authentication endpoints
  async login(loginData: LoginData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async register(registerData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users');
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}/change-password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    const response = await this.request<Booking[]>('/bookings');
    if (response.success && response.data) {
      response.data = response.data.map((b: any) => ({ ...b, id: b._id }));
    }
    return response;
  }

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    const response = await this.request<Booking>(`/bookings/${id}`);
    if (response.success && response.data) {
      response.data = { ...response.data, id: (response.data as any)._id };
    }
    return response;
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Booking>> {
    const response = await this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    if (response.success && response.data) {
      response.data = { ...response.data, id: (response.data as any)._id };
    }
    return response;
  }

  async updateBooking(id: string, bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> {
    const response = await this.request<Booking>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
    if (response.success && response.data) {
      response.data = { ...response.data, id: (response.data as any)._id };
    }
    return response;
  }

  async deleteBooking(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(); 