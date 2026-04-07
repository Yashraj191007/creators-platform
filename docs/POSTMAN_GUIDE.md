# Postman Collection Guide — Creator's Platform API

## Overview

This guide explains how to import, configure, and use the Postman collection for the **Creator's Platform API**. The collection covers all endpoints across authentication and post management, with environment variables and automated test assertions built in.

---

## Setup

### 1. Install Postman

Download and install the desktop app from [postman.com](https://postman.com/downloads).

> **Why the desktop app?** It can communicate directly with `localhost` without any additional browser extensions or agents.

### 2. Import the Collection

1. Open Postman
2. Click **Import** (top left)
3. Select the file: `docs/Creator-Platform-API.postman_collection.json`
4. The collection **"Creator's Platform API"** will appear in your left sidebar

### 3. Import the Environment

1. Click **Environments** in the left sidebar
2. Click **Import**
3. Select the file: `docs/Local-Development.postman_environment.json`
4. The **"Local Development"** environment will be created

### 4. Activate the Environment

In the **top-right dropdown** of the Postman window, select **"Local Development"**.

> ⚠️ If it still says "No Environment", the variables like `{{baseURL}}` will not resolve and requests will fail.

---

## Usage

### Step-by-Step Order

Follow this sequence to test the full API flow:

1. **Health Check** — Verify your server is running
2. **Register User** — Create a test account (a unique email is auto-generated)
3. **Login User** — Get a JWT (automatically saved to `{{authToken}}`)
4. **Create Post** — Create a post (post ID auto-saved to `{{postId}}`)
5. **Get All Posts** — View all posts for the logged-in user
6. **Get Post by ID** — Fetch a single post using `{{postId}}`
7. **Update Post** — Modify the post using `{{postId}}`
8. **Delete Post** — Remove the post using `{{postId}}`

### Starting the Server

```bash
# Option 1 — Node.js directly
npm run server

# Option 2 — Docker Compose
docker-compose up
```

---

## Request Organization

```
Creator's Platform API
├── Health
│   └── Health Check              GET  /api/health
├── Auth
│   ├── Register User             POST /api/users/register
│   └── Login User                POST /api/auth/login
└── Posts
    ├── Get All Posts             GET  /api/posts
    ├── Create Post               POST /api/posts
    ├── Get Post by ID            GET  /api/posts/:id
    ├── Update Post               PUT  /api/posts/:id
    └── Delete Post               DELETE /api/posts/:id
```

---

## Environment Variables

| Variable           | Description                                  | Auto-set?         |
|--------------------|----------------------------------------------|-------------------|
| `{{baseURL}}`      | Server base URL (default: `http://localhost:5000`) | Manual          |
| `{{authToken}}`    | JWT token for authenticated requests         | ✅ Auto (Login)   |
| `{{postId}}`       | ID of the most recently created/fetched post | ✅ Auto (Create Post / Get All Posts) |
| `{{registeredEmail}}` | Email used in most recent registration   | ✅ Auto (Register User) |

### How Token Auto-Save Works

The **Login User** request has this script in its **Tests tab**:

```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("authToken", response.token);
    console.log("Token saved:", response.token);
}
```

After a successful login, every subsequent request using `Authorization: Bearer {{authToken}}` will automatically include your fresh token — no copy-paste required.

---

## Test Assertions

Every request in this collection includes automated tests in the **Tests tab**. After clicking **Send**, scroll to the **Test Results** panel to see pass/fail status.

### Tests per Request

| Request         | Tests Included                                                |
|-----------------|---------------------------------------------------------------|
| Health Check    | Status 200, `message` field exists, Response time < 500ms    |
| Register User   | Status 201, `_id` exists, `email` exists, `name` exists, Response time < 1000ms |
| Login User      | Status 200, `success: true`, `token` exists, `user` object exists, Response time < 500ms |
| Get All Posts   | Status 200, response is array, Response time < 500ms          |
| Create Post     | Status 201, `_id` exists, `title` exists, `content` exists, `author` exists |
| Get Post by ID  | Status 200, `_id` field exists, Response time < 500ms         |
| Update Post     | Status 200, title matches updated value, `author` exists      |
| Delete Post     | Status 200, `message` exists, `_id` exists                   |

---

## Pre-request Scripts

The **Register User** request uses a Pre-request Script to generate a unique email on each send:

```javascript
const timestamp = Date.now();
const randomEmail = `user${timestamp}@example.com`;
pm.variables.set("uniqueEmail", randomEmail);
```

This prevents "email already exists" errors when running the same request multiple times.

---

## Common Issues & Solutions

### "Could not get any response"
- ✅ Ensure your server is running (`npm run server` or `docker-compose up`)
- ✅ Confirm the port matches — default is `5000`

### "401 Unauthorized"
- ✅ Run **Login User** to refresh the token
- ✅ Check that `{{authToken}}` is populated in your environment
- ✅ Verify the Authorization header: `Bearer {{authToken}}`

### "Environment variables not resolving"
- ✅ Check the top-right dropdown — it must show **"Local Development"**

### "Test failures"
- ✅ Open the **Body** tab to see the actual response
- ✅ Compare it against the expected structure in this guide

---

## API Response Reference

### `GET /api/health`
```json
{
  "message": "Server is running!",
  "timestamp": "2026-04-07T08:00:00.000Z"
}
```

### `POST /api/users/register` → 201
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Test User",
  "email": "user1712345678@example.com",
  "createdAt": "2026-04-07T08:00:00.000Z",
  "updatedAt": "2026-04-07T08:00:00.000Z"
}
```

### `POST /api/auth/login` → 200
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "2026-04-07T08:00:00.000Z"
  }
}
```

### `GET /api/posts` → 200
```json
[
  {
    "_id": "60c72b2f9b1e8a001c8e4d12",
    "title": "My Post from Postman",
    "content": "This is a test post.",
    "author": { "_id": "...", "name": "Test User", "email": "test@example.com" },
    "createdAt": "2026-04-07T08:00:00.000Z"
  }
]
```

### `POST /api/posts` → 201
```json
{
  "_id": "60c72b2f9b1e8a001c8e4d12",
  "title": "My Post from Postman",
  "content": "This is a test post created via Postman.",
  "author": { "_id": "...", "name": "Test User", "email": "test@example.com" },
  "createdAt": "2026-04-07T08:00:00.000Z",
  "updatedAt": "2026-04-07T08:00:00.000Z"
}
```

### `DELETE /api/posts/:id` → 200
```json
{
  "message": "Post deleted successfully",
  "_id": "60c72b2f9b1e8a001c8e4d12"
}
```
