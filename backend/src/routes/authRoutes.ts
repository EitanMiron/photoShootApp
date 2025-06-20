import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { validate } from '../middleware/validateRequest';
import { loginSchema, registerSchema } from '../validation/authSchema';

const router = express.Router();

// Register endpoint
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user (password will be hashed automatically by the User model)
    const user = new User({
      name,
      email,
      password, // This will be hashed by the pre-save hook
      phone
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data (without password) and token
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Login endpoint
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password using the User model's comparePassword method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data (without password) and token
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.json({
      success: true,
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Logout endpoint (optional - client-side token removal is usually sufficient)
router.post('/logout', (req, res) => {
  // In a stateless JWT setup, logout is typically handled client-side
  // by removing the token from storage
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router; 