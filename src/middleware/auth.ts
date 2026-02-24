import { Response, NextFunction, RequestHandler } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';
import { IAuthRequest } from '../types';

export const authenticate: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ error: 'Invalid token. User not found.' });
      return;
    }

    (req as IAuthRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const optionalAuth: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        (req as IAuthRequest).user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};
