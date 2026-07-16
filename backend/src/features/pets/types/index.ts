import type { Document } from 'mongoose';

/* ------------------------------------------------------------------ */
/*  Core entity                                                        */
/* ------------------------------------------------------------------ */

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface IPet {
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  color: string;
  dateOfBirth: Date;
  sex: 'male' | 'female';
  isNeutered: boolean;
  microchipId?: string;
  weightKg?: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPetDocument extends IPet, Document {}

/* ------------------------------------------------------------------ */
/*  DTOs                                                               */
/* ------------------------------------------------------------------ */

export interface PetResponse {
  id: string;
  ownerId: string;
  ownerName: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Filters & Pagination                                               */
/* ------------------------------------------------------------------ */

export interface PetQueryFilters {
  search?: string;
  species?: Species;
  isActive?: boolean;
  ownerId?: string;
  sortBy?: 'name' | 'species' | 'breed' | 'dateOfBirth' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}