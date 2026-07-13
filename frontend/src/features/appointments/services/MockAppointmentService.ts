import type { AppointmentService } from './AppointmentService';
import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  UpdateAppointmentStatusInput,
  AppointmentFilters,
  PaginatedResult,
  AppointmentStatus,
} from '../types';
import { MOCK_APPOINTMENTS } from '../utils/mockData';
import { isValidTransition, generateAppointmentNumber, resetCounter } from '../utils/appointmentHelpers';
import { MOCK_OWNERS } from '../../owners/utils/mockData';
import { MOCK_PETS } from '../../pets/utils/mockData';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const generateId = (): string => crypto.randomUUID();
const now = (): string => new Date().toISOString();
const clone = (a: Appointment): Appointment => ({ ...a });

const resolveOwnerName = (ownerId: string): string => {
  const owner = MOCK_OWNERS.find((o) => o.id === ownerId);
  return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner';
};

const resolvePetInfo = (petId: string): { petName: string; petSpecies: Appointment['petSpecies'] } => {
  const pet = MOCK_PETS.find((p) => p.id === petId);
  return {
    petName: pet?.name ?? 'Unknown Pet',
    petSpecies: pet?.species ?? 'other',
  };
};

/* ------------------------------------------------------------------ */
/*  In-memory store                                                    */
/* ------------------------------------------------------------------ */

let store: Appointment[] = [...MOCK_APPOINTMENTS];

// Seed the appointment number counter based on existing data
resetCounter(store.length);

/* ------------------------------------------------------------------ */
/*  Filtering, sorting, pagination                                     */
/* ------------------------------------------------------------------ */

function applyFilters(appointments: Appointment[], filters?: AppointmentFilters): Appointment[] {
  let result = [...appointments];
  if (!filters) return result;

  // Search across pet name, owner name, reason, appointment number
  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (a) =>
        a.petName.toLowerCase().includes(q) ||
        a.ownerName.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q) ||
        a.appointmentNumber.toLowerCase().includes(q),
    );
  }

  // Exact date filter
  if (filters.date) {
    result = result.filter((a) => a.date === filters.date);
  }

  // Date range filter
  if (filters.dateFrom) {
    result = result.filter((a) => a.date >= filters.dateFrom!);
  }
  if (filters.dateTo) {
    result = result.filter((a) => a.date <= filters.dateTo!);
  }

  // Status filter
  if (filters.status) {
    result = result.filter((a) => a.status === filters.status);
  }

  // Type filter
  if (filters.type) {
    result = result.filter((a) => a.type === filters.type);
  }

  // Owner filter
  if (filters.ownerId) {
    result = result.filter((a) => a.ownerId === filters.ownerId);
  }

  // Pet filter
  if (filters.petId) {
    result = result.filter((a) => a.petId === filters.petId);
  }

  // Sorting
  const sortBy = filters.sortBy ?? 'date';
  const sortOrder = filters.sortOrder ?? 'asc';
  result.sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'date':
        cmp = a.date.localeCompare(b.date);
        if (cmp === 0) cmp = a.startTime.localeCompare(b.startTime);
        break;
      case 'startTime':
        cmp = a.startTime.localeCompare(b.startTime);
        break;
      case 'createdAt':
        cmp = a.createdAt.localeCompare(b.createdAt);
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
    }
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
}

function paginate(
  items: Appointment[],
  page: number = 1,
  pageSize: number = 10,
): PaginatedResult<Appointment> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data: data.map(clone), total, page: safePage, pageSize, totalPages };
}

/* ------------------------------------------------------------------ */
/*  MockAppointmentService                                             */
/* ------------------------------------------------------------------ */

export class MockAppointmentService implements AppointmentService {
  async list(filters?: AppointmentFilters): Promise<PaginatedResult<Appointment>> {
    await delay();
    const filtered = applyFilters(store, filters);
    return paginate(filtered, filters?.page, filters?.pageSize);
  }

  async getById(id: string): Promise<Appointment> {
    await delay();
    const appointment = store.find((a) => a.id === id);
    if (!appointment) throw new Error(`Appointment not found: ${id}`);
    return clone(appointment);
  }

  async create(data: CreateAppointmentInput): Promise<Appointment> {
    await delay();
    const timestamp = now();
    const petInfo = resolvePetInfo(data.petId);
    const appointment: Appointment = {
      id: generateId(),
      appointmentNumber: generateAppointmentNumber(),
      ownerId: data.ownerId,
      ownerName: resolveOwnerName(data.ownerId),
      petId: data.petId,
      petName: petInfo.petName,
      petSpecies: petInfo.petSpecies,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      reason: data.reason.trim(),
      type: data.type,
      status: 'scheduled',
      notes: data.notes?.trim() || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.push(appointment);
    return clone(appointment);
  }

  async update(id: string, data: UpdateAppointmentInput): Promise<Appointment> {
    await delay();
    const index = store.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Appointment not found: ${id}`);

    const current = store[index];
    const updated: Appointment = {
      ...current,
      ...(data.date !== undefined && { date: data.date }),
      ...(data.startTime !== undefined && { startTime: data.startTime }),
      ...(data.endTime !== undefined && { endTime: data.endTime }),
      ...(data.reason !== undefined && { reason: data.reason.trim() }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.notes !== undefined && { notes: data.notes?.trim() || undefined }),
      updatedAt: now(),
    };
    store[index] = updated;
    return clone(updated);
  }

  async updateStatus(id: string, data: UpdateAppointmentStatusInput): Promise<Appointment> {
    await delay();
    const index = store.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Appointment not found: ${id}`);

    const current = store[index];
    if (!isValidTransition(current.status, data.status)) {
      throw new Error(
        `Cannot transition from "${current.status}" to "${data.status}". ` +
        `Valid transitions: ${current.status} → [${current.status === 'scheduled' ? 'confirmed, cancelled' : current.status === 'confirmed' ? 'checked-in, cancelled' : current.status === 'checked-in' ? 'in-progress, cancelled, no-show' : current.status === 'in-progress' ? 'completed, cancelled' : 'none'}].`,
      );
    }

    const updated: Appointment = {
      ...current,
      status: data.status,
      updatedAt: now(),
    };
    store[index] = updated;
    return clone(updated);
  }

  async cancel(id: string): Promise<Appointment> {
    return this.updateStatus(id, { status: 'cancelled' });
  }
}