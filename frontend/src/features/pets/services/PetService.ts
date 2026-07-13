import type { Pet, CreatePetInput, UpdatePetInput, PetFilters, PaginatedResult } from '../types';

export interface PetService {
  /** List pets with optional filtering, sorting, and pagination */
  list(filters?: PetFilters): Promise<PaginatedResult<Pet>>;

  /** Get a single pet by UUID */
  getById(id: string): Promise<Pet>;

  /** Create a new pet */
  create(data: CreatePetInput): Promise<Pet>;

  /** Update an existing pet (partial) */
  update(id: string, data: UpdatePetInput): Promise<Pet>;

  /** Soft-deactivate a pet (sets isActive = false) */
  deactivate(id: string): Promise<Pet>;

  /** Reactivate a previously deactivated pet */
  activate(id: string): Promise<Pet>;
}