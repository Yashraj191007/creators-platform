import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import app from './app.js';
import connectDB from './config/db.js';
import postRoutes from './routes/postRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// Post routes need the Socket.io instance for real-time events
app.use('/api/posts', postRoutes(io));

// 404 handler — must come AFTER all routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler — must be defined LAST
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⚡ Socket.io ready`);
});