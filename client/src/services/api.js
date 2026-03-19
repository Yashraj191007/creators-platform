import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
  // NOTE: Do NOT set a global Content-Type here.
  // For regular JSON requests, axios sets it automatically.
  // For FormData (file uploads), the browser must set it — including the
  // multipart boundary — which only works if we don't override it globally.
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Runs before every outgoing request.
// Reads the JWT from localStorage and attaches it as a Bearer token.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response interceptor ─────────────────────────────────────────────────────
// Runs after every response.
// On 401 Unauthorized: clears auth data and redirects to /login automatically.
api.interceptors.response.use(
  (response) => {
    // Successful response – just pass it through
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is expired, invalid, or missing on the backend
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Hard redirect to login (works outside of React component tree)
      window.location.href = '/login';

      console.log('Session expired. Please login again.');
    }

    // Propagate the error so individual components can handle it too
    return Promise.reject(error);
  }
);

export default api;
