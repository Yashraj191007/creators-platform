import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
} from '../controllers/postController.js';

// postRoutes receives the Socket.io `io` instance so controllers
// can emit real-time events when posts are created.
const postRoutes = (io) => {
    const router = express.Router();

    // All post routes require authentication
    router.use(protect);

    router.route('/')
        .get(getPosts)
        .post(createPost(io));

    router.route('/:id')
        .get(getPostById)
        .put(updatePost)
        .delete(deletePost);

    return router;
};

export default postRoutes;
