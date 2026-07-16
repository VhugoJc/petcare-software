import type { PetService } from './PetService';
import type { Pet, CreatePetInput, UpdatePetInput, PetFilters, PaginatedResult } from '../types';
import { API_ENDPOINTS } from '../../../config/api';
import { tokenStorage } from '../../auth/utils/tokenStorage';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

class RestPetServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'RestPetServiceError';
    this.status = status;
  }
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = tokenStorage.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) {
    throw new RestPetServiceError(
      body.error?.message || 'An unexpected error occurred',
      response.status,
    );
  }
  return body.data as T;
}

/* ------------------------------------------------------------------ */
/*  RestPetService                                                     */
/* ------------------------------------------------------------------ */

export class RestPetService implements PetService {
  async list(filters?: PetFilters): Promise<PaginatedResult<Pet>> {
    const params = new URLSearchParams();

    if (filters?.search) params.set('search', filters.search);
    if (filters?.species) params.set('species', filters.species);
    if (filters?.ownerId) params.set('ownerId', filters.ownerId);
    if (filters?.isActive !== undefined) params.set('isActive', String(filters.isActive));
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.pageSize) params.set('pageSize', String(filters.pageSize));

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.pets.list}?${queryString}`
      : API_ENDPOINTS.pets.list;

    const response = await fetch(url, { headers: getAuthHeaders() });
    const body = await response.json();

    if (!response.ok) {
      throw new RestPetServiceError(
        body.error?.message || 'Failed to load pets',
        response.status,
      );
    }

    return {
      data: body.data as Pet[],
      total: body.meta.total,
      page: body.meta.page,
      pageSize: body.meta.limit,
      totalPages: body.meta.totalPages,
    };
  }

  async getById(id: string): Promise<Pet> {
    const response = await fetch(API_ENDPOINTS.pets.detail(id), {
      headers: getAuthHeaders(),
    });
    return handleResponse<Pet>(response);
  }

  async create(data: CreatePetInput): Promise<Pet> {
    const response = await fetch(API_ENDPOINTS.pets.create, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Pet>(response);
  }

  async update(id: string, data: UpdatePetInput): Promise<Pet> {
    const response = await fetch(API_ENDPOINTS.pets.update(id), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Pet>(response);
  }

  async deactivate(id: string): Promise<Pet> {
    return this.update(id, { isActive: false } as unknown as UpdatePetInput);
  }

  async activate(id: string): Promise<Pet> {
    return this.update(id, { isActive: true } as unknown as UpdatePetInput);
  }
}

export { RestPetServiceError };