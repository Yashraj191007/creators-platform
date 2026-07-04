import request from 'supertest';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import app from '../app.js';
import User from '../models/User.js';

describe('Auth Routes', () => {

  // Run before all tests in this file
  beforeAll(async () => {
    // Connect to test database, db connection is handled in app.js? No, wait!
    // I need to make sure the app connects to the database here or in app.js
    // I removed connectDB() from app.js and put it in server.js! So I need to connect here for tests!
    const dbURI = process.env.MONGO_URI_TEST;
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(dbURI);
    }
  });

  // Run after each test
  afterEach(async () => {
    // Clear all users after each test
    await User.deleteMany({});
  });

  // Run after all tests in this file
  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('POST /api/users/register', () => {
    test('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'Test User');
      expect(res.body).toHaveProperty('email', 'testuser@example.com');
    });

    test('should fail to register with an existing email', async () => {
      // First, create a user
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'password123'
        });

      // Try to register again with the same email
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Another User',
          email: 'existing@example.com',
          password: 'differentpassword'
        });

      expect(res.status).toBe(400); // Bad Request (or 409 Conflict depending on how the server implements it, it implemented 400 for duplicate email)
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('already exists');
    });

    test('should fail to register with missing required fields', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Incomplete User'
          // Missing email and password
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should log in with correct credentials', async () => {
      // First, register a user
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Login Test User',
          email: 'login@example.com',
          password: 'password123'
        });

      // Then log in
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('success', true);
    });

    test('should fail to log in with wrong password', async () => {
      // Register a user
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Password Test User',
          email: 'wrongpass@example.com',
          password: 'correctpassword'
        });

      // Try to log in with wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrongpass@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401); // Unauthorized
      expect(res.body).toHaveProperty('message');
    });
  });
});
