/* ------------------------------------------------------------------ */
/*  Owner — Core entity                                               */
/* ------------------------------------------------------------------ */

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferredContactMethod: PreferredContactMethod;
  notes?: string;
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type PreferredContactMethod = 'email' | 'phone' | 'sms' | 'mail';

/* ------------------------------------------------------------------ */
/*  Create / Update payloads (backend-ready, no computed fields)      */
/* ------------------------------------------------------------------ */

export interface CreateOwnerInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferredContactMethod: PreferredContactMethod;
  notes?: string;
}

export interface UpdateOwnerInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferredContactMethod?: PreferredContactMethod;
  notes?: string;
}

/* ------------------------------------------------------------------ */
/*  Filters & Pagination                                              */
/* ------------------------------------------------------------------ */

export interface OwnerFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: 'firstName' | 'lastName' | 'createdAt';
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