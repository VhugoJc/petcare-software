import { Router } from 'express';
import { healthRoutes } from '../features/health/health.routes';
import { authRoutes } from '../features/auth/auth.routes';

const router = Router();

// Health check
router.use('/health', healthRoutes);

// Authentication
router.use('/auth', authRoutes);

// Future feature modules will be mounted here:
// router.use('/users', userRoutes);
// router.use('/owners', ownerRoutes);
// router.use('/pets', petRoutes);
// router.use('/appointments', appointmentRoutes);

export { router as apiRoutes };