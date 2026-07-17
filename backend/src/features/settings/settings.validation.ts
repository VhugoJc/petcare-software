import { z } from 'zod';

const workingDayEnum = z.enum([
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
]);

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const updateSettingsSchema = z.object({
  clinicInfo: z
    .object({
      clinicName: z
        .string()
        .min(1, 'Clinic name is required')
        .max(200, 'Clinic name must be at most 200 characters')
        .trim()
        .optional(),
      phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .max(20, 'Phone number must be at most 20 characters')
        .trim()
        .optional(),
      email: z
        .string()
        .email('Invalid email address')
        .max(255, 'Email must be at most 255 characters')
        .trim()
        .optional(),
      website: z
        .string()
        .max(500, 'Website must be at most 500 characters')
        .trim()
        .optional(),
      address: z
        .string()
        .max(500, 'Address must be at most 500 characters')
        .trim()
        .optional(),
      logoUrl: z
        .string()
        .max(2000, 'Logo URL must be at most 2000 characters')
        .trim()
        .optional(),
    })
    .optional(),
  businessHours: z
    .object({
      openingTime: z
        .string()
        .regex(timeRegex, 'Opening time must be in HH:mm format (24h)')
        .optional(),
      closingTime: z
        .string()
        .regex(timeRegex, 'Closing time must be in HH:mm format (24h)')
        .optional(),
      workingDays: z
        .array(workingDayEnum)
        .min(1, 'At least one working day is required')
        .optional(),
    })
    .optional(),
  appointmentSettings: z
    .object({
      defaultDuration: z
        .number()
        .int()
        .min(15, 'Duration must be at least 15 minutes')
        .max(240, 'Duration must be at most 240 minutes')
        .optional(),
      appointmentInterval: z
        .number()
        .int()
        .min(5, 'Interval must be at least 5 minutes')
        .max(120, 'Interval must be at most 120 minutes')
        .optional(),
      allowOverlapping: z.boolean().optional(),
    })
    .optional(),
  userPreferences: z
    .object({
      language: z.string().min(1).max(10).optional(),
      timeZone: z.string().min(1).max(50).optional(),
      dateFormat: z.string().min(1).max(20).optional(),
    })
    .optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;