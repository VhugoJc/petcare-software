import { useState, useEffect, useCallback, useRef } from 'react';
import type { Appointment } from '../types';
import { appointmentService } from '../services';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UseAppointmentState {
  appointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
}

interface UseAppointmentReturn extends UseAppointmentState {
  refresh: () => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAppointment(id: string | undefined): UseAppointmentReturn {
  const [state, setState] = useState<UseAppointmentState>({
    appointment: null,
    isLoading: true,
    error: null,
  });
  const mountedRef = useRef(true);

  const fetchAppointment = useCallback(async () => {
    if (!id) return;
    setState({ appointment: null, isLoading: true, error: null });

    try {
      const data = await appointmentService.getById(id);
      if (mountedRef.current) {
        setState({ appointment: data, isLoading: false, error: null });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState({
          appointment: null,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load appointment',
        });
      }
    }
  }, [id]);

  useEffect(() => {
    mountedRef.current = true;
    fetchAppointment();
    return () => { mountedRef.current = false; };
  }, [fetchAppointment]);

  return { ...state, refresh: fetchAppointment };
}