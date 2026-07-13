import { MockAppointmentService } from './MockAppointmentService';
import type { AppointmentService } from './AppointmentService';

export const appointmentService: AppointmentService = new MockAppointmentService();