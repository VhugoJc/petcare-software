const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  owners: {
    list: `${API_BASE_URL}/owners`,
    create: `${API_BASE_URL}/owners`,
    detail: (id) => `${API_BASE_URL}/owners/${id}`,
    update: (id) => `${API_BASE_URL}/owners/${id}`,
    delete: (id) => `${API_BASE_URL}/owners/${id}`,
  },
};

export default API_BASE_URL;
