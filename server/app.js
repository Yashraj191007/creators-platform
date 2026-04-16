import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/upload.js';
import errorHandler from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// NOTE: The /api/posts routes, 404 handler, and global error handler
// are registered in server.js AFTER the Socket.io `io` instance is created,
// because post routes need `io` for real-time events.

export default app;
