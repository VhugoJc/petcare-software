import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from './auth.middleware';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticate, authController.getMe);

export { router as authRoutes };