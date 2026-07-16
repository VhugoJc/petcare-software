import { Router } from 'express';
import { healthRoutes } from '../features/health/health.routes';
import { authRoutes } from '../features/auth/auth.routes';
import { ownerRoutes } from '../features/owners/owners.routes';
import { petRoutes } from '../features/pets/pets.routes';

const router = Router();

// Health check
router.use('/health', healthRoutes);

// Authentication
router.use('/auth', authRoutes);

// Owners
router.use('/owners', ownerRoutes);

// Pets
router.use('/pets', petRoutes);

// Future feature modules will be mounted here:
// router.use('/appointments', appointmentRoutes);

export { router as apiRoutes };