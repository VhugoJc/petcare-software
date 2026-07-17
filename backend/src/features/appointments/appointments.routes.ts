import { Router } from 'express';
import * as appointmentsController from './appointments.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

// All appointment routes require authentication
router.get('/', authenticate, appointmentsController.listAppointments);
router.get('/:id', authenticate, appointmentsController.getAppointmentById);
router.post('/', authenticate, appointmentsController.createAppointment);
router.patch('/:id', authenticate, appointmentsController.updateAppointment);
router.patch('/:id/status', authenticate, appointmentsController.updateAppointmentStatus);
router.delete('/:id', authenticate, appointmentsController.deleteAppointment);

export { router as appointmentRoutes };