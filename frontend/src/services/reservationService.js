import { api } from './api';

export const reservationService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/reservations${params ? `?${params}` : ''}`);
  },
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, { status }),
  delete: (id) => api.delete(`/reservations/${id}`)
};

export default reservationService;
