import { useState, useEffect, useCallback, useRef } from 'react';
import type { Owner, OwnerFilters, PaginatedResult } from '../types';
import { ownerService } from '../services';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UseOwnersState {
  owners: Owner[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

interface UseOwnersReturn extends UseOwnersState {
  filters: OwnerFilters;
  setFilters: (filters: OwnerFilters) => void;
  refresh: () => Promise<void>;
  createOwner: (data: import('../types').CreateOwnerInput) => Promise<Owner>;
  updateOwner: (id: string, data: import('../types').UpdateOwnerInput) => Promise<Owner>;
  toggleActiveStatus: (owner: Owner) => Promise<Owner>;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FILTERS: OwnerFilters = {
  search: '',
  isActive: undefined,
  sortBy: 'lastName',
  sortOrder: 'asc',
  page: 1,
  pageSize: 10,
};

const INITIAL_STATE: UseOwnersState = {
  owners: [],
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

export function useOwners(): UseOwnersReturn {
  const [state, setState] = useState<UseOwnersState>(INITIAL_STATE);
  const [filters, setFiltersState] = useState<OwnerFilters>(DEFAULT_FILTERS);
  const mountedRef = useRef(true);

  /* ---------- Fetch owners ---------- */

  const fetchOwners = useCallback(async (currentFilters: OwnerFilters) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result: PaginatedResult<Owner> = await ownerService.list(currentFilters);

      if (mountedRef.current) {
        setState({
          owners: result.data,
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
          error: err instanceof Error ? err.message : 'Failed to load owners',
        }));
      }
    }
  }, []);

  // Fetch on mount and when filters change
  useEffect(() => {
    mountedRef.current = true;
    fetchOwners(filters);
    return () => {
      mountedRef.current = false;
    };
  }, [filters, fetchOwners]);

  /* ---------- Filter setter ---------- */

  const setFilters = useCallback((newFilters: OwnerFilters) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when search or filter criteria change
      page: newFilters.search !== undefined ||
            newFilters.isActive !== undefined ||
            newFilters.sortBy !== undefined ||
            newFilters.sortOrder !== undefined
        ? 1
        : (newFilters.page ?? prev.page),
    }));
  }, []);

  /* ---------- Refresh ---------- */

  const refresh = useCallback(async () => {
    await fetchOwners(filters);
  }, [filters, fetchOwners]);

  /* ---------- Create ---------- */

  const createOwner = useCallback(
    async (data: import('../types').CreateOwnerInput): Promise<Owner> => {
      const created = await ownerService.create(data);
      await fetchOwners(filters);
      return created;
    },
    [filters, fetchOwners],
  );

  /* ---------- Update ---------- */

  const updateOwner = useCallback(
    async (id: string, data: import('../types').UpdateOwnerInput): Promise<Owner> => {
      const updated = await ownerService.update(id, data);
      await fetchOwners(filters);
      return updated;
    },
    [filters, fetchOwners],
  );

  /* ---------- Toggle active status ---------- */

  const toggleActiveStatus = useCallback(
    async (owner: Owner): Promise<Owner> => {
      const result = owner.isActive
        ? await ownerService.deactivate(owner.id)
        : await ownerService.activate(owner.id);
      await fetchOwners(filters);
      return result;
    },
    [filters, fetchOwners],
  );

  /* ---------- Return ---------- */

  return {
    ...state,
    filters,
    setFilters,
    refresh,
    createOwner,
    updateOwner,
    toggleActiveStatus,
  };
}