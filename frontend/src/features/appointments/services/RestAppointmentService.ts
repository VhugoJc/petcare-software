import type { AppointmentService } from './AppointmentService';
import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  UpdateAppointmentStatusInput,
  AppointmentFilters,
  PaginatedResult,
} from '../types';
import { API_ENDPOINTS } from '../../../config/api';
import { tokenStorage } from '../../auth/utils/tokenStorage';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

class RestAppointmentServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'RestAppointmentServiceError';
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
    throw new RestAppointmentServiceError(
      body.error?.message || 'An unexpected error occurred',
      response.status,
    );
  }
  return body.data as T;
}

/* ------------------------------------------------------------------ */
/*  RestAppointmentService                                             */
/* ------------------------------------------------------------------ */

export class RestAppointmentService implements AppointmentService {
  async list(filters?: AppointmentFilters): Promise<PaginatedResult<Appointment>> {
    const params = new URLSearchParams();

    if (filters?.search) params.set('search', filters.search);
    if (filters?.date) params.set('date', filters.date);
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.set('dateTo', filters.dateTo);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.type) params.set('type', filters.type);
    if (filters?.ownerId) params.set('ownerId', filters.ownerId);
    if (filters?.petId) params.set('petId', filters.petId);
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.pageSize) params.set('pageSize', String(filters.pageSize));

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.appointments.list}?${queryString}`
      : API_ENDPOINTS.appointments.list;

    const response = await fetch(url, { headers: getAuthHeaders() });
    const body = await response.json();

    if (!response.ok) {
      throw new RestAppointmentServiceError(
        body.error?.message || 'Failed to load appointments',
        response.status,
      );
    }

    return {
      data: body.data as Appointment[],
      total: body.meta.total,
      page: body.meta.page,
      pageSize: body.meta.limit,
      totalPages: body.meta.totalPages,
    };
  }

  async getById(id: string): Promise<Appointment> {
    const response = await fetch(API_ENDPOINTS.appointments.detail(id), {
      headers: getAuthHeaders(),
    });
    return handleResponse<Appointment>(response);
  }

  async create(data: CreateAppointmentInput): Promise<Appointment> {
    const response = await fetch(API_ENDPOINTS.appointments.create, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Appointment>(response);
  }

  async update(id: string, data: UpdateAppointmentInput): Promise<Appointment> {
    const response = await fetch(API_ENDPOINTS.appointments.update(id), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Appointment>(response);
  }

  async updateStatus(
    id: string,
    data: UpdateAppointmentStatusInput,
  ): Promise<Appointment> {
    const response = await fetch(API_ENDPOINTS.appointments.status(id), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Appointment>(response);
  }

  async cancel(id: string): Promise<Appointment> {
    return this.updateStatus(id, { status: 'cancelled' });
  }
}

export { RestAppointmentServiceError };