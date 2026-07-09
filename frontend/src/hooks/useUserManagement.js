import { useCallback, useReducer } from 'react';

const initialState = { users: [], error: null };

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return { ...state, users: [...state.users, { ...action.payload, id: Date.now() }], error: null };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u), error: null };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload), error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const useUserManagement = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addUser = useCallback(userData => {
    if (!userData.name?.trim() || !userData.email?.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Name and email are required' });
      return;
    }
    dispatch({ type: 'ADD_USER', payload: userData });
  }, []);

  const updateUser = useCallback((id, userData) => {
    if (!userData.name?.trim() || !userData.email?.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Name and email are required' });
      return;
    }
    dispatch({ type: 'UPDATE_USER', payload: { id, ...userData } });
  }, []);

  const deleteUser = useCallback(id => {
    dispatch({ type: 'DELETE_USER', payload: id });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return { users: state.users, error: state.error, addUser, updateUser, deleteUser, clearError };
};
