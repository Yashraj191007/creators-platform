import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc   Protect routes – verifies JWT and attaches req.user
// @usage  import { protect } from '../middleware/auth.js' then use as route middleware
export const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from "Authorization: Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the authenticated user to the request (exclude password)
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Token is valid → proceed to the route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};
