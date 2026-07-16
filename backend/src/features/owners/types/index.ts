import type { Document } from 'mongoose';

/* ------------------------------------------------------------------ */
/*  Core entity                                                        */
/* ------------------------------------------------------------------ */

export type PreferredContactMethod = 'email' | 'phone' | 'sms' | 'mail';

export interface IOwner {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IOwnerDocument extends IOwner, Document {}

/* ------------------------------------------------------------------ */
/*  DTOs                                                               */
/* ------------------------------------------------------------------ */

export interface OwnerResponse {
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
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Filters & Pagination                                               */
/* ------------------------------------------------------------------ */

export interface OwnerQueryFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: 'firstName' | 'lastName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}