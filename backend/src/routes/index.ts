import { Router } from 'express';
import { healthRoutes } from '../features/health/health.routes';

const router = Router();

// Health check
router.use('/health', healthRoutes);

// Future feature modules will be mounted here:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/owners', ownerRoutes);
// router.use('/pets', petRoutes);
// router.use('/appointments', appointmentRoutes);

export { router as apiRoutes };