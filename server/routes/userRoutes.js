import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// POST /api/users/register - Register a new user (public)
router.post('/register', registerUser);

// GET /api/users - Get all users (protected)
router.get('/', protect, getAllUsers);

// GET /api/users/:id - Get a user by ID (protected)
router.get('/:id', protect, getUserById);

// PUT /api/users/:id - Update a user (protected)
router.put('/:id', protect, updateUser);

// DELETE /api/users/:id - Delete a user (protected)
router.delete('/:id', protect, deleteUser);

export default router;
