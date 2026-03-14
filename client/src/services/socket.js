import { io } from 'socket.io-client';

// Use standard vite environment variables
const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(URL, {
    autoConnect: false, // Prevent connecting automatically
});
