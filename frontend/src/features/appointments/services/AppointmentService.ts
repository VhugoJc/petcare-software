import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  UpdateAppointmentStatusInput,
  AppointmentFilters,
  PaginatedResult,
} from '../types';

export interface AppointmentService {
  /** List appointments with optional filtering, sorting, pagination */
  list(filters?: AppointmentFilters): Promise<PaginatedResult<Appointment>>;

  /** Get a single appointment by UUID */
  getById(id: string): Promise<Appointment>;

  /** Create a new appointment */
  create(data: CreateAppointmentInput): Promise<Appointment>;

  /** Update an existing appointment (partial — only date/time/reason/type/notes) */
  update(id: string, data: UpdateAppointmentInput): Promise<Appointment>;

  /** Transition appointment status (validates workflow) */
  updateStatus(id: string, data: UpdateAppointmentStatusInput): Promise<Appointment>;

  /** Cancel an appointment (convenience — calls updateStatus with 'cancelled') */
  cancel(id: string): Promise<Appointment>;
}