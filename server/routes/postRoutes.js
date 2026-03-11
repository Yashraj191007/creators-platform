import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController.js';

const router = express.Router();

// Collection routes (no :id)
router.post('/', protect, createPost);   // POST   /api/posts
router.get('/',  protect, getPosts);     // GET    /api/posts?page=1&limit=6

// Document routes (with :id) — MUST come after collection routes
router.get('/:id',    protect, getPostById); // GET    /api/posts/:id
router.put('/:id',    protect, updatePost);  // PUT    /api/posts/:id
router.delete('/:id', protect, deletePost);  // DELETE /api/posts/:id

export default router;
