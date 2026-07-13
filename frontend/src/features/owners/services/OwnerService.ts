import type { Owner, CreateOwnerInput, UpdateOwnerInput, OwnerFilters, PaginatedResult } from '../types';

export interface OwnerService {
  /** List owners with optional filtering, sorting, and pagination */
  list(filters?: OwnerFilters): Promise<PaginatedResult<Owner>>;

  /** Get a single owner by UUID */
  getById(id: string): Promise<Owner>;

  /** Create a new owner */
  create(data: CreateOwnerInput): Promise<Owner>;

  /** Update an existing owner (partial) */
  update(id: string, data: UpdateOwnerInput): Promise<Owner>;

  /** Soft-deactivate an owner (sets isActive = false) */
  deactivate(id: string): Promise<Owner>;

  /** Reactivate a previously deactivated owner */
  activate(id: string): Promise<Owner>;
}