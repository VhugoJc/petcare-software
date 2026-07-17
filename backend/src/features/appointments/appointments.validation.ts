import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const appointmentTypeEnum = z.enum([
  'consultation', 'surgery', 'vaccination', 'checkup',
  'grooming', 'dental', 'emergency', 'followup', 'other',
]);

const appointmentStatusEnum = z.enum([
  'scheduled', 'confirmed', 'checked-in', 'in-progress',
  'completed', 'cancelled', 'no-show',
]);

export const createAppointmentSchema = z.object({
  ownerId: z.string().min(1, 'Owner is required'),
  petId: z.string().min(1, 'Pet is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  startTime: z
    .string()
    .regex(timeRegex, 'Start time must be in HH:mm format (24h)'),
  endTime: z
    .string()
    .regex(timeRegex, 'End time must be in HH:mm format (24h)'),
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(500, 'Reason must be at most 500 characters')
    .trim(),
  type: appointmentTypeEnum,
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .trim()
    .optional(),
});

export const updateAppointmentSchema = z.object({
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date')
    .optional(),
  startTime: z
    .string()
    .regex(timeRegex, 'Start time must be in HH:mm format (24h)')
    .optional(),
  endTime: z
    .string()
    .regex(timeRegex, 'End time must be in HH:mm format (24h)')
    .optional(),
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(500, 'Reason must be at most 500 characters')
    .trim()
    .optional(),
  type: appointmentTypeEnum.optional(),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .trim()
    .optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: appointmentStatusEnum,
});

export const appointmentQuerySchema = z.object({
  search: z.string().trim().optional(),
  date: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: appointmentStatusEnum.optional(),
  type: appointmentTypeEnum.optional(),
  ownerId: z.string().optional(),
  petId: z.string().optional(),
  sortBy: z.enum(['date', 'startTime', 'createdAt', 'status']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type AppointmentQueryInput = z.infer<typeof appointmentQuerySchema>;