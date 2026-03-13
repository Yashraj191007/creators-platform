# Creators Platform - MERN Stack Project

## Project Overview
This project is a fully functional, integrated MERN (MongoDB, Express, React, Node.js) application built as the capstone for Module 3. It allows users to register, log in, create, view, edit, and delete their own content. The project features complete authentication, authorization, CRUD operations with pagination, and robust full-stack error handling.

## Technology Stack
- **Frontend**: React, Vite, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcrypt

## Key Features
- **Authentication & Authorization**: User registration, login, and protected routes. JWTs are used to secure API requests.
- **CRUD Operations**: Users can create posts, read paginated lists of posts, update their own posts, and delete their own posts.
- **Backend Security**: Middleware to verify JWT tokens and strict ownership checks to prevent unauthorized edits/deletes.
- **Full-Stack Error Handling**: Centralized error handling on the backend with consistent formatting `{"success": false, "message": "..."}`, and frontend error catching via toast notifications.

## Environment Variables
The application requires `.env` files in both the `client` and `server` directories. **Do not commit these files to version control.**

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Client (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Setup Instructions

1. **Clone the repository** (or extract the ZIP file).
2. **Install dependencies**:
   - For the server:
     ```bash
     cd server
     npm install
     ```
   - For the client:
     ```bash
     cd client
     npm install
     ```

## How to Run

1. **Start the Backend Server**:
   ```bash
   cd server
   npm run dev
   ```
   *The server will typically run on http://localhost:5000.*

2. **Start the Frontend Client**:
   ```bash
   cd client
   npm run dev
   ```
   *The client will typically run on http://localhost:5173.*

3. **Access the Application**:
   Open a browser and navigate to the frontend URL to register a new user and explore the features!