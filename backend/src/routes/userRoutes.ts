import express from 'express';
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  changePassword
} from '../controllers/userController';

import { validate } from '../middleware/validateRequest';
import { userSchema, userUpdateSchema, passwordChangeSchema } from '../validation/userSchema';
import { registerSchema, loginSchema } from '../validation/authSchema';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// --- Auth Routes ---
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

// --- CRUD Routes ---
router.post('/', validate(userSchema), createUser);
router.get('/', getUsers);
router.put('/:id', authenticateToken, validate(userUpdateSchema), updateUser);
router.delete('/:id', authenticateToken, deleteUser);
router.post('/:id/change-password', authenticateToken, validate(passwordChangeSchema), changePassword);

export default router;
