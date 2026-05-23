import { api } from './api';

export const inventoryService = {
  getCategories: () => api.get('/inventory/categories'),
  createCategory: (data) => api.post('/inventory/categories', data),
  
  getItems: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/inventory/items${params ? `?${params}` : ''}`);
  },
  getItem: (id) => api.get(`/inventory/items/${id}`),
  createItem: (data) => api.post('/inventory/items', data),
  updateItem: (id, data) => api.put(`/inventory/items/${id}`, data),
  deleteItem: (id) => api.delete(`/inventory/items/${id}`),
  
  addMovement: (id, data) => api.post(`/inventory/items/${id}/movements`, data),
  getMovements: (id) => api.get(`/inventory/items/${id}/movements`)
};

export default inventoryService;
