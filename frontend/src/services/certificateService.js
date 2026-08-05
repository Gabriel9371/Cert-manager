import { api } from './api';

export const certificateService = {
  getAll: () => api.get('/certificates'),
  getById: (id) => api.get(`/certificates/${id}`),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.patch(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
  getExpired: () => api.get('/certificates/expired'),
};

export const userService = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
};