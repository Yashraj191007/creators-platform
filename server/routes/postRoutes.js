import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPost, getPosts } from '../controllers/postController.js';

const router = express.Router();

// POST /api/posts   – Create a new post (protected)
router.post('/', protect, createPost);

// GET /api/posts    – Get paginated posts for the logged-in user (protected)
router.get('/', protect, getPosts);

export default router;
