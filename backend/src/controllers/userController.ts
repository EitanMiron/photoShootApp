import { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { userSchema } from '../validation/userSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';


// Register a new user
export const registerUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.errors });
      return;
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const loginUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers: RequestHandler = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId || userId.toString() !== id) {
      res.status(403).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId || userId.toString() !== id) {
      res.status(403).json({ success: false, error: 'Unauthorized' });
      return;
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const changePassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId || userId.toString() !== id) {
      res.status(403).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, error: 'Current password is incorrect' });
      return;
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
