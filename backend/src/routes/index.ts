import { Router } from 'express';
import { healthRoutes } from '../features/health/health.routes';
import { authRoutes } from '../features/auth/auth.routes';
import { ownerRoutes } from '../features/owners/owners.routes';
import { petRoutes } from '../features/pets/pets.routes';
import { appointmentRoutes } from '../features/appointments/appointments.routes';
import { dashboardRoutes } from '../features/dashboard/dashboard.routes';
import { settingsRoutes } from '../features/settings/settings.routes';

const router = Router();

// Health check
router.use('/health', healthRoutes);

// Authentication
router.use('/auth', authRoutes);

// Owners
router.use('/owners', ownerRoutes);

// Pets
router.use('/pets', petRoutes);

// Appointments
router.use('/appointments', appointmentRoutes);

// Dashboard
router.use('/dashboard', dashboardRoutes);

// Settings
router.use('/settings', settingsRoutes);

export { router as apiRoutes };