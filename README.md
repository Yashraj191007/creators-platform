# Creator's Platform

[![CI](https://github.com/Yashraj191007/creators-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/Yashraj191007/creators-platform/actions)

A full-stack MERN application with real-time features, file uploads, and CI/CD.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Real-time**: Socket.io
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (client) + Render (server)

## CI Pipeline

Every push and pull request to `main` automatically:

1. Installs server dependencies (`npm ci`)
2. Runs server tests (Jest + Supertest)
3. Installs client dependencies (`npm ci`)
4. Runs client tests (Jest + React Testing Library)

## Getting Started

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

## Environment Variables

See `.env.example` in the root and `server/.env.example` for required variables.