import type { Species } from '../../../types';

/* ------------------------------------------------------------------ */
/*  Appointment — Core operational entity                             */
/* ------------------------------------------------------------------ */

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked-in'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export type AppointmentType =
  | 'consultation'
  | 'surgery'
  | 'vaccination'
  | 'checkup'
  | 'grooming'
  | 'dental'
  | 'emergency'
  | 'followup'
  | 'other';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  ownerId: string;
  ownerName: string;
  petId: string;
  petName: string;
  petSpecies: Species;
  date: string;          // ISO 8601 date (YYYY-MM-DD)
  startTime: string;     // HH:mm (24h)
  endTime: string;       // HH:mm (24h)
  reason: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Create / Update / Status-Transition payloads                      */
/* ------------------------------------------------------------------ */

export interface CreateAppointmentInput {
  ownerId: string;
  petId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  type: AppointmentType;
  notes?: string;
}

export interface UpdateAppointmentInput {
  date?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  type?: AppointmentType;
  notes?: string;
}

export interface UpdateAppointmentStatusInput {
  status: AppointmentStatus;
}

/* ------------------------------------------------------------------ */
/*  Filters & Pagination                                              */
/* ------------------------------------------------------------------ */

export interface AppointmentFilters {
  search?: string;
  date?: string;           // Exact date (YYYY-MM-DD)
  dateFrom?: string;       // Start of date range
  dateTo?: string;         // End of date range
  status?: AppointmentStatus;
  type?: AppointmentType;
  ownerId?: string;
  petId?: string;
  sortBy?: 'date' | 'startTime' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Validation result                                                 */
/* ------------------------------------------------------------------ */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}