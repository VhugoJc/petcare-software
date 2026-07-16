import type { OwnerService } from './OwnerService';
import type { Owner, CreateOwnerInput, UpdateOwnerInput, OwnerFilters, PaginatedResult } from '../types';
import { API_ENDPOINTS } from '../../../config/api';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

class RestOwnerServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'RestOwnerServiceError';
    this.status = status;
  }
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) {
    throw new RestOwnerServiceError(
      body.error?.message || 'An unexpected error occurred',
      response.status,
    );
  }
  return body.data as T;
}

/* ------------------------------------------------------------------ */
/*  RestOwnerService                                                   */
/* ------------------------------------------------------------------ */

export class RestOwnerService implements OwnerService {
  async list(filters?: OwnerFilters): Promise<PaginatedResult<Owner>> {
    const params = new URLSearchParams();

    if (filters?.search) params.set('search', filters.search);
    if (filters?.isActive !== undefined) params.set('isActive', String(filters.isActive));
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.pageSize) params.set('pageSize', String(filters.pageSize));

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.owners.list}?${queryString}`
      : API_ENDPOINTS.owners.list;

    const response = await fetch(url, { headers: getAuthHeaders() });
    const body = await response.json();

    if (!response.ok) {
      throw new RestOwnerServiceError(
        body.error?.message || 'Failed to load owners',
        response.status,
      );
    }

    return {
      data: body.data as Owner[],
      total: body.meta.total,
      page: body.meta.page,
      pageSize: body.meta.limit,
      totalPages: body.meta.totalPages,
    };
  }

  async getById(id: string): Promise<Owner> {
    const response = await fetch(API_ENDPOINTS.owners.detail(id), {
      headers: getAuthHeaders(),
    });
    return handleResponse<Owner>(response);
  }

  async create(data: CreateOwnerInput): Promise<Owner> {
    const response = await fetch(API_ENDPOINTS.owners.create, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Owner>(response);
  }

  async update(id: string, data: UpdateOwnerInput): Promise<Owner> {
    const response = await fetch(API_ENDPOINTS.owners.update(id), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Owner>(response);
  }

  async deactivate(id: string): Promise<Owner> {
    return this.update(id, { isActive: false } as unknown as UpdateOwnerInput);
  }

  async activate(id: string): Promise<Owner> {
    return this.update(id, { isActive: true } as unknown as UpdateOwnerInput);
  }
}

export { RestOwnerServiceError }; // Re-export for callers that want to check status