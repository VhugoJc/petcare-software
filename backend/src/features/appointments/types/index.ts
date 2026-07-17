import type { Document } from 'mongoose';

/* ------------------------------------------------------------------ */
/*  Core entity                                                        */
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

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface IAppointment {
  ownerId: string;
  petId: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
  type: AppointmentType;
  status: AppointmentStatus;
  appointmentNumber: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointmentDocument extends IAppointment, Document {}

/* ------------------------------------------------------------------ */
/*  DTOs                                                               */
/* ------------------------------------------------------------------ */

export interface AppointmentResponse {
  id: string;
  appointmentNumber: string;
  ownerId: string;
  ownerName: string;
  petId: string;
  petName: string;
  petSpecies: Species;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Filters & Pagination                                               */
/* ------------------------------------------------------------------ */

export interface AppointmentQueryFilters {
  search?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  ownerId?: string;
  petId?: string;
  sortBy?: 'date' | 'startTime' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}