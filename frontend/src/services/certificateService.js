import { api } from './api'

export const certificateService = {
  list: () => api.get('/certificates').then((res) => res.data),

  getById: (id) => api.get(`/certificates/${id}`).then((res) => res.data),

  create: (payload) => api.post('/certificates', payload).then((res) => res.data),

  update: (id, payload) =>
    api.patch(`/certificates/${id}`, payload).then((res) => res.data),

  remove: (id) => api.delete(`/certificates/${id}`),

  listExpired: () => api.get('/certificates/expired').then((res) => res.data),
}
