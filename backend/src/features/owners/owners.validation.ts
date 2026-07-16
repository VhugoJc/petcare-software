import { z } from 'zod';

const preferredContactMethodEnum = z.enum(['email', 'phone', 'sms', 'mail']);

export const createOwnerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be at most 100 characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters')
    .trim()
    .toLowerCase(),
  phoneNumber: z
    .string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be at most 20 characters')
    .trim(),
  emergencyContact: z
    .string()
    .max(20, 'Emergency contact must be at most 20 characters')
    .trim()
    .optional(),
  address: z
    .string()
    .max(255, 'Address must be at most 255 characters')
    .trim()
    .optional(),
  city: z
    .string()
    .max(100, 'City must be at most 100 characters')
    .trim()
    .optional(),
  state: z
    .string()
    .max(100, 'State must be at most 100 characters')
    .trim()
    .optional(),
  country: z
    .string()
    .max(100, 'Country must be at most 100 characters')
    .trim()
    .optional(),
  postalCode: z
    .string()
    .max(20, 'Postal code must be at most 20 characters')
    .trim()
    .optional(),
  preferredContactMethod: preferredContactMethodEnum,
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .trim()
    .optional(),
});

export const updateOwnerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be at most 100 characters')
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be at most 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters')
    .trim()
    .toLowerCase()
    .optional(),
  phoneNumber: z
    .string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be at most 20 characters')
    .trim()
    .optional(),
  emergencyContact: z
    .string()
    .max(20, 'Emergency contact must be at most 20 characters')
    .trim()
    .optional(),
  address: z
    .string()
    .max(255, 'Address must be at most 255 characters')
    .trim()
    .optional(),
  city: z
    .string()
    .max(100, 'City must be at most 100 characters')
    .trim()
    .optional(),
  state: z
    .string()
    .max(100, 'State must be at most 100 characters')
    .trim()
    .optional(),
  country: z
    .string()
    .max(100, 'Country must be at most 100 characters')
    .trim()
    .optional(),
  postalCode: z
    .string()
    .max(20, 'Postal code must be at most 20 characters')
    .trim()
    .optional(),
  preferredContactMethod: preferredContactMethodEnum.optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .trim()
    .optional(),
});

export const ownerQuerySchema = z.object({
  search: z.string().trim().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return undefined;
      return val === 'true';
    }),
  sortBy: z.enum(['firstName', 'lastName', 'createdAt']).default('lastName'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateOwnerInput = z.infer<typeof createOwnerSchema>;
export type UpdateOwnerInput = z.infer<typeof updateOwnerSchema>;
export type OwnerQueryInput = z.infer<typeof ownerQuerySchema>;