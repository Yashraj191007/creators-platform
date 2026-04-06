import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/upload.js';
import errorHandler from './middleware/errorMiddleware.js';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('No token'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.user = decoded;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}, Email: ${socket.data.user?.email}`);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
app.use('/api/posts', postRoutes(io));
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler MUST be defined LAST
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⚡ Socket.io ready`);
});