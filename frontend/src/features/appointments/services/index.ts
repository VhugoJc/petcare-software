import { RestAppointmentService } from './RestAppointmentService';
import type { AppointmentService } from './AppointmentService';

/**
 * Active AppointmentService implementation.
 *
 * Uses the real REST API backend. JWT auth token is read from
 * localStorage automatically by RestAppointmentService.
 */
export const appointmentService: AppointmentService = new RestAppointmentService();