import express from 'express';
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  registerUser,
  loginUser
} from '../controllers/userController';

import { validate } from '../middleware/validateRequest';
import { userSchema } from '../validation/userSchema';

const router = express.Router();

// --- Auth Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- CRUD Routes ---
router.post('/', validate(userSchema), createUser);
router.get('/', getUsers);
router.put('/:id', validate(userSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
