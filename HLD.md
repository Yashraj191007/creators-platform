# High-Level Design (HLD)

## 1. System Architecture
The application follows a standard Client-Server architecture utilizing the MERN stack.

- **Client**: A React Single Page Application (SPA) built with Vite, hosted on Vercel.
- **Server**: A Node.js and Express REST API, hosted on Render.
- **Database**: MongoDB Atlas for persistent data storage.

## 2. Data Flow
1. The client makes an HTTP request or establishes a WebSocket connection.
2. The Express server processes the request (routing, authentication, validation).
3. The server interacts with MongoDB via Mongoose to read or write data.
4. The server responds with JSON data or emits Socket.io events to connected clients.

## 3. Key Components
- **API Gateway/Router**: Directs incoming requests to the appropriate controllers.
- **Controllers**: Business logic execution.
- **Services**: Abstracted data access and external integrations (e.g., file storage).
- **Socket Manager**: Handles real-time events and connections.

## 4. Deployment Architecture
- Continuous Integration and Continuous Deployment (CI/CD) pipelines managed by GitHub Actions.
- Automated testing (Jest, Supertest, React Testing Library) runs on every push to the `main` branch.
- Independent deployment for Client (Vercel) and Server (Render).
