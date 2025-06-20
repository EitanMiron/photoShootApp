import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('Auth middleware - authHeader:', authHeader);
  console.log('Auth middleware - token:', token);

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', async (err: any, decoded: any) => {
    if (err) {
      console.log('JWT verification error:', err);
      res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    console.log('JWT decoded:', decoded);

    try {
      const user = await User.findById(decoded.userId).select('-password');
      
      console.log('Found user:', user);
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Ensure the user object has both id and _id for compatibility
      const userWithId = {
        ...user.toObject(),
        id: user._id
      };

      console.log('User object to attach:', userWithId);
      
      req.user = userWithId;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Authentication error'
      });
    }
  });
}; 