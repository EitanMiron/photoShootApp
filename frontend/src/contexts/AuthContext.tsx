import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to normalize user object
  const normalizeUser = (userData: any): User => {
    if (!userData) return userData;
    return {
      ...userData,
      id: userData.id || userData._id,
    };
  };

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = normalizeUser(JSON.parse(storedUser));
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        const normalizedUser = normalizeUser(userData);
        setUser(normalizedUser);
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        return true;
      } else {
        console.error('Login failed:', response.error);
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const response = await apiService.register({ name, email, password, phone });
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        const normalizedUser = normalizeUser(userData);
        setUser(normalizedUser);
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        return true;
      } else {
        console.error('Registration failed:', response.error);
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    apiService.logout().catch(error => {
      console.error('Logout error:', error);
    });
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 