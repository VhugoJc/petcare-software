import type { OwnerService } from './OwnerService';
import type { Owner, CreateOwnerInput, UpdateOwnerInput, OwnerFilters, PaginatedResult } from '../types';
import { MOCK_OWNERS } from '../utils/mockData';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Simulates network latency */
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

/** Generates a UUID v4 */
const generateId = (): string => crypto.randomUUID();

/** Returns the current ISO timestamp */
const now = (): string => new Date().toISOString();

/** Deep clone an owner (defensive copy) */
const clone = (owner: Owner): Owner => ({ ...owner });

/* ------------------------------------------------------------------ */
/*  In-memory store (seeded from mockData.ts)                         */
/* ------------------------------------------------------------------ */

let store: Owner[] = [...MOCK_OWNERS];

/* ------------------------------------------------------------------ */
/*  Filtering, sorting, pagination (pure functions)                    */
/* ------------------------------------------------------------------ */

function applyFilters(owners: Owner[], filters?: OwnerFilters): Owner[] {
  let result = [...owners];

  if (!filters) return result;

  // Search across firstName, lastName, email, phoneNumber
  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (o) =>
        o.firstName.toLowerCase().includes(q) ||
        o.lastName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phoneNumber.replace(/\D/g, '').includes(q.replace(/\D/g, '')),
    );
  }

  // Active status filter
  if (filters.isActive !== undefined) {
    result = result.filter((o) => o.isActive === filters.isActive);
  }

  // Sorting
  const sortBy = filters.sortBy ?? 'lastName';
  const sortOrder = filters.sortOrder ?? 'asc';
  result.sort((a, b) => {
    const aVal = (a[sortBy] ?? '').toString().toLowerCase();
    const bVal = (b[sortBy] ?? '').toString().toLowerCase();
    const cmp = aVal.localeCompare(bVal);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
}

function paginate(
  owners: Owner[],
  page: number = 1,
  pageSize: number = 10,
): PaginatedResult<Owner> {
  const total = owners.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  const data = owners.slice(start, start + pageSize);

  return {
    data: data.map(clone),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

/* ------------------------------------------------------------------ */
/*  MockOwnerService                                                   */
/* ------------------------------------------------------------------ */

export class MockOwnerService implements OwnerService {
  async list(filters?: OwnerFilters): Promise<PaginatedResult<Owner>> {
    await delay();
    const filtered = applyFilters(store, filters);
    return paginate(filtered, filters?.page, filters?.pageSize);
  }

  async getById(id: string): Promise<Owner> {
    await delay();
    const owner = store.find((o) => o.id === id);
    if (!owner) {
      throw new Error(`Owner not found: ${id}`);
    }
    return clone(owner);
  }

  async create(data: CreateOwnerInput): Promise<Owner> {
    await delay();
    const timestamp = now();
    const owner: Owner = {
      id: generateId(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber.trim(),
      emergencyContact: data.emergencyContact?.trim() || undefined,
      address: data.address?.trim() || undefined,
      city: data.city?.trim() || undefined,
      state: data.state?.trim() || undefined,
      country: data.country?.trim() || undefined,
      postalCode: data.postalCode?.trim() || undefined,
      preferredContactMethod: data.preferredContactMethod,
      notes: data.notes?.trim() || undefined,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.push(owner);
    return clone(owner);
  }

  async update(id: string, data: UpdateOwnerInput): Promise<Owner> {
    await delay();
    const index = store.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Owner not found: ${id}`);
    }

    const current = store[index];
    const updated: Owner = {
      ...current,
      ...(data.firstName !== undefined && { firstName: data.firstName.trim() }),
      ...(data.lastName !== undefined && { lastName: data.lastName.trim() }),
      ...(data.email !== undefined && { email: data.email.trim() }),
      ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber.trim() }),
      ...(data.emergencyContact !== undefined && {
        emergencyContact: data.emergencyContact.trim() || undefined,
      }),
      ...(data.address !== undefined && { address: data.address.trim() || undefined }),
      ...(data.city !== undefined && { city: data.city.trim() || undefined }),
      ...(data.state !== undefined && { state: data.state.trim() || undefined }),
      ...(data.country !== undefined && { country: data.country.trim() || undefined }),
      ...(data.postalCode !== undefined && { postalCode: data.postalCode.trim() || undefined }),
      ...(data.preferredContactMethod !== undefined && {
        preferredContactMethod: data.preferredContactMethod,
      }),
      ...(data.notes !== undefined && { notes: data.notes.trim() || undefined }),
      updatedAt: now(),
    };

    store[index] = updated;
    return clone(updated);
  }

  async deactivate(id: string): Promise<Owner> {
    await delay();
    const index = store.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Owner not found: ${id}`);
    }
    const updated: Owner = {
      ...store[index],
      isActive: false,
      updatedAt: now(),
    };
    store[index] = updated;
    return clone(updated);
  }

  async activate(id: string): Promise<Owner> {
    await delay();
    const index = store.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Owner not found: ${id}`);
    }
    const updated: Owner = {
      ...store[index],
      isActive: true,
      updatedAt: now(),
    };
    store[index] = updated;
    return clone(updated);
  }
}