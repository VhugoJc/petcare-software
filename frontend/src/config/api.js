const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`,
  },
  owners: {
    list: `${API_BASE_URL}/owners`,
    create: `${API_BASE_URL}/owners`,
    detail: (id) => `${API_BASE_URL}/owners/${id}`,
    update: (id) => `${API_BASE_URL}/owners/${id}`,
    delete: (id) => `${API_BASE_URL}/owners/${id}`,
  },
  pets: {
    list: `${API_BASE_URL}/pets`,
    create: `${API_BASE_URL}/pets`,
    detail: (id) => `${API_BASE_URL}/pets/${id}`,
    update: (id) => `${API_BASE_URL}/pets/${id}`,
    delete: (id) => `${API_BASE_URL}/pets/${id}`,
  },
  appointments: {
    list: `${API_BASE_URL}/appointments`,
    create: `${API_BASE_URL}/appointments`,
    detail: (id) => `${API_BASE_URL}/appointments/${id}`,
    update: (id) => `${API_BASE_URL}/appointments/${id}`,
    status: (id) => `${API_BASE_URL}/appointments/${id}/status`,
    delete: (id) => `${API_BASE_URL}/appointments/${id}`,
  },
  dashboard: {
    get: `${API_BASE_URL}/dashboard`,
  },
  settings: {
    get: `${API_BASE_URL}/settings`,
    update: `${API_BASE_URL}/settings`,
  },
};

export default API_BASE_URL;
