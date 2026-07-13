import type { PetService } from './PetService';
import type { Pet, CreatePetInput, UpdatePetInput, PetFilters, PaginatedResult } from '../types';
import { MOCK_PETS } from '../utils/mockData';
import { MOCK_OWNERS } from '../../owners/utils/mockData';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const generateId = (): string => crypto.randomUUID();
const now = (): string => new Date().toISOString();
const clone = (pet: Pet): Pet => ({ ...pet });

/** Resolve owner name from ownerId */
const resolveOwnerName = (ownerId: string): string => {
  const owner = MOCK_OWNERS.find((o) => o.id === ownerId);
  return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner';
};

/* ------------------------------------------------------------------ */
/*  In-memory store (seeded from mockData.ts)                         */
/* ------------------------------------------------------------------ */

let store: Pet[] = [...MOCK_PETS];

/* ------------------------------------------------------------------ */
/*  Filtering, sorting, pagination                                     */
/* ------------------------------------------------------------------ */

function applyFilters(pets: Pet[], filters?: PetFilters): Pet[] {
  let result = [...pets];

  if (!filters) return result;

  // Search across name, breed, microchipId
  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        (p.microchipId?.toLowerCase().includes(q) ?? false),
    );
  }

  // Species filter
  if (filters.species) {
    result = result.filter((p) => p.species === filters.species);
  }

  // Active status filter
  if (filters.isActive !== undefined) {
    result = result.filter((p) => p.isActive === filters.isActive);
  }

  // Owner filter
  if (filters.ownerId) {
    result = result.filter((p) => p.ownerId === filters.ownerId);
  }

  // Sorting
  const sortBy = filters.sortBy ?? 'name';
  const sortOrder = filters.sortOrder ?? 'asc';
  result.sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';

    switch (sortBy) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'species':
        aVal = a.species;
        bVal = b.species;
        break;
      case 'breed':
        aVal = a.breed.toLowerCase();
        bVal = b.breed.toLowerCase();
        break;
      case 'dateOfBirth':
        aVal = a.dateOfBirth;
        bVal = b.dateOfBirth;
        break;
      case 'createdAt':
        aVal = a.createdAt;
        bVal = b.createdAt;
        break;
    }

    if (typeof aVal === 'string') {
      const cmp = aVal.localeCompare(bVal as string);
      return sortOrder === 'asc' ? cmp : -cmp;
    }
    return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  return result;
}

function paginate(
  pets: Pet[],
  page: number = 1,
  pageSize: number = 10,
): PaginatedResult<Pet> {
  const total = pets.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  const data = pets.slice(start, start + pageSize);

  return {
    data: data.map(clone),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

/* ------------------------------------------------------------------ */
/*  MockPetService                                                     */
/* ------------------------------------------------------------------ */

export class MockPetService implements PetService {
  async list(filters?: PetFilters): Promise<PaginatedResult<Pet>> {
    await delay();
    const filtered = applyFilters(store, filters);
    return paginate(filtered, filters?.page, filters?.pageSize);
  }

  async getById(id: string): Promise<Pet> {
    await delay();
    const pet = store.find((p) => p.id === id);
    if (!pet) {
      throw new Error(`Pet not found: ${id}`);
    }
    return clone(pet);
  }

  async create(data: CreatePetInput): Promise<Pet> {
    await delay();
    const timestamp = now();
    const pet: Pet = {
      id: generateId(),
      ownerId: data.ownerId,
      ownerName: resolveOwnerName(data.ownerId),
      name: data.name.trim(),
      species: data.species,
      breed: data.breed.trim(),
      color: data.color.trim(),
      dateOfBirth: data.dateOfBirth,
      sex: data.sex,
      isNeutered: data.isNeutered,
      microchipId: data.microchipId?.trim() || undefined,
      weightKg: data.weightKg ?? undefined,
      notes: data.notes?.trim() || undefined,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.push(pet);
    return clone(pet);
  }

  async update(id: string, data: UpdatePetInput): Promise<Pet> {
    await delay();
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Pet not found: ${id}`);
    }

    const current = store[index];
    const updated: Pet = {
      ...current,
      ...(data.ownerId !== undefined && {
        ownerId: data.ownerId,
        ownerName: resolveOwnerName(data.ownerId),
      }),
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.species !== undefined && { species: data.species }),
      ...(data.breed !== undefined && { breed: data.breed.trim() }),
      ...(data.color !== undefined && { color: data.color.trim() }),
      ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth }),
      ...(data.sex !== undefined && { sex: data.sex }),
      ...(data.isNeutered !== undefined && { isNeutered: data.isNeutered }),
      ...(data.microchipId !== undefined && { microchipId: data.microchipId?.trim() || undefined }),
      ...(data.weightKg !== undefined && { weightKg: data.weightKg ?? undefined }),
      ...(data.notes !== undefined && { notes: data.notes?.trim() || undefined }),
      updatedAt: now(),
    };

    store[index] = updated;
    return clone(updated);
  }

  async deactivate(id: string): Promise<Pet> {
    await delay();
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Pet not found: ${id}`);
    }
    const updated: Pet = { ...store[index], isActive: false, updatedAt: now() };
    store[index] = updated;
    return clone(updated);
  }

  async activate(id: string): Promise<Pet> {
    await delay();
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Pet not found: ${id}`);
    }
    const updated: Pet = { ...store[index], isActive: true, updatedAt: now() };
    store[index] = updated;
    return clone(updated);
  }
}