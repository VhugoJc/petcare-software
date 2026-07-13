import { useState, useEffect, useCallback, useRef } from 'react';
import type { Pet } from '../types';
import { petService } from '../services';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UsePetState {
  pet: Pet | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePetReturn extends UsePetState {
  refresh: () => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function usePet(id: string | undefined): UsePetReturn {
  const [state, setState] = useState<UsePetState>({
    pet: null,
    isLoading: true,
    error: null,
  });
  const mountedRef = useRef(true);

  const fetchPet = useCallback(async () => {
    if (!id) return;

    setState({ pet: null, isLoading: true, error: null });

    try {
      const data = await petService.getById(id);
      if (mountedRef.current) {
        setState({ pet: data, isLoading: false, error: null });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState({
          pet: null,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load pet',
        });
      }
    }
  }, [id]);

  useEffect(() => {
    mountedRef.current = true;
    fetchPet();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchPet]);

  return {
    ...state,
    refresh: fetchPet,
  };
}