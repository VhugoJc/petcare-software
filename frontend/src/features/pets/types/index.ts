import type { Species } from '../../../types';

/* ------------------------------------------------------------------ */
/*  Pet — Core entity                                                 */
/* ------------------------------------------------------------------ */

export interface Pet {
  id: string;
  ownerId: string;
  ownerName: string; // Denormalized for list display (resolved by service)
  name: string;
  species: Species;
  breed: string;
  color: string;
  dateOfBirth: string; // ISO 8601 date
  sex: 'male' | 'female';
  isNeutered: boolean;
  microchipId?: string;
  weightKg?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/* ------------------------------------------------------------------ */
/*  Create / Update payloads                                          */
/* ------------------------------------------------------------------ */

export interface CreatePetInput {
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  color: string;
  dateOfBirth: string;
  sex: 'male' | 'female';
  isNeutered: boolean;
  microchipId?: string;
  weightKg?: number;
  notes?: string;
}

export interface UpdatePetInput {
  ownerId?: string;
  name?: string;
  species?: Species;
  breed?: string;
  color?: string;
  dateOfBirth?: string;
  sex?: 'male' | 'female';
  isNeutered?: boolean;
  microchipId?: string;
  weightKg?: number;
  notes?: string;
}

/* ------------------------------------------------------------------ */
/*  Filters & Pagination                                              */
/* ------------------------------------------------------------------ */

export interface PetFilters {
  search?: string;
  species?: Species;
  isActive?: boolean;
  ownerId?: string;
  sortBy?: 'name' | 'species' | 'breed' | 'dateOfBirth' | 'createdAt';
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