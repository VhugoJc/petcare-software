import { createContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthState, AuthAction, User, AuthTokens, LoginCredentials } from '../types';
import { authService } from '../services';
import { tokenStorage } from '../utils/tokenStorage';

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true, // true while restoring session on mount
  isSubmitting: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isSubmitting: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isSubmitting: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isSubmitting: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

export interface AuthContextValue {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /* Restore session on mount --------------------------------------- */
  useEffect(() => {
    const restoreSession = async () => {
      const user = tokenStorage.getUser();
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (user && accessToken && refreshToken) {
        // Tokens exist — optionally verify with getCurrentUser()
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            dispatch({ type: 'RESTORE_SESSION', payload: { user: currentUser, tokens: { accessToken, refreshToken } } });
          } else {
            // Service couldn't verify, but we have stored data — restore anyway for offline/mock mode
            dispatch({ type: 'RESTORE_SESSION', payload: { user, tokens: { accessToken, refreshToken } } });
          }
        } catch {
          // If API call fails (offline / no backend), restore from local storage
          dispatch({ type: 'RESTORE_SESSION', payload: { user, tokens: { accessToken, refreshToken } } });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    restoreSession();
  }, []);

  /* Login ---------------------------------------------------------- */
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user, tokens } = await authService.login(credentials);
      tokenStorage.setUser(user);
      tokenStorage.setTokens(tokens);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tokens } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw err; // re-throw so the caller can handle if needed
    }
  }, []);

  /* Logout --------------------------------------------------------- */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      tokenStorage.clear();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  /* Clear error ---------------------------------------------------- */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}