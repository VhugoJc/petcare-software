import { useState, useEffect, useCallback, useRef } from 'react';
import type { Appointment, AppointmentFilters, PaginatedResult } from '../types';
import { appointmentService } from '../services';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UseAppointmentsState {
  appointments: Appointment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

interface UseAppointmentsReturn extends UseAppointmentsState {
  filters: AppointmentFilters;
  setFilters: (filters: AppointmentFilters) => void;
  refresh: () => Promise<void>;
  createAppointment: (data: import('../types').CreateAppointmentInput) => Promise<Appointment>;
  updateAppointment: (id: string, data: import('../types').UpdateAppointmentInput) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, data: import('../types').UpdateAppointmentStatusInput) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<Appointment>;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FILTERS: AppointmentFilters = {
  search: '',
  date: undefined,
  status: undefined,
  type: undefined,
  sortBy: 'date',
  sortOrder: 'asc',
  page: 1,
  pageSize: 10,
};

const INITIAL_STATE: UseAppointmentsState = {
  appointments: [],
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

export function useAppointments(): UseAppointmentsReturn {
  const [state, setState] = useState<UseAppointmentsState>(INITIAL_STATE);
  const [filters, setFiltersState] = useState<AppointmentFilters>(DEFAULT_FILTERS);
  const mountedRef = useRef(true);

  /* ---------- Fetch ---------- */

  const fetchAppointments = useCallback(async (currentFilters: AppointmentFilters) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result: PaginatedResult<Appointment> = await appointmentService.list(currentFilters);
      if (mountedRef.current) {
        setState({
          appointments: result.data,
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
          error: err instanceof Error ? err.message : 'Failed to load appointments',
        }));
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchAppointments(filters);
    return () => { mountedRef.current = false; };
  }, [filters, fetchAppointments]);

  /* ---------- Filter setter ---------- */

  const setFilters = useCallback((newFilters: AppointmentFilters) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page:
        newFilters.search !== undefined ||
        newFilters.date !== undefined ||
        newFilters.dateFrom !== undefined ||
        newFilters.dateTo !== undefined ||
        newFilters.status !== undefined ||
        newFilters.type !== undefined ||
        newFilters.sortBy !== undefined ||
        newFilters.sortOrder !== undefined
          ? 1
          : (newFilters.page ?? prev.page),
    }));
  }, []);

  /* ---------- Refresh ---------- */

  const refresh = useCallback(async () => {
    await fetchAppointments(filters);
  }, [filters, fetchAppointments]);

  /* ---------- Create ---------- */

  const createAppointment = useCallback(
    async (data: import('../types').CreateAppointmentInput): Promise<Appointment> => {
      const created = await appointmentService.create(data);
      await fetchAppointments(filters);
      return created;
    },
    [filters, fetchAppointments],
  );

  /* ---------- Update ---------- */

  const updateAppointment = useCallback(
    async (id: string, data: import('../types').UpdateAppointmentInput): Promise<Appointment> => {
      const updated = await appointmentService.update(id, data);
      await fetchAppointments(filters);
      return updated;
    },
    [filters, fetchAppointments],
  );

  /* ---------- Update status ---------- */

  const updateAppointmentStatus = useCallback(
    async (id: string, data: import('../types').UpdateAppointmentStatusInput): Promise<Appointment> => {
      const result = await appointmentService.updateStatus(id, data);
      await fetchAppointments(filters);
      return result;
    },
    [filters, fetchAppointments],
  );

  /* ---------- Cancel ---------- */

  const cancelAppointment = useCallback(
    async (id: string): Promise<Appointment> => {
      const result = await appointmentService.cancel(id);
      await fetchAppointments(filters);
      return result;
    },
    [filters, fetchAppointments],
  );

  /* ---------- Return ---------- */

  return {
    ...state,
    filters,
    setFilters,
    refresh,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
  };
}