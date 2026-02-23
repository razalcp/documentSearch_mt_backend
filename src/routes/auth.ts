import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/authController';
import { validateRequest, signupSchema, loginSchema } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
