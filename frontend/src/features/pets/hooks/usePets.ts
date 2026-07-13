import { useState, useEffect, useCallback, useRef } from 'react';
import type { Pet, PetFilters, PaginatedResult } from '../types';
import { petService } from '../services';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UsePetsState {
  pets: Pet[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

interface UsePetsReturn extends UsePetsState {
  filters: PetFilters;
  setFilters: (filters: PetFilters) => void;
  refresh: () => Promise<void>;
  createPet: (data: import('../types').CreatePetInput) => Promise<Pet>;
  updatePet: (id: string, data: import('../types').UpdatePetInput) => Promise<Pet>;
  toggleActiveStatus: (pet: Pet) => Promise<Pet>;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FILTERS: PetFilters = {
  search: '',
  species: undefined,
  isActive: undefined,
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  pageSize: 10,
};

const INITIAL_STATE: UsePetsState = {
  pets: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  isLoading: true,
  error: null,
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function usePets(): UsePetsReturn {
  const [state, setState] = useState<UsePetsState>(INITIAL_STATE);
  const [filters, setFiltersState] = useState<PetFilters>(DEFAULT_FILTERS);
  const mountedRef = useRef(true);

  /* ---------- Fetch pets ---------- */

  const fetchPets = useCallback(async (currentFilters: PetFilters) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result: PaginatedResult<Pet> = await petService.list(currentFilters);

      if (mountedRef.current) {
        setState({
          pets: result.data,
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
          isLoading: false,
          error: null,
        });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load pets',
        }));
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchPets(filters);
    return () => {
      mountedRef.current = false;
    };
  }, [filters, fetchPets]);

  /* ---------- Filter setter ---------- */

  const setFilters = useCallback((newFilters: PetFilters) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page:
        newFilters.search !== undefined ||
        newFilters.species !== undefined ||
        newFilters.isActive !== undefined ||
        newFilters.sortBy !== undefined ||
        newFilters.sortOrder !== undefined
          ? 1
          : (newFilters.page ?? prev.page),
    }));
  }, []);

  /* ---------- Refresh ---------- */

  const refresh = useCallback(async () => {
    await fetchPets(filters);
  }, [filters, fetchPets]);

  /* ---------- Create ---------- */

  const createPet = useCallback(
    async (data: import('../types').CreatePetInput): Promise<Pet> => {
      const created = await petService.create(data);
      await fetchPets(filters);
      return created;
    },
    [filters, fetchPets],
  );

  /* ---------- Update ---------- */

  const updatePet = useCallback(
    async (id: string, data: import('../types').UpdatePetInput): Promise<Pet> => {
      const updated = await petService.update(id, data);
      await fetchPets(filters);
      return updated;
    },
    [filters, fetchPets],
  );

  /* ---------- Toggle active status ---------- */

  const toggleActiveStatus = useCallback(
    async (pet: Pet): Promise<Pet> => {
      const result = pet.isActive
        ? await petService.deactivate(pet.id)
        : await petService.activate(pet.id);
      await fetchPets(filters);
      return result;
    },
    [filters, fetchPets],
  );

  /* ---------- Return ---------- */

  return {
    ...state,
    filters,
    setFilters,
    refresh,
    createPet,
    updatePet,
    toggleActiveStatus,
  };
}