import { z } from 'zod';

const speciesEnum = z.enum(['dog', 'cat', 'bird', 'rabbit', 'other']);

export const createPetSchema = z.object({
  ownerId: z.string().min(1, 'Owner is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  species: speciesEnum,
  breed: z
    .string()
    .min(1, 'Breed is required')
    .max(100, 'Breed must be at most 100 characters')
    .trim(),
  color: z
    .string()
    .min(1, 'Color is required')
    .max(50, 'Color must be at most 50 characters')
    .trim(),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  sex: z.enum(['male', 'female']),
  isNeutered: z.boolean(),
  microchipId: z
    .string()
    .max(50, 'Microchip ID must be at most 50 characters')
    .trim()
    .optional(),
  weightKg: z
    .number()
    .positive('Weight must be positive')
    .max(9999, 'Weight seems too high')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .trim()
    .optional(),
});

export const updatePetSchema = z.object({
  ownerId: z.string().min(1, 'Owner is required').optional(),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .trim()
    .optional(),
  species: speciesEnum.optional(),
  breed: z
    .string()
    .min(1, 'Breed is required')
    .max(100, 'Breed must be at most 100 characters')
    .trim()
    .optional(),
  color: z
    .string()
    .min(1, 'Color is required')
    .max(50, 'Color must be at most 50 characters')
    .trim()
    .optional(),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .optional(),
  sex: z.enum(['male', 'female']).optional(),
  isNeutered: z.boolean().optional(),
  microchipId: z
    .string()
    .max(50, 'Microchip ID must be at most 50 characters')
    .trim()
    .optional(),
  weightKg: z
    .number()
    .positive('Weight must be positive')
    .max(9999, 'Weight seems too high')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .trim()
    .optional(),
  isActive: z.boolean().optional(),
});

export const petQuerySchema = z.object({
  search: z.string().trim().optional(),
  species: speciesEnum.optional(),
  ownerId: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return undefined;
      return val === 'true';
    }),
  sortBy: z.enum(['name', 'species', 'breed', 'dateOfBirth', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type PetQueryInput = z.infer<typeof petQuerySchema>;